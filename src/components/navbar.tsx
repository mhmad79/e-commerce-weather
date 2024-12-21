/*** @format */
'use client'
import React, { useState } from 'react';
import { MdMyLocation, MdOutlineLocationOn, MdWbSunny } from "react-icons/md";
import SearchBox from './searchBox';
import axios from 'axios';
import { useAtom } from 'jotai';
import { lodingCityAtom, placeAtom } from '@/app/atom';

type Props = {location?: string};

export default function Navbar({ location }: Props) {
  const [city, setCity] = useState('');
  const [error, setError] = useState('');
  // 
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const [place, setPlace] = useAtom(placeAtom)
  const [_, setLodingCity] = useAtom(lodingCityAtom)

  async function handlInpotChange(value: string) {
    setCity(value)
    if(value.length >= 3){
      try {
        const response = await axios.get( 
          `https://api.openweathermap.org/data/2.5/find?q=${value}&appid=482c7dceb662eb0cb3310449e50f90dd`
        );
           console.log(response);
           
          const suggestions = response.data.list.map((item: any) => item.name);
          setSuggestions(suggestions);
          setError('')
          setShowSuggestions(true)
      } catch (error) {
        setSuggestions([])
        setShowSuggestions(false)
      }
    }
    else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  function handleSuggestionClick(value: string) {
    setCity(value)
    setShowSuggestions(false)
  }
  
  function handleSubmitSearch(e:React.FormEvent<HTMLFormElement>) {
    setLodingCity(true)
    e.preventDefault()
    if(suggestions.length==0) {
      setError('Location not found')
      setLodingCity(false)
    }
    else {
      setError('')
      setTimeout(() => {
        setLodingCity(false)
      setPlace(city)
      setShowSuggestions(false)
      } , 500);
    }
  }

  function handleCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (postiion) => {
        const { latitude, longitude } = postiion.coords;
        try {
          setLodingCity(true)
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=482c7dceb662eb0cb3310449e50f90dd&cnt=56`
        );
        setTimeout(() => {
          setLodingCity(false)
          setPlace(response.data.name)
        }, 500);
      } catch (error) {
        setLodingCity(false)
      }
    });
  }
}
  

  return (
    <>
      <nav className='shadow-sm sticky top-0 left-0 z-50 bg-white'>
        <div className=' h-[80px] w-full flex justify-between items-center max-w-7xl px-3 mx-auto'>
            <div className=' flex items-center  gap-2'>
                <h2 className='text-gray-500 text-3xl'>Weather</h2>
                <MdWbSunny className='text-3xl mt-1 text-yellow-300 ' />
            </div>
            <section className=' flex gap-2 items-center'>
              <MdMyLocation 
                title='Your Current Location'
                onClick={handleCurrentLocation}
                className=' text-2xl text-gray-400 hover:opacity-80 cursor-pointer' 
              />
              <MdOutlineLocationOn className=' text-3xl' />
              <p className='text-slate-900/80 text-sm'> {location} </p>
              <div className=' relative hidden md:flex'> 
                {/**Serch box*/}
                <SearchBox
                  value={city}
                  onSubmit={handleSubmitSearch}
                  onChange={e => handlInpotChange(e.target.value)}
                />

                <SuggetopmBox
                {...{
                  showSuggestions,
                  suggestions,
                  handleSuggestionClick,
                  error
                }}  />
              </div>
            </section>
        </div>
      </nav>
      <section className=' flex max-w-7xl px-3 md:hidden'>
        <div className=' relative '> 
                  {/**Serch box*/}
                  <SearchBox
                    value={city}
                    onSubmit={handleSubmitSearch}
                    onChange={e => handlInpotChange(e.target.value)}
                    />

                  <SuggetopmBox
                  {...{
                    showSuggestions,
                    suggestions,
                    handleSuggestionClick,
                    error
                  }}  />
                </div>
            </section>
    </>

  )
}

function SuggetopmBox({
  showSuggestions,
  suggestions,
  handleSuggestionClick,
  error
}: {
  showSuggestions: boolean,
  suggestions: string[],
  handleSuggestionClick: (item: string) => void,
  error: string
}) {
  return (
    <>
    {((showSuggestions && suggestions.length > 1) || error) && (
      <ul className=' mb-4 bg-white absolute border top-[44px] left-0 border-r-gray-100 rounded-md min-w-[200px] flex flex-col gap-1 py-2 px-2'>
        {error && suggestions.length < 1 && (
          <li className=' text-red-500 p-1'>{error}</li>
        )}
        {suggestions.map((itme, i) => (

          <li 
            key={i}
            onClick={() => handleSuggestionClick(itme)}
            className=' cur p-1 rounded hover:bg-gray-200'
            >
              {itme}
            </li>
        ))}
      </ul>
    )}
    </>
  )
}