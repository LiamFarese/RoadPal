import { Modal, StyleSheet, Pressable, Text, View } from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import * as Location from "expo-location";
import MapButton from "../Components/General/MapButton";
import MapView, { PROVIDER_GOOGLE, Overlay, Marker } from "react-native-maps";
import createAlert from "../Components/General/Alert";
import ReportScreen from "./ReportScreen";
import ReportCard from "../Components/General/ReportCard";
import DOMAIN from "../Endpoints/Domain";

// importing project colour scheme
import colours from "../ColourScheme/colours";

const capitalise = (string) => {
  return string.replace(/^\w/, (c) => c.toUpperCase());
};

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [viewRegion, setViewRegion] = useState({
    latitude: -10.65,
    longitude: 142.5,
    latitudeDelta: 15,
    longitudeDelta: 15,
  });

  //use of hooks to access state of screen
  const [weatherGrid, setWeatherGrid] = useState([]);
  const [peakRainfall, setPeakRainfall] = useState(0);
  const [weatherLoading, setWeatherLoading] = useState(false);

  const [reportGrid, setReportGrid] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  // upon changes to weatherLoading
  useEffect(() => {
    if (weatherLoading) {
      loadWeatherData(viewRegion);
    }
    // set peakRainfall state to the maximum weight of all points in the grid
    setPeakRainfall(Math.max(...weatherGrid.map((point) => point.weight)));
  }, [weatherLoading]);

  // upon changes to reportsLoading
  useEffect(() => {
    if (reportsLoading) {
      loadReports(viewRegion);
    }
  }, [reportsLoading]);

  // upon initial render
  useEffect(() => {
    (async () => {
      // request location permission from user
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }
      // gets current gps location of user
      let location = await Location.getCurrentPositionAsync({});
      // updates state with current user location
      setLocation(location);
    })();
  });

  const updateData = () => {
    setWeatherLoading(true);
    setReportsLoading(true);
  };

  const loadWeatherData = async (region) => {
    //encodes regional parameters in URL
    var requestString =
      DOMAIN +
      `weather?lat=${region.latitude}&long=${region.longitude}&latDelta=${region.latitudeDelta}&longDelta=${region.longitudeDelta}`;
    //returns the response from the backend
    await fetch(requestString)
      //converts response to JSON format
      .then((res) => res.json())
      // appends returned datapoints to the grid array
      .then((data) => setWeatherGrid((grid) => [...grid, ...data]))
      // logs any errors making call to backend
      .catch((err) => {
        console.log(err);
        createAlert({
          title: "Cannot connect to backend",
          message: "Attempted to load weather data",
          button: "Try again",
          onPress: () => loadWeatherData(region),
        });
      });
    //sets loading state to false
    setWeatherLoading(false);
  };

  const loadReports = async (region) => {
    //encodes regional parameters in URL
    var requestString =
      DOMAIN +
      `report?lat=${region.latitude}&long=${region.longitude}&latDelta=${region.latitudeDelta}&longDelta=${region.longitudeDelta}`;
    //returns the response from the backend
    await fetch(requestString)
      //converts response to JSON format
      .then((res) => res.json())
      // appends returned datapoints to the grid array
      .then((data) => setReportGrid(data))
      // logs any errors making call to backend
      .catch((err) => {
        console.log(err);
        createAlert({
          title: "Cannot connect to backend",
          message: "Attempted to load report data",
          button: "Try again",
          onPress: () => loadReports(region),
        });
      });
    //sets loading state to false
    setReportsLoading(false);
  };

  // when user changes the region of the map in view, update the state of viewRegion
  const onRegionChange = (region) => {
    setViewRegion(region);
  };

  return (
    <View style={styles.container}>
      {/* loading popout */}
      <View
        style={{
          flex: 1,
          width: "100%",
          backgroundColor: colours.primary,
          alignItems: "center",
          justifyContent: "flex-end",
          paddingBottom: 6,
        }}
      >
        <Text
          style={{ fontSize: 16, fontWeight: "600", color: colours.background }}
        >
          Loading...
        </Text>
      </View>
      {/* report modal */}
      <Modal
        style={styles.modal}
        animationType="slide"
        transparent={true}
        visible={modalVisible}
      >
        <ReportScreen
          goBack={() => setModalVisible(false)}
          currentLocation={location}
        ></ReportScreen>
      </Modal>

      {/* Google Map window */}
      <MapView
        style={{
          width: "100%",
          height: weatherLoading || reportsLoading ? "92%" : "100%",
          justifyContent: "flex-end",
        }}
        provider={PROVIDER_GOOGLE}
        mapType="terrain"
        initialRegion={viewRegion}
        onRegionChangeComplete={onRegionChange}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {/* Refresh Button - replace with absolute components in view overtop */}

        <Overlay image={""} style={[styles.refreshButton, styles.buttonShadow]}>
          <Pressable onPress={updateData}>
            <MapButton iconName="reload" size={55} color={colours.primary} />
          </Pressable>
        </Overlay>

        {/* Report button - replace with absolute components in view overtop */}
        <Overlay image={""} style={[styles.reportButton, styles.buttonShadow]}>
          <Text>{weatherLoading}</Text>
          <Pressable onPress={() => setModalVisible(true)}>
            <MapButton iconName="flag" size={100} color={colours.alert} />
          </Pressable>
        </Overlay>

        {/* Heatmap overlay (only rendered if there is at least one datapoint in the grid) */}
        {weatherGrid.length != 0 ? (
          <MapView.Heatmap
            points={weatherGrid}
            opacity={0.5}
            radius={1000 / viewRegion.longitudeDelta}
            maxIntensity={12.5 * peakRainfall} //weights are integers in range 0 - 7 (12.5% increments)
            gradientSmoothing={0}
            heatmapMode={"POINTS_WEIGHT"} //bases heatmap of the weighting of datapoints
            gradient={{
              colors: ["#00000000", "#03fcd7", "#03cffc", "#0377fc", "#0307fc"],
              startPoints: [0.02, 0.3, 0.5, 0.75, 1],
              colorMapSize: 256,
            }}
          />
        ) : null}

        {/* map reports on onto map */}
        {reportGrid.map((report) => (
          <Marker
            key={report._id}
            coordinate={{
              latitude: report.Latitude,
              longitude: report.Longitude,
            }}
          >
            <ReportCard
              title={capitalise(report.ReportType)}
              time={report.StartDate}
              location={{
                latitude: report.Latitude,
                longitude: report.Longitude,
              }}
            />
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  map: {},
  navButton: {
    alignSelf: "flex-end",
  },
  reportButton: {
    alignSelf: "center",
    padding: 40,
  },
  refreshButton: {
    position: "absolute",
    left: 10,
    bottom: 46,
  },
  buttonShadow: {
    shadowOpacity: 0.1,
    shadowColor: "#000",
    shadowRadius: 1,
    shadowOffset: { width: 0, height: 4 },
  },
});
