import { StyleSheet, Text, Button, View, Dimensions } from "react-native";
import React from "react";
import { useState, useEffect } from "react";

// FOR PROTOTYPING COMPONENTS OF THE APP

export default function DevScreen() {
  return <View style={styles.container}></View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  inputBox: {},
});
