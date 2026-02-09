import { useState, type FormEvent } from "react";
import "./App.css";

interface WeatherCondition {
  bg: string;
  cardBg: string;
  accent: string;
  icon: string;
  title: string;
  description: string;
  textColor: string;
  illustration: string;
}

interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  hourly: { time: string; temp: number }[];
}

interface WeatherConditions {
  [key: string]: WeatherCondition;
}

function App() {
  const [city, setCity] = useState<string>("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  // const [selectedDay, setSelectedDay] = useState<number>(0);

  const weatherConditions: WeatherConditions = {
    clear: {
      bg: "bg-gradient-to-br from-[#87CEEB] via-[#B0E0E6] to-[#F0E68C]",
      cardBg: "",
      accent: "bg-[#0EA5E9]",
      icon: "☀️",
      title: "Ensolarado",
      description: "Um dia radiante como nos filmes de Miyazaki.",
      textColor: "text-white",
      illustration:
        "https://cdn.abacus.ai/images/833867bd-6be6-4283-8daa-e8838f98b190.png",
    },
    cloudy: {
      bg: "bg-gradient-to-br from-[#DDA0DD] via-[#E6A8D7] to-[#BA55D3]",
      cardBg: "",
      accent: "bg-[#9333EA]",
      icon: "☁️",
      title: "Nublado",
      description: "O castelo animado pode estar escondido nessas nuvens.",
      textColor: "text-white",
      illustration:
        "https://cdn.abacus.ai/images/7a5219b3-8b68-4ee6-98a9-58268df8243e.png",
    },
    rainy: {
      bg: "bg-gradient-to-br from-[#2C3E50] via-[#34495E] to-[#4A5F7F]",
      cardBg: "",
      accent: "bg-[#0F172A]",
      icon: "🌧️",
      title: "Chuvoso",
      description: "Totoro está esperando o ônibus sob a chuva.",
      textColor: "text-white",
      illustration:
        "https://cdn.abacus.ai/images/85278324-0576-4af4-bf32-bc868dea9657.png",
    },
    snowy: {
      bg: "bg-gradient-to-br from-[#E0F2FE] via-[#BAE6FD] to-[#DBEAFE]",
      cardBg: "",
      accent: "bg-[#38BDF8]",
      icon: "❄️",
      title: "Nevando",
      description: "Um manto branco de silêncio e magia.",
      textColor: "text-white",
      illustration:
        "https://cdn.abacus.ai/images/f770b63b-b7e4-4971-9b6d-2e7b4c331c1a.png",
    },
  };

  const getWeatherCondition = (code: number): string => {
    if (code === 0 || code === 1) return "clear";
    if (code === 2 || code === 3) return "cloudy";
    if (code >= 51 && code <= 67) return "rainy";
    if (code >= 71 && code <= 77) return "snowy";
    if (code >= 95) return "rainy";
    return "clear";
  };

  const searchCity = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!city.trim()) return;
    setLoading(true);
    setError("");

    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=pt&format=json`,
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        throw new Error("Cidade não encontrada");
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m&hourly=temperature_2m&timezone=auto`,
      );
      const wData = await weatherRes.json();

      const hourlyData = wData.hourly.time
        .slice(0, 6)
        .map((t: string, i: number) => ({
          time: new Date(t).getHours() + ":00",
          temp: Math.round(wData.hourly.temperature_2m[i]),
        }));

      setWeather({
        city: name,
        country: country,
        temperature: Math.round(wData.current.temperature_2m),
        humidity: wData.current.relative_humidity_2m,
        windSpeed: Math.round(wData.current.wind_speed_10m),
        condition: getWeatherCondition(wData.current.weather_code),
        hourly: hourlyData,
      });
    } catch (err) {
      console.error(err);
      setError("Erro ao buscar dados. Tente novamente!");
    } finally {
      setLoading(false);
    }
  };

  const current = weather
    ? weatherConditions[weather.condition] || weatherConditions.clear
    : weatherConditions.clear;

  // const days = [
  //   "Hoje",
  //   "Segunda",
  //   "Terça",
  //   "Quarta",
  //   "Quinta",
  //   "Sexta",
  //   "Sábado",
  // ];

  return (
    <div
      className={`min-h-screen w-full ${current.bg} transition-all duration-1000 flex flex-col items-center justify-center p-6`}
    >
      {/* Search Form */}
      <form onSubmit={searchCity} className="w-full max-w-4xl mb-10">
        <div className="relative flex items-center">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Procurar Cidade"
            disabled={loading}
            className="w-full px-6 py-3 rounded-full bg-white/50 backdrop-blur-sm border-none shadow-inner text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/60 focus:bg-white/70 transition-all outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-4 text-gray-500 hover:text-gray-800 hover:scale-110 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? "⏳" : "🔍"}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-500/90 text-white px-6 py-3 rounded-2xl mb-6">
          {error}
        </div>
      )}

      {weather ? (
        <div className="w-full max-w-4xl">
          {/* Main Weather Card */}
          <div
            className={`relative ${current.cardBg} backdrop-blur-md rounded-[40px] p-8 shadow-2xl overflow-hidden`}
          >
            {/* Header Info */}
            <div className="flex justify-between items-start mb-6 z-10 relative">
              <div>
                <h2 className="text-3xl font-bold text-black tracking-tight drop-shadow-lg">
                  {weather.city}
                </h2>
                <p className="text-black text-lg drop-shadow">
                  {weather.country}
                </p>
              </div>
              <div className="text-right">
                <p className="text-black font-semibold drop-shadow">Hoje</p>
                <p className="text-black text-sm drop-shadow">
                  {new Date().toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>

            {/* Background Image - SEM OVERLAY */}
            <div className="absolute inset-0 z-0">
              <img
                src={current.illustration}
                alt="weather background"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Temperature Display */}
            <div className="flex justify-between items-end z-10 relative mb-8">
              <div className="flex flex-col">
                <span className="text-[100px] md:text-[140px] font-light text-black leading-none drop-shadow-2xl">
                  {weather.temperature}°
                </span>
                <p className="text-black text-xl mt-2 drop-shadow-lg">
                  {current.title}
                </p>
              </div>
              <div className="text-7xl mb-4 drop-shadow-lg">{current.icon}</div>
            </div>

            {/* Hourly Forecast */}
            <div className="flex gap-3 overflow-x-auto z-10 relative no-scrollbar pb-2">
              {weather.hourly.map((h, i) => (
                <div
                  key={i}
                  className={`flex flex-col items-center justify-center ${current.accent} rounded-2xl p-4 min-w-[80px] shadow-lg`}
                >
                  <span className="text-white/70 text-xs mb-2">{h.time}</span>
                  <span className="text-white font-bold text-xl">
                    {h.temp}°
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Navigation - FUNCIONAL */}
          {/* <div className="flex justify-center gap-4 mt-10 overflow-x-auto py-2 no-scrollbar">
            {days.map((day, i) => (
              <button
                key={i}
                onClick={() => setSelectedDay(i)}
                className={`px-6 py-2 rounded-full border transition-all whitespace-nowrap ${
                  selectedDay === i
                    ? "bg-white shadow-lg font-semibold text-gray-800 border-white scale-105"
                    : "bg-white/30 backdrop-blur-sm border-white/50 text-white hover:bg-white/50"
                }`}
              >
                {day}
              </button>
            ))}
          </div> */}
        </div>
      ) : (
        <div className="text-center text-gray-600">
          <div className="text-8xl mb-4">🏠</div>
          <p className="text-xl font-medium drop-shadow">
            Pesquise uma cidade para começar sua jornada...
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
