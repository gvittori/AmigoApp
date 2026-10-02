import React, { useState } from 'react';
import { LostDogReport, DogProfile, PetSpecies } from '../types/amigo';
import { DOG_BREEDS, CAT_BREEDS } from '../data/mockData';
import { X, ShieldAlert, Camera, MapPin, LocateFixed, AlertTriangle, CheckCircle2, Radio } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface ReportModalProps {
  onClose: () => void;
  onSubmit: (report: LostDogReport) => void;
  userDogs: DogProfile[];
  existingReports: LostDogReport[];
}

export const ReportModal: React.FC<ReportModalProps> = ({
  onClose,
  onSubmit,
  userDogs,
  existingReports,
}) => {
  // Step 1: Choose Option (A: Lost my pet vs B: Found a pet)
  const [reportMode, setReportMode] = useState<'SELECT' | 'FORM'>('SELECT');
  const [reportType, setReportType] = useState<'MY_DOG' | 'FOUND_DOG'>('MY_DOG');

  const [species, setSpecies] = useState<PetSpecies>('PERRO');
  const [selectedDogId, setSelectedDogId] = useState(userDogs[0]?.id || '');
  const [dogName, setDogName] = useState(userDogs[0]?.name || '');
  const [breed, setBreed] = useState(DOG_BREEDS[0]);
  const [neighborhood, setNeighborhood] = useState('Pocitos, Montevideo');
  const [addressText, setAddressText] = useState('Rambla y Bv. España');
  const [lat, setLat] = useState(-34.9128);
  const [lng, setLng] = useState(-56.1511);
  const [radiusKm, setRadiusKm] = useState(5.0); // Default 5 km radius
  const [rewardAmount, setRewardAmount] = useState<number>(3500);
  const [takesMedication, setTakesMedication] = useState(false);
  const [description, setDescription] = useState('');
  const [contactPhone, setContactPhone] = useState('+598 99 419 883');
  const [tempPhoto, setTempPhoto] = useState('https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&auto=format&fit=crop&q=80');

  const [duplicateWarning, setDuplicateWarning] = useState<boolean>(false);
  const [broadcasting, setBroadcasting] = useState(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);
  const [volunteersCount, setVolunteersCount] = useState(0);

  const currentBreeds = species === 'PERRO' ? DOG_BREEDS : CAT_BREEDS;

  // Check for duplicate reports within ~300 meters (approx 0.003 degrees) in the last hour
  const checkDuplicate = (checkLat: number, checkLng: number) => {
    const oneHourAgo = new Date().getTime() - 3600000;
    const isNearby = existingReports.some((r) => {
      const createdTime = new Date(r.createdAt).getTime();
      const latDiff = Math.abs(r.lastKnownLocation.lat - checkLat);
      const lngDiff = Math.abs(r.lastKnownLocation.lng - checkLng);
      return latDiff < 0.003 && lngDiff < 0.003 && createdTime > oneHourAgo;
    });
    setDuplicateWarning(isNearby);
  };

  const handleGpsPick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newLat = pos.coords.latitude;
          const newLng = pos.coords.longitude;
          setLat(newLat);
          setLng(newLng);
          setNeighborhood('Ubicación GPS Actual (Montevideo)');
          checkDuplicate(newLat, newLng);
        },
        () => {
          // Fallback
          checkDuplicate(lat, lng);
        }
      );
    } else {
      checkDuplicate(lat, lng);
    }
  };

  // Mock trigger function broadcastAlertToRadius
  const broadcastAlertToRadius = (location: { lat: number; lng: number }, radiusKm = 5) => {
    setBroadcasting(true);
    // Simulate push notification broadcast calculation
    const simulatedVolunteers = Math.floor(25 + Math.random() * 50);
    setVolunteersCount(simulatedVolunteers);

    setTimeout(() => {
      setBroadcasting(false);
      setBroadcastSuccess(true);
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Trigger broadcast simulation
    broadcastAlertToRadius({ lat, lng }, radiusKm);

    const newReport: LostDogReport = {
      id: `rep-${Date.now()}`,
      dogId: reportType === 'MY_DOG' ? selectedDogId : undefined,
      tempDogPhoto: reportType === 'FOUND_DOG' ? tempPhoto : undefined,
      reportType,
      status: reportType === 'MY_DOG' ? 'LOST' : 'FOUND',
      species,
      lastKnownLocation: {
        lat,
        lng,
        neighborhood,
        addressText,
      },
      radiusKm,
      createdAt: new Date().toISOString(),
      updatedBy: 'Violencia RIvas',
      description,
      contactPhone,
      rewardAmount: reportType === 'MY_DOG' ? Number(rewardAmount) : undefined,
      dogName: dogName.trim() ? dogName.trim() : (species === 'PERRO' ? 'Mascota' : 'Mascota'),
      breed,
      takesMedication,
      isAggressive: false,
    };

    setTimeout(() => {
      onSubmit(newReport);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-amber-200 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shadow-sm">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Centro de Reporte AMIGO UY
              </h3>
              <p className="text-xs text-slate-600">
                Difunde alertas instantáneas de rescate en Montevideo
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Broadcasting / Success Overlay */}
        {broadcasting && (
          <div className="p-12 text-center space-y-4 animate-in fade-in">
            <Radio className="w-16 h-16 text-orange-500 mx-auto animate-pulse" />
            <h4 className="text-lg font-black text-slate-900">Transmitiendo Alerta a {radiusKm} km...</h4>
            <p className="text-xs text-slate-600">Enviando notificaciones push a voluntarios y refugios cercanos en Montevideo.</p>
          </div>
        )}

        {broadcastSuccess && (
          <div className="p-12 text-center space-y-4 animate-in fade-in">
            <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
            <h4 className="text-xl font-black text-slate-900">¡Alerta Emitida con Éxito!</h4>
            <p className="text-xs font-medium text-slate-700 bg-emerald-50 border border-emerald-200 p-3 rounded-2xl">
              📡 Notificación enviada a <strong>{volunteersCount} voluntarios</strong> en un radio de {radiusKm} km alrededor de {neighborhood}.
            </p>
          </div>
        )}

        {!broadcasting && !broadcastSuccess && reportMode === 'SELECT' && (
          /* STEP 1: PICK OPTION */
          <div className="p-6 space-y-6">
            <div className="text-center">
              <h4 className="text-base font-extrabold text-slate-900">¿Qué tipo de reporte deseas realizar?</h4>
              <p className="text-xs text-slate-500 mt-1">Selecciona una de las dos opciones para comenzar</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setReportType('MY_DOG');
                  setReportMode('FORM');
                }}
                className="p-6 rounded-3xl border-2 border-amber-200 hover:border-orange-500 bg-gradient-to-br from-white to-amber-50/50 hover:shadow-xl transition-all text-left flex flex-col justify-between group"
              >
                <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
                  🚨
                </div>
                <div>
                  <h5 className="text-sm font-black text-slate-900">Perdí a mi mascota</h5>
                  <p className="text-xs text-slate-500 mt-1">Selecciona entre tus mascotas registradas con biometría.</p>
                </div>
              </button>

              <button
                onClick={() => {
                  setReportType('FOUND_DOG');
                  setReportMode('FORM');
                }}
                className="p-6 rounded-3xl border-2 border-amber-200 hover:border-orange-500 bg-gradient-to-br from-white to-amber-50/50 hover:shadow-xl transition-all text-left flex flex-col justify-between group"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
                  🐾
                </div>
                <div>
                  <h5 className="text-sm font-black text-slate-900">Encontré una mascota</h5>
                  <p className="text-xs text-slate-500 mt-1">Sube una foto rápida y marca la ubicación donde la viste.</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {!broadcasting && !broadcastSuccess && reportMode === 'FORM' && (
          /* STEP 2: FORM FIELDS */
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Duplicate report warning banner */}
            {duplicateWarning && (
              <div className="bg-rose-50 border border-rose-300 p-3.5 rounded-2xl flex items-start gap-3 animate-in fade-in">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-xs text-rose-900">
                  <span className="font-extrabold block">⚠️ Advertencia de Duplicado</span>
                  Ya existe un reporte activo a menos de 300 metros en la última hora. Asegúrate de no duplicar alertas innecesarias.
                </div>
              </div>
            )}

            {/* Species Selector */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSpecies('PERRO');
                  setBreed(DOG_BREEDS[0]);
                }}
                className={`py-2 text-xs font-black rounded-xl border transition-all ${
                  species === 'PERRO' ? 'bg-amber-100 border-amber-400 text-amber-900 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                🐶 Perro
              </button>
              <button
                type="button"
                onClick={() => {
                  setSpecies('GATO');
                  setBreed(CAT_BREEDS[0]);
                }}
                className={`py-2 text-xs font-black rounded-xl border transition-all ${
                  species === 'GATO' ? 'bg-amber-100 border-amber-400 text-amber-900 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                🐱 Gato
              </button>
            </div>

            {reportType === 'MY_DOG' && userDogs.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Selecciona tu Mascota Registrada
                </label>
                <select
                  value={selectedDogId}
                  onChange={(e) => {
                    setSelectedDogId(e.target.value);
                    const found = userDogs.find((d) => d.id === e.target.value);
                    if (found) {
                      setDogName(found.name);
                      setBreed(found.breed);
                      setSpecies(found.species);
                      setTakesMedication(found.takesMedication);
                    }
                  }}
                  className="w-full bg-slate-50 border border-amber-200 rounded-2xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-medium"
                >
                  {userDogs.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.breed}) — Biometría: {d.noseprintId}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Photo picker placeholder for Found Dog */}
            {reportType === 'FOUND_DOG' && (
              <div className="border-2 border-dashed border-amber-300 rounded-2xl p-4 text-center bg-amber-50/50 hover:bg-amber-50 transition-colors">
                <Camera className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                <span className="text-xs font-bold text-slate-800 block">Subir foto de la mascota encontrada</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Cámara o galería (Placeholder activo)</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nombre de la Mascota"
                required
                value={dogName}
                onChange={(e) => setDogName(e.target.value)}
              />
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Raza (estimada)</label>
                <select
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  className="w-full bg-slate-50 border border-amber-200 rounded-2xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-medium"
                >
                  {currentBreeds.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Neighborhood / Street address with GPS location picker button */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <Input
                  label="Barrio (Montevideo)"
                  required
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleGpsPick}
                  className="w-full h-12 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-colors border border-amber-300 shadow-sm"
                >
                  <LocateFixed className="w-4 h-4 text-amber-700" />
                  <span>Usar GPS Actual</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Calle / Referencia</label>
              <input
                type="text"
                required
                value={addressText}
                onChange={(e) => setAddressText(e.target.value)}
                className="w-full bg-slate-50 border border-amber-200 rounded-2xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Radio de notificación ({radiusKm} km)
                </label>
                <input
                  type="range"
                  min="1"
                  max="15"
                  step="1"
                  value={radiusKm}
                  onChange={(e) => setRadiusKm(Number(e.target.value))}
                  className="w-full accent-amber-600 bg-slate-100 mt-2"
                />
              </div>
              {reportType === 'MY_DOG' && (
                <Input
                  label="Recompensa (UYU)"
                  type="number"
                  value={rewardAmount}
                  onChange={(e) => setRewardAmount(Number(e.target.value))}
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Detalles adicionales (conducta, collar, notas)
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ej. Muy asustadizo, lleva collar rojo con chapita..."
                className="w-full bg-slate-50 border border-amber-200 rounded-2xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-medium"
              ></textarea>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                checked={takesMedication}
                onChange={(e) => setTakesMedication(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-50 border-amber-300 text-amber-600"
              />
              <span className="text-xs font-bold text-slate-700">¿Requiere medicamento diario?</span>
            </div>

            <Input
              label="Teléfono de contacto"
              required
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
            />

            {/* Submit CTA with broadcast trigger */}
            <div className="pt-2">
              <Button fullWidth type="submit">
                <ShieldAlert className="w-4 h-4" />
                <span>Emitir Alerta a {radiusKm} km</span>
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
