import React from 'react';
import { Building2, Phone, MapPin, Clock, Star, ShieldCheck } from 'lucide-react';

export const BusinessesView: React.FC = () => {
  const businesses = [
    {
      id: 'b1',
      name: 'Clínica Veterinaria Pocitos',
      category: 'Veterinaria 24hs & Urgencias',
      address: 'Bv. España 2715, Pocitos, Montevideo',
      phone: '+598 2709 1234',
      hours: 'Abierto 24 Horas',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=400&auto=format&fit=crop&q=80',
      verified: true,
    },
    {
      id: 'b2',
      name: 'Veterinaria Carrasco Express',
      category: 'Clínica & Pet Shop',
      address: 'Arocena 1650, Carrasco, Montevideo',
      phone: '+598 2600 5678',
      hours: 'Lun a Sáb: 08:00 - 20:00',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400&auto=format&fit=crop&q=80',
      verified: true,
    },
    {
      id: 'b3',
      name: 'Refugio & Veterinaria Punta Carretas',
      category: 'Rescate & Adopción',
      address: 'Ellauri 500, Punta Carretas, Montevideo',
      phone: '+598 2711 9988',
      hours: 'Lun a Dom: 09:00 - 18:00',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=400&auto=format&fit=crop&q=80',
      verified: true,
    },
  ];

  return (
    <div className="w-full min-h-[calc(100vh-130px)] bg-gradient-to-br from-amber-50/80 via-orange-50/30 to-rose-50/40 pb-28 px-4 py-6 max-w-4xl mx-auto">
      <div className="bg-white/90 backdrop-blur-xl border border-amber-200/80 rounded-3xl p-6 shadow-xl mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-extrabold text-[10px] uppercase tracking-wider">
            Directorio de Negocios 🇺🇾
          </span>
        </div>
        <h2 className="text-2xl font-black text-slate-900">Veterinarias y Negocios Colaboradores</h2>
        <p className="text-xs text-slate-600 mt-1">
          Clínicas veterinarias, refugios y comercios afiliados a la red de rescate AMIGO en Uruguay.
        </p>
      </div>

      <div className="grid gap-4">
        {businesses.map((biz) => (
          <div key={biz.id} className="bg-white/95 backdrop-blur-xl border border-amber-200/80 rounded-3xl p-5 shadow-lg flex flex-col sm:flex-row gap-4 items-start">
            <img src={biz.image} alt={biz.name} className="w-full sm:w-32 h-32 rounded-2xl object-cover border border-amber-200 shadow-inner" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-1.5">
                  <span>{biz.name}</span>
                  {biz.verified && <ShieldCheck className="w-4 h-4 text-emerald-600" />}
                </h3>
                <span className="flex items-center gap-1 text-xs font-black text-amber-700 bg-amber-100 px-2.5 py-1 rounded-xl">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{biz.rating}</span>
                </span>
              </div>

              <span className="inline-block mt-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {biz.category}
              </span>

              <div className="mt-3 space-y-1.5 text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{biz.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="font-bold text-slate-800">{biz.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{biz.hours}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-amber-100 flex items-center justify-end">
                <a
                  href={`tel:${biz.phone}`}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-md flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Llamar ahora</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
