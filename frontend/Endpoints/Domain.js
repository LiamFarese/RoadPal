import { Platform } from "react-native";

var devMode = false;

const DOMAIN = devMode
  ? Platform.OS == "ios"
    ? "http://localhost:5003/"
    : "http://139.222.203.81:5003/"
  : "http://synopticbackend-env.eba-we3fsgrq.us-east-1.elasticbeanstalk.com/";

export default DOMAIN;
