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
import { Natar } from 'components/Interfaces/Natar';
import { NATAR_TYPE } from 'consts/natarType.const';


interface MultiPointMapProps {
  natars: Natar[];
  zoom?: number;
}

const MultiPointMap = ({ natars, zoom = 12 }: MultiPointMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<MapView | null>(null);

  useEffect(() => {
    if (viewRef.current || !mapRef.current || natars.length === 0) return;

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

        const centerLat = natars[0].lat;
        const centerLong = natars[0].long;

        const view = new MapView({
          container: mapRef.current!,
          map,
          center: [centerLong, centerLat],
          zoom,
        });

        viewRef.current = view;

        const graphicsLayer = new GraphicsLayer();

        natars.forEach(({ lat, long, wasOpened, type }) => {
          const point = new Point({ latitude: lat, longitude: long });

          const color = type === NATAR_TYPE.MAIN ? [0, 0, 255] : [128, 0, 128];

          const markerSymbol = new SimpleMarkerSymbol({
            color: wasOpened ? color : [255, 255, 255, 0],
            size: 10,
            style: 'circle',
            outline: {
              color,
              width: 2,
            },
          });

          const graphic = new Graphic({
            geometry: point,
            symbol: markerSymbol,
          });

          graphicsLayer.add(graphic);
        });

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
  }, [natars, zoom]);

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height: '300px', borderRadius: 8 }}
    />
  );
};

export default MultiPointMap;
