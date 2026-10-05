"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { Expand, LocateFixed, Minimize } from "lucide-react";
import { useTokenColor } from "./useTokenColor";

type LatLng = [number, number];
export interface MapLine { color: string; pts: LatLng[]; label?: string }
export interface MapProps {
  lines: MapLine[];
  home?: LatLng;
  takeoff?: LatLng[];
  touchdown?: LatLng[];
  fence?: number;
  ends?: { pt: LatLng; color: string }[];   // plain end dots (Flight 1 hops)
}

const icon = (html: string, size = 16) => L.divIcon({ html, className: "", iconSize: [size, size], iconAnchor: [size / 2, size / 2] });
const triangle = (fill: string, up: boolean) =>
  icon(`<svg width="14" height="14" viewBox="0 0 14 14"><polygon points="${up ? "7,1 13,12 1,12" : "7,13 13,2 1,2"}" fill="${fill}" stroke="#fff" stroke-width="1.5"/></svg>`, 14);
const homeIcon = (fill: string) =>
  icon(`<div style="width:18px;height:18px;border-radius:4px;background:${fill};border:1.5px solid #fff;display:flex;align-items:center;justify-content:center;font:700 11px sans-serif;color:#111">H</div>`, 18);
const dot = (fill: string) => icon(`<div style="width:10px;height:10px;border-radius:50%;background:${fill};border:1.5px solid #fff"></div>`, 10);

function boundsOf(p: MapProps) {
  const all = [...p.lines.flatMap(l => l.pts), ...(p.home ? [p.home] : [])];
  let b = L.latLngBounds(all);
  if (p.home && p.fence) b = b.extend(L.latLng(p.home).toBounds(p.fence * 2));
  return b.pad(0.08);
}

// Leaflet is driven directly (not via react-leaflet) so the map is created and
// removed exactly once per mount, which survives React's dev double-mount.
export default function TrackMap(props: MapProps) {
  const color = useTokenColor();
  const box = useRef<HTMLDivElement>(null);
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const bounds = useRef<L.LatLngBounds | null>(null);
  const [full, setFull] = useState(false);

  // Create the map once.
  useEffect(() => {
    if (!el.current) return;
    const m = L.map(el.current, { scrollWheelZoom: false, zoomSnap: 0.25, maxZoom: 21 });
    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
      attribution: "Imagery &copy; Esri, Maxar, Earthstar Geographics", maxNativeZoom: 19, maxZoom: 21,
    }).addTo(m);
    // Scroll-zoom only after the map is clicked, so the dialog keeps scrolling normally.
    m.on("click", () => m.scrollWheelZoom.enable());
    m.on("mouseout", () => m.scrollWheelZoom.disable());
    map.current = m;
    return () => { m.remove(); map.current = null; };
  }, []);

  // (Re)draw the overlays whenever the data or theme colours change.
  useEffect(() => {
    const m = map.current;
    if (!m) return;
    const layer = L.layerGroup().addTo(m);
    if (props.home && props.fence)
      L.circle(props.home, { radius: props.fence, color: color("warn"), weight: 2, dashArray: "6 6", fill: false }).addTo(layer);
    props.lines.forEach(l => L.polyline(l.pts, { color: l.color, weight: 3, opacity: 0.95, lineJoin: "round", lineCap: "round" }).addTo(layer));
    props.ends?.forEach(e => L.marker(e.pt, { icon: dot(e.color) }).addTo(layer));
    props.takeoff?.forEach(p => L.marker(p, { icon: triangle(color("loit"), true) }).addTo(layer));
    props.touchdown?.forEach(p => L.marker(p, { icon: triangle(color("rtl"), false) }).addTo(layer));
    if (props.home) L.marker(props.home, { icon: homeIcon(color("s5")), zIndexOffset: 1000 }).addTo(layer);
    bounds.current = boundsOf(props);
    m.invalidateSize();
    m.fitBounds(bounds.current);
    return () => { layer.remove(); };
  }, [props, color]);

  // Fullscreen: keep the state in sync and refit after the size changes.
  useEffect(() => {
    const sync = () => {
      setFull(document.fullscreenElement === box.current);
      setTimeout(() => { map.current?.invalidateSize(); if (bounds.current) map.current?.fitBounds(bounds.current); }, 80);
    };
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);
  const toggleFull = () => (document.fullscreenElement ? document.exitFullscreen() : box.current?.requestFullscreen());
  const reset = () => { if (bounds.current) map.current?.flyToBounds(bounds.current, { duration: 0.6 }); };

  const btn = "w-8 h-8 flex items-center justify-center rounded-md bg-black/60 text-white hover:bg-black/80 backdrop-blur-sm";
  return (
    <div ref={box} className={full ? "relative w-full h-full bg-black" : "relative w-full h-[340px] sm:h-[420px] rounded-lg overflow-hidden border border-border"}>
      <div ref={el} className="w-full h-full" style={{ background: "#1b1f24" }} />
      <div className="absolute top-2 right-2 z-[1000] flex flex-col gap-1.5">
        <button type="button" className={btn} onClick={toggleFull} aria-label={full ? "Exit fullscreen" : "Fullscreen"}>{full ? <Minimize className="w-4 h-4" /> : <Expand className="w-4 h-4" />}</button>
        <button type="button" className={btn} onClick={reset} aria-label="Reset view"><LocateFixed className="w-4 h-4" /></button>
      </div>
      {!full && <p className="absolute bottom-1.5 left-2 z-[1000] text-[10px] text-white/80 bg-black/50 rounded px-1.5 py-0.5 pointer-events-none">Click the map to zoom with the scroll wheel</p>}
    </div>
  );
}
