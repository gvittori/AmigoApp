import React from 'react';
import { Users, Heart, Award, Shield, Sparkles, MessageCircle, Share2 } from 'lucide-react';

export const CommunityView: React.FC = () => {
  const communityPosts = [
    {
      id: 'p1',
      author: 'Dr. Martín Gómez',
      role: 'Negocio (Pocitos Vet)',
      avatar: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=150&auto=format&fit=crop&q=80',
      time: 'Hace 2 horas',
      content: '¡Gracias a la red AMIGO pudimos vacunar y entregar alimento balanceado al refugio temporal de Malvín. ¡La solidaridad en Montevideo es increíble!',
      likes: 48,
      comments: 12,
    },
    {
      id: 'p2',
      author: 'Sofía Martínez',
      role: 'Rescatista Estándar',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      time: 'Hace 5 horas',
      content: 'Buscando a "Negrito" por la zona de Parque Rodó. Si alguien lo ve por la rambla por favor avisen al chat o al 099 123 456.',
      likes: 31,
      comments: 8,
    },
    {
      id: 'p3',
      author: 'Federico Silva',
      role: 'Coordinador Barrial',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      time: 'Ayer',
      content: 'Recordatorio para todos los vecinos de Carrasco: hoy a las 18:00 hrs realizamos la charla informativa sobre prevención de mascotas extraviadas en verano.',
      likes: 64,
      comments: 19,
    },
  ];

  return (
    <div className="w-full min-h-[calc(100vh-130px)] bg-gradient-to-br from-amber-50/80 via-orange-50/30 to-rose-50/40 pb-28 px-4 py-6 max-w-4xl mx-auto">
      <div className="bg-white/90 backdrop-blur-xl border border-amber-200/80 rounded-3xl p-6 shadow-xl mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-white font-extrabold text-[10px] uppercase tracking-wider">
            Comunidad Activa 🇺🇾
          </span>
        </div>
        <h2 className="text-2xl font-black text-slate-900">Red de Apoyo y Rescate</h2>
        <p className="text-xs text-slate-600 mt-1">
          Conecta con vecinos, rescatistas y veterinarias colaboradoras en Montevideo y todo Uruguay.
        </p>
      </div>

      <div className="grid gap-4">
        {communityPosts.map((post) => (
          <div key={post.id} className="bg-white/95 backdrop-blur-xl border border-amber-200/80 rounded-3xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full object-cover border-2 border-amber-300" />
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">{post.author}</h4>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    {post.role}
                  </span>
                </div>
              </div>
              <span className="text-xs text-slate-400">{post.time}</span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed mb-4 font-medium">
              {post.content}
            </p>

            <div className="flex items-center gap-4 pt-3 border-t border-amber-100 text-xs font-bold text-slate-600">
              <button className="flex items-center gap-1 hover:text-rose-600 transition">
                <Heart className="w-4 h-4 text-rose-500" />
                <span>{post.likes} Me gusta</span>
              </button>
              <button className="flex items-center gap-1 hover:text-amber-600 transition">
                <MessageCircle className="w-4 h-4 text-amber-600" />
                <span>{post.comments} Comentarios</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
