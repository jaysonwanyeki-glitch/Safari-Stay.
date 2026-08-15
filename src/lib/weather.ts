/**
 * Current weather via the free Open-Meteo API (no key required, CC BY 4.0).
 * Server-side fetches are cached for 10 minutes.
 */

export type Weather = {
  temp: number;
  humidity: number;
  wind: number;
  code: number;
  label: string;
  icon: string;
};

// 10-minute TTL cache so every detail-page view doesn't hit the API.
const CACHE_TTL_MS = 10 * 60 * 1000;
const globalForWeather = globalThis as unknown as {
  __safariWeather?: { key: string; data: Weather; at: number };
};

// WMO weather interpretation codes → friendly label + emoji.
const WMO: Record<number, [string, string]> = {
  0: ["Clear sky", "☀️"],
  1: ["Mainly clear", "🌤️"],
  2: ["Partly cloudy", "⛅"],
  3: ["Overcast", "☁️"],
  45: ["Fog", "🌫️"],
  48: ["Rime fog", "🌫️"],
  51: ["Light drizzle", "🌦️"],
  53: ["Drizzle", "🌦️"],
  55: ["Heavy drizzle", "🌧️"],
  61: ["Light rain", "🌧️"],
  63: ["Rain", "🌧️"],
  65: ["Heavy rain", "⛈️"],
  66: ["Freezing rain", "🌧️"],
  67: ["Freezing rain", "⛈️"],
  71: ["Light snow", "🌨️"],
  73: ["Snow", "🌨️"],
  75: ["Heavy snow", "❄️"],
  77: ["Snow grains", "🌨️"],
  80: ["Light showers", "🌦️"],
  81: ["Showers", "🌧️"],
  82: ["Violent showers", "⛈️"],
  85: ["Snow showers", "🌨️"],
  86: ["Snow showers", "🌨️"],
  95: ["Thunderstorm", "⛈️"],
  96: ["Thunderstorm & hail", "⛈️"],
  99: ["Thunderstorm & hail", "⛈️"],
};

export async function getWeather(lat: number, lon: number): Promise<Weather | null> {
  const url =
    "https://api.open-meteo.com/v1/forecast?" +
    `latitude=${lat}&longitude=${lon}` +
    "&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto";
  const key = `${lat.toFixed(3)},${lon.toFixed(3)}`;
  const cached = globalForWeather.__safariWeather;
  if (cached && cached.key === key && Date.now() - cached.at < CACHE_TTL_MS) return cached.data;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      current?: { temperature_2m: number; relative_humidity_2m: number; weather_code: number; wind_speed_10m: number };
    };
    const c = json.current;
    if (!c) return null;
    const [label, icon] = WMO[c.weather_code] ?? ["Unknown", "🌡️"];
    const data: Weather = {
      temp: Math.round(c.temperature_2m),
      humidity: Math.round(c.relative_humidity_2m),
      wind: Math.round(c.wind_speed_10m),
      code: c.weather_code,
      label,
      icon,
    };
    globalForWeather.__safariWeather = { key, data, at: Date.now() };
    return data;
  } catch {
    return cached?.key === key ? cached.data : null;
  }
}
