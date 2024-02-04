'use client'

import Image from "next/image";
import Navbar from "../components/navbar";
import { useQuery } from "react-query";
import axios from "axios";
import { format, parseISO } from "date-fns";
import Container from "@/components/container";
import { convertKelvinToCelsius } from "@/utils/convertKelvinToCelsius";
import WeatherIcon from "@/components/weather-icon";
import { getDayOrNightIcon } from "@/utils/getDayOrNight";

// https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_API_KEY}&cnt=56
// https://api.openweathermap.org/data/2.5/forecast?q=berlin&appid=de64dfac830b87371aac037f142177cd&cnt=56

interface WeatherData {
    cod: string;
    message: number;
    cnt: number;
    list: Array<WeatherItem>;
    city: {
        id: number;
        name: string;
        coord: {
            lat: number;
            lon: number;
        };
        country: string;
        population: number;
        timezone: number;
        sunrise: number;
        sunset: number;
    };
}

interface WeatherItem {
    dt: number;
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        sea_level: number;
        grnd_level: number;
        humidity: number;
        temp_kf: number;
    };
    weather: Array<{
        id: number;
        main: string;
        description: string;
        icon: string;
    }>;
    clouds: {
        all: number;
    };
    wind: {
        speed: number;
        deg: number;
        gust: number;
    };
    visibility: number;
    pop: number;
    sys: {
        pod: string;
    };
    dt_txt: string;
}


export default function Home() {
    const { isLoading, error, data } = useQuery<WeatherData>('repoData',
        async () => {
            const { data } = await axios.get(
                `https://api.openweathermap.org/data/2.5/forecast?q=berlin&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`
            );
            
            return data;
        }
    );

    const firstData = data?.list[0];

    console.log('data', data);


    if (isLoading) return (<div className="flex items-center min-h-screen justify-center">
        <p className="animate-bounce">Loading...</p>
    </div>);


    if (error) return <div>Error: {(error as Error).message}</div>;


    return (
        <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
            <Navbar />
            <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
                {/* today data */}
                <section className="space-y-4">
                    <div>
                        <h2 className="flex gap-1 text-2xl items-end">
                            <p>{format(parseISO(firstData?.dt_txt ?? ""), "EEEE")},</p>
                            <p>{(format(parseISO(firstData?.dt_txt ?? ""), "dd.MM.yyyy"))}</p>
                        </h2>
                        <Container className=" gap-10 px-6 items-center" >
                            <div className="flex flex-col px-4">
                                <span className="text-5xl">{convertKelvinToCelsius(firstData?.main.temp ?? 279)}°C</span>
                                <p className="text-xs space-x-1 whitespace-nowrap flex items-center justify-between">
                                    <span>Feels like </span><span>{convertKelvinToCelsius(firstData?.main.feels_like ?? 279)}°C</span>
                                </p>
                                <p className="text-xs space-x-2 flex items-center justify-between">
                                    <span>↓ {convertKelvinToCelsius(firstData?.main.temp_min ?? 279)}°C</span>
                                    <span>↑ {convertKelvinToCelsius(firstData?.main.temp_max ?? 279)}°C</span>
                                </p>
                            </div>
                            <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
                                {data?.list.map((d, i) => <div key={i} className="flex flex-col justify-between gap-2 items-center text-xs font-semibold mb-4">
                                    <p className="whitespace-nowrap">
                                        {format(parseISO(d.dt_txt), "HH:mm")}
                                    </p>
                                    <WeatherIcon iconName={getDayOrNightIcon(d.weather[0].icon, d.dt_txt)} />
                                    <p>
                                        {convertKelvinToCelsius(d.main.temp)}°C
                                    </p>
                                </div>)}
                            </div>
                        </Container>
                    </div>
                </section>

                {/* 7 day forecast data */}
                <section></section>
            </main>
        </div>
    );
}
