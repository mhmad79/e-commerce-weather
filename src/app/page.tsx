'use client'
import Container from "@/components/container";
import { converWindSpeed } from "@/components/convertWindSpeed";
import ForecasWeatherDetail from "@/components/forecasWeatherDetail";
import Navbar from "@/components/navbar";
import WeatherDetails from "@/components/weatherDetails";
import WeatherIcon from "@/components/weatherIcon";
import covertkelvinTpCelsius from "@/utils/covertkelvinTpCelsius";
import { getDayOrNighIcon } from "@/utils/getDayOrNightIcon";
import { metersTokilometers } from "@/utils/metersTokilometers";
import { useQuery } from "@tanstack/react-query";
import axios from 'axios';
import {format, fromUnixTime, parseISO} from 'date-fns'
import { useAtom } from "jotai";
import { lodingCityAtom, placeAtom } from "./atom";
import { useEffect } from "react";
// https://api.openweathermap.org/data/2.5/forecast?q=pune&appid=482c7dceb662eb0cb3310449e50f90dd&cnt=56

interface WeatherData {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherForecast[];
  city: City;
}

interface WeatherForecast {
  dt: number;
  main: MainWeather;
  weather: WeatherDescription[];
  clouds: Clouds;
  wind: Wind;
  visibility: number;
  pop: number;
  sys: Sys;
  dt_txt: string;
}

interface MainWeather {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  sea_level: number;
  grnd_level: number;
  humidity: number;
  temp_kf: number;
}

