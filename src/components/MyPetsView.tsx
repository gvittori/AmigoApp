import React, { useState } from 'react';
import { DogProfile, UserProfile, PetSpecies } from '../types/amigo';
import { DOG_BREEDS, CAT_BREEDS } from '../data/mockData';
import { Award, Plus, Phone, AlertTriangle, Pill, ShieldCheck, ChevronRight, Check } from 'lucide-react';
import { Input } from './ui/Input';
import { Switch } from './ui/Switch';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface MyPetsViewProps {
  currentUser: UserProfile;
  userDogs: DogProfile[];
  onAddDog: (dog: DogProfile) => void;
}

export const MyPetsView: React.FC<MyPetsViewProps> = ({
  currentUser,
  userDogs,
  onAddDog,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [formStep, setFormStep] = useState(1);

  // Form state
  const [newName, setNewName] = useState('');
  const [species, setSpecies] = useState<PetSpecies>('PERRO');
  const [newBreed, setNewBreed] = useState(DOG_BREEDS[0]);
  const [newAge, setNewAge] = useState('2 años');
  const [takesMeds, setTakesMeds] = useState(false);
  const [isAggressive, setIsAggressive] = useState(false);
  const [contactPhone, setContactPhone] = useState(currentUser.phone);

  const currentBreeds = species === 'PERRO' ? DOG_BREEDS : CAT_BREEDS;

  const handleRegisterDog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newBreed.trim()) return;

    const newDog: DogProfile = {
      id: `dog-${Date.now()}`,
      ownerId: currentUser.id,
      name: newName,
      species,
      breed: newBreed,
      age: newAge,
      takesMedication: takesMeds,
      isAggressive,
      photoUrl: species === 'PERRO' ? 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80',
      noseprintId: `NP-MVD-${Math.floor(1000 + Math.random() * 9000)}`,
      color: species === 'PERRO' ? 'Dorado' : 'Beige',
      gender: 'Macho',
    };

    onAddDog(newDog);
    setNewName('');
    setFormStep(1);
    setShowAddModal(false);
  };

  return (
    <div className="w-full min-h-[calc(100vh-130px)] bg-gradient-to-br from-amber-50/80 via-orange-50/30 to-rose-50/40 pb-28 px-4 py-6 max-w-4xl mx-auto relative overflow-hidden">
      {/* Decorative ambient background blobs */}
      <div className="absolute top-12 right-[-5%] w-72 h-72 rounded-full bg-amber-400/10 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-12 left-[-5%] w-80 h-80 rounded-full bg-rose-400/10 blur-3xl pointer-events-none"></div>

      {/* User profile summary banner */}
      <Card className="relative z-10 mb-8 flex flex-col sm:flex-row items-center gap-6 bg-white/90 backdrop-blur-xl border border-amber-200/80 shadow-xl shadow-amber-500/5">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-amber-400 shrink-0 shadow-md">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.username}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white font-extrabold text-[10px] tracking-wider uppercase shadow-sm">
              Dueño Verificado 🇺🇾
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900">{currentUser.username}</h2>
          <p className="text-xs text-slate-600 mt-0.5">{currentUser.neighborhood} (Uruguay)</p>
          <div className="flex items-center justify-center sm:justify-start gap-3 mt-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-100 border border-amber-300 text-amber-900 text-xs font-extrabold shadow-sm">
              <Award className="w-4 h-4 text-amber-600" />
              <span>{currentUser.score} Estrellas de Rescate</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold">
              <Phone className="w-3.5 h-3.5 text-amber-600" />
              <span>{currentUser.phone}</span>
            </span>
          </div>
        </div>

        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4" />
          <span>Registrar Mascota</span>
        </Button>
      </Card>

      {/* Pets list header */}
      <div className="relative z-10 flex items-center justify-between mb-4">
        <h3 className="text-lg font-black text-slate-900">
          Mis Mascotas Registradas y Biometría Nasal
        </h3>
        <span className="text-xs font-extrabold text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-200 shadow-sm">
          {userDogs.length} Mascotas
        </span>
      </div>

      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {userDogs.map((dog) => (
          <Card key={dog.id} className="relative overflow-hidden group bg-white/90 backdrop-blur-xl border border-amber-200/80 shadow-lg shadow-amber-500/5 hover:shadow-xl transition-all">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-200 shrink-0 bg-amber-50 shadow-inner">
                <img
                  src={dog.photoUrl}
                  alt={dog.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-black text-slate-900 truncate flex items-center gap-1.5">
                    <span>{dog.species === 'GATO' ? '🐱' : '🐶'}</span>
                    <span>{dog.name}</span>
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200 font-bold">
                    {dog.noseprintId}
                  </span>
                </div>

                <div className="text-xs text-slate-600 mt-1 font-medium">
                  <span>{dog.breed}</span> · <span>{dog.age}</span>
                </div>

                {/* Warning tags & badges */}
                <div className="flex flex-wrap items-center gap-1.5 mt-3">
                  {dog.takesMedication && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-lg bg-purple-100 text-purple-900 border border-purple-200 shadow-sm">
                      <Pill className="w-3 h-3 text-purple-700" />
                      Medicamento diario
                    </span>
                  )}
                  {dog.isAggressive && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-lg bg-rose-100 text-rose-900 border border-rose-200 animate-pulse shadow-sm">
                      <AlertTriangle className="w-3 h-3 text-rose-700" />
                      Precaución / Asustadizo
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-lg bg-amber-100 text-amber-900 border border-amber-200 shadow-sm">
                    <ShieldCheck className="w-3 h-3 text-amber-700" />
                    Huella Nasal Activa
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Progressive Disclosure Modal for Registering/Editing Pet Profile */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-amber-200 rounded-3xl w-full max-w-lg p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-amber-100">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Registrar Perfil de Mascota
                </h3>
                <p className="text-xs text-slate-500">Paso {formStep} de 3 — Progressive Disclosure</p>
              </div>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setFormStep(1);
                }}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:text-slate-900 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterDog} className="space-y-4">
              {/* Step 1: Species & Basic Name */}
              {formStep === 1 && (
                <div className="space-y-4 animate-in fade-in">
                  <label className="block text-xs font-bold text-slate-700">1. Selecciona la Especie</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSpecies('PERRO');
                        setNewBreed(DOG_BREEDS[0]);
                      }}
                      className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                        species === 'PERRO' ? 'bg-amber-100 border-amber-500 text-amber-900 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      <span className="text-2xl">🐶</span>
                      <span className="text-xs font-black">Perro / Dog</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSpecies('GATO');
                        setNewBreed(CAT_BREEDS[0]);
                      }}
                      className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                        species === 'GATO' ? 'bg-amber-100 border-amber-500 text-amber-900 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      <span className="text-2xl">🐱</span>
                      <span className="text-xs font-black">Gato / Cat</span>
                    </button>
                  </div>

                  <Input
                    label="Nombre de la Mascota"
                    required
                    placeholder="Ej. Simón, Lola, Michi..."
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />

                  <div className="flex justify-end pt-2">
                    <Button
                      type="button"
                      onClick={() => {
                        if (newName.trim()) setFormStep(2);
                      }}
                    >
                      <span>Siguiente</span>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Breed & Age */}
              {formStep === 2 && (
                <div className="space-y-4 animate-in fade-in">
                  <label className="block text-xs font-bold text-slate-700">2. Raza y Edad</label>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Raza</label>
                    <select
                      value={newBreed}
                      onChange={(e) => setNewBreed(e.target.value)}
                      className="w-full bg-slate-50 border border-amber-200 rounded-2xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-medium"
                    >
                      {currentBreeds.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  <Input
                    label="Edad"
                    value={newAge}
                    onChange={(e) => setNewAge(e.target.value)}
                    placeholder="Ej. 3 años"
                  />

                  <div className="flex justify-between pt-2">
                    <Button type="button" variant="outline" onClick={() => setFormStep(1)}>
                      Atrás
                    </Button>
                    <Button type="button" onClick={() => setFormStep(3)}>
                      <span>Siguiente: Salud y Conducta</span>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Medication & Aggressive Toggles (with warning badges) */}
              {formStep === 3 && (
                <div className="space-y-4 animate-in fade-in">
                  <label className="block text-xs font-bold text-slate-700">3. Requisitos Médicos y Conducta</label>
                  
                  <Switch
                    checked={takesMeds}
                    onChange={setTakesMeds}
                    label="¿Toma medicamentos diarios?"
                    description="Indicar si requiere tratamiento veterinario constante."
                  />

                  <Switch
                    checked={isAggressive}
                    onChange={setIsAggressive}
                    label="¿Es muy asustadizo / defensivo con extraños?"
                    description="Muestra una alerta visual de precaución para los rescatistas."
                    warningVariant={true}
                  />

                  <Input
                    label="Teléfono de Contacto del Dueño"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                  />

                  <div className="flex justify-between pt-2">
                    <Button type="button" variant="outline" onClick={() => setFormStep(2)}>
                      Atrás
                    </Button>
                    <Button type="submit">
                      <Check className="w-4 h-4" />
                      <span>Guardar Perfil Biométrico</span>
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
