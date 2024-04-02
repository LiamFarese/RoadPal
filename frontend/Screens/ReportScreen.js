import { Button, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import DOMAIN from "../Endpoints/Domain";
import { Picker } from "@react-native-picker/picker";
import createAlert, { createOKAlert } from "../Components/General/Alert";

import colours from "../ColourScheme/colours";

import SendButton from "../Components/General/SendButton";

const capitalise = (string) => {
  return string.replace(/^\w/, (c) => c.toUpperCase());
};

export default function ReportScreen(props) {
  const [options, setOptions] = useState([]);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [selectedReportType, setSelectedReportType] = useState();

  // upon changes to the state
  useEffect(() => {
    if (optionsLoading) {
      loadOptions();
    }
  });

  const loadOptions = async () => {
    //defines request URL
    var requestString = DOMAIN + "report/types";
    //returns the response from the backend
    await fetch(requestString)
      //converts response to JSON format
      .then((res) => res.json())
      // appends returned datapoints to the grid array
      .then((data) => setOptions(data))
      // logs any errors making call to backend
      .catch((err) => {
        console.log(err);
      });
    //sets loading state to false
    setOptionsLoading(false);
  };

  const handleReport = async () => {
    // handles creation and sending of report, then returns to the map
    await sendReport(createReport(selectedReportType)).then(props.goBack());
  };

  const createReport = (option) => {
    return {
      Latitude: props.currentLocation.coords.latitude,
      Longitude: props.currentLocation.coords.longitude,
      ReportType: option,
    };
  };

  // sends report to backend via a post request
  const sendReport = async (report) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(report),
    };
    await fetch(DOMAIN + "report/", requestOptions)
      .then(() => {
        console.log("Report sent to backend");
        createOKAlert({
          title: "Report sent",
          message: `You reported a ${report.ReportType}`,
        });
      })
      .catch((err) => {
        console.log(err);
        createAlert({
          title: "Cannot connect to backend",
          message: "Attempted to send report",
          button: "Resend",
          onPress: () => sendReport(report),
        });
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* header */}
      <View style={styles.header}>
        {/* back button */}
        <View style={styles.goBack}>
          <Button title="Cancel" onPress={props.goBack}></Button>
        </View>
        <Text style={styles.title}>Report</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.pickerContainer}>
          <Text style={styles.inputFieldTitle}>Select what you've found</Text>

          {/* Report type picker */}
          <Picker
            selectedValue={selectedReportType}
            style={{
              width: "100%",
            }}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedReportType(itemValue.toLowerCase())
            }
          >
            {/* populates items in picker wheel with available values */}
            {options
              ? options.map((option) => {
                  return (
                    <Picker.Item
                      key={option}
                      label={capitalise(option)}
                      value={option}
                    />
                  );
                })
              : null}
          </Picker>
        </View>

        {/* Button to send form to backend */}
        <SendButton
          title={`Report`}
          onPress={selectedReportType ? () => handleReport() : () => {}}
          colour={selectedReportType ? colours.alert : "gray"}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#00ff0055",
    backgroundColor: colours.background,
    alignItems: "center",
  },
  content: {
    flex: 1,
    width: "100%",
    alignItems: "flex-start",
    padding: 10,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: 20,
    // backgroundColor: "#ff000055",
  },
  goBack: {
    position: "absolute",
    alignSelf: "flex-start",
  },
  title: {
    fontSize: 26,
    fontWeight: "normal",
  },
  pickerContainer: {
    flex: 1,
    // backgroundColor: "#00ff0055",
    width: "100%",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  inputFieldTitle: {
    fontSize: 20,
    fontWeight: "bold",
    // backgroundColor: "#0000ff55",
  },
  inputField: { height: 100 },
});
