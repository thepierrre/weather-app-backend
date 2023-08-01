const axios = require("axios");
const express = require("express");
const app = express();

const port = 5002;

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/location", async (req, res, next) => {
  // ipstack key
  const apiKey = "0fe6aa6fe86b3038828f74b6d0a57c61";
  // ipstack API
  const APIUrl = `http://api.ipstack.com/check?access_key=${apiKey}`;

  try {
    const response = await axios.get(APIUrl);
    location = response.data;
  } catch (error) {
    location = null;
    error = "Something went wrong. Please try again.";
  }

  res.json(location);
});

app.use("/weather", async (req, res, next) => {
  const { city } = req.query;
  // openweather key
  const apiKey = "056795ab2eb5a0b267ee4ab9dfafce43";
  // openweather API
  const APIUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  let weather;
  let error;

  try {
    const response = await axios.get(APIUrl);
    weather = response.data;
  } catch (error) {
    weather = null;
    error = "Something went wrong. Please try again.";
  }

  res.json(weather);
});

app.listen(port);
