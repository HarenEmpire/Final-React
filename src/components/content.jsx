import { useEffect, useState } from "react";
import "./content.css";

import kis from "../assets/kis.png";
import sonbahar from "../assets/sonbahar.png";
import ilkbahar from "../assets/ilkbahar.png";
import yaz from "../assets/yaz.png";
import errorImg from "../assets/error.jpeg";
import defaultBg from "../assets/default.png";

function Content() {
    const [city, setCity] = useState("");
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [bgImage, setBgImage] = useState(defaultBg);

    const fetchWeather = async () => {
        if (!city.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const geoRes = await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
                    city.trim()
                )}&count=1&language=tr`
            );

            if (!geoRes.ok) throw new Error("Şehir bulunamadı!");

            const geoData = await geoRes.json();
            if (!geoData.results || geoData.results.length === 0) {
                throw new Error("Şehir bulunamadı");
            }

            const { latitude, longitude, name } = geoData.results[0];

            const weatherRes = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
            );

            if (!weatherRes.ok) throw new Error("Hava durumu alınamadı");

            const weatherData = await weatherRes.json();

            setWeather({
                name,
                temp: weatherData.current_weather.temperature,
            });
        } catch (err) {
            setError(err.message);
            setWeather(null);
            setBgImage(errorImg);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (!weather) return;

        const temp = weather.temp;

        if (temp < 0) setBgImage(kis);
        else if (temp < 15) setBgImage(sonbahar);
        else if (temp < 30) setBgImage(ilkbahar);
        else setBgImage(yaz);
    }, [weather]);

    return (
        <main
            className="content"
            style={{
                backgroundImage: bgImage ? `url(${bgImage})` : "none",
            }}
        >
            <div
                style={{
                    background: "rgba(0,0,0,0.6)",
                    padding: "2rem",
                    borderRadius: "12px",
                    color: "white",
                    textAlign: "center",
                    width: "300px",
                }}
            >
                <input
                    type="text"
                    placeholder="Şehir giriniz (Ankara)"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "8px",
                        marginBottom: "10px",
                        borderRadius: "6px",
                        border: "none",
                    }}
                />

                <button
                    onClick={fetchWeather}
                    style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: "6px",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: "bold",
                    }}
                >
                    Getir
                </button>

                {loading && <p>Yükleniyor...</p>}

                {error && (
                    <>
                        <p style={{ color: "salmon" }}>{error}</p>
                    </>
                )}

                {weather && !error && (
                    <>
                        <h2>{weather.name}</h2>
                        <p style={{ fontSize: "2rem" }}>{weather.temp} °C</p>
                    </>
                )}
            </div>
        </main>
    );
}

export default Content;
