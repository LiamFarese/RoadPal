const fetch = require("node-fetch");
const router = require("express").Router();

// returns array of coordinates covering the region provided in a grid pattern
const generateGrid = (region) => {
  const DIVISOR = 5; //set to 5
  var grid = [];
  var gridSpacing = region.longitudeDelta / DIVISOR;
  let initialCoordinates = {
    latitude: region.latitude - region.latitudeDelta / 2,
    longitude: region.longitude - region.longitudeDelta / 2,
  };

  var rows = DIVISOR;
  var columns = parseInt(region.latitudeDelta / gridSpacing);

  //iterates throught the rows and colums adding each new point to the grid array
  for (var i = 0; i <= rows; i++) {
    for (var j = 0; j <= columns; j++) {
      grid.push({
        // latitude and logitude of each grid point are determined by a multiple of the grid spacing
        latitude: initialCoordinates.latitude + j * gridSpacing,
        longitude: initialCoordinates.longitude + i * gridSpacing,
      });
    }
  }
  return grid;
};

// weather API call returning weather data for a given coordinate
async function getWeatherData(point) {
  const APIkey = "379e0e01452a1de49ad8b129510ce2ea"; //
  const data = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${point.latitude}&lon=${point.longitude}&appid=${APIkey}&exclude=daily,hourly,minutely`
  )
    .then((res) => {
      return res.json();
    })
    .catch((err) => console.log(err));
  // console.log(data.current);
  return data;
}

function getPrecipitationWeight(data) {
  let precipitation = data.current.rain ? data.current.rain["1h"] : null;
  if (precipitation) {
    if (precipitation <= 0.5) {
      //very light rainfall

      return 1;
    }
    if (precipitation <= 1) {
      //light rainfall
      return 2;
    }
    //determines rainfall intensity on logaritmic scale, rounds up to nearest integer and offsets by 2
    return Math.ceil(Math.log2(precipitation)) + 2;
  } else {
    // no rainfall
    return 0;
  }
}

// default route
router.get("/", async (req, res) => {
  var region = {
    latitude: req.query.lat,
    longitude: req.query.long,
    latitudeDelta: req.query.latDelta,
    longitudeDelta: req.query.longDelta,
  };
  var grid = generateGrid(region);
  var dataPoints = [];
  for (const point of grid) {
    // loads rainfall for given coordinate into a weighted integer (0 - 7)
    const precipitationWeight = await getWeatherData(point).then((data) => {
      //if no current data is available for coordinates then discard data point
      return data.current ? getPrecipitationWeight(data) : null;
    });
    if (precipitationWeight) {
      // add weighted data point to array
      dataPoints.push({
        latitude: point.latitude,
        longitude: point.longitude,
        weight: precipitationWeight,
      });
    }
  }
  console.log("Weather route hit!");
  console.log(`${grid.length} API calls made`);
  res.send(dataPoints);
});

module.exports = router;
