import React, { useState } from 'react';
import { LostDogReport } from '../types/amigo';
import { X, Phone, Sparkles, Copy, Check, Eye, Award, CheckCircle2, HeartHandshake } from 'lucide-react';
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

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-amber-200 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 my-8">
        <div className="relative h-64 w-full bg-amber-100">
          <img
            src={report.dogId ? (report.species === 'GATO' ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&auto=format&fit=crop&q=80') : report.tempDogPhoto}
            alt={report.dogName}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-black/30"></div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-700 hover:text-slate-900 transition-colors shadow-md"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6">
            <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
              report.status === 'LOST' ? 'bg-rose-100 text-rose-700 border border-rose-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
            }`}>
              {report.status === 'LOST' ? 'Perdido' : 'Encontrado'}
            </span>
            <h2 className="text-2xl font-black text-white mt-1 flex items-center gap-2">
              <span>{report.species === 'GATO' ? '🐱' : '🐶'}</span>
              <span>{report.dogName || 'Mascota'}</span>
            </h2>
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto bg-amber-50/30">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-white p-3 rounded-2xl border border-amber-200 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 block">RAZA</span>
              <span className="text-xs font-extrabold text-slate-800 truncate block mt-0.5">{report.breed || 'Mestizo'}</span>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-amber-200 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 block">ZONA (URUGUAY)</span>
              <span className="text-xs font-extrabold text-amber-700 truncate block mt-0.5">{report.lastKnownLocation.neighborhood}</span>
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

          <div className="flex items-center gap-3 pt-2">
            <a
              href={`tel:${report.contactPhone}`}
              className="flex-1 h-12 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-600/25 transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>Contactar Dueño: {report.contactPhone}</span>
            </a>
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
                      <option value="Violencia RIvas">Violencia RIvas (+50 ★)</option>
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
      </div>
    </div>
  );
};
