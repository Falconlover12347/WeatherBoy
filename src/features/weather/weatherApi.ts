import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export type Place = {
  id: number;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
};

export type Forecast = {
  current: { temperature_2m: number; weather_code: number };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
};

export const weatherApi = createApi({
  reducerPath: 'weatherApi',
  baseQuery: fetchBaseQuery({ baseUrl: '' }),
  endpoints: (builder) => ({
    getForecast: builder.query<Forecast, { lat: number; lon: number }>({
      query: ({ lat, lon }) =>
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&current=temperature_2m,weather_code` +
        `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
        `&timezone=auto&forecast_days=7`,
    }),

    searchPlaces: builder.query<Place[], string>({
      query: (name) =>
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          name
        )}&count=20&language=en&format=json`,
      transformResponse: (res: { results?: Place[] }) => res.results ?? [],
    }),
  }),
});

export const { useGetForecastQuery, useSearchPlacesQuery, useLazySearchPlacesQuery } = weatherApi;