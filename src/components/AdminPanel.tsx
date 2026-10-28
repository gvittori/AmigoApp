import React, { useState, useMemo } from 'react';
import { UserProfile, UserRole } from '../types/amigo';
import { Button } from './ui/Button';
import { Shield, UserPlus, Trash2, Edit3, X, ChevronDown, ChevronUp, Search, Filter } from 'lucide-react';

interface AdminPanelProps {
  users: UserProfile[];
  onUpdateUser: (updatedUser: UserProfile) => void;
  onDeleteUser: (userId: string) => void;
  onCreateUser: (newUser: UserProfile) => void;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  users,
  onUpdateUser,
  onDeleteUser,
  onCreateUser,
  onClose,
}) => {
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [pointsFilter, setPointsFilter] = useState<string>('all');

  // Accordion open/collapse state for groups
  const [expandedSections, setExpandedSections] = useState<{
    estandar: boolean;
    Negocio: boolean;
    Admin: boolean;
  }>({
    estandar: true,
    Negocio: true,
    Admin: true,
  });

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('estandar');
  const [neighborhood, setNeighborhood] = useState('Pocitos, Montevideo');
  const [phone, setPhone] = useState('+598 ');

  const handleStartEdit = (user: UserProfile) => {
    setEditingUser(user);
    setName(user.username);
    setEmail(user.email);
    setPassword(user.password || '');
    setRole(user.role);
    setNeighborhood(user.neighborhood);
    setPhone(user.phone);
    setIsCreating(false);
  };

  const handleStartCreate = () => {
    setEditingUser(null);
    setName('');
    setEmail('');
    setPassword('');
    setRole('estandar');
    setNeighborhood('Montevideo');
    setPhone('+598 ');
    setIsCreating(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCreating) {
      const newUser: UserProfile = {
        id: `usr-${Date.now()}`,
        email: email.trim(),
        password: password || 'Password123',
        username: name.trim(),
        role,
        phone,
        score: role === 'Admin' ? 1000 : role === 'Negocio' ? 500 : 100,
        avatarUrl: role === 'Negocio'
          ? 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        neighborhood,
      };
      onCreateUser(newUser);
      setIsCreating(false);
    } else if (editingUser) {
      const updated: UserProfile = {
        ...editingUser,
        username: name.trim(),
        email: email.trim(),
        password: password || editingUser.password,
        role,
        neighborhood,
        phone,
      };
      onUpdateUser(updated);
      setEditingUser(null);
    }
  };

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // Search query (username or email)
      const matchesSearch =
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase());

      // Role filter
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;

      // Points filter
      let matchesPoints = true;
      if (pointsFilter === 'gt100') matchesPoints = u.score >= 100;
      else if (pointsFilter === 'gt300') matchesPoints = u.score >= 300;
      else if (pointsFilter === 'gt500') matchesPoints = u.score >= 500;

      return matchesSearch && matchesRole && matchesPoints;
    });
  }, [users, searchQuery, roleFilter, pointsFilter]);

  // Group by role in exact required order: estandar first, then Negocio, then Admin
  const standardUsers = useMemo(() => filteredUsers.filter((u) => u.role === 'estandar'), [filteredUsers]);
  const businessUsers = useMemo(() => filteredUsers.filter((u) => u.role === 'Negocio'), [filteredUsers]);
  const adminUsers = useMemo(() => filteredUsers.filter((u) => u.role === 'Admin'), [filteredUsers]);

  const toggleSection = (section: 'estandar' | 'Negocio' | 'Admin') => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-amber-200 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden my-8 animate-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <Shield className="w-6 h-6 text-amber-400" />
            <h2 className="text-lg font-extrabold tracking-tight">Administracion</h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Action Bar & Top controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
              Cuentas ({filteredUsers.length})
            </h3>
            <Button onClick={handleStartCreate} className="flex items-center gap-1.5 text-xs py-2 px-3.5">
              <UserPlus className="w-4 h-4" />
              <span>Nueva Cuenta</span>
            </Button>
          </div>

          {/* Search & Filters Toolbar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre o correo..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="all">Filtrar por rol (Todos)</option>
                <option value="estandar">Estándar</option>
                <option value="Negocio">Negocio (Veterinaria)</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div>
              <select
                value={pointsFilter}
                onChange={(e) => setPointsFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="all">Filtrar por puntos (Todos)</option>
                <option value="gt100">100+ puntos</option>
                <option value="gt300">300+ puntos</option>
                <option value="gt500">500+ puntos</option>
              </select>
            </div>
          </div>

          {/* Edit / Create Form Modal embedded */}
          {(isCreating || editingUser) && (
            <form onSubmit={handleSave} className="mb-6 p-4 bg-amber-50/70 border border-amber-200 rounded-2xl">
              <h4 className="text-xs font-black text-amber-900 uppercase mb-3">
                {isCreating ? '➕ Crear Nueva Cuenta' : `✏️ Editando: ${editingUser?.username}`}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Nombre / Razón Social</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nombre"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Correo (Username)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Contraseña</label>
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Tipo (Rol)</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
                  >
                    <option value="estandar">Estándar</option>
                    <option value="Negocio">Negocio (Veterinaria)</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Barrio / Ubicación</label>
                  <input
                    type="text"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => { setIsCreating(false); setEditingUser(null); }}
                  className="text-xs py-1.5"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="text-xs py-1.5">
                  {isCreating ? 'Guardar Nuevo' : 'Actualizar Cambios'}
                </Button>
              </div>
            </form>
          )}

          {/* Account Sections (Expandable Areas: Standard first, then Business, then Admins) */}
          <div className="space-y-4">
            
            {/* 1. Standard Accounts */}
            <div className="border border-amber-200 rounded-2xl overflow-hidden bg-white shadow-sm">
              <button
                onClick={() => toggleSection('estandar')}
                className="w-full px-4 py-3 bg-amber-50/80 hover:bg-amber-100/70 flex items-center justify-between text-left transition"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-amber-900">
                    Cuentas Estándar ({standardUsers.length})
                  </span>
                </div>
                {expandedSections.estandar ? <ChevronUp className="w-4 h-4 text-amber-800" /> : <ChevronDown className="w-4 h-4 text-amber-800" />}
              </button>

              {expandedSections.estandar && (
                <div className="p-3">
                  {standardUsers.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-3">No hay cuentas estándar que coincidan con la búsqueda.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase text-[10px]">
                            <th className="p-2.5">Usuario</th>
                            <th className="p-2.5">Correo</th>
                            <th className="p-2.5">Ubicación</th>
                            <th className="p-2.5">Puntos</th>
                            <th className="p-2.5 text-right">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {standardUsers.map((u) => (
                            <tr key={u.id} className="hover:bg-slate-50 transition">
                              <td className="p-2.5 flex items-center gap-2 font-bold text-slate-900">
                                <img src={u.avatarUrl} alt="" className="w-7 h-7 rounded-full object-cover border border-amber-300" />
                                <div>
                                  <div>{u.username}</div>
                                  <div className="text-[9px] text-slate-400 font-normal">{u.phone}</div>
                                </div>
                              </td>
                              <td className="p-2.5 font-mono text-slate-600">{u.email}</td>
                              <td className="p-2.5 text-slate-600">{u.neighborhood}</td>
                              <td className="p-2.5 font-bold text-amber-700">{u.score} ★</td>
                              <td className="p-2.5 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <button onClick={() => handleStartEdit(u)} className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition" title="Editar">
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button onClick={() => { if (confirm(`¿Eliminar usuario ${u.username}?`)) onDeleteUser(u.id); }} className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition" title="Eliminar">
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 2. Business Accounts */}
            <div className="border border-emerald-200 rounded-2xl overflow-hidden bg-white shadow-sm">
              <button
                onClick={() => toggleSection('Negocio')}
                className="w-full px-4 py-3 bg-emerald-50/80 hover:bg-emerald-100/70 flex items-center justify-between text-left transition"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-900">
                    Cuentas de Negocio / Veterinarias ({businessUsers.length})
                  </span>
                </div>
                {expandedSections.Negocio ? <ChevronUp className="w-4 h-4 text-emerald-800" /> : <ChevronDown className="w-4 h-4 text-emerald-800" />}
              </button>

              {expandedSections.Negocio && (
                <div className="p-3">
                  {businessUsers.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-3">No hay cuentas de negocio que coincidan con la búsqueda.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase text-[10px]">
                            <th className="p-2.5">Negocio</th>
                            <th className="p-2.5">Correo</th>
                            <th className="p-2.5">Ubicación</th>
                            <th className="p-2.5">Puntos</th>
                            <th className="p-2.5 text-right">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {businessUsers.map((u) => (
                            <tr key={u.id} className="hover:bg-slate-50 transition">
                              <td className="p-2.5 flex items-center gap-2 font-bold text-slate-900">
                                <img src={u.avatarUrl} alt="" className="w-7 h-7 rounded-full object-cover border border-emerald-300" />
                                <div>
                                  <div>{u.username}</div>
                                  <div className="text-[9px] text-slate-400 font-normal">{u.phone}</div>
                                </div>
                              </td>
                              <td className="p-2.5 font-mono text-slate-600">{u.email}</td>
                              <td className="p-2.5 text-slate-600">{u.neighborhood}</td>
                              <td className="p-2.5 font-bold text-emerald-700">{u.score} ★</td>
                              <td className="p-2.5 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <button onClick={() => handleStartEdit(u)} className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition" title="Editar">
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button onClick={() => { if (confirm(`¿Eliminar negocio ${u.username}?`)) onDeleteUser(u.id); }} className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition" title="Eliminar">
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 3. Admin Accounts */}
            <div className="border border-purple-200 rounded-2xl overflow-hidden bg-white shadow-sm">
              <button
                onClick={() => toggleSection('Admin')}
                className="w-full px-4 py-3 bg-purple-50/80 hover:bg-purple-100/70 flex items-center justify-between text-left transition"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-purple-900">
                    Cuentas de Administrador ({adminUsers.length})
                  </span>
                </div>
                {expandedSections.Admin ? <ChevronUp className="w-4 h-4 text-purple-800" /> : <ChevronDown className="w-4 h-4 text-purple-800" />}
              </button>

              {expandedSections.Admin && (
                <div className="p-3">
                  {adminUsers.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-3">No hay cuentas admin que coincidan con la búsqueda.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase text-[10px]">
                            <th className="p-2.5">Administrador</th>
                            <th className="p-2.5">Correo</th>
                            <th className="p-2.5">Ubicación</th>
                            <th className="p-2.5">Puntos</th>
                            <th className="p-2.5 text-right">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {adminUsers.map((u) => (
                            <tr key={u.id} className="hover:bg-slate-50 transition">
                              <td className="p-2.5 flex items-center gap-2 font-bold text-slate-900">
                                <img src={u.avatarUrl} alt="" className="w-7 h-7 rounded-full object-cover border border-purple-300" />
                                <div>
                                  <div>{u.username}</div>
                                  <div className="text-[9px] text-slate-400 font-normal">{u.phone}</div>
                                </div>
                              </td>
                              <td className="p-2.5 font-mono text-slate-600">{u.email}</td>
                              <td className="p-2.5 text-slate-600">{u.neighborhood}</td>
                              <td className="p-2.5 font-bold text-purple-700">{u.score} ★</td>
                              <td className="p-2.5 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <button onClick={() => handleStartEdit(u)} className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition" title="Editar">
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button onClick={() => { if (confirm(`¿Eliminar admin ${u.username}?`)) onDeleteUser(u.id); }} className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition" title="Eliminar">
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
