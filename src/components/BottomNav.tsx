import React from 'react';
import { MapPin, Radio, PlusCircle, Heart, Bot } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'map' | 'feed' | 'report' | 'mypets' | 'assistant';
  setActiveTab: (tab: 'map' | 'feed' | 'report' | 'mypets' | 'assistant') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const tabs = [
    { id: 'map', label: 'Mapa', icon: MapPin },
    { id: 'feed', label: 'Reportes', icon: Radio },
    { id: 'report', label: 'Reportar', icon: PlusCircle, isAction: true },
    { id: 'mypets', label: 'Mis Mascotas', icon: Heart },
    { id: 'assistant', label: 'Asistente IA', icon: Bot },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-amber-200/80 pb-safe shadow-lg">
      <div className="grid grid-cols-5 items-center h-16 px-2 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.isAction) {
            return (
              <div key={tab.id} className="flex justify-center -mt-6">
                <button
                  onClick={() => setActiveTab('report')}
                  className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 to-rose-600 text-white flex items-center justify-center shadow-xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-transform focus:outline-none ring-4 ring-white"
                  title="Reportar Mascota"
                >
                  <Icon className="w-7 h-7" />
                </button>
              </div>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex flex-col items-center justify-center py-1 transition-colors ${
                isActive ? 'text-amber-600 font-extrabold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.75px]'}`} />
              <span className="text-[10px] tracking-tight truncate max-w-[65px]">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
