import React from 'react';
import Container from './container';
import { LuEye, LuSunrise, LuSunset } from 'react-icons/lu';
import { FiDroplet } from 'react-icons/fi';
import { MdAir } from 'react-icons/md';
import { ImMeter } from 'react-icons/im';

export interface WeatherDetailProps {
    visibility: string;
    humidity: string;
    windSpeed: string;
    airPressure: string;
    sunrise: string;
    sunset: string;
}

export default function WeatherDetails(props: WeatherDetailProps) {
    const {
        visibility = "25km",
        humidity = "61%",
        windSpeed = "7 km/h",
        airPressure = "1013 hPa",
        sunrise = "06:00",
        sunset = "18:00"
    } = props;

    return (
        <>
            <SingleWeatherDetail
                icon={<LuEye />}
                info="Visibility"
                value={visibility}
            />
            <SingleWeatherDetail
                icon={<FiDroplet />}
                info="Humidity"
                value={humidity}
            />
            <SingleWeatherDetail
                icon={<MdAir />}
                info="Wind Speed"
                value={windSpeed}
            />
            <SingleWeatherDetail
                icon={<ImMeter />}
                info="Air Pressure"
                value={airPressure}
            />
            <SingleWeatherDetail
                icon={<LuSunrise />}
                info="Sunrise"
                value={sunrise}
            />
            <SingleWeatherDetail
                icon={<LuSunset />}
                info="Sunset"
                value={sunset}
            />
        </>
    );
}

export interface SingleWeatherDetailProps {
    info: string;
    icon: React.ReactNode;
    value: string;
}

function SingleWeatherDetail(props: SingleWeatherDetailProps){
    return (
        <div className="flex flex-col justify-between gap-2 items-center text-xs font-semibold text-black/80 px-2">
            <p className="whitespace-nowrap">{props.info}</p>
            <div className="text-3xl">{props.icon}</div>
            <p>{props.value}</p>
        </div>
    );
}