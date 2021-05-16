import { GetCityWeather } from "./WeatherController";

test("Ask openWeatherApi", async () => {
  const req = { query: { cityId: 2288873 } };
  expect((await GetCityWeather(req)).code).toBe(200);
});
