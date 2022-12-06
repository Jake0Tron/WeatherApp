import React, { useState, useEffect } from "react";
import useCurrentLocation from "../../hooks/useCurrentLocation";
import { Carousel } from "../../lib";
import "./ForecastWeather.css";

const fetchWeatherData = async (lat, long) => {
  const resp = await fetch(
    `http://localhost:8080/forecast?lat=${lat}&lon=${long}`
  );
  const data = await resp.json();
  return data;
};

const ForecastWeather = () => {
  const currentLocation = useCurrentLocation();
  const [forecastData, setForecastData] = useState(null);
  useEffect(() => {
    if (currentLocation) {
      fetchWeatherData(
        currentLocation.latitude,
        currentLocation.longitude
      ).then((weather) => {
        setForecastData(weather);
      });
    }
  }, [currentLocation]);

  return forecastData != null ? (
    <div className="forecastWeather">
      <div className="name">{forecastData.city.name} Forecast</div>
      <Carousel carouselData={forecastData.list} />
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default ForecastWeather;