import React, { useState, useRef } from 'react';
import { LostDogReport, formatReportDateTime } from '../types/amigo';
import { X, MapPin, Sparkles, Copy, Check, Eye, Award, CheckCircle2, HeartHandshake, ZoomIn, Plus, Minus } from 'lucide-react';
import { Button } from './ui/Button';

interface DogDetailModalProps {
  report: LostDogReport;
  onClose: () => void;
  onUpdateReportStatus?: (reportId: string, status: 'RESOLVED') => void;
  onAddSighting?: (reportId: string, sightingText: string) => void;
  onAwardPoints?: (points: number) => void;
}

export const DogDetailModal: React.FC<DogDetailModalProps> = ({
  report,
  onClose,
  onUpdateReportStatus,
  onAddSighting,
  onAwardPoints,
}) => {
  const [photoTab, setPhotoTab] = useState<'FACE' | 'BODY'>('FACE');
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    if (zoomScale <= 1) return;
    isDragging.current = true;
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || zoomScale <= 1) return;
    setPan({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging.current) {
      isDragging.current = false;
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore pointer capture errors if released
      }
    }
  };

  const handleOpenZoom = () => {
    setZoomScale(1);
    setPan({ x: 0, y: 0 });
    setIsZoomModalOpen(true);
  };

  const handleCloseZoom = () => {
    setIsZoomModalOpen(false);
    setZoomScale(1);
    setPan({ x: 0, y: 0 });
  };

  const [flyerText, setFlyerText] = useState<string | null>(null);
  const [loadingFlyer, setLoadingFlyer] = useState(false);
  const [copied, setCopied] = useState(false);

  const [showSightingModal, setShowSightingModal] = useState(false);
  const [sightingText, setSightingText] = useState('');
  const [sightingSuccess, setSightingSuccess] = useState(false);

  const [showFoundModal, setShowFoundModal] = useState(false);
  const [selectedHelper, setSelectedHelper] = useState('Joaquín Rodríguez');
  const [rescueCompleted, setRescueCompleted] = useState(false);

  const handleGenerateFlyer = async () => {
    setLoadingFlyer(true);
    try {
      const res = await fetch('/api/ai/flyer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dogName: report.dogName || 'Mascota',
          breed: report.breed || 'Mestizo',
          neighborhood: report.lastKnownLocation.neighborhood,
          contactPhone: report.contactPhone,
          rewardAmount: report.rewardAmount || 0,
          description: report.description,
          language: 'es',
        }),
      });
      const data = await res.json();
      setFlyerText(data.flyerText);
    } catch (err) {
      console.error(err);
      setFlyerText('Error al generar cartel.');
    } finally {
      setLoadingFlyer(false);
    }
  };

  const handleCopyFlyer = () => {
    if (flyerText) {
      navigator.clipboard.writeText(flyerText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSightingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sightingText.trim()) return;
    if (onAddSighting) {
      onAddSighting(report.id, sightingText);
    }
    setSightingSuccess(true);
    setTimeout(() => {
      setSightingSuccess(false);
      setShowSightingModal(false);
      setSightingText('');
    }, 1500);
  };

  const handleCompleteRescue = () => {
    if (onUpdateReportStatus) {
      onUpdateReportStatus(report.id, 'RESOLVED');
    }
    if (onAwardPoints) {
      onAwardPoints(50);
    }
    setRescueCompleted(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const facePhoto = report.facePhotoUrl || report.tempFacePhoto || (report.species === 'GATO' ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&auto=format&fit=crop&q=80');
  const bodyPhoto = report.fullBodyPhotoUrl || report.photoUrl || report.tempDogPhoto || (report.species === 'GATO' ? 'https://images.unsplash.com/photo-1513360309081-38f076278f19?w=800&auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800&auto=format&fit=crop&q=80');
  const hasTwoPhotos = Boolean(facePhoto && bodyPhoto && facePhoto !== bodyPhoto);
  const activePhoto = photoTab === 'FACE' ? facePhoto : bodyPhoto;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-amber-200 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 my-8">
        {/* Photo Container with Face / Body Selector and Zoom Option */}
        <div className="relative h-72 sm:h-80 w-full bg-slate-950 overflow-hidden group">
          <img
            src={activePhoto}
            alt={report.dogName}
            className="w-full h-full object-cover transition-transform duration-300 cursor-pointer"
            onClick={handleOpenZoom}
            title="Toca para ampliar foto"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-black/40 pointer-events-none"></div>

          {/* Top Left: 2-Photos Thumbnails (2nd photo thumbnail stacked underneath 1st) */}
          {hasTwoPhotos ? (
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              <button
                type="button"
                onClick={() => setPhotoTab('FACE')}
                className={`relative w-14 h-14 rounded-2xl overflow-hidden border-2 transition-all shadow-lg ${
                  photoTab === 'FACE'
                    ? 'border-amber-400 ring-2 ring-amber-400/70 scale-105'
                    : 'border-white/60 opacity-80 hover:opacity-100 hover:scale-100 bg-black/40'
                }`}
                title="Ver foto: Solo Rostro"
              >
                <img src={facePhoto} alt="Rostro" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[8px] text-white font-extrabold text-center py-0.5 leading-none">
                  Rostro
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPhotoTab('BODY')}
                className={`relative w-14 h-14 rounded-2xl overflow-hidden border-2 transition-all shadow-lg ${
                  photoTab === 'BODY'
                    ? 'border-amber-400 ring-2 ring-amber-400/70 scale-105'
                    : 'border-white/60 opacity-80 hover:opacity-100 hover:scale-100 bg-black/40'
                }`}
                title="Ver foto: Cuerpo Entero"
              >
                <img src={bodyPhoto} alt="Cuerpo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[8px] text-white font-extrabold text-center py-0.5 leading-none">
                  Cuerpo
                </span>
              </button>
            </div>
          ) : (
            <div className="absolute top-4 left-4 z-10">
              <span className="px-3 py-1 rounded-xl bg-black/60 text-white text-xs font-bold backdrop-blur-md border border-white/20">
                📷 Foto de Mascota
              </span>
            </div>
          )}

          {/* Top Right: Zoom Option & Close Button */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <button
              onClick={handleOpenZoom}
              className="px-3 py-1.5 rounded-full bg-white/90 hover:bg-white backdrop-blur-md flex items-center gap-1.5 text-xs font-black text-slate-800 transition-all shadow-md hover:scale-105 active:scale-95"
              title="Ampliar foto / Zoom"
            >
              <ZoomIn className="w-4 h-4 text-amber-600" />
              <span>Zoom</span>
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/90 hover:bg-white backdrop-blur-md flex items-center justify-center text-slate-700 hover:text-slate-900 transition-colors shadow-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Bottom Title & Status */}
          <div className="absolute bottom-4 left-6 right-6">
            <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
              report.status === 'LOST' ? 'bg-rose-100 text-rose-700 border border-rose-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
            }`}>
              {report.status === 'LOST' ? 'Perdido' : 'Encontrado'}
            </span>
            <h2 className="text-2xl font-black text-white mt-1 flex items-center gap-2 drop-shadow-md">
              <span>{report.species === 'GATO' ? '🐱' : '🐶'}</span>
              <span>{report.dogName || 'Mascota'}</span>
              <span className="text-xs font-bold text-amber-300 ml-1">
                ({photoTab === 'FACE' ? 'Solo Rostro' : 'Cuerpo Entero'})
              </span>
            </h2>
          </div>
        </div>

        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto bg-amber-50/30">
          {/* Address / Location & Time Banner with Donde and Cuando strictly aligned on same level */}
          <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-sm">
            <div className="flex items-start gap-2.5 text-xs">
              <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0 space-y-2">
                {/* Donde */}
                <div className="flex items-start gap-2">
                  <span className="font-extrabold text-slate-900 shrink-0 w-16">Donde:</span>
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-slate-800">
                      {report.lastKnownLocation.addressText || report.lastKnownLocation.neighborhood}
                    </span>
                    {report.lastKnownLocation.crossStreets && (
                      <span className="block text-xs font-semibold text-amber-900 mt-0.5">
                        {report.lastKnownLocation.crossStreets}
                      </span>
                    )}
                    <span className="block text-[11px] text-slate-500 font-medium mt-0.5">
                      Barrio / Localidad: {report.lastKnownLocation.neighborhood}
                    </span>
                  </div>
                </div>

                {/* Cuando: exactly same level / width as Donde */}
                <div className="flex items-baseline gap-2 pt-1.5 border-t border-amber-100">
                  <span className="font-extrabold text-slate-900 shrink-0 w-16">Cuando:</span>
                  <span className="font-semibold text-slate-800">
                    {formatReportDateTime(report.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-white p-3 rounded-2xl border border-amber-200 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 block">RAZA</span>
              <span className="text-xs font-extrabold text-slate-800 truncate block mt-0.5">{report.breed || 'Mestizo'}</span>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-amber-200 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 block">RADIO ALERTA</span>
              <span className="text-xs font-extrabold text-amber-700 truncate block mt-0.5">{report.radiusKm} km</span>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-amber-200 shadow-sm col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold text-slate-400 block">RECOMPENSA</span>
              <span className="text-xs font-extrabold text-amber-800 truncate block mt-0.5">${report.rewardAmount || 0} UYU</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Descripción del Caso
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed bg-white p-4 rounded-2xl border border-amber-200 shadow-sm">
              {report.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              variant="secondary"
              onClick={() => setShowSightingModal(true)}
            >
              <Eye className="w-4 h-4 text-amber-600" />
              <span>Ví a esta mascota aquí (Avistamiento)</span>
            </Button>

            <Button
              variant="primary"
              onClick={() => setShowFoundModal(true)}
            >
              <Award className="w-4 h-4" />
              <span>Marcar como Encontrado (Dueño)</span>
            </Button>
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-rose-50 border border-amber-300 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <h4 className="text-sm font-extrabold text-slate-900">
                  Generador de Cartel WhatsApp (IA)
                </h4>
              </div>

              {!flyerText && (
                <button
                  onClick={handleGenerateFlyer}
                  disabled={loadingFlyer}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-colors shadow-md flex items-center gap-1.5"
                >
                  {loadingFlyer ? 'Generando...' : '🖨️ Generar Cartel IA'}
                </button>
              )}
            </div>

            {flyerText && (
              <div className="space-y-3">
                <pre className="text-xs text-slate-700 font-sans whitespace-pre-wrap bg-white p-3 rounded-xl border border-amber-200 max-h-48 overflow-y-auto">
                  {flyerText}
                </pre>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={handleCopyFlyer}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? '¡Copiado!' : 'Copiar Texto'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {showSightingModal && (
          <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95">
              {sightingSuccess ? (
                <div className="text-center py-6 space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="text-base font-black text-slate-900">¡Avistamiento registrado!</h4>
                  <p className="text-xs text-slate-600">Se ha notificado al dueño y actualizado la ruta en el mapa.</p>
                </div>
              ) : (
                <form onSubmit={handleSightingSubmit} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-black text-slate-900">📍 Registrar Avistamiento</h4>
                    <button type="button" onClick={() => setShowSightingModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
                  </div>
                  <p className="text-xs text-slate-500">¿Viste a {report.dogName || 'esta mascota'} recientemente? Ingresa detalles del avistamiento.</p>
                  
                  <textarea
                    rows={3}
                    required
                    value={sightingText}
                    onChange={(e) => setSightingText(e.target.value)}
                    placeholder="Ej. Lo vi corriendo hacia la rambla hace 10 minutos..."
                    className="w-full bg-slate-50 border border-amber-200 rounded-2xl p-3 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                  />

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setShowSightingModal(false)}>Cancelar</Button>
                    <Button type="submit">Enviar Avistamiento</Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {showFoundModal && (
          <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 text-center">
              {rescueCompleted ? (
                <div className="py-6 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto text-2xl animate-bounce">
                    🎉
                  </div>
                  <h4 className="text-xl font-black text-slate-900">¡Mascota Recuperada con Éxito!</h4>
                  <p className="text-xs font-bold text-amber-800 bg-amber-50 p-3 rounded-2xl border border-amber-200">
                    🏆 +50 Estrellas de Rescate otorgadas a {selectedHelper}. <br/>
                    Total Mascotas Rescatadas: +1 🐾
                  </p>
                </div>
              ) : (
                <div className="space-y-4 text-left">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-black text-slate-900">🎉 Marcar como Encontrado</h4>
                    <button type="button" onClick={() => setShowFoundModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
                  </div>
                  <p className="text-xs text-slate-500">Selecciona al voluntario o vecino de la comunidad que ayudó en el rescate para agradecerle y otorgarle puntos.</p>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Voluntario / Colaborador</label>
                    <select
                      value={selectedHelper}
                      onChange={(e) => setSelectedHelper(e.target.value)}
                      className="w-full bg-slate-50 border border-amber-200 rounded-2xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-medium"
                    >
                      <option value="Joaquín Rodríguez">Joaquín Rodríguez (+50 ★)</option>
                      <option value="Ana Suarez">Ana Suarez (+50 ★)</option>
                      <option value="Refugio Montevideo Amigo">Refugio Montevideo Amigo (+50 ★)</option>
                    </select>
                  </div>

                  <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 flex items-center gap-3">
                    <HeartHandshake className="w-6 h-6 text-amber-600 shrink-0" />
                    <span className="text-xs text-amber-900 font-medium">Se actualizarán las estadísticas globales y se otorgarán insignias de héroe comunitario.</span>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="outline" onClick={() => setShowFoundModal(false)}>Cancelar</Button>
                    <Button type="button" onClick={handleCompleteRescue}>Confirmar Rescate Exitoso</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Simple Photo Lightbox (No text, fits properly on mobile, + / - on top left, X outside photo on top right) */}
        {isZoomModalOpen && (
          <div
            className="fixed inset-0 z-70 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in select-none"
            onClick={handleCloseZoom}
          >
            {/* Top Left: Small + and - icons to increase or decrease zoom */}
            <div
              className="fixed top-4 left-4 sm:top-6 sm:left-6 z-80 flex items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => {
                  setZoomScale((prev) => Math.min(Number((prev + 0.35).toFixed(2)), 3.5));
                }}
                disabled={zoomScale >= 3.5}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/20 hover:bg-white/35 active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed text-white flex items-center justify-center shadow-2xl backdrop-blur-md border border-white/30 transition cursor-pointer"
                aria-label="Aumentar zoom"
                title="Aumentar zoom (+)"
              >
                <Plus className="w-5 h-5 stroke-[2.5]" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setZoomScale((prev) => {
                    const next = Math.max(Number((prev - 0.35).toFixed(2)), 1);
                    if (next <= 1) setPan({ x: 0, y: 0 });
                    return next;
                  });
                }}
                disabled={zoomScale <= 1}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/20 hover:bg-white/35 active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed text-white flex items-center justify-center shadow-2xl backdrop-blur-md border border-white/30 transition cursor-pointer"
                aria-label="Reducir zoom"
                title="Reducir zoom (-)"
              >
                <Minus className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {/* X Close Button positioned outside the photo on top right */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleCloseZoom();
              }}
              className="fixed top-4 right-4 sm:top-6 sm:right-6 z-80 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/20 hover:bg-white/35 active:scale-90 text-white flex items-center justify-center shadow-2xl backdrop-blur-md border border-white/30 transition cursor-pointer"
              aria-label="Cerrar"
              title="Cerrar"
            >
              <X className="w-6 h-6 stroke-[2.5]" />
            </button>

            {/* Photo Container - Clean, fitted properly for mobile, zero text */}
            <div
              className="relative max-h-full max-w-full flex items-center justify-center overflow-visible"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={activePhoto}
                alt=""
                style={{
                  transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoomScale})`,
                  transition: isDragging.current ? 'none' : 'transform 200ms ease-out',
                  transformOrigin: 'center center',
                }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  if (zoomScale > 1) {
                    setZoomScale(1);
                    setPan({ x: 0, y: 0 });
                  } else {
                    setZoomScale(2);
                  }
                }}
                className={`max-h-[82vh] max-w-[88vw] sm:max-h-[88vh] sm:max-w-[85vw] object-contain rounded-2xl shadow-2xl select-none touch-none ${
                  zoomScale > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
                }`}
                referrerPolicy="no-referrer"
                draggable={false}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
