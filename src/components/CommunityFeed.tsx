import React, { useState, useEffect, useRef } from 'react';
import { LostDogReport } from '../types/amigo';
import { MapPin, Search, Phone, ShieldAlert, Heart, List, Map as MapIcon } from 'lucide-react';

declare const L: any;

interface CommunityFeedProps {
  reports: LostDogReport[];
  onSelectReport: (report: LostDogReport) => void;
  onOpenReportModal: () => void;
}

export const CommunityFeed: React.FC<CommunityFeedProps> = ({
  reports,
  onSelectReport,
  onOpenReportModal,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'LOST' | 'FOUND'>('ALL');
  const [speciesFilter, setSpeciesFilter] = useState<'ALL' | 'PERRO' | 'GATO'>('ALL');

  // Simulated user location (Montevideo center)
  const userLocation = { lat: -34.9011, lng: -56.1645 };

  const calculateDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Number((R * c).toFixed(1));
  };

  const filtered = reports.filter((r) => {
    const matchesSearch =
      (r.dogName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (r.breed?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      r.lastKnownLocation.neighborhood.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'ALL' ? true : r.status === typeFilter;
    const matchesSpecies = speciesFilter === 'ALL' ? true : r.species === speciesFilter;

    return matchesSearch && matchesType && matchesSpecies;
  });

  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewMode === 'map' && typeof window !== 'undefined' && L && mapContainerRef.current) {
      if (!mapRef.current) {
        const map = L.map(mapContainerRef.current, {
          zoomControl: false,
        }).setView([userLocation.lat, userLocation.lng], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        L.control.zoom({ position: 'bottomright' }).addTo(map);
        mapRef.current = map;
      } else {
        mapRef.current.invalidateSize();
      }

      const map = mapRef.current;

      map.eachLayer((layer: any) => {
        if (layer instanceof L.Marker || layer instanceof L.Circle) {
          map.removeLayer(layer);
        }
      });

      L.circle([userLocation.lat, userLocation.lng], {
        radius: 5000,
        color: '#f59e0b',
        fillColor: '#fbbf24',
        fillOpacity: 0.1,
        weight: 2,
        dashArray: '5, 5',
      }).addTo(map);

      const userIcon = L.divIcon({
        className: 'user-location-marker',
        html: `<div style="background-color: #3b82f6; width: 36px; height: 36px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 15px rgba(59, 130, 246, 0.6); color: white; font-size: 14px;">📍</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });
      L.marker([userLocation.lat, userLocation.lng], { icon: userIcon }).addTo(map);

      filtered.forEach((report) => {
        const dist = calculateDistanceKm(userLocation.lat, userLocation.lng, report.lastKnownLocation.lat, report.lastKnownLocation.lng);
        if (dist <= 5.0) {
          const isLost = report.status === 'LOST';
          const colorHex = isLost ? '#e11d48' : '#f59e0b';
          const emoji = report.species === 'GATO' ? '🐱' : '🐶';

          const customIcon = L.divIcon({
            className: 'custom-map-marker',
            html: `<div style="background-color: ${colorHex}; width: 36px; height: 36px; border-radius: 12px; border: 3px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3); font-weight: bold; color: white; font-size: 14px;">${emoji}</div>`,
            iconSize: [36, 36],
            iconAnchor: [18, 18],
          });

          const marker = L.marker([report.lastKnownLocation.lat, report.lastKnownLocation.lng], {
            icon: customIcon,
          }).addTo(map);

          marker.on('click', () => {
            onSelectReport(report);
          });
        }
      });
    }

    return () => {
      if (viewMode !== 'map' && mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [viewMode, filtered]);

  return (
    <div className="w-full min-h-[calc(100vh-130px)] bg-gradient-to-br from-amber-50/80 via-orange-50/30 to-rose-50/40 pb-28 px-4 py-6 max-w-4xl mx-auto relative overflow-hidden">
      <div className="absolute top-10 left-[-10%] w-72 h-72 rounded-full bg-amber-400/10 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-[-10%] w-80 h-80 rounded-full bg-rose-400/10 blur-3xl pointer-events-none"></div>

      {/* Header & View Mode Toggle */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-white/85 backdrop-blur-xl p-6 rounded-3xl border border-amber-200/80 shadow-xl shadow-amber-500/5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white font-extrabold text-[10px] tracking-wider uppercase shadow-sm">
              Feed de Rescate 🇺🇾
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Alertas y Mascotas Perdidas
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Montevideo y alrededores (Radio de búsqueda de 5 km)
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-amber-100/70 p-1.5 rounded-2xl border border-amber-200">
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
              viewMode === 'list' ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <List className="w-4 h-4" />
            <span>Lista</span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
              viewMode === 'map' ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <MapIcon className="w-4 h-4" />
            <span>Mapa (5 km)</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="relative z-10 flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-600" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por raza, barrio (ej. Pocitos, Carrasco)..."
            className="w-full bg-white/90 backdrop-blur-md border border-amber-200 rounded-2xl pl-11 pr-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 shadow-sm transition-all font-medium"
          />
        </div>

        <button
          onClick={onOpenReportModal}
          className="px-5 py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-orange-500/30 hover:scale-105 active:scale-95 transition-transform flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Reportar</span>
        </button>
      </div>

      {/* Species filter chips */}
      <div className="relative z-10 flex items-center gap-2 mb-6">
        <button
          onClick={() => setSpeciesFilter('ALL')}
          className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all shadow-sm ${
            speciesFilter === 'ALL' ? 'bg-slate-900 text-white shadow-md' : 'bg-white/80 backdrop-blur-md text-slate-700 border border-amber-200 hover:bg-white'
          }`}
        >
          🐾 Todas
        </button>
        <button
          onClick={() => setSpeciesFilter('PERRO')}
          className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all shadow-sm ${
            speciesFilter === 'PERRO' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md' : 'bg-white/80 backdrop-blur-md text-slate-700 border border-amber-200 hover:bg-white'
          }`}
        >
          🐶 Perros
        </button>
        <button
          onClick={() => setSpeciesFilter('GATO')}
          className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all shadow-sm ${
            speciesFilter === 'GATO' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md' : 'bg-white/80 backdrop-blur-md text-slate-700 border border-amber-200 hover:bg-white'
          }`}
        >
          🐱 Gatos
        </button>
      </div>

      {viewMode === 'list' ? (
        <div className="relative z-10 grid gap-4">
          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-white/80 backdrop-blur-xl rounded-3xl border border-amber-200 shadow-xl">
              <Heart className="w-12 h-12 text-amber-400 mx-auto mb-3 animate-bounce" />
              <p className="text-sm font-extrabold text-slate-700">
                No se encontraron reportes activos
              </p>
            </div>
          ) : (
            filtered.map((report) => {
              const distanceKm = calculateDistanceKm(
                userLocation.lat,
                userLocation.lng,
                report.lastKnownLocation.lat,
                report.lastKnownLocation.lng
              );

              return (
                <div
                  key={report.id}
                  onClick={() => onSelectReport(report)}
                  className="bg-white/90 hover:bg-white backdrop-blur-xl border border-amber-200/80 hover:border-orange-400 rounded-3xl p-5 transition-all cursor-pointer group shadow-lg shadow-amber-500/5 hover:shadow-xl hover:-translate-y-0.5"
                >
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="relative w-full sm:w-32 h-36 rounded-2xl overflow-hidden border-2 border-amber-100 shrink-0 bg-amber-50 shadow-inner">
                      <img
                        src={report.dogId ? (report.species === 'GATO' ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&auto=format&fit=crop&q=80') : report.tempDogPhoto}
                        alt={report.dogName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2 left-2 flex gap-1">
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full backdrop-blur-md shadow-md ${
                          report.status === 'LOST' ? 'bg-rose-600 text-white shadow-rose-500/30' : 'bg-amber-500 text-white shadow-amber-500/30'
                        }`}>
                          {report.status === 'LOST' ? 'Perdido' : 'Encontrado'}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h3 className="text-lg font-black text-slate-900 group-hover:text-orange-600 transition-colors flex items-center gap-2">
                          <span className="text-xl">{report.species === 'GATO' ? '🐱' : '🐶'}</span>
                          <span>{report.dogName || 'Mascota'}</span>
                        </h3>
                        <span className="text-xs font-black text-orange-700 bg-orange-100/80 border border-orange-200 px-3 py-1 rounded-xl w-fit shadow-sm">
                          📍 {distanceKm} km
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 mt-2 font-medium">
                        <span className="font-bold text-slate-800">{report.breed || 'Mestizo'}</span>
                        <span aria-hidden="true" className="text-amber-400">·</span>
                        <span className="flex items-center gap-1 text-orange-700 font-bold">
                          <MapPin className="w-3.5 h-3.5 text-orange-600" />
                          {report.lastKnownLocation.neighborhood}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed font-normal">
                        {report.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 mt-4">
                        {report.takesMedication && (
                          <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-xl bg-purple-100 text-purple-900 border border-purple-200 shadow-sm">
                            💊 Requiere medicación
                          </span>
                        )}
                        <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-xl bg-rose-100 text-rose-900 border border-rose-200 shadow-sm animate-pulse">
                          🚨 Necesita ayuda / Alerta activa
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-amber-100">
                        <span className="text-[11px] text-slate-500 font-mono">
                          Reportado por {report.updatedBy}
                        </span>

                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${report.contactPhone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-md shadow-orange-500/20"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Contactar Dueño</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        <div className="relative z-10 w-full h-[550px] bg-white rounded-3xl overflow-hidden border border-amber-200/80 shadow-2xl">
          <div className="absolute top-3 left-3 z-20 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-amber-200 text-xs font-bold text-slate-800 shadow-md flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Radio de 5 km alrededor de tu ubicación (Montevideo)</span>
          </div>
          <div ref={mapContainerRef} className="w-full h-full"></div>
        </div>
      )}
    </div>
  );
};
