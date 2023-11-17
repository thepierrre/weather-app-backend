const axios = require("axios");
const express = require("express");
const cors = require("cors");
const app = express();
// const { locationKey, OpenWeatherAPIKey } = require("./weather-app-credentials");

const port = process.env.PORT;
// const port = 5014;

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

// Get the coordinates based on the entered city.
app.get("/coordinates", async (req, res, next) => {
  const { city } = req.query;

  // const APIKey = OpenWeatherAPIKey;
  const APIKey = process.env.APIKEY;
  const limit = 1;
  const APIUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${limit}&appid=${APIKey}`;

  try {
    const response = await axios.get(APIUrl);
    const coordinates = response.data;

    if (Array.isArray(coordinates) && coordinates.length > 0) {
      res.json(coordinates);
    } else {
      res.status(422).json({
        errorMessage: "Sorry, we couldn't find the city.",
      });
    }
    // res.json(coordinates);
  } catch (err) {
    res
      .status(422)
      .json({ errorMessage: "An error occured while fetching the city." });
  }
});

// Get weather and air quality based on the coordinates.
app.get("/combined-data", async (req, res, next) => {
  const { lat, lon } = req.query;
  // const APIKey = OpenWeatherAPIKey;
  const APIKey = process.env.APIKey;

  airQualityAPIUrl = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${APIKey}`;
  weatherAPIURL = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${APIKey}`;

  try {
    const [airQualityResponse, weatherResponse] = await Promise.all([
      axios.get(airQualityAPIUrl),
      axios.get(weatherAPIURL),
    ]);
    const airQualityData = airQualityResponse.data;
    const weatherData = weatherResponse.data;

    const combinedData = {
      airQuality: airQualityData,
      weather: weatherData,
    };

    res.json(combinedData);
  } catch (err) {
    console.log(err);
  }
});

// Get the city name based on the coordinates.
app.get("/city", async (req, res, next) => {
  const { lat, lon } = req.query;

  // const APIKey = OpenWeatherAPIKey;
  const APIKey = process.env.APIKey;
  const limit = 1;
  const APIUrl = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=${limit}&appid=${APIKey}`;

  try {
    const response = await axios.get(APIUrl);
    const city = response.data;
    res.json(city);
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
