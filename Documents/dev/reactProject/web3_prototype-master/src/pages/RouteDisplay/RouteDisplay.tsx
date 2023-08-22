import React, { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { create } from 'ipfs-http-client';
// import 'mapbox-gl/dist/mapbox-gl.css';
import "./RouteDisplay.scss";

const apiKey = process.env.REACT_APP_API_KEY;
const apiSecret = process.env.REACT_APP_API_SECRET;
const combined = `${apiKey}:${apiSecret}`;
const encoded = btoa(combined);

const ipfs = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        'Authorization': `Basic ${encoded}`
    }
});

// MapboxのAPIキーを設定
const MAPBOX_API_KEY = process.env.REACT_APP_MAPBOX_API_KEY;

if (!MAPBOX_API_KEY) {
    throw new Error("Mapbox API key is missing in .env file.");
}

mapboxgl.accessToken = MAPBOX_API_KEY;

interface RouteDisplayProps {
    cid: string;
}

export const RouteDisplay: React.FC<RouteDisplayProps> = ({ cid }) => {
    const [routeData, setRouteData] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [map, setMap] = useState<mapboxgl.Map | null>(null);

    useEffect(() => {
        fetchDataFromIPFS(cid);
    }, [cid]);

    useEffect(() => {
        const initializeMap = () => {
            setTimeout(() => {
                const mapInstance = new mapboxgl.Map({
                    container: 'mapContainer',
                    style: 'mapbox://styles/mabupro/clldg8sd300fl01pw0jf66619',
                    center: [136.96694, 35.15472],
                    zoom: 10.5
                });

                mapInstance.on('load', () => {
                    setMap(mapInstance);
                    mapInstance.resize();  // この行を追加
                });
            }, 0);
        };

        if (!map && routeData) initializeMap();

        return () => {
            if (map) map.remove();
        };
    }, [map, routeData]);

    useEffect(() => {
        if (map && routeData) {
            // マップに既にルートのソースやレイヤーが存在する場合、それを削除します。
            if (map.getSource('route')) {
                map.removeLayer('route-line');
                map.removeSource('route');
            }

            // routeData.featuresが存在し、その長さが1以上であることを確認
            if (routeData.features && routeData.features.length > 0) {
                // 提供された座標を使用してDirections APIからルートを取得します。
                const coordinates = routeData.features[0].geometry.coordinates.map((coord: number[]) => coord.join(',')).join(';');
                console.log(coordinates);

                fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?geometries=geojson&access_token=${MAPBOX_API_KEY}`)
                    .then(response => response.json())
                    .then(data => {
                        // 取得したルートをマップのソースとして追加します。
                        map.addSource('route', {
                            type: 'geojson',
                            data: data.routes[0].geometry
                        });

                        // ソースを使用してポリラインのレイヤーをマップに追加します。
                        map.addLayer({
                            id: 'route-line',
                            type: 'line',
                            source: 'route',
                            layout: {
                                'line-join': 'round',
                                'line-cap': 'round'
                            },
                            paint: {
                                'line-color': '#03AA46',
                                'line-width': 8,
                                'line-opacity': 0.8
                            }
                        });
                    });
            }
        }
    }, [map, routeData]);

    async function fetchDataFromIPFS(cid: string) {
        let dataString = "";
        try {
            for await (const chunk of ipfs.cat(cid)) {
                dataString += new TextDecoder().decode(chunk);
            }

            if (dataString && dataString.startsWith("{") && dataString.endsWith("}")) {
                const data = JSON.parse(dataString);
                setRouteData(data);
            } else {
                console.error("Invalid JSON data received from IPFS:", dataString);
                setError("データの形式が正しくありません。");
            }
        } catch (error) {
            console.error("Failed to fetch data from IPFS:", error);
            setError("IPFSからのデータ取得に失敗しました。");
        }
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!routeData) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h1>Map</h1>
            <div id="mapContainer" className="route-map"></div>
        </div>
    );
};

export default RouteDisplay;
