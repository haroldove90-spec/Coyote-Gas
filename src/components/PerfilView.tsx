import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  User, Smartphone, Key, Lock, Camera, CheckCircle, 
  ArrowLeft, UploadCloud, RefreshCw
} from 'lucide-react';
import { Vendedor } from '../types';
import { AdminProfile } from '../dataStore';

interface PerfilViewProps {
  role: 'admin' | 'vendedor';
  adminProfile?: AdminProfile;
  activeVendedor?: Vendedor;
  onSaveAdmin: (updated: AdminProfile) => void;
  onSaveVendedor: (updated: Vendedor) => void;
  onBack: () => void;
}

export function PerfilView({
  role,
  adminProfile,
  activeVendedor,
  onSaveAdmin,
  onSaveVendedor,
  onBack
}: PerfilViewProps) {
  // Identify who we are editing
  const isVendedor = role === 'vendedor';
  
  // Set initial states accordingly
  const [nombre, setNombre] = useState(isVendedor ? (activeVendedor?.nombre || '') : (adminProfile?.nombre || ''));
  const [telefono, setTelefono] = useState(isVendedor ? (activeVendedor?.telefono || '') : (adminProfile?.telefono || ''));
  const [usuario, setUsuario] = useState(isVendedor ? (activeVendedor?.usuario || '') : (adminProfile?.usuario || ''));
  const [contrasena, setContrasena] = useState(isVendedor ? (activeVendedor?.contrasena || '') : (adminProfile?.contrasena || ''));
  const [fotoPerfil, setFotoPerfil] = useState<string>(isVendedor ? (activeVendedor?.fotoPerfil || '') : (adminProfile?.fotoPerfil || ''));

  const [dragActive, setDragActive] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convert uploaded image to base64
  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setFotoPerfil(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (nombre.trim() === '' || telefono.trim() === '') return;

    if (isVendedor && activeVendedor) {
      onSaveVendedor({
        ...activeVendedor,
        nombre: nombre.trim(),
        telefono: telefono.trim(),
        usuario: usuario.trim(),
        contrasena: contrasena.trim(),
        fotoPerfil: fotoPerfil
      });
    } else if (!isVendedor && adminProfile) {
      onSaveAdmin({
        ...adminProfile,
        nombre: nombre.trim(),
        telefono: telefono.trim(),
        usuario: usuario.trim(),
        contrasena: contrasena.trim(),
        fotoPerfil: fotoPerfil
      });
    }

    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3500);
  };

  // Pre-seeded nice geometric colors for initials fallback
  const getInitials = (str: string) => {
    return str.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 pb-16 font-sans space-y-6">
      
      {/* Back button & Header title */}
      <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-xl transition-all text-[#305975]"
            title="Regresar"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-black text-[#305975] uppercase tracking-tight">Mi Perfil Personal</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
              Rol Activo: {isVendedor ? 'Operador Comercial' : 'Administrador Coyote'}
            </p>
          </div>
        </div>

        <span className="text-[10px] bg-[#305975]/10 text-[#305975] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
          {isVendedor ? (activeVendedor?.nombre.split('(')[1]?.replace(')', '') || 'Ruta') : 'Control Central'}
        </span>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Profile Picture Uploader (Left Column - Column Span 4) */}
        <div className="md:col-span-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center justify-center space-y-4 text-center">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Fotografía de Perfil</span>
          
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-slate-100 group shadow-md flex items-center justify-center bg-[#305975]/10 text-[#305975]">
            {fotoPerfil ? (
              <img 
                src={fotoPerfil} 
                alt="Foto de Perfil" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="text-3xl font-black">{getInitials(nombre || 'CY')}</span>
            )}

            <button
              type="button"
              onClick={triggerFileInput}
              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold cursor-pointer"
            >
              <Camera className="w-5 h-5 mb-1" />
              <span>Cambiar Foto</span>
            </button>
          </div>

          {/* Drag & Drop Area */}
          <div 
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={triggerFileInput}
            className={`w-full p-4 border-2 border-dashed rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
              dragActive 
                ? 'border-[#7294A0] bg-[#7294A0]/5' 
                : 'border-slate-200 hover:border-[#7294A0] hover:bg-slate-50'
            }`}
          >
            <UploadCloud className="w-5 h-5 text-gray-400" />
            <span className="text-[10px] font-bold text-gray-600 block">Suelte una foto aquí o haga clic</span>
            <span className="text-[8px] text-gray-400 block">PNG, JPG (máx. 2MB)</span>
            
            <input 
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {fotoPerfil && (
            <button
              type="button"
              onClick={() => setFotoPerfil('')}
              className="text-[10px] text-red-500 hover:underline font-bold"
            >
              Remover Foto
            </button>
          )}
        </div>

        {/* Configuration details (Right Column - Column Span 8) */}
        <div className="md:col-span-8 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block border-b pb-2 mb-2">Información de la Cuenta</span>
          
          <div className="space-y-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 tracking-wider uppercase mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#7294A0]" /> Nombre Completo
              </label>
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full p-2.5 text-sm bg-slate-50 border border-gray-200 rounded-xl focus:border-[#7294A0] focus:ring-1 focus:ring-[#7294A0] focus:outline-none"
              />
            </div>

            {/* WhatsApp Phone */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 tracking-wider uppercase mb-1 flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5 text-[#7294A0]" /> Celular WhatsApp (10 dígitos)
              </label>
              <input
                type="tel"
                required
                pattern="[0-9]{10}"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="w-full p-2.5 text-sm bg-slate-50 border border-gray-200 rounded-xl focus:border-[#7294A0] focus:ring-1 focus:ring-[#7294A0] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Username */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 tracking-wider uppercase mb-1 flex items-center gap-1">
                  <Key className="w-3.5 h-3.5 text-[#7294A0]" /> Nombre de Usuario
                </label>
                <input
                  type="text"
                  required
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  className="w-full p-2.5 text-sm bg-slate-50 border border-gray-200 rounded-xl focus:border-[#7294A0] focus:ring-1 focus:ring-[#7294A0] focus:outline-none font-mono text-xs text-slate-700"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 tracking-wider uppercase mb-1 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-[#7294A0]" /> Contraseña de Acceso
                </label>
                <input
                  type="text"
                  required
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  className="w-full p-2.5 text-sm bg-slate-50 border border-gray-200 rounded-xl focus:border-[#7294A0] focus:ring-1 focus:ring-[#7294A0] focus:outline-none font-mono text-xs text-slate-700"
                />
              </div>
            </div>

          </div>

          <div className="pt-4 border-t flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#305975] hover:bg-[#25465e] text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-[0.98] uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Guardar Cambios
            </button>
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center"
            >
              Cancelar
            </button>
          </div>

          {showToast && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-xs font-medium flex items-center gap-2 mt-4"
            >
              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>¡Perfil actualizado con éxito! Cambios guardados e integrados en el ecosistema Coyote Gas.</span>
            </motion.div>
          )}

        </div>

      </form>

    </div>
  );
}
