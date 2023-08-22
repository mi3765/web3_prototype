import React, { useEffect, useRef, useState } from 'react';
import { create } from 'ipfs-http-client';

// APIキーとAPIキーシークレットを組み合わせる
const apiKey = process.env.REACT_APP_API_KEY;
const apiSecret = process.env.REACT_APP_API_SECRET;
const combined = `${apiKey}:${apiSecret}`;

// Base64エンコードする
const encoded = btoa(combined);

const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    'Authorization': `Basic ${encoded}`
  }
});

interface RouteCreationEditProps {
  onCidGenerated: (cid: string) => void;
}

export const RouteCreationEdit: React.FC<RouteCreationEditProps> = ({ onCidGenerated }) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const mapboxApiKey = process.env.REACT_APP_MAPBOX_API_KEY;
  const [isUploading, setIsUploading] = useState(false); // アップロード中の状態を追跡
  const [iframeData, setIframeData] = useState<any | null>(null); // 追加: iframeからのデータを保存するstate

  async function uploadToIPFS(data: any) {
    setIsUploading(true); // アップロード開始
    try {
      const { path } = await ipfs.add(JSON.stringify(data));
      console.log("Uploaded to IPFS with CID:", path);
      onCidGenerated(path); // CIDを親コンポーネントに渡す
      setIsUploading(false); // アップロード完了
    } catch (error) {
      console.error("Failed to upload to IPFS:", error);
      setIsUploading(false); // アップロード失敗
    }
  }

  function handleUploadButtonClick() {
    if (iframeData) {
      uploadToIPFS(iframeData);
    } else {
      console.error("No data received from iframe yet.");
    }
  }

  useEffect(() => {
    function handleDataFromIframe(event: MessageEvent) { // 修正: eventの型を指定
      if (event.data) {
        setIframeData(event.data);
      }
    }

    window.addEventListener('message', handleDataFromIframe);

    return () => {
      window.removeEventListener('message', handleDataFromIframe);
    };
  }, []);

  useEffect(() => {
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="ja">
        <head>
          <meta charset="utf-8" />
          <title>Demo: Get started with the Map Matching API</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <script src="https://api.tiles.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.js"></script>
          <link href="https://api.tiles.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css" rel="stylesheet" />
          <script src="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.0.9/mapbox-gl-draw.js"></script>
          <link rel="stylesheet" href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.0.9/mapbox-gl-draw.css" type="text/css" />
          <style>
              body {
                  margin: 0;
                  padding: 0;
                  font-family: sans-serif;
              }
              #map {
                  position: absolute;
                  top: 0;
                  bottom: 0;
                  width: 100%;
              }
              .info-box {
                  position: absolute;
                  margin: 20px;
                  width: 25%;
                  top: 0;
                  bottom: 20px;
                  padding: 20px;
                  background-color: #fff;
                  overflow-y: scroll;
              }
              @media (max-width: 960px) {
                  #map {
                      width: 100%;  /* 幅を100%に設定 */
                      height: auto; /* 高さを自動に設定 */
                      max-width: 960px; /* 最大幅を960pxに設定 */
                  }
              }
          </style>
        </head>
        <body>
          <div id="map"></div>
          <div class="info-box">
            <label for="travelMode">移動手段を選択:</label>
            <select id="travelMode">
                <option value="driving">車</option>
                <option value="walking">徒歩</option>
                <option value="cycling">自転車</option>
            </select>          
            <p>
                右側の描画ツールを使用してルートを描画してください。最も正確なルートを取得するために、定期的にポイントを描画してください。
            </p>
            <div id="directions"></div>
          </div>
          <script>
            mapboxgl.accessToken = '${mapboxApiKey}';
            const map = new mapboxgl.Map({
              container: 'map',
              style: 'mapbox://styles/mabupro/clldg8sd300fl01pw0jf66619',
              center: [136.96694, 35.15472],
              zoom: 14.5
            });
            document.getElementById('travelMode').addEventListener('change', updateRoute);

            const draw = new MapboxDraw({
              displayControlsDefault: false,
              controls: {
                line_string: true,
                trash: true
              },
              defaultMode: 'draw_line_string',
              styles: [
                {
                  'id': 'gl-draw-line',
                  'type': 'line',
                  'filter': [
                    'all',
                    ['==', '$type', 'LineString'],
                    ['!=', 'mode', 'static']
                  ],
                  'layout': {
                    'line-cap': 'round',
                    'line-join': 'round'
                  },
                  'paint': {
                    'line-color': '#438EE4',
                    'line-dasharray': [0.2, 2],
                    'line-width': 2,
                    'line-opacity': 0.7
                  }
                },
                {
                  'id': 'gl-draw-polygon-and-line-vertex-halo-active',
                  'type': 'circle',
                  'filter': [
                    'all',
                    ['==', 'meta', 'vertex'],
                    ['==', '$type', 'Point'],
                    ['!=', 'mode', 'static']
                  ],
                  'paint': {
                    'circle-radius': 12,
                    'circle-color': '#FFF'
                  }
                },
                {
                  'id': 'gl-draw-polygon-and-line-vertex-active',
                  'type': 'circle',
                  'filter': [
                    'all',
                    ['==', 'meta', 'vertex'],
                    ['==', '$type', 'Point'],
                    ['!=', 'mode', 'static']
                  ],
                  'paint': {
                    'circle-radius': 8,
                    'circle-color': '#438EE4'
                  }
                }
              ]
            });

            map.addControl(draw);
            map.on('draw.create', updateRoute);
            map.on('draw.update', updateRoute);
            map.on('draw.delete', removeRoute);

            function updateRoute() {
                const data = draw.getAll();
                if (data.features.length === 0) {
                    return; // 描画データがない場合は関数を終了
                }
                const lastFeature = data.features.length - 1;
                const coords = data.features[lastFeature].geometry.coordinates;
            
                // 2つ以上の座標が必要
                if (coords.length < 2) {
                    alert("2つ以上の座標を描画してください。");
                    return;
                }
            
                removeRoute();
                const profile = document.getElementById('travelMode').value;
                const newCoords = coords.join(';');
                const radius = coords.map(() => 25);
                getMatch(newCoords, radius, profile);
            }
            
            async function getMatch(coordinates, radius) {
                const profile = document.getElementById('travelMode').value; 
                const radiuses = radius.join(';');
                const query = await fetch(
                    \`https://api.mapbox.com/matching/v5/mapbox/\${profile}/\${coordinates}?geometries=geojson&radiuses=\${radiuses}&steps=true&language=ja&access_token=\${mapboxgl.accessToken}\`,
                    { method: 'GET' }
                );
                response = await query.json();
              if (response.code !== 'Ok') {
                alert(
                  \`\${response.code} - \${response.message}.\n\nFor more information: https://docs.mapbox.com/api/navigation/map-matching/#map-matching-api-errors\`
                );
                return;
              }
              const coords = response.matchings[0].geometry;
              addRoute(coords);
              getInstructions(response.matchings[0]);
            }

            function getInstructions(data) {
              const directions = document.getElementById('directions');
              let tripDirections = '';
              for (const leg of data.legs) {
                const steps = leg.steps;
                for (const step of steps) {
                  tripDirections += \`<li>\${step.maneuver.instruction}</li>\`;
                }
              }
              directions.innerHTML = \`<p><strong>目的地までの時間は: \${Math.floor(
                data.duration / 60
              )} 分.</strong></p><ol>\${tripDirections}</ol>\`;
            }

            function addRoute(coords) {
              if (map.getSource('route')) {
                map.removeLayer('route');
                map.removeSource('route');
              } else {
                map.addLayer({
                  'id': 'route',
                  'type': 'line',
                  'source': {
                    'type': 'geojson',
                    'data': {
                      'type': 'Feature',
                      'properties': {},
                      'geometry': coords
                    }
                  },
                  'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                  },
                  'paint': {
                    'line-color': '#03AA46',
                    'line-width': 8,
                    'line-opacity': 0.8
                  }
                });
              }
            }

            function removeRoute() {
              if (!map.getSource('route')) return;
              map.removeLayer('route');
              map.removeSource('route');
            }

            function updateRoute() {
              const data = draw.getAll();
              if (data.features.length === 0) {
                  return; // 描画データがない場合は関数を終了
              }
              const lastFeature = data.features.length - 1;
              const coords = data.features[lastFeature].geometry.coordinates;
          
              // 2つ以上の座標が必要
              if (coords.length < 2) {
                  alert("2つ以上の座標を描画してください。");
                  return;
              }
          
              removeRoute();
              const profile = document.getElementById('travelMode').value;
              const newCoords = coords.join(';');
              const radius = coords.map(() => 25);
              getMatch(newCoords, radius, profile);
          
              // ルートデータを外部に送信
              window.parent.postMessage(data, '*');
          }
          </script>
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const blobURL = URL.createObjectURL(blob);

    if (iframeRef.current) {
      iframeRef.current.src = blobURL;
    }

    return () => {
      URL.revokeObjectURL(blobURL);
    };
  }, []);

  return (
    <div>
      <iframe
        ref={iframeRef}
        title="Mapbox Map"
        frameBorder="0"
        allowFullScreen
        style={{ width: '100%', height: '400px', maxWidth: '960px' }}
      ></iframe>
      <button
        className='submit-route-btn'
        onClick={handleUploadButtonClick}
        disabled={isUploading || !iframeData} // ここでiframeDataがnullまたはundefinedの場合にボタンを無効化
      >
        {isUploading ? "ルート情報を更新中..." : "ルート情報を更新"}
      </button>
    </div>
  );

}