"use client"

import React from 'react';
import { MdMyLocation, MdOutlineLocationOn, MdSunny } from "react-icons/md";
import SearchBox from './SearchBox';

import {useState} from 'react';
import axios from 'axios';
import { useAtom } from 'jotai';
import { loadingCityAtom, placeAtom } from '@/app/atom';

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_KEY;

type Props = {};

export default function Navbar({}: Props) {

    const [city, setCity] = useState<string>("");
    const [error, setError] = useState<string>("");
    
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

    const [place, setPlace] = useAtom(placeAtom);
    const [loading, setLoading] = useAtom(loadingCityAtom);

    async function handleInputChange (value: string) {
        setCity(value);
        if(value.length >= 3){
            try{
                const response = await axios.get(
                    `https://api.openweathermap.org/data/2.5/find?q=${value}&appid=${API_KEY}`
                    );

                const suggestions = response.data.list.map((item:any) => item.name);

                setSuggestions(suggestions);
                setError("");
                setShowSuggestions(true);
            }
            catch(err:any){
                setSuggestions([]);
                setError(err.message);
            }
        }else{
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }

    function handleSuggestionClick(item: string){
        setCity(item);
        setShowSuggestions(false);
        
    }

    function handleSubmitSearch( e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        setLoading(true);
        if(suggestions.length == 0){
            setError("No city found");
            setLoading(false);
        }
        else{
            setError("");
            setTimeout(() => {
                setShowSuggestions(false);
                setPlace(city);
                setLoading(false);    
            }, 500);
        }
    }

    function handleCurrentLocation(){
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(async (position) => {
                const {latitude, longitude} = position.coords;
                try{
                    setLoading(true);
                    const response = await axios.get(
                        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
                    );
                    setTimeout(() => {
                        setPlace(response.data.name);
                        setLoading(false);
                    }, 500);
                }
                catch(err:any){
                    setError(err.message);
                }
            });
        }
    }

    return (
        <nav className="shadow-sm sticky top-0 left-0 z-50 bg-white">
            <div className="h-[80px] w-full flex justify-between items-center max-w-7xl px-3 mx-auto">
                <p className="flex items-center justify-center gap-2">
                    <h2 className="text-gray-500 text-3xl">Weather</h2>
                    <MdSunny className="text-3xl mt-1 text-orange-600" />
                </p>
                <section className="flex gap-2 items-center">
                    <MdMyLocation 
                    title="Find My Location" 
                    onClick={handleCurrentLocation}
                    className="text-2xl text-gray-500 transition-transform duration-200 hover:scale-110 cursor-pointer" />
                    <MdOutlineLocationOn className="text-3xl" />
                    <p className="text-slate-900/80 text-sm"> {place} </p>
                    <div className="relative">{/* SearchBox */}
                        <SearchBox
                        value={city}
                        onChange={(e) => handleInputChange(e.target.value)}
                        onSubmit={(e) => handleSubmitSearch(e)}
                         />
                         <SuggestionBox
                        {...{
                            showSuggestions,
                            suggestions,
                            handleSuggestionClick,
                            error
                        }}
                        />
                    </div>
                </section>
            </div>
        </nav>
    );
}

function SuggestionBox({
    showSuggestions,
    suggestions,
    handleSuggestionClick,
    error
}:{
    showSuggestions: boolean;
    suggestions: string[];
    handleSuggestionClick: (item: string) => void;
    error: string;
}) {
    return (
        <> {((showSuggestions && suggestions.length > 1) || error) && 
        
        <ul className="mb-4 bg-white absolute border top-[44px] left-0 border-gray rounded-md min-w-[200px] flex flex-col gap-1 py-2 px-2">
            {error && suggestions.length < 1 && <li className="text-red-500 p-1">{error}</li>}
            {suggestions.map((item, i) => (
                <li
                key={i}
                onClick={() => handleSuggestionClick(item)}
                className="cursor-pointer p-1 rounded hover:bg-gray-200"
                >
                    {item}
                </li>
            ))}
        </ul>
        }

        </>
    )
}