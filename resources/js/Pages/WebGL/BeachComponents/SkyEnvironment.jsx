import React, { useMemo } from "react";
import { Sky, Stars } from "@react-three/drei";
import SunCalc from "suncalc";

export default function SkyEnvironment({ preset = "noon" }) {
    const realTimeConfig = useMemo(() => {
        if (preset !== "real-time") return null;

        const date = new Date();
        const lat = 28.45; // Las Canteras, approx
        const lng = -16.25;

        const sunPos = SunCalc.getPosition(date, lat, lng);
        const azimuth = sunPos.azimuth;
        const altitude = sunPos.altitude;

        const r = 100;
        const y = r * Math.sin(altitude);
        const rPlane = r * Math.cos(altitude);
        const x = rPlane * Math.sin(azimuth);
        const z = rPlane * Math.cos(azimuth);

        const isNight = altitude < -0.05;

        return {
            sunPosition: [x, y, z],
            turbidity: 0.1,
            rayleigh: isNight ? 0.1 : 0.5,
            mieCoefficient: 0.005,
            mieDirectionalG: 0.8,
            stars: isNight,
            ambientIntensity: Math.max(0.1, Math.sin(Math.max(0, altitude)) * 0.8),
        };
    }, [preset]);

    const presets = {
        sunrise: {
            sunPosition: [100, 10, 100],
            turbidity: 0.1,
            rayleigh: 0.5,
            mieCoefficient: 0.005,
            mieDirectionalG: 0.8,
            stars: false,
            ambientIntensity: 0.4,
        },
        noon: {
            sunPosition: [50, 100, 50],
            turbidity: 0.1,
            rayleigh: 0.1,
            mieCoefficient: 0.005,
            mieDirectionalG: 0.8,
            stars: false,
            ambientIntensity: 0.8,
        },
        sunset: {
            sunPosition: [-100, 10, -100],
            turbidity: 0.2,
            rayleigh: 1.0,
            mieCoefficient: 0.005,
            mieDirectionalG: 0.8,
            stars: false,
            ambientIntensity: 0.3,
        },
        midnight: {
            sunPosition: [0, -10, 0],
            turbidity: 0.1,
            rayleigh: 0.5,
            mieCoefficient: 0.005,
            mieDirectionalG: 0.8,
            stars: true,
            ambientIntensity: 0.2,
        },
    };

    const config = preset === "real-time" ? realTimeConfig : (presets[preset] || presets.noon);

    return (
        <>
            <Sky
                sunPosition={config.sunPosition}
                turbidity={config.turbidity}
                rayleigh={config.rayleigh}
                mieCoefficient={config.mieCoefficient}
                mieDirectionalG={config.mieDirectionalG}
            />
            {config.stars && (
                <Stars
                    radius={100}
                    depth={50}
                    count={5000}
                    factor={4}
                    saturation={0}
                    fade
                    speed={1}
                />
            )}

            {/* Hemisphere light for natural ambient lighting */}
            <hemisphereLight
                args={['#87ceeb', '#f4e99b', 0.6]}
                position={[0, 50, 0]}
            />

            {/* Main ambient light */}
            <ambientLight intensity={config.ambientIntensity * 0.6} />

            {/* Main directional (sun) light */}
            <directionalLight
                position={config.sunPosition}
                intensity={config.stars ? 0.2 : 1.8}
                castShadow
                shadow-mapSize={[4096, 4096]}
                shadow-camera-left={-80}
                shadow-camera-right={80}
                shadow-camera-top={80}
                shadow-camera-bottom={-80}
                shadow-camera-near={0.1}
                shadow-camera-far={300}
                shadow-bias={-0.0001}
            />

            {/* Fill light from opposite side */}
            <directionalLight
                position={[-config.sunPosition[0] * 0.5, config.sunPosition[1] * 0.3, -config.sunPosition[2] * 0.5]}
                intensity={config.stars ? 0.05 : 0.4}
                color="#ffe4c4"
            />

            {/* Rim light for dramatic effect */}
            <directionalLight
                position={[0, 20, -100]}
                intensity={config.stars ? 0.1 : 0.3}
                color="#ffd700"
            />
        </>
    );
}
