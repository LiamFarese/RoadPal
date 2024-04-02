import React from "react";
import { View, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { Ionicons } from "@expo/vector-icons";

import MapScreen from "../Screens/MapScreen";
import DevScreen from "../Screens/DevScreen";

const colours = require("../ColourScheme/colours.json");

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Map") {
            iconName = focused ? "map" : "map-outline";
          } else if (route.name === "Dev") {
            iconName = focused ? "code" : "code-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colours.alert,
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Map" component={MapScreen}></Tab.Screen>
      <Tab.Screen name="Dev" component={DevScreen}></Tab.Screen>
    </Tab.Navigator>
  );
}
