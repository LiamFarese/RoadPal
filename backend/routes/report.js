const router = require("express").Router();

//models
const Report = require("../models/report.js");

//Saves report posts to database
router.post("/", (req, res) => {
  if (req.body) {
    console.log("Report recieved by backend");
  }
  const newReport = new Report(req.body);
  newReport.save();
  res.status(200).send("Entry saved into database");
});

//default route
router.get("/", (req, res) => {
  //initalise coordinates so the get request shows all valid entries by default
  let Coordinates = {
    Longitude: 0,
    Latitude: 0,
    LongitudeDelta: 360, //longitude has a max and min value of 180 and -180, so delta is 360
    LatitudeDelta: 180, //Latitude has a max and min value of 90 and -90, so delta is 180
  };

  //if all query values are present it will set the new coordinates, otherwise leave as default
  if (
    req.query.long &&
    req.query.lat &&
    req.query.longDelta &&
    req.query.latDelta != null
  ) {
    (Coordinates.Longitude = Number(req.query.long)),
      (Coordinates.Latitude = Number(req.query.lat)),
      (Coordinates.LongitudeDelta = Number(req.query.longDelta)),
      (Coordinates.LatitudeDelta = Number(req.query.latDelta));
  }

  //finds coordinates of the screen
  const LongitudeLower = Coordinates.Longitude - Coordinates.LongitudeDelta / 2;
  const LongitudeUpper = Coordinates.Longitude + Coordinates.LongitudeDelta / 2;
  const latitudeLower = Coordinates.Latitude - Coordinates.LatitudeDelta / 2;
  const latitudeUpper = Coordinates.Latitude + Coordinates.LatitudeDelta / 2;

  //returns all entries on database within the screen coordinates
  Report.find({
    Longitude: { $gt: LongitudeLower, $lt: LongitudeUpper },
    Latitude: { $gt: latitudeLower, $lt: latitudeUpper },
  }).then((foundReports) => res.json(foundReports));
});

//returns all enum values for report type in database schema
router.get("/types", (req, res) => {
  res.json(Report.schema.path("ReportType").enumValues);
});

module.exports = router;
