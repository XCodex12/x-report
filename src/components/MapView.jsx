import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { categoryMeta } from '../utils/constants';
import { DURBAN } from '../utils/geo';

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export default function MapView({ issues = [], height = 480, onPick, picked, scrollZoom = false }) {
  const elRef = useRef(null);
  const mapRef = useRef(null);
  const layerRef = useRef(null);
  const pickMarkerRef = useRef(null);
  const onPickRef = useRef(onPick);

  useEffect(() => {
    onPickRef.current = onPick;
  }, [onPick]);

  // Create the map once
  useEffect(() => {
    const map = L.map(elRef.current, { center: DURBAN, zoom: 12, scrollWheelZoom: scrollZoom });
       L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
     attribution: '&copy; OpenStreetMap contributors',
     maxZoom: 19,
   }).addTo(map);
    layerRef.current = L.layerGroup().addTo(map);
    map.on('click', (e) => {
      if (onPickRef.current) onPickRef.current({ lat: e.latlng.lat, lng: e.latlng.lng });
    });
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
      pickMarkerRef.current = null;
    };
  }, [scrollZoom]);

  // Draw the issue pins
  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    layer.clearLayers();
    issues.forEach((issue, index) => {
      const icon = L.divIcon({
        className: '',
        html: `<span class="pin" style="--pin:${categoryMeta(issue.category).color};--d:${index * 70}ms"></span>`,
        iconSize: [20, 20],
        iconAnchor: [10, 24],
        popupAnchor: [0, -24],
      });
      L.marker([issue.lat, issue.lng], { icon, title: issue.title })
        .bindPopup(
          `<strong>${esc(issue.title)}</strong><br/>` +
            `<span class="popup-id">${esc(issue.id)}</span><br/>` +
            `${esc(issue.status)}, ${esc(issue.location)}`
        )
        .addTo(layer);
    });
  }, [issues]);

  // Draw the pin the person is placing
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (pickMarkerRef.current) {
      pickMarkerRef.current.remove();
      pickMarkerRef.current = null;
    }
    if (picked) {
      const icon = L.divIcon({
        className: '',
        html: '<span class="pin pin-pick"></span>',
        iconSize: [20, 20],
        iconAnchor: [10, 24],
      });
      pickMarkerRef.current = L.marker([picked.lat, picked.lng], { icon }).addTo(map);
      map.panTo([picked.lat, picked.lng]);
    }
  }, [picked]);

  return <div ref={elRef} className="map" style={{ height }} />;
}