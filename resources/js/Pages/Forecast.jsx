import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';

export default function Forecast() {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);
    const [selectedHour, setSelectedHour] = useState(null); // null means "current" or "daily summary" if not today

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                // Las Canteras coordinates: 28.128, -15.433
                const response = await fetch(
                    'https://api.open-meteo.com/v1/forecast?latitude=28.128&longitude=-15.433&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m,uv_index&hourly=temperature_2m,weather_code,wind_speed_10m,wind_direction_10m,uv_index,is_day&daily=weather_code,sunrise,sunset,uv_index_max,precipitation_sum,wind_speed_10m_max&timezone=auto'
                );
                const data = await response.json();
                setWeatherData(data);
            } catch (error) {
                console.error("Error fetching weather data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, []);

    const getWeatherIcon = (code) => {
        if (code === 0) return "☀️";
        if (code >= 1 && code <= 3) return "⛅";
        if (code >= 45 && code <= 48) return "🌫️";
        if (code >= 51 && code <= 55) return "🌧️";
        if (code >= 61 && code <= 67) return "🌧️";
        if (code >= 71 && code <= 77) return "❄️";
        if (code >= 80 && code <= 82) return "🌦️";
        if (code >= 95 && code <= 99) return "⛈️";
        return "❓";
    };

    const getWeatherDescription = (code) => {
        const codes = {
            0: "Despejado", 1: "Mayormente despejado", 2: "Parcialmente nublado", 3: "Nublado",
            45: "Niebla", 48: "Niebla con escarcha", 51: "Llovizna ligera", 53: "Llovizna moderada",
            55: "Llovizna densa", 61: "Lluvia ligera", 63: "Lluvia moderada", 65: "Lluvia fuerte",
            80: "Chubascos ligeros", 81: "Chubascos moderados", 82: "Chubascos violentos", 95: "Tormenta",
        };
        return codes[code] || "Desconocido";
    };

    const getWindDirection = (degrees) => {
        const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        return directions[Math.round(degrees / 45) % 8];
    };

    const getWindStatus = (speed) => {
        if (speed < 15) return { label: "Leve", color: "text-green-500", icon: "😌", bg: "bg-green-50" };
        if (speed < 30) return { label: "Moderado", color: "text-blue-500", icon: "😐", bg: "bg-blue-50" };
        return { label: "Fuerte", color: "text-red-500", icon: "😵", bg: "bg-red-50" };
    };

    const getUVStatus = (index) => {
        if (index < 2) return { color: "text-green-500", warning: null, bg: "bg-green-50" };
        if (index < 5) return { color: "text-yellow-500", warning: null, bg: "bg-yellow-50" };
        if (index < 7) return { color: "text-orange-500", warning: "¡Ponte crema!", bg: "bg-orange-50" };
        return { color: "text-red-500", warning: "¡Ponte crema!", bg: "bg-red-50" };
    };

    const formatTime = (isoString) => {
        return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Helper to get the data to display based on selection
    const getDisplayData = () => {
        if (!weatherData) return null;

        // If a specific hour is selected
        if (selectedHour) {
            const index = weatherData.hourly.time.indexOf(selectedHour);
            if (index !== -1) {
                return {
                    type: 'hourly',
                    timeLabel: `${new Date(selectedHour).toLocaleDateString('es-ES', { weekday: 'long' })} ${formatTime(selectedHour)}`,
                    temp: weatherData.hourly.temperature_2m[index],
                    code: weatherData.hourly.weather_code[index],
                    windSpeed: weatherData.hourly.wind_speed_10m[index],
                    windDir: weatherData.hourly.wind_direction_10m[index] || 0, // Add fallback
                    uv: weatherData.hourly.uv_index[index],
                    isDay: weatherData.hourly.is_day[index],
                    sunInfo: null // Hourly doesn't really have sun hours left logic same as current
                };
            }
        }

        // If today and no specific hour selected -> Show Current
        const isToday = selectedDayIndex === 0;
        if (isToday) {
            return {
                type: 'current',
                timeLabel: "Ahora mismo",
                temp: weatherData.current.temperature_2m,
                code: weatherData.current.weather_code,
                windSpeed: weatherData.current.wind_speed_10m,
                windDir: weatherData.current.wind_direction_10m,
                uv: weatherData.daily.uv_index_max[0], // Use max UV for today as reference or current? API has current UV.
                // Let's use current UV if available in current object, otherwise daily max
                // API call requested current=uv_index, so it should be there.
                uv: weatherData.current.uv_index,
                isDay: weatherData.current.is_day,
                sunInfo: calculateSunHoursLeft(new Date())
            };
        }

        // If future day and no hour selected -> Show Daily Summary (using noon or max values)
        const dayDate = weatherData.daily.time[selectedDayIndex];
        return {
            type: 'daily',
            timeLabel: new Date(dayDate).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }),
            temp: null, // Daily doesn't have a single temp, maybe show range?
            // Let's find the max temp for that day from hourly or daily API
            // The API call didn't request daily max temp, but we have hourly.
            // Let's just grab 12:00 PM for that day as a representative or just show "Ver por horas"
            // Better: Use the daily weather code.
            code: weatherData.daily.weather_code[selectedDayIndex],
            windSpeed: weatherData.daily.wind_speed_10m_max[selectedDayIndex],
            windDir: null, // Daily max wind doesn't have a single direction
            uv: weatherData.daily.uv_index_max[selectedDayIndex],
            isDay: 1,
            sunInfo: `Amanecer: ${formatTime(weatherData.daily.sunrise[selectedDayIndex])} - Puesta: ${formatTime(weatherData.daily.sunset[selectedDayIndex])}`
        };
    };

    const calculateSunHoursLeft = (now) => {
        if (!weatherData || !weatherData.daily) return "";
        const sunset = new Date(weatherData.daily.sunset[0]);
        const sunrise = new Date(weatherData.daily.sunrise[0]);

        if (now > sunset) return "Anocheció";
        if (now < sunrise) return "Amanece pronto";

        const diffMs = sunset - now;
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m de sol`;
    };

    const displayData = getDisplayData();

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Previsión Meteorológica" />
            <Navbar />

            <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-extrabold text-gray-900">
                        Previsión <span className="text-[#1CA9C9]">Las Canteras</span>
                    </h1>
                </div>

                {loading || !displayData ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1CA9C9]"></div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Unified Main Card */}
                        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 relative">
                            {/* Card Header / Background */}
                            <div className={`p-8 text-center relative overflow-hidden ${displayData.isDay ? 'bg-gradient-to-b from-blue-400 to-blue-200' : 'bg-gradient-to-b from-indigo-900 to-purple-800'}`}>
                                <div className="relative z-10">
                                    <h2 className="text-white/90 font-medium text-lg uppercase tracking-wider mb-2">
                                        {displayData.timeLabel}
                                    </h2>
                                    <div className="text-8xl mb-2 filter drop-shadow-lg animate-bounce-slow">
                                        {getWeatherIcon(displayData.code)}
                                    </div>
                                    {displayData.temp !== null && (
                                        <div className="text-6xl font-bold text-white drop-shadow-md">
                                            {Math.round(displayData.temp)}°
                                        </div>
                                    )}
                                    <p className="text-white/90 text-xl font-medium mt-2">
                                        {getWeatherDescription(displayData.code)}
                                    </p>
                                </div>

                                {/* Decorative circles */}
                                <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
                                <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2 blur-2xl"></div>
                            </div>

                            {/* Card Details Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
                                {/* Wind Section */}
                                <div className={`p-6 flex flex-col items-center justify-center transition-colors ${getWindStatus(displayData.windSpeed).bg}`}>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`text-3xl ${getWindStatus(displayData.windSpeed).color}`}>
                                            {getWindStatus(displayData.windSpeed).icon}
                                        </span>
                                        <span className="text-gray-500 font-medium uppercase text-xs tracking-wider">Viento</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-2xl font-bold ${getWindStatus(displayData.windSpeed).color}`}>
                                            {displayData.windSpeed} <span className="text-sm text-gray-400 font-normal">km/h</span>
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        {displayData.windDir !== null && (
                                            <div
                                                className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center"
                                                style={{ transform: `rotate(${displayData.windDir - 180}deg)` }}
                                                title={`Dirección: ${displayData.windDir - 180}°`}
                                            >
                                                <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}
                                        <span className={`font-bold ${getWindStatus(displayData.windSpeed).color}`}>
                                            {getWindStatus(displayData.windSpeed).label}
                                        </span>
                                        {displayData.windDir !== null && (
                                            <span className="text-gray-400 text-sm">
                                                {getWindDirection(displayData.windDir)}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* UV Section */}
                                <div className={`p-6 flex flex-col items-center justify-center transition-colors ${getUVStatus(displayData.uv).bg}`}>
                                    <div className="flex items-center gap-3 mb-2">
                                        <svg className={`w-6 h-6 ${getUVStatus(displayData.uv).color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                        <span className="text-gray-500 font-medium uppercase text-xs tracking-wider">Índice UV</span>
                                    </div>
                                    <span className={`text-3xl font-bold ${getUVStatus(displayData.uv).color}`}>
                                        {displayData.uv}
                                    </span>
                                    {getUVStatus(displayData.uv).warning && (
                                        <span className="mt-2 px-3 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full animate-pulse">
                                            {getUVStatus(displayData.uv).warning}
                                        </span>
                                    )}
                                </div>

                                {/* Sun/Extra Section */}
                                <div className="p-6 flex flex-col items-center justify-center bg-yellow-50/50">
                                    <div className="flex items-center gap-3 mb-2">
                                        <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-gray-500 font-medium uppercase text-xs tracking-wider">Sol</span>
                                    </div>
                                    <span className="text-lg font-bold text-gray-800 text-center">
                                        {displayData.sunInfo || "---"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Controls Section */}
                        <div className="space-y-6">
                            {/* Day Selector */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 ml-1">Días</h3>
                                <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar snap-x">
                                    {weatherData.daily.time.map((time, index) => {
                                        const isSelected = selectedDayIndex === index;
                                        return (
                                            <button
                                                key={time}
                                                onClick={() => {
                                                    setSelectedDayIndex(index);
                                                    setSelectedHour(null); // Reset hour when day changes
                                                }}
                                                className={`flex-shrink-0 snap-start flex flex-col items-center p-3 rounded-2xl border min-w-[90px] transition-all duration-200 ${isSelected
                                                    ? 'border-[#1CA9C9] bg-[#1CA9C9] text-white shadow-md transform scale-105'
                                                    : 'border-gray-200 bg-white text-gray-600 hover:border-[#1CA9C9]/50 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <span className={`text-xs font-medium mb-1 ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>
                                                    {new Date(time).toLocaleDateString('es-ES', { weekday: 'short' })}
                                                </span>
                                                <span className="text-xl font-bold">
                                                    {new Date(time).getDate()}
                                                </span>
                                                <span className="text-2xl mt-1">
                                                    {getWeatherIcon(weatherData.daily.weather_code[index])}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Hourly Selector */}
                            <div>
                                <div className="flex justify-between items-center mb-3 ml-1">
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                                        Por horas ({new Date(weatherData.daily.time[selectedDayIndex]).toLocaleDateString('es-ES', { weekday: 'long' })})
                                    </h3>
                                    {selectedHour && (
                                        <button
                                            onClick={() => setSelectedHour(null)}
                                            className="text-xs text-[#1CA9C9] font-bold hover:underline"
                                        >
                                            Ver resumen
                                        </button>
                                    )}
                                </div>

                                <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar snap-x">
                                    {weatherData.hourly.time.map((time, index) => {
                                        const date = new Date(time);
                                        const selectedDate = new Date(weatherData.daily.time[selectedDayIndex]);

                                        // Filter for selected day
                                        if (date.getDate() !== selectedDate.getDate() ||
                                            date.getMonth() !== selectedDate.getMonth()) {
                                            return null;
                                        }

                                        const isSelected = selectedHour === time;
                                        const isNow = selectedDayIndex === 0 && Math.abs(new Date() - date) < 3600000; // Highlight current hour roughly

                                        return (
                                            <button
                                                key={time}
                                                onClick={() => setSelectedHour(time)}
                                                className={`flex-shrink-0 snap-start flex flex-col items-center p-3 rounded-xl border min-w-[80px] transition-all ${isSelected
                                                    ? 'border-[#1CA9C9] bg-[#1CA9C9]/10 ring-2 ring-[#1CA9C9]'
                                                    : isNow
                                                        ? 'border-gray-300 bg-gray-100'
                                                        : 'border-gray-100 bg-white hover:border-gray-300'
                                                    }`}
                                            >
                                                <span className="text-xs font-medium text-gray-500 mb-1">
                                                    {formatTime(time)}
                                                </span>
                                                <span className="text-xl mb-1">
                                                    {getWeatherIcon(weatherData.hourly.weather_code[index])}
                                                </span>
                                                <span className="text-sm font-bold text-gray-900">
                                                    {Math.round(weatherData.hourly.temperature_2m[index])}°
                                                </span>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <svg
                                                        className="w-3 h-3 text-gray-400"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                        style={{ transform: `rotate(${weatherData.hourly.wind_direction_10m[index]}deg)` }}
                                                    >
                                                        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className="text-[10px] text-gray-500">{weatherData.hourly.wind_speed_10m[index]}</span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
