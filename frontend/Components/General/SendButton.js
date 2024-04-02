import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";

export default function SendButton(props) {
  return (
    <Pressable
      style={[styles(props).container, styles(props).buttonShadow]}
      onPress={props.onPress}
    >
      <View>
        <Text style={styles(props).title}>{props.title}</Text>
      </View>
    </Pressable>
  );
}

const styles = (props) =>
  StyleSheet.create({
    container: {
      width: 200,
      height: 60,
      backgroundColor: props.colour,
      alignSelf: "center",
      justifyContent: "center",
      alignItems: "center",
      margin: 40,
      borderRadius: 100,
    },
    title: { fontSize: 24, fontWeight: "700", color: "white" },
    buttonShadow: {
      shadowOpacity: 0.1,
      shadowColor: "#000",
      shadowRadius: 3,
      shadowOffset: { width: 0, height: 4 },
    },
  });