interface WeatherDescription {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface Clouds {
  all: number;
}

interface Wind {
  speed: number;
  deg: number;
  gust: number;
}

interface Sys {
  pod: string;
}

interface City {
  id: number;
  name: string;
  coord: Coordinates;
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
}

interface Coordinates {
  lat: number;
  lon: number;
}


 

export default function Home() {
    const [place, setPlace] = useAtom(placeAtom)
    const [loadingCity,] = useAtom(lodingCityAtom)
    
  const { isPending, error, data, refetch } = useQuery<WeatherData>({
    queryKey: ['repoData'], 
    queryFn: async ()  => {
      const {data} = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=482c7dceb662eb0cb3310449e50f90dd&cnt=56`
      ) 
      return data;
    }
  })

  useEffect(() => {
    refetch()
  }, [place, refetch])

  console.log('data',data);
  

  
  const firsData = data?.list[0]
  
  console.log('data', data);
  
  // if (!data || !data.list) {
  //   throw new Error("Data or list is missing!");
  // }
  
  const uniqueDates = [
    ...new Set(
      data?.list.map(
        (entry) => new Date(entry.dt * 1000).toISOString().split("T")[0]
      )
    )
  ];
  
  const firstDataForEachDate = uniqueDates.map((date) => {
    return data?.list.find((entry) => {
      const entryDate = new Date(entry.dt * 1000).toISOString().split("T")[0];
      const entryTime = new Date(entry.dt * 1000).getHours();
      return entryDate === date && entryTime >= 6;
    }) || null; // معالجة القيم غير الموجودة
  });
  
  console.log(firstDataForEachDate);
  

  if (isPending) return (
    <div className="flex items-center min-h-screen justify-center">
      <p className="aniwate-bounce">Loading...</p>
    </div>
  )

  return (
    <div className=" flex flex-col gap-4 bg-gray-100 min-h-screen">
      <Navbar location={data?.city.name}  />
      <main className="px-3 max-w-7xl mx-auto flex-col gap-9 w-full pb-10 pt-10">
        {/* today data */}
        {loadingCity ? ( 
          <WeatherSkeleton /> 
        ) : (
        <>
        <section className=" space-y-4">
          <div className="space-y-2">
            <h2 className=" flex items-end gap-1 text-2xl ">
              <p>{format(parseISO(firsData?.dt_txt ?? ""), "EEEE")}</p>
              <p className=" text-lg">({format(parseISO(firsData?.dt_txt ?? ""), "dd.MM.yyyy")})</p>
            </h2>
            <Container className=" gap-10 px-6 items-center">
              {/* temprature */}
              <div className=" flex flex-col px-4">
                <span className=" text-5xl">
                  {covertkelvinTpCelsius(firsData?.main.temp ?? 302.15)}°
                </span>
              <p className=" text-xs space-x-1 whitespace-nowrap">
                  <span>
                    Feels like
                  </span>
                  <span className="">
                    {covertkelvinTpCelsius(firsData?.main.feels_like ?? 0)}°
                  </span>
              </p>
              <p className=" text-xs space-x-2">
                  <span className="">
                    {covertkelvinTpCelsius(firsData?.main.temp_min ?? 0)}°↓
                  </span>
                  <span className="">
                    {covertkelvinTpCelsius(firsData?.main.temp_max ?? 0)}°↑
                  </span>
              </p>
              </div>
              {/* time and weather icon */}
              <div className=" flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
                {data?.list.map((d, i) => (
                  <div 
                    key={i}
                    className=" flex flex-col justify-between gap-2 items-center text-xs font-semibold"
                  >
                    <p className=' whitespace-nowrap'>
                      {format(parseISO(d.dt_txt), "h:mm a")}
                    </p>

                      <WeatherIcon 
                        iconName={getDayOrNighIcon(d.weather[0].icon, d.dt_txt)} 
                      />
                    <p>
                      {covertkelvinTpCelsius(d?.main.temp ?? 0 )}°
                    </p>

                  </div>
                ))}
              </div>
            </Container>
          </div>
          <div className="flex gap-4">
          {/* legt */}
              <Container className="w-fit justify-center flex-col px-4 items-center">
                <p className=" capitalize text-center">{firsData?.weather[0].description}</p>
                <WeatherIcon 
                  iconName={getDayOrNighIcon(
                    firsData?.weather[0].icon ?? '', 
                    firsData?.dt_txt ?? '')} 
                />
              </Container>
              <Container className=" bg-yellow-300/80 px-6 gap-4 justify-between overflow-x-auto">
                    <WeatherDetails 
                      visability={metersTokilometers(firsData?.visibility ?? 10000)}
                      airPressure={`${firsData?.main.pressure} hPa`}
                      humidity={`${firsData?.main.humidity}%`}
                      sunrise={format(
                        fromUnixTime(data?.city.sunrise ?? 1734226148),
                        'H:mm'
                      )}
                      sunset={format(
                        fromUnixTime(data?.city.sunset ?? 1734265833),
                        'H:mm'
                      )}
                      windSpeed={converWindSpeed(firsData?.wind.speed ?? 1.64)}
                     />
              </Container>
          {/* right */}
          </div>
        </section>
        {/* 7 day forcast data */}
        <section className=" flex w-full flex-col gap-4">
          <p className="text-2xl">Forcast (7 days)</p>
          {firstDataForEachDate.map((d,i) => (
          <ForecasWeatherDetail key={i} 
              weatehrIcon = {d?.weather[0].icon ?? '0id'}
              date = {format(parseISO(d?.dt_txt ?? ''), 'dd.MM')}
              day = {format(parseISO(d?.dt_txt ?? ''), 'EEEE')}
              feels_like = {d?.main.feels_like ?? 0}      
              temp = {d?.main.temp ?? 0}         
              temp_max = {d?.main.temp_max}        
              temp_min = {d?.main.temp_min}        
              description  = {d?.weather[0].description ?? ''}
              visability={metersTokilometers(firsData?.visibility ?? 10000)}
              airPressure={`${firsData?.main.pressure} hPa`}
              humidity={`${firsData?.main.humidity}%`}
              sunrise={format(
                fromUnixTime(data?.city.sunrise ?? 1734226148),
                'H:mm'
              )}
              sunset={format(
                fromUnixTime(data?.city.sunset ?? 1734265833),
                'H:mm'
              )}
              windSpeed={converWindSpeed(firsData?.wind.speed ?? 1.64)}
              />
            ))}
        </section>
      </>
        )}
      </main>
    </div>
  );
}



import React from "react";

function WeatherSkeleton() {
  return (
    <main className="px-3 max-w-7xl mx-auto flex-col gap-9 w-full pb-10 pt-10 animate-pulse">
      {/* Skeleton for today's data */}
      <section className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-end gap-3">
            {/* Skeleton for date */}
            <div className="h-6 bg-gray-300 rounded w-32"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
          <div className="gap-10 px-6 items-center flex">
            {/* Skeleton for temperature */}
            <div className="flex flex-col px-4 gap-2">
              <div className="h-12 bg-gray-300 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 bg-gray-200 rounded w-28"></div>
            </div>
            {/* Skeleton for weather icons */}
            <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full pr-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-2 items-center text-xs font-semibold"
                >
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-12"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          {/* Left section skeleton */}
          <div className="flex flex-col px-4 items-center">
            <div className="h-6 bg-gray-300 rounded w-28"></div>
            <div className="h-16 w-16 bg-gray-300 rounded-full"></div>
          </div>
          {/* Right section skeleton */}
          <div className="bg-gray-300/80 px-6 gap-4 justify-between flex-col w-full">
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </section>
      {/* Skeleton for 7-day forecast */}
      <section className="flex w-full flex-col gap-4">
        <div className="h-6 bg-gray-300 rounded w-32"></div>
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex justify-between items-center gap-4">
            <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
            <div className="flex-1 h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
        ))}
      </section>
    </main>
  );
};

