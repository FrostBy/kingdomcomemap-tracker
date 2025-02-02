declare module '*.less';
import type * as Leaflet from 'leaflet';
import 'jquery';

declare global {
  const map: Leaflet.Map;
  interface Window {
    L: typeof Leaflet;
    $: typeof jQuery;
  }
}

interface CustomMarker extends L.Marker {
  hasCustomEvent?: boolean;
}
