// src/Weather.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const Weather = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // THIS IS THE LINE YOU NEED TO UPDATE
  const API_KEY = "6566dae9fbb605f4dd6372d3ba1169ee";

  const fetchWeatherData = async () => {
    if (!city) {
      setError("Please enter a city name.");
      setWeatherData(null);
      return;
    }

    setLoading(true);
    setError("");
    setWeatherData(null);

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );
      setWeatherData(response.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError("City not found. Please try again.");
      } else {
        setError("An error occurred while fetching weather data.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeatherData();
  };

  return (
    <div className="weather-app">
      <h1>Weather App</h1>
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="city-input"
        />
        <button type="submit" className="search-button">
          Get Weather
        </button>
      </form>

      {loading && <p className="loading">Loading weather data...</p>}
      {error && <p className="error-message">{error}</p>}

      {weatherData && (
        <div className="weather-display">
          <h2>
            {weatherData.name}, {weatherData.sys.country}
          </h2>
          <div className="weather-info">
            <p className="temperature">
              Temperature: {Math.round(weatherData.main.temp)}°C
            </p>
            <p className="description">
              Condition: {weatherData.weather[0].description}
            </p>
            <p className="humidity">Humidity: {weatherData.main.humidity}%</p>
            <p className="wind-speed">
              Wind Speed: {weatherData.wind.speed} m/s
            </p>
            {weatherData.weather[0].icon && (
              <img
                src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                alt={weatherData.weather[0].description}
                className="weather-icon"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;
