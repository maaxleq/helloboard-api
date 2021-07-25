const http = require("http");
const axios = require("axios");
const express = require("express");
require("dotenv").config();

const app = express();

const getWeatherUrl = (type, city) => {
    return `https://api.openweathermap.org/data/2.5/${type}?q=${city}&units=metric&appid=${process.env.API_KEY}`;
}

const getLocateUrl = ip => {
    return `https://ip-api.com/json/${ip}`;
}

app.get("/weather/:city", (req, res) => {
    res. header("Access-Control-Allow-Origin", "*");

    const url = getWeatherUrl("weather", req.params.city);

    axios.get(url)
    .then(result => {
        const responseData = {
            weather: result.data.weather[0].description,
            temp: Math.round(result.data.main.temp),
            wind_speed: Math.round(result.data.wind.speed * 3.6),
            humidity: result.data.main.humidity,
            timestamp: result.data.dt,
        };

        res.json(responseData);
    })
    .catch(error => {
        res.end();
    });
});

app.get("/forecast/:city", (req, res) => {
    res. header("Access-Control-Allow-Origin", "*");

    const url = getWeatherUrl("forecast", req.params.city);

    axios.get(url)
    .then(result => {
        const responseData = [];

        for (let i = 0 ; i < 8 ; i++){
            const data = result.data.list[i];

            responseData.push({
                weather: data.weather[0].description,
                temp: Math.round(data.main.temp),
                wind_speed: Math.round(data.wind.speed * 3.6),
                humidity: data.main.humidity,
                timestamp: data.dt,
            });
        }

        res.json(responseData);
    })
    .catch(error => {
        res.end();
    });
});

app.get("/locate", (req, res) => {
    res. header("Access-Control-Allow-Origin", "*");

    const url = getLocateUrl(req.ip);

    axios.get(url)
    .then(result => {
        res.json(result);
    })
    .catch(error => {
        res.end();
    });
});

http.createServer(app).listen(process.env.PORT, process.env.HOST);