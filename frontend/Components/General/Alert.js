import { Alert } from "react-native";
// resuable alert - currently used for development purposes
const createAlert = (props) =>
  Alert.alert(props.title, props.message, [
    {
      text: "Dismiss",
      style: "cancel",
    },
    {
      text: props.button,
      onPress: props.onPress,
    },
  ]);

export const createOKAlert = (props) =>
  Alert.alert(props.title, props.message, [
    {
      text: "OK",
      onPress: () => {},
    },
  ]);

export default createAlert;
