import React from 'react';
import { UserProfile } from '../types/amigo';
import { Shield, LogOut } from 'lucide-react';
import logoAmigo from '../assets/images/logoAmigo.jpg';

interface NavbarProps {
  currentUser: UserProfile;
  onOpenProfile: () => void;
  onOpenAdminPanel?: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenProfile,
  onOpenAdminPanel,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/60 px-4 py-3 flex items-center justify-between shadow-sm">
      {/* Zone 1: Brand Wordmark */}
      <div className="flex items-center gap-2.5">
        <img
          src={logoAmigo}
          alt="AMIGO"
          className="w-10 h-10 rounded-2xl object-cover shadow-md border border-amber-200"
        />
        <div>
          <h1 className="text-lg font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
            AMIGO
          </h1>
          <div className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
            <span>{currentUser.username}</span>
            {currentUser.role !== 'Admin' && (
              <span className={`px-1.5 py-0.2 rounded text-[9px] uppercase font-black ${
                currentUser.role === 'Negocio'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {currentUser.role}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Zone 2: Subtitle for desktop */}
      <div className="hidden lg:flex items-center gap-6 text-xs text-slate-600 font-medium">
        <span>Red comunitaria de rescate y recuperación de mascotas</span>
      </div>

      {/* Zone 3: Actions */}
      <div className="flex items-center gap-2">
        {currentUser.role === 'Admin' && onOpenAdminPanel && (
          <button
            onClick={onOpenAdminPanel}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-100 border border-purple-300 text-purple-900 text-xs font-extrabold hover:bg-purple-200 transition shadow-sm"
            title="Panel de Administración"
          >
            <Shield className="w-4 h-4 text-purple-700" />
            <span className="hidden sm:inline">Admin</span>
          </button>
        )}

        {/* User Avatar */}
        <button
          onClick={onOpenProfile}
          className="w-9 h-9 rounded-full overflow-hidden border-2 border-amber-400 hover:border-amber-500 transition-colors focus:outline-none shadow-sm"
          title="Ver Perfil"
        >
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.username}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </button>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="p-2 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 transition"
          title="Cerrar Sesión"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
