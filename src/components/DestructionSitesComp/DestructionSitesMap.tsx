import { useEffect, useRef, memo } from 'react';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import WebTileLayer from '@arcgis/core/layers/WebTileLayer';
import IdentityManager from '@arcgis/core/identity/IdentityManager';
import Basemap from '@arcgis/core/Basemap';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import Graphic from '@arcgis/core/Graphic';
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol';
import Query from '@arcgis/core/rest/support/Query';
import '@arcgis/core/assets/esri/css/main.css';
import debounce from 'lodash/debounce';

import { ARCGIS_SETTINGS } from 'consts/settings.const';
import { MAP_SETTINGS } from 'consts/settings.const';
import ErrorPage from 'components/ErrorPage';


export interface DestructionSite {
  street: string;
  number: string;
  casualties: number;
  geometry?: __esri.GeometryUnion | null;
}

interface MapComponentProps {
  destructionSites: DestructionSite[];
  onClickDestructionSite: (site: DestructionSite) => void;
  setStreetNames: (names: string[]) => void;
}

const DestructionSitesMap = memo(({
  destructionSites,
  onClickDestructionSite,
  setStreetNames
}: MapComponentProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<MapView | null>(null);
  const featureLayerRef = useRef<FeatureLayer | null>(null);
  const highlightLayerRef = useRef<GraphicsLayer | null>(null);
  const selectedLayerRef = useRef<GraphicsLayer | null>(null);

  useEffect(() => {
    if (viewRef.current) return;

    let view: MapView;

    const init = async () => {
      try {
        // IdentityManager.checkSignInStatus(ARCGIS_SETTINGS.PORTAL_URL)
        //   .then(() => console.log('ArcGIS authenticated'))
        //   .catch(() => {
        //     throw new Error('ArcGIS is not authenticated'); // TODO: Change
        //   });
        
        const basemapLayer = new WebTileLayer({
          urlTemplate: MAP_SETTINGS.BASEMAP_URL,
          subDomains: MAP_SETTINGS.SUBDOMAINS,
        });
    
        await basemapLayer.load(); // wait for layer to finish loading
    
        const basemap = new Basemap({ baseLayers: [basemapLayer] });
        const map = new Map({ basemap });
    
        view = new MapView({
          container: mapRef.current as HTMLDivElement,
          map,
          center: MAP_SETTINGS.INITIAL_CENTER,
          zoom: MAP_SETTINGS.INITIAL_ZOOM,
        });

        viewRef.current = view;

        const featureLayer = new FeatureLayer({
          url: `${ARCGIS_SETTINGS.SERVER_URL}/rest/services/BeerSheva/MapServer/4`,
          outFields: ['*'],
          renderer: {
            type: 'simple',
            symbol: {
              type: 'simple-fill',
              color: [211, 211, 211, 0.5],
              outline: { color: [128, 128, 128, 1], width: 1 },
            },
          },
        });

        featureLayerRef.current = featureLayer;
        map.add(featureLayer);

        const highlightLayer = new GraphicsLayer();
        highlightLayerRef.current = highlightLayer;
        map.add(highlightLayer);

        const selectedLayer = new GraphicsLayer();
        selectedLayerRef.current = selectedLayer;
        map.add(selectedLayer);

        view.on('click', debounceHighlight);
        view.on('pointer-move', debouncePointerMove);

        fetchStreetNames();

      } catch (error) {
        console.error('Error loading ArcGIS map:', error);
        return ErrorPage(error);
      }
    };

    const fetchStreetNames = async () => {
      if (!featureLayerRef.current) return;

      const query = new Query({
        where: 'Street_Name IS NOT NULL',
        outFields: ['Street_Name'],
        returnDistinctValues: true,
        orderByFields: ['Street_Name'],
      });

      try {
        const result = await featureLayerRef.current.queryFeatures(query);
        const names = result.features.map(f => f.attributes['Street_Name']);
        setStreetNames(Array.from(new Set(names)));
      } catch (e) {
        console.error('Query failed:', e);
      }
    };

    const getHighlightSymbol = () =>
      new SimpleFillSymbol({
        color: [0, 0, 0, 0],
        outline: { color: [255, 204, 0, 1], width: 3 },
      });

    const debounceHighlight = debounce(async (event) => {
      if (!viewRef.current || !featureLayerRef.current) return;

      const response = await viewRef.current.hitTest(event);
      const result = response.results.find(
        (hit): hit is __esri.GraphicHit => 'graphic' in hit && hit.graphic?.layer === featureLayerRef.current
      );
      highlightLayerRef.current?.removeAll();

      if (result?.graphic) {
        const highlightGraphic = new Graphic({
          geometry: result.graphic.geometry,
          symbol: getHighlightSymbol(),
        });

        highlightLayerRef.current?.add(highlightGraphic);

        const { Street_Name, House_Number } = result.graphic.attributes;
        onClickDestructionSite({
          street: Street_Name,
          number: House_Number,
          casualties: 0,
          geometry: result.graphic.geometry,
        });
      }
    }, 250);

    const debouncePointerMove = debounce(async (event) => {
      if (!viewRef.current || !featureLayerRef.current) return;

      const response = await viewRef.current.hitTest(event);
      const result = response.results.find(
        (g): g is __esri.GraphicHit => 'graphic' in g && g.graphic?.layer === featureLayerRef.current
      );

      highlightLayerRef.current?.removeAll();

      if (result?.graphic) {
        const highlightGraphic = new Graphic({
          geometry: result.graphic.geometry,
          symbol: getHighlightSymbol(),
        });

        highlightLayerRef.current?.add(highlightGraphic);
      }
    }, 50);

    init();

    return () => {
      viewRef.current?.destroy();
      viewRef.current = null;
    };
  }, []);

  useEffect(() => {
    const updateSelectedLayer = async () => {
      if (!selectedLayerRef.current || !featureLayerRef.current) return;

      selectedLayerRef.current.removeAll();

      if (destructionSites.length === 0) return;

      const whereClause = destructionSites
        .map(
          site =>
            `House_Number = '${site.number}' AND Street_Name = '${site.street}'`
        )
        .join(' OR ');

      const query = new Query({
        where: whereClause,
        outFields: ['*'],
        returnGeometry: true,
      });

      const result = await featureLayerRef.current.queryFeatures(query);

      result.features.forEach(f => {
        const graphic = new Graphic({
          geometry: f.geometry,
          symbol: {
            type: 'simple-fill',
            color: [255, 0, 0, 0.5],
            outline: { color: [255, 0, 0], width: 1 },
          },
        });

        selectedLayerRef.current?.add(graphic);
      });
    };

    updateSelectedLayer();
  }, [destructionSites]);

  return (
    <div
      id='destruction-sites-map-container'
      ref={mapRef}
      style={{ width: '100%', height: '400px' }}
    />
  );
});

export default DestructionSitesMap;
