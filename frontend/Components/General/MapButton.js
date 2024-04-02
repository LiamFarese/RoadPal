import { StyleSheet, Text, View, Button } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colours from "../../ColourScheme/colours";

import React from "react";

export default function MapButton(props) {
  return (
    <View style={styles(props).container}>
      <Ionicons
        name={props.iconName}
        size={props.size * 0.45}
        color={props.color}
      />
    </View>
  );
}

const styles = (props) => {
  return StyleSheet.create({
    container: {
      width: props.size,
      height: props.size,
      backgroundColor: colours.background,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 100,
    },
  });
};
