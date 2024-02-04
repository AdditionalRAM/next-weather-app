import React from 'react';
import Container from './container';
import WeatherIcon from './weather-icon';
import WeatherDetails, { WeatherDetailProps } from './weatherDetails';

export interface ForecastWeatherDetailProps extends WeatherDetailProps {
    weatherIcon: string;
    date: string;
    day: string;
    temp: string;
    tempMin: string;
    tempMax: string;
    feelsLike: string;
    description: string;
}

export default function ForecastWeatherDetail(props: ForecastWeatherDetailProps) {
    // set default values
    const {
        weatherIcon = "01d",
        date = "04.02",
        day = "Sunday",
        temp = "25°C",
        tempMin = "20°C",
        tempMax = "30°C",
        feelsLike = "25°C",
        description = "Clear Sky"
    } = props;
    return (
        <Container className="gap-4">
            <section className="flex flex-gap-4 items-center px-4">
                <div className="flex flex-col px-4 items-center justify-between h-full">
                    <WeatherIcon iconName={weatherIcon} />
                    <p>{date}</p>
                    <p className="text-sm">{day}</p>
                </div>
                <div className="flex flex-col px-4 items-center justify-between h-full">
                    <p className="text-3xl w-full text-center">{temp}</p>
                    <p className="text-xs space-x-1 whitespace-nowrap flex items-center justify-between w-full">
                        <span>Feels like </span><span>{feelsLike}</span>
                    </p>
                    <p className="text-xs space-x-2 flex items-center justify-between w-full">
                        <span>↓{tempMin}</span>
                        <span>↑{tempMax}</span>
                    </p>
                    <p className="capitalize text-center" >{description}</p>
                </div>
            </section>
            <section className="overflow-x-auto flex justify-between gap-4 px-4 w-full pr-10">
                <WeatherDetails {...props} />
            </section>
        </Container>
    )
}