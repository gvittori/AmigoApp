import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types/amigo';
import { Button } from './ui/Button';
import { Shield, Mail, Lock, Eye, EyeOff, User, ArrowRight, Sparkles, Building2, UserCheck, KeyRound } from 'lucide-react';
import logoAmigo from '../assets/images/amigoLogo2.jpg';

interface LoginScreenProps {
  users: UserProfile[];
  initialEmail?: string;
  initialPassword?: string;
  onLogin: (user: UserProfile, emailEntered?: string, passwordEntered?: string) => void;
  onRegister: (newUser: UserProfile) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  users,
  initialEmail = 'asuarez@gmail.com',
  initialPassword = 'Asuarez1',
  onLogin,
  onRegister,
}) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState(initialPassword);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Registration fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('+598 ');
  const [regNeighborhood, setRegNeighborhood] = useState('Pocitos, Montevideo');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const found = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!found) {
      setErrorMsg('No se encontró ninguna cuenta con este correo.');
      return;
    }

    if (found.password && found.password !== password) {
      setErrorMsg('Contraseña incorrecta.');
      return;
    }

    onLogin(found, email, password);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!regName || !regEmail || !regPassword) {
      setErrorMsg('Por favor completa todos los campos obligatorios.');
      return;
    }

    const existing = users.find(u => u.email.toLowerCase() === regEmail.trim().toLowerCase());
    if (existing) {
      setErrorMsg('Ya existe una cuenta con este correo electrónico.');
      return;
    }

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      email: regEmail.trim(),
      password: regPassword,
      username: regName.trim(),
      role: 'estandar',
      phone: regPhone || '+598 99 000 000',
      score: 50,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      neighborhood: regNeighborhood || 'Montevideo',
    };

    onRegister(newUser);
    onLogin(newUser, regEmail, regPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/50 to-amber-100/60 flex items-center justify-center p-4 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-xl border border-amber-200/80 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 animate-in fade-in zoom-in-95">
        
        {/* Header & Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-amber-100 border-2 border-amber-300 shadow-inner mb-3 overflow-hidden">
            <img src={logoAmigo} alt="AMIGO" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center gap-2">
            AMIGO
          </h1>
          <p className="text-xs text-slate-600 mt-1 font-medium">
            Red comunitaria inteligente de rescate y recuperación de mascotas
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex bg-amber-100/60 p-1 rounded-2xl mb-6 border border-amber-200">
          <button
            type="button"
            onClick={() => { setIsRegistering(false); setErrorMsg(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              !isRegistering ? 'bg-white text-amber-900 shadow-md' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => { setIsRegistering(true); setErrorMsg(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              isRegistering ? 'bg-white text-amber-900 shadow-md' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Crear Cuenta
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-medium animate-in shake">
            {errorMsg}
          </div>
        )}

        {!isRegistering ? (
          /* LOGIN FORM */
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Correo electrónico (Usuario)
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ej. asuarez@gmail.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Contraseña
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Por favor contacta a soporte."); }} className="text-[11px] font-semibold text-amber-600 hover:underline">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-11 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs py-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input type="checkbox" defaultChecked className="rounded border-slate-300 text-amber-600 focus:ring-amber-400" />
                <span>Recordar mi sesión</span>
              </label>
            </div>

            <Button type="submit" className="w-full py-3 rounded-2xl font-extrabold text-sm shadow-lg">
              <span>Ingresar</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>
        ) : (
          /* REGISTRATION FORM */
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nombre completo
              </label>
              <input
                type="text"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="ej. Ana Suárez"
                required
                className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Correo electrónico (Usuario)
              </label>
              <input
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="ej. usuario@correo.com"
                required
                className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono</label>
                <input
                  type="text"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Zona / Barrio</label>
                <input
                  type="text"
                  value={regNeighborhood}
                  onChange={(e) => setRegNeighborhood(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-semibold"
                />
              </div>
            </div>

            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 font-medium">
              Para cuentas de Negocio o Veterinarias, contactar a la administracion.
            </div>

            <Button type="submit" className="w-full py-3 rounded-2xl font-extrabold text-sm shadow-lg mt-2">
              Crear Cuenta y Entrar
            </Button>
          </form>
        )}

      </div>
    </div>
  );
};
