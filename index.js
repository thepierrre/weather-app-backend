const axios = require("axios");
const express = require("express");
const cors = require("cors");
const app = express();

const port = process.env.PORT;

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.use("/location", async (req, res, next) => {
  const { lat, lon } = req.body;

  const apiKey = process.env.LOCATIONKEY;
  const APIUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}`;

  try {
    const response = await axios.get(APIUrl);
    location = response.data.results[9].formatted_address;
  } catch (error) {
    location = null;
    error = "Something went wrong. Please try again.";
  }

  res.json(location);
});

app.use("/weather", async (req, res, next) => {
  const { city } = req.query;
  const apiKey = process.env.WEATHERKEY;
  const APIUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  try {
    const response = await axios.get(APIUrl);
    const weather = response.data;

    res.json(weather);
  } catch (error) {
    res.status(422).json({ errorMessage: "Couldn't find the entered city." });
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
