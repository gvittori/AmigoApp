import React from 'react';
import { UserProfile } from '../types/amigo';
import { Award, ShieldAlert } from 'lucide-react';

interface NavbarProps {
  currentUser: UserProfile;
  onOpenProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenProfile,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/60 px-4 py-3 flex items-center justify-between shadow-sm">
      {/* Zone 1: Brand Wordmark */}
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center shadow-lg shadow-amber-500/25">
          <ShieldAlert className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
            AMIGO
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
              URUGUAY 🇺🇾
            </span>
          </h1>
        </div>
      </div>

      {/* Zone 2: Subtitle for desktop */}
      <div className="hidden md:flex items-center gap-6 text-xs text-slate-600 font-medium">
        <span>Red comunitaria de rescate y recuperación de mascotas y animales perdidos</span>
      </div>

      {/* Zone 3: Actions */}
      <div className="flex items-center gap-2.5">
        {/* Rescue Stars Badge */}
        <button
          onClick={onOpenProfile}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100/70 border border-amber-300 text-amber-900 text-xs font-extrabold hover:bg-amber-200 transition-colors shadow-sm"
        >
          <Award className="w-4 h-4 text-amber-600" />
          <span>{currentUser.score} ★</span>
        </button>

        {/* User Avatar */}
        <button
          onClick={onOpenProfile}
          className="w-9 h-9 rounded-full overflow-hidden border-2 border-amber-400 hover:border-amber-500 transition-colors focus:outline-none shadow-sm"
        >
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.username}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </button>
      </div>
    </header>
  );
};
