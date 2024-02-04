'use client'

import Image from "next/image";
import Navbar from "@/components/navbar";
import { useQuery } from "react-query";
import axios from "axios";
import { format, fromUnixTime, parseISO } from "date-fns";
import Container from "@/components/container";
import { convertKelvinToCelsius } from "@/utils/convertKelvinToCelsius";
import WeatherIcon from "@/components/weather-icon";
import { getDayOrNightIcon } from "@/utils/getDayOrNight";
import WeatherDetails from "@/components/weatherDetails";
import { metersToKm } from "@/utils/metersToKm";
import ForecastWeatherDetail from "@/components/forecastWeatherDetail";
import { useAtom } from "jotai";
import { loadingCityAtom, placeAtom } from "./atom";
import { useEffect } from "react";

// https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_API_KEY}&cnt=56

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
    const [place, setPlace] = useAtom(placeAtom);
    const [loading, setLoading] = useAtom(loadingCityAtom);


    const { isLoading, error, data, refetch } = useQuery<WeatherData>('repoData',
        async () => {
            const { data } = await axios.get(
                `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`
            );
            
            return data;
        }
    );

    useEffect(() => {
        refetch();
    }, [place, refetch]);

    const firstData = data?.list[0];

    if (isLoading) return (<div className="flex items-center min-h-screen justify-center">
        <p className="animate-bounce">Loading...</p>
    </div>);


    if (error) return <div>Error: {(error as Error).message}</div>;

    const uniqueDates = [
        ...new Set(
            data?.list.map(
                (d) => new Date(d.dt * 1000).toISOString().split("T")[0]
            )
        )
    ];

    const firstDataForEachDate = uniqueDates.map((date) => {
        return data?.list.find((entry) => {
            const entryDate = new Date(entry.dt * 1000).toISOString().split("T")[0];
            const entryTime = new Date(entry.dt * 1000).getHours();
            return date === entryDate && entryTime >= 12;
        });
    });;

    return (
        <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
            <Navbar />
            
            <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
                {loading ? (<WeatherSkeleton />) :
                <>
                <section className="space-y-4">
                    <div className="space-y-2">
                        <h2 className="flex gap-1 text-2xl items-end">
                            <p>{format(parseISO(firstData?.dt_txt ?? ""), "EEEE")},</p>
                            <p>{(format(parseISO(firstData?.dt_txt ?? ""), "dd.MM.yyyy"))}</p>
                        </h2>
                        <Container className=" gap-10 px-6 items-center pr-10" >
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
                                {data?.list.map((d, i) => 
                                // check if the date is the same as the first date (date is today's date)
                                i < 8 
                                ? <div key={i} className="flex flex-col justify-between gap-2 items-center text-xs font-semibold mb-4">
                                    <p className="whitespace-nowrap">
                                        {format(parseISO(d.dt_txt), "HH:mm")}
                                    </p>
                                    <WeatherIcon iconName={getDayOrNightIcon(d.weather[0].icon, d.dt_txt)} />
                                    <p>
                                        {convertKelvinToCelsius(d.main.temp)}°C
                                    </p>
                                </div> : null)}
                            </div>
                        </Container>
                    </div>
                    <div className=" flex gap-4">
                        {/* left */}
                        <Container className="w-fit justify-center flex-col px-4 items-center">
                            <p className="capitalize text-center" >{firstData?.weather[0].description}</p>
                            <WeatherIcon iconName={getDayOrNightIcon(firstData?.weather[0].icon ?? "", 
                            firstData?.dt_txt ?? "")} 
                            />
                        </Container>
                            
                        <Container className="bg-yellow-300 px-6 gap-4 justify-between overflow-x-auto pr-10">
                            <WeatherDetails 
                                visibility={metersToKm(firstData?.visibility ?? 10000)} 
                                airPressure={`${firstData?.main.pressure} hPa`} 
                                humidity={`${firstData?.main.humidity}%`}
                                windSpeed={`${firstData?.wind.speed} km/h`}
                                sunrise={format(fromUnixTime(data?.city.sunrise ?? 1707029062), "HH:mm")}
                                sunset={format(fromUnixTime(data?.city.sunset ?? 1707062161), "HH:mm")}
                            />
                        </Container>
                    </div>
                </section>

                <section className="flex w-full flex-col gap-4">
                    <p className="text-2xl">Forecast (7 Days)</p>
                    {firstDataForEachDate.map((d, i) => (
                        <ForecastWeatherDetail key={i}
                        description={d?.weather[0].description ?? ""}
                        weatherIcon={d?.weather[0].icon ?? ""}
                        date={format(parseISO(d?.dt_txt ?? ""), "dd.MM")}
                        day={format(parseISO(d?.dt_txt ?? ""), "EEEE")}
                        temp={`${convertKelvinToCelsius(d?.main.temp ?? 279)}°C`}
                        tempMin={`${convertKelvinToCelsius(d?.main.temp_min ?? 279)}°C`}
                        tempMax={`${convertKelvinToCelsius(d?.main.temp_max ?? 279)}°C`}
                        feelsLike={`${convertKelvinToCelsius(d?.main.feels_like ?? 279)}°C`}
                        visibility={metersToKm(d?.visibility ?? 10000)}
                        airPressure={`${d?.main.pressure} hPa`}
                        humidity={`${d?.main.humidity}%`}
                        windSpeed={`${d?.wind.speed} km/h`}
                        sunrise={format(fromUnixTime(data?.city.sunrise ?? 1707029062), "HH:mm")}
                        sunset={format(fromUnixTime(data?.city.sunset ?? 1707062161), "HH:mm")}
                        />
                    ))}
                </section>
                </>}
            </main>
        </div>
    );
}

function WeatherSkeleton() {
    return (
        <section className="space-y-8 ">
            {/* Today's data skeleton */}
            <div className="space-y-2 animate-pulse">
                {/* Date skeleton */}
                <div className="flex gap-1 text-2xl items-end ">
                    <div className="h-6 w-24 bg-gray-300 rounded"></div>
                    <div className="h-6 w-24 bg-gray-300 rounded"></div>
                </div>

                {/* Time wise temperature skeleton */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((index) => (
                        <div key={index} className="flex flex-col items-center space-y-2">
                            <div className="h-6 w-16 bg-gray-300 rounded"></div>
                            <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
                            <div className="h-6 w-16 bg-gray-300 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 7 days forecast skeleton */}
            <div className="flex flex-col gap-4 animate-pulse">
                <p className="text-2xl h-8 w-36 bg-gray-300 rounded"></p>

                {[1, 2, 3, 4, 5, 6, 7].map((index) => (
                    <div key={index} className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
                        <div className="h-8 w-28 bg-gray-300 rounded"></div>
                        <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
                        <div className="h-8 w-28 bg-gray-300 rounded"></div>
                        <div className="h-8 w-28 bg-gray-300 rounded"></div>
                    </div>
                ))}
            </div>
        </section>
    );
}