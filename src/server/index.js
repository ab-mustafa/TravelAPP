// import { getCityImage, getWeatherForTarget, getCityGeoInfo } from './utils.js'; 
const { getCityImage, getWeatherForTarget, getCityGeoInfo } = require('./utils.js');


let projectData = {};
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const cors = require('cors');
app.use(cors());
require("dotenv").config();


const secret_keys = {
    "WEATHER_BIT_KEY": process.env.WEATHER_BIT_KEY,
    "PIXABAY_KEY": process.env.PIXABAY_KEY,
    "GEONAMES_KEY": process.env.GEONAMES_KEY
}

app.get("/trip-info", async (req, res) => {
    try {
        const { city, date } = req.query;
        if (!city) {
            return res.status(400).json({ error: "City is required for getting trip inf." });
        }
        if (!date){
            return res.status(400).json({ error: "Date is required for getting trip info."})
        }

        const geoInfo = await getCityGeoInfo(city, secret_keys["GEONAMES_KEY"]);
        if (geoInfo["message"] == "City not found"){
            res.json({"message":  "City not found"});
        }
        else {
        const weather = await getWeatherForTarget(geoInfo.latitude, geoInfo.longitude, date, secret_keys["WEATHER_BIT_KEY"]);
        const cityImage = await getCityImage(city, secret_keys["PIXABAY_KEY"]);

        res.json({ 
                   "city": city,
                   "date": date,
                   "geoInfo": geoInfo,
                   "weather": weather,
                   "cityImage": cityImage 
        });
    }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});




app.get("/get-city-geo", async (req, res) => {
    try {
        const {city} = req.query;
        if (!city) {
            return res.status(400).json({ error: "City is required for getting trip inf." });
        }
        const geoInfo = await getCityGeoInfo(city, secret_keys["GEONAMES_KEY"]);
        res.json(geoInfo)
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});


app.get("/get-city-weather", async (req, res)=>{
    try {
        const { latitude,  longitude, date } = req.query;
        if (!latitude) {
            return res.status(400).json({ error: "latitude of the destination is required for getting accurate weather." });
        }
        if (!longitude) {
            return res.status(400).json({ error: "longitude of the destination is required for getting accurate weather." });
        }
        if (!date){
            return res.status(400).json({ error: "Date is required for getting accurate weather."})
        }
        const weather = await getWeatherForTarget(latitude, longitude, date, secret_keys["WEATHER_BIT_KEY"]);
        res.json(weather);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});


app.get("/get-city-image", async (req, res) => {
    try {
        const { city} = req.query;
        if (!city) {
            return res.status(400).json({ error: "City is required for getting Image." });}
        const cityImage = await getCityImage(city, secret_keys["PIXABAY_KEY"]);
        res.json({ "cityImage": cityImage});
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

    

// Setup Server
const port = 8000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

