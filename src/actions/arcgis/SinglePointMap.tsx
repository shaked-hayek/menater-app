import { useEffect, useRef } from 'react';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import WebTileLayer from '@arcgis/core/layers/WebTileLayer';
import Basemap from '@arcgis/core/Basemap';
import Point from '@arcgis/core/geometry/Point';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import IdentityManager from '@arcgis/core/identity/IdentityManager';
import '@arcgis/core/assets/esri/css/main.css';
import { ARCGIS_SETTINGS, MAP_SETTINGS } from 'consts/settings.const';


interface SinglePointMapProps {
    lat: number;
    long: number;
    zoom?: number;
}

const SinglePointMap = ({ lat, long, zoom = 15 } : SinglePointMapProps) => {
    const mapRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<MapView | null>(null);

  useEffect(() => {
    if (viewRef.current || !mapRef.current) return;

    const initializeMap = async () => {
      try {
        await IdentityManager.checkSignInStatus(ARCGIS_SETTINGS.SERVER_URL);

        const basemapLayer = new WebTileLayer({
          urlTemplate: MAP_SETTINGS.BASEMAP_URL,
          subDomains: MAP_SETTINGS.SUBDOMAINS,
        });

        await basemapLayer.load();

        const basemap = new Basemap({ baseLayers: [basemapLayer] });
        const map = new Map({ basemap });

        const view = new MapView({
          container: mapRef.current!,
          map,
          center: [long, lat],
          zoom,
        });

        viewRef.current = view;

        const point = new Point({ latitude: lat, longitude: long });

        const markerSymbol = new SimpleMarkerSymbol({
          color: [226, 119, 40],
          size: 10,
          outline: {
            color: [255, 255, 255],
            width: 2,
          },
        });

        const graphic = new Graphic({
          geometry: point,
          symbol: markerSymbol,
        });

        const graphicsLayer = new GraphicsLayer();
        graphicsLayer.add(graphic);
        map.add(graphicsLayer);
      } catch (error) {
        console.error('Failed to load map:', error);
      }
    };

    initializeMap();

    return () => {
      viewRef.current?.destroy();
      viewRef.current = null;
    };
  }, [lat, long, zoom]);

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height: '200px', borderRadius: 8 }}
    />
  );
}

export default SinglePointMap;