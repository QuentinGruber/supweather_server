import { ApiResponse } from "../types/shared";
import axios from "axios";

const GetCityWeather = async function (req: any): Promise<ApiResponse> {
  const { cityId } = req.query;
  try {
    const result = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${process.env.OPENWEATHER_APIKEY}`
    );
    return {
      code: 200,
      data: result.data,
    };
  } catch (error:any) {
    console.log(error.response);
    const { cod, message } = error.response.data;
    return {
      code: cod,
      data: message,
    };
  }
};

const GetCityWeatherDaily = async function (req: any): Promise<ApiResponse> {
  const { lat, lon } = req.query;
  try {
    const result = await axios.get(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${process.env.OPENWEATHER_APIKEY}`
    );
    return {
      code: 200,
      data: result.data,
    };
  } catch (error:any) {
    console.log(error.response);
    const { cod, message } = error.response.data;
    return {
      code: cod,
      data: message,
    };
  }
};

export { GetCityWeather, GetCityWeatherDaily };
