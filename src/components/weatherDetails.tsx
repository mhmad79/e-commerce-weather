import React from 'react'
import { LuEye, LuSunrise, LuSunset } from 'react-icons/lu'
import { FiDroplet } from 'react-icons/fi';
import { MdAir } from 'react-icons/md';
import { ImMeter } from 'react-icons/im';

export interface WeatherDataProps {
    visability: string, 
    humidity: string,
    windSpeed: string,
    airPressure: string,
    sunrise: string,
    sunset: string
}

export default function WeatherDetails(props: WeatherDataProps) {
    const {
        visability = "25km", 
        humidity = "61%",
        windSpeed = "7 km/h",
        airPressure = "1012 hPa",
        sunrise = "6.20",
        sunset = "18.48"
    } = props;
  return (
    <>
        <SingleWeatherDetail 
            icon={<LuEye />} 
            informtion='Visability' 
            value={visability} 
        /> 
        <SingleWeatherDetail 
            icon={<FiDroplet />} 
            informtion='Humidity' 
            value={humidity} 
        /> 
        <SingleWeatherDetail 
            icon={<MdAir />} 
            informtion='WindSpeed' 
            value={windSpeed} 
        /> 
        <SingleWeatherDetail 
            icon={<ImMeter />} 
            informtion='AirPressure' 
            value={airPressure} 
        /> 
        <SingleWeatherDetail 
            icon={<LuSunrise />} 
            informtion='Sunrise' 
            value={sunrise} 
        /> 
        <SingleWeatherDetail 
            icon={<LuSunset />} 
            informtion='Sunset' 
            value={sunset} 
        /> 
    </>
  )
}

export  interface SinglWeatherDetailsProps {
    informtion: string,
    icon: React.ReactNode,
    value: string,
}

function SingleWeatherDetail(props: SinglWeatherDetailsProps) {
    return (
        <div className=' flex flex-col justify-between gap-2 items-center text-center text-xs font-semibold'>
            <p className=' whitespace-nowrap'>{props.informtion}</p>
            <div className=' text-3xl'>{props.icon}</div>
            <p>{props.value}</p>
        </div>
    )
}