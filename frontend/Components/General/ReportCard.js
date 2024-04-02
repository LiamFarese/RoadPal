import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colours from "../../ColourScheme/colours.json";

const reportTypes = [
  {
    ReportType: "flood",
    iconName: "home-flood",
    colour: "#1789FC",
  },
  {
    ReportType: "fire",
    iconName: "fire",
    colour: "#FE4A49",
  },
  {
    ReportType: "tornado",
    iconName: "weather-tornado",
    colour: "#788086",
  },
  {
    ReportType: "blockage",
    iconName: "block-helper",
    colour: "#ff0000",
  },
  {
    ReportType: "earthquake",
    iconName: "alert-decagram",
    colour: "#967D69",
  },
  {
    ReportType: "hurricane",
    iconName: "weather-hurricane",
    colour: "#A755C2",
  },
];
var moment = require("moment-timezone");
var tzlookup = require("tz-lookup");

export default function ReportCard(props) {
  const [dateTime, setDateTime] = useState(Date.parse(props.time));

  // identifies report type from title given
  let reportType = reportTypes.some(
    (type) => type.ReportType === props.title.toLowerCase()
  )
    ? reportTypes.find((type) => type.ReportType === props.title.toLowerCase())
    : null;

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <MaterialCommunityIcons
          style={styles.icon}
          name={reportType.iconName}
          size={30}
          color={reportType.colour}
        />
        <View>
          <Text style={[styles.text, styles.title]}>{props.title}</Text>
          <Text style={[styles.text, styles.time]}>
            {moment(dateTime)
              .tz(tzlookup(props.location.latitude, props.location.longitude))
              .format("HH:mm z")}
          </Text>
        </View>
      </View>
      <View style={styles.triangle} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  box: {
    flexDirection: "row",
    backgroundColor: colours.background,
    padding: 8,
    borderRadius: 10,
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 7,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: colours.background,
    transform: [{ rotate: "180deg" }],
  },
  icon: {
    marginRight: 10,
  },
  text: {
    color: colours.text,
  },
  title: {
    fontWeight: "600",
  },
  time: {
    fontWeight: "300",
  },
});
