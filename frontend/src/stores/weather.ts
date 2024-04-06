import { defineStore } from "pinia";

import { Weather } from "../models";


export const useWeatherStore = defineStore("weather", {
  actions: {
    async getCurrentWeather() {
      const url = "https://api.data.gov.sg/v1";

      const fn = async (reading: string) => {
        const data = await fetch(`${url}/environment/${reading}`, {
          mode: "cors",
        });

        return await data.json();
      }

      let data;
      try {
        data = await Promise.all([fn("air-temperature"), fn("relative-humidity"), fn("rainfall")]);
      } catch (error) {
        console.error(error);
      }

      let weather: Weather = {
        temperature: 30.1,
        humidity: 80.1,
        state: "Cloudy",
      };

      data?.forEach((d, i) => {
        const reading = d.items[0]?.readings?.find((r: any) => r.station_id === "S43").value;

        if (i === 0) {
          weather.temperature = reading;
        } else if (i === 1) {
          weather.humidity = reading;
        } else {
          weather.state = reading == 0 ? "Cloudy" : "Raining";
        }
      });

      return weather;
    },
  }
});