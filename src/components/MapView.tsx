import React, { useEffect, useRef, useState } from 'react';
import { LostDogReport, formatReportDateTime } from '../types/amigo';
import { MapPin, Navigation, LocateFixed, X, CheckCircle2 } from 'lucide-react';

declare const L: any;

interface MapViewProps {
  reports: LostDogReport[];
  onSelectReport: (report: LostDogReport) => void;
  onOpenReportModal: () => void;
}

export const MapView: React.FC<MapViewProps> = ({
  reports,
  onSelectReport,
}) => {
  const [filterType, setFilterType] = useState<'ALL' | 'LOST' | 'FOUND'>('ALL');
  const [selectedPin, setSelectedPin] = useState<LostDogReport | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>({
    lat: -34.9011,
    lng: -56.1645, // Default Montevideo center
  });
  const [locationStatus, setLocationStatus] = useState<string>('Montevideo, UY (GPS Activo)');

  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const userMarkerRef = useRef<any>(null);
  const radiusCirclesRef = useRef<any[]>([]);

  const filteredReports = reports.filter((r) => {
    if (filterType === 'LOST') return r.status === 'LOST';
    if (filterType === 'FOUND') return r.status === 'FOUND';
    return true;
  });

  useEffect(() => {
    if (selectedPin && !filteredReports.some((r) => r.id === selectedPin.id)) {
      setSelectedPin(null);
    }
  }, [filterType, filteredReports, selectedPin]);

  useEffect(() => {
    if (typeof window !== 'undefined' && L && mapContainerRef.current && !mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
      }).setView([userLocation.lat, userLocation.lng], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      mapRef.current = map;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapRef.current && L) {
      const map = mapRef.current;
      
      map.eachLayer((layer: any) => {
        if (layer instanceof L.Marker && layer !== userMarkerRef.current) {
          map.removeLayer(layer);
        }
      });
      radiusCirclesRef.current.forEach((c) => map.removeLayer(c));
      radiusCirclesRef.current = [];

      if (userMarkerRef.current) {
        map.removeLayer(userMarkerRef.current);
      }

      const userIcon = L.divIcon({
        className: 'user-location-marker',
        html: `<div style="background-color: #3b82f6; width: 40px; height: 40px; border-radius: 50%; border: 4px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 20px rgba(59, 130, 246, 0.6); color: white; font-size: 16px;">📍</div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon }).addTo(map);
      userMarkerRef.current = userMarker;

      filteredReports.forEach((report) => {
        const isLost = report.status === 'LOST';
        const colorHex = isLost ? '#e11d48' : '#f59e0b';
        const emoji = report.species === 'GATO' ? '🐱' : '🐶';

        const radiusMeters = report.radiusKm * 1000;
        const circle = L.circle([report.lastKnownLocation.lat, report.lastKnownLocation.lng], {
          radius: radiusMeters,
          color: colorHex,
          fillColor: colorHex,
          fillOpacity: 0.12,
          weight: 1.5,
          dashArray: '4, 4',
        }).addTo(map);
        radiusCirclesRef.current.push(circle);

        const customIcon = L.divIcon({
          className: 'custom-map-marker',
          html: `<div style="background-color: ${colorHex}; width: 38px; height: 38px; border-radius: 12px; border: 3px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3); font-weight: bold; color: white; font-size: 15px;">${emoji}</div>`,
          iconSize: [38, 38],
          iconAnchor: [19, 19],
        });

        const marker = L.marker([report.lastKnownLocation.lat, report.lastKnownLocation.lng], {
          icon: customIcon,
        }).addTo(map);

        marker.on('click', () => {
          setSelectedPin(report);
          map.setView([report.lastKnownLocation.lat, report.lastKnownLocation.lng], 15, { animate: true });
        });
      });
    }
  }, [filteredReports, userLocation]);

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(newPos);
          setLocationStatus('Ubicación actual obtenida por GPS');
          if (mapRef.current) {
            mapRef.current.setView([newPos.lat, newPos.lng], 15, { animate: true });
          }
        },
        () => {
          const fallbackPos = { lat: -34.9011, lng: -56.1645 };
          setUserLocation(fallbackPos);
          setLocationStatus('Montevideo (Ubicación simulada)');
          if (mapRef.current) {
            mapRef.current.setView([fallbackPos.lat, fallbackPos.lng], 14, { animate: true });
          }
        }
      );
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-130px)] bg-amber-50/30 flex flex-col overflow-hidden">
      {/* Top overlay: Filters + Locate Button (removed duplicate top-right Reportar button) */}
      <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between gap-2 pointer-events-auto">
        <div className="flex items-center gap-1.5 p-1 bg-white/95 backdrop-blur-md rounded-2xl border border-amber-200/60 shadow-lg">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'ALL' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilterType('LOST')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'LOST' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Perdidos
          </button>
          <button
            onClick={() => setFilterType('FOUND')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'FOUND' ? 'bg-amber-500 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Encontrados
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLocateMe}
            className="w-11 h-11 bg-white border border-amber-200/80 rounded-2xl shadow-lg flex items-center justify-center text-amber-700 hover:bg-amber-50 active:scale-95 transition-all"
            title="Actualizar mi ubicación GPS"
          >
            <LocateFixed className="w-5 h-5 text-amber-600 animate-pulse" />
          </button>
        </div>
      </div>

      {/* GPS Status Banner */}
      <div className="absolute top-16 left-3 z-20 bg-white/90 backdrop-blur-md px-3 py-1 rounded-xl border border-amber-200 text-[11px] font-semibold text-slate-700 shadow-sm flex items-center gap-1.5">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        <span>{locationStatus}</span>
      </div>

      {/* Real Interactive Leaflet Map Container */}
      <div ref={mapContainerRef} className="absolute inset-0 z-10 w-full h-full"></div>

      {/* Bottom Selected Report Preview Card with X close button */}
      {selectedPin && (
        <div className="absolute bottom-20 left-3 right-3 z-30 max-w-lg mx-auto bg-white/95 backdrop-blur-xl border border-amber-200/90 rounded-3xl p-3.5 sm:p-4 shadow-2xl animate-in fade-in slide-in-from-bottom-4 max-h-[calc(100vh-140px)] overflow-y-auto">
          <button
            onClick={() => setSelectedPin(null)}
            className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-slate-100/90 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors shadow-sm"
            title="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>

          {(() => {
            const firstPhoto = selectedPin.facePhotoUrl || selectedPin.tempFacePhoto || selectedPin.photoUrl || selectedPin.tempDogPhoto || (selectedPin.species === 'GATO' ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&auto=format&fit=crop&q=80');
            const secondPhoto = selectedPin.fullBodyPhotoUrl || (selectedPin.photoUrl && selectedPin.photoUrl !== firstPhoto ? selectedPin.photoUrl : undefined) || (selectedPin.tempDogPhoto && selectedPin.tempDogPhoto !== firstPhoto ? selectedPin.tempDogPhoto : undefined);

            return (
              <div className="flex items-start gap-3">
                {/* Photo Thumbnails: One underneath the other (stacked vertically) */}
                {secondPhoto ? (
                  <div className="flex flex-col gap-2 shrink-0">
                    <div
                      onClick={() => onSelectReport(selectedPin)}
                      className="w-15 h-15 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-amber-300 bg-amber-100 shadow-sm relative group cursor-pointer shrink-0"
                      title="Ver detalle del reporte (Rostro)"
                    >
                      <img
                        src={firstPhoto}
                        alt={selectedPin.dogName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-0 inset-x-0 bg-black/65 backdrop-blur-xs text-[8px] text-white font-extrabold text-center py-0.5 leading-none tracking-tight">
                        Rostro
                      </span>
                    </div>

                    <div
                      onClick={() => onSelectReport(selectedPin)}
                      className="w-15 h-15 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-amber-200 bg-amber-100 shadow-sm relative group cursor-pointer shrink-0"
                      title="Ver detalle del reporte (Cuerpo)"
                    >
                      <img
                        src={secondPhoto}
                        alt={`${selectedPin.dogName} - Cuerpo`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-0 inset-x-0 bg-black/65 backdrop-blur-xs text-[8px] text-white font-extrabold text-center py-0.5 leading-none tracking-tight">
                        Cuerpo
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col shrink-0">
                    <div
                      onClick={() => onSelectReport(selectedPin)}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-amber-300 bg-amber-100 shadow-sm relative group cursor-pointer shrink-0"
                      title="Ver detalle del reporte"
                    >
                      <img
                        src={firstPhoto}
                        alt={selectedPin.dogName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  {/* Header: Title and Status Badge with pr-9 so nothing overlaps the X close button */}
                  <div className="flex items-center justify-between gap-2 pr-9">
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 truncate flex items-center gap-1.5 min-w-0">
                      <span className="shrink-0">{selectedPin.species === 'GATO' ? '🐱' : '🐶'}</span>
                      <span className="truncate">{selectedPin.dogName || 'Mascota'}</span>
                    </h3>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shrink-0 ${
                      selectedPin.status === 'LOST' ? 'bg-rose-100 text-rose-700 border border-rose-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      {selectedPin.status === 'LOST' ? 'Perdido' : 'Encontrado'}
                    </span>
                  </div>

                  {/* Donde and Cuando aligned on the exact same level */}
                  <div className="mt-2 p-2.5 rounded-2xl bg-amber-50/80 border border-amber-200/70 text-xs">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0 space-y-1.5">
                        {/* Donde */}
                        <div className="flex items-start gap-1.5">
                          <span className="font-extrabold text-slate-900 shrink-0 w-14">Donde:</span>
                          <div className="flex-1 min-w-0">
                            <span className="font-semibold text-slate-800 break-words leading-tight block">
                              {selectedPin.lastKnownLocation.addressText || selectedPin.lastKnownLocation.neighborhood}
                            </span>
                            {selectedPin.lastKnownLocation.crossStreets && (
                              <span className="block text-[11px] text-amber-900 font-medium mt-0.5 break-words leading-tight">
                                {selectedPin.lastKnownLocation.crossStreets}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Cuando: exactly same level as Donde */}
                        <div className="flex items-baseline gap-1.5 pt-1 border-t border-amber-200/50">
                          <span className="font-extrabold text-slate-900 shrink-0 w-14">Cuando:</span>
                          <span className="font-semibold text-slate-800 whitespace-nowrap">
                            {formatReportDateTime(selectedPin.createdAt)}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-500 font-medium truncate">
                          Barrio: {selectedPin.lastKnownLocation.neighborhood}
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedPin.description && (
                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 break-words leading-relaxed">
                      {selectedPin.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-amber-100 gap-2">
                    <div className="flex items-center gap-1.5 text-xs text-amber-800 font-mono shrink-0">
                      <Navigation className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                      <span className="font-semibold">Radio: {selectedPin.radiusKm} km</span>
                    </div>

                    <button
                      onClick={() => onSelectReport(selectedPin)}
                      className="px-3.5 py-1.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shrink-0 active:scale-95 flex items-center gap-1 hover:shadow-lg"
                    >
                      <span>Ver Detalles</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
