const express = require("express");
const app = express();
const dotenv = require("dotenv");
// imports the Mongo database module
const mongoose = require("mongoose");

// routes
const weatherRoute = require("./routes/weather");
const reportRoute = require("./routes/report");

dotenv.config();
const PORT = process.env.PORT || 5003;

// declares our connection string
const dbURI =
  "mongodb+srv://SynopticProject:SynopticProject@synopticprojectcluster.crbpeof.mongodb.net/?retryWrites=true&w=majority";
// database password: SynopticProject

// initialises a connection the the mongo database
function connectDatabase() {
  mongoose
    .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(function (result) {
      console.log("Database connected");
    })
    // catches errors with database
    .catch((err) => {
      console.log("Database disconnected");
      console.log(err);
      console.log("Retrying...");
      //recursively calls function to attemt to reconnect
      connectDatabase();
    });
}

connectDatabase();

app.use(express.static("LandingPage"));

app.use(express.json());

const path = require("path");

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/routes/index.html"));
  console.log("/ route hit!");
});

app.use("/weather", weatherRoute);
app.use("/report", reportRoute);

app.listen(PORT, () => {
  var ip = require("ip");
  console.log(`Endpoint: http://${ip.address()}:${PORT}`);
});
