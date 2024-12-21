import React from 'react'
import Container from './container'
import WeatherIcon from './weatherIcon'
import WeatherDetails, { WeatherDataProps } from './weatherDetails';
import covertkelvinTpCelsius from '@/utils/covertkelvinTpCelsius';

interface ForecasWeatherDetailProps extends WeatherDataProps {
    weatehrIcon: string;
    date: string;
    day: string;
    temp: number;           
    feels_like: number;      
    temp_max: number;        
    temp_min: number;       
    description: string;
  }

export default function ForecasWeatherDetail(props: ForecasWeatherDetailProps) {
    const {
        weatehrIcon = "02d",
        date = "19.09",
        day = "Tuesday",
        temp,           
        feels_like,      
        temp_max,        
        temp_min,       
        description
    } = props;
  return (
    <Container className=' gap-4'>
        {/* left */}
        <section className=' flex gap-4 items-center px-4'>
            <div className=' flex flex-col gap-1 items-center'>
                <WeatherIcon iconName={weatehrIcon} />
                <p>{props.date}</p>
                <p className=' text-sm'>{props.day}</p>
            </div>

            {/*  */}

            <div className=' flex flex-col px-4'>
                <span>{covertkelvinTpCelsius(props.temp ?? 0 )}°</span>
                <p className=' text-xs space-x-1 whitespace-nowrap'></p>
                <span>Feels like</span>
                <span>{covertkelvinTpCelsius(props.feels_like ?? 0 )}°</span>
                <p className=' capitalize'>{props.description}</p>
            </div>
        </section>
        {/* right */}
        <section className=' overflow-x-auto flex justify-between gap-4 px-4 w-full pr-10'>
            <WeatherDetails {...props}  />
        </section>
    </Container>
  )
}