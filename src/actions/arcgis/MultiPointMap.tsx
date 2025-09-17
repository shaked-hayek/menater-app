import { useEffect, useRef } from 'react';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import WebTileLayer from '@arcgis/core/layers/WebTileLayer';
import Basemap from '@arcgis/core/Basemap';
import Point from '@arcgis/core/geometry/Point';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol';
import IdentityManager from '@arcgis/core/identity/IdentityManager';
import Query from '@arcgis/core/rest/support/Query';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import '@arcgis/core/assets/esri/css/main.css';

import { ARCGIS_SETTINGS, MAP_SETTINGS, CITY_DATA } from 'consts/settings.const';
import { Natar } from 'components/Interfaces/Natar';
import { DestructionSite } from 'components/Interfaces/DestructionSite';
import { NATAR_TYPE } from 'consts/natarType.const';
import { mainNatarColor, secondaryNatarColor } from 'style/colors';

interface MultiPointMapProps {
  natars: Natar[];
  destructionSites: DestructionSite[];
  hoveredNatarId?: number | null;
  zoom?: number;
}

const MultiPointMap = ({ natars, destructionSites = [], hoveredNatarId = null, zoom = 12 }: MultiPointMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<MapView | null>(null);

  const hoverLayerRef = useRef<GraphicsLayer | null>(null);
  const getNatarColor = (natarType: NATAR_TYPE) => natarType === NATAR_TYPE.MAIN ? mainNatarColor : secondaryNatarColor;


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

        // --- Natars Layer ---
        const natarsLayer = new GraphicsLayer();
        natars.forEach(({ lat, long, wasOpened, type }) => {
          const point = new Point({ latitude: lat, longitude: long });
          const natarColor : string = getNatarColor(type);

          const markerSymbol = new SimpleMarkerSymbol({
            color: wasOpened ? natarColor : [255, 255, 255, 0],
            size: 10,
            style: 'circle',
            outline: { color: natarColor, width: 2 },
          });

          natarsLayer.add(new Graphic({ geometry: point, symbol: markerSymbol }));
        });
        map.add(natarsLayer);

        // --- Destruction Sites Layer ---
        if (destructionSites.length > 0) {
          const sitesLayer = new GraphicsLayer();
          map.add(sitesLayer);

          const featureLayer = new FeatureLayer({
            url: `${ARCGIS_SETTINGS.SERVER_URL}/rest/services${CITY_DATA.CITY_MAP_LOC}`,
            outFields: ['*'],
          });

          const whereClause = destructionSites
            .map(site => `OBJECTID = ${site.buildingId}`)
            .join(' OR ');

          const query = new Query({
            where: whereClause,
            outFields: ['*'],
            returnGeometry: true,
          });

          const result = await featureLayer.queryFeatures(query);

          result.features.forEach(f => {
            sitesLayer.add(new Graphic({
              geometry: f.geometry,
              symbol: new SimpleFillSymbol({
                color: [255, 0, 0, 0.5],
                outline: { color: [255, 0, 0], width: 1 },
              }),
            }));
          });
        }
      } catch (error) {
        console.error('Failed to load map:', error);
      }
    };

    initializeMap();

    return () => {
      viewRef.current?.destroy();
      viewRef.current = null;
    };
  }, [natars, destructionSites, zoom]);

  useEffect(() => {
    if (!viewRef.current?.map) return;
  
    if (!hoverLayerRef.current) {
      const hoverLayer = new GraphicsLayer();
      hoverLayerRef.current = hoverLayer;
      viewRef.current.map.add(hoverLayer);
    }
  
    hoverLayerRef.current.removeAll();
  
    if (hoveredNatarId) {
      const natar = natars.find(n => n.id === hoveredNatarId);
      if (natar) {
        const point = new Point({ latitude: natar.lat, longitude: natar.long });
        const natarColor : string = getNatarColor(natar.type);

        const symbol = new SimpleMarkerSymbol({
          color: [255, 255, 0, 0.7],
          size: 14,
          style: 'circle',
          outline: { color: natarColor, width: 2 },
        });
  
        hoverLayerRef.current.add(new Graphic({ geometry: point, symbol }));
      }
    }
  }, [hoveredNatarId, natars]);

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height: '300px', borderRadius: 8 }}
    />
  );
};

export default MultiPointMap;
