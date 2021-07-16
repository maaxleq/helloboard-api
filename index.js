const http = require("http");
const axios = require("axios");
const express = require("express");
require("dotenv").config();

const app = express();

const getUrl = (type, city) => {
    return `https://api.openweathermap.org/data/2.5/${type}?q=${city}&units=metric&appid=${process.env.API_KEY}`;
}

app.get("/weather/:city", (req, res) => {
    const url = getUrl("weather", req.params.city);

    axios.get(url)
    .then(result => {
        if (result.data.cod == 200){
            const responseData = {
                weather: result.data.weather[0].description,
                temp: Math.round(result.data.main.temp),
                wind_speed: Math.round(result.data.wind.speed * 3.6),
                humidity: result.data.main.humidity,
                timestamp: result.data.dt,
            };

            res.json(responseData);
        }
        else {
            res.status(result.data.cod).end();
        }
    })
    .catch(error => {
        console.log(error);
        res.status(500).end();
    });
});

app.get("/forecast/:city", (req, res) => {
    const url = getUrl("forecast", req.params.city);

    axios.get(url)
    .then(result => {
        console.log(result);
        if (result.data.cod == 200){
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
        }
        else {
            res.status(result.data.cod).end();
        }
    })
    .catch(error => {
        console.log(error);
        res.status(500).end();
    });
});

http.createServer(app).listen(process.env.PORT, process.env.HOST);