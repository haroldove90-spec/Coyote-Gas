import React from 'react';
import { Settings, Smartphone, ShieldAlert, Key } from 'lucide-react';
import { Role } from '../types';

interface HomeSelectorProps {
  onSelectRole: (role: Role) => void;
}

export function HomeSelector({ onSelectRole }: HomeSelectorProps) {
  return (
    <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-gray-200 shadow-xl p-8 sm:p-12 relative overflow-hidden flex flex-col items-center">
        
        {/* Subtle geometric background accents */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-[#305975]/5 rounded-full -translate-x-12 -translate-y-12 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#7294A0]/5 rounded-full translate-x-16 translate-y-16 pointer-events-none"></div>

        {/* Business Logo Area */}
        <div className="w-full max-w-xs mb-10 flex flex-col items-center select-none animate-fadeIn">
          <div className="p-5 bg-slate-50 rounded-2xl border border-gray-150 shadow-sm flex items-center justify-center">
            <img 
              src="https://cossma.com.mx/coyotegaslogo.png" 
              alt="Coyote Gas Logo" 
              className="h-16 sm:h-20 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <h1 className="text-2xl font-black text-[#305975] tracking-tight mt-4 uppercase text-center">
            Coyote Gas
          </h1>
          <p className="text-xs text-[#7294A0] font-bold tracking-widest uppercase mt-1 text-center">
            Sistema de Administración LP
          </p>
        </div>

        {/* Informative Step Header */}
        <div className="text-center mb-8">
          <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">
            Selecciona tu Perfil de Ingreso
          </h2>
          <div className="w-12 h-1 bg-[#305975] rounded-full mx-auto mt-2"></div>
        </div>

        {/* Cards Grid for Roles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
          
          {/* Card 1: VENDEDOR ROLE */}
          <button
            id="role-vendedor-btn"
            onClick={() => onSelectRole('vendedor')}
            className="group bg-slate-50 hover:bg-white border-2 border-gray-100 hover:border-[#7294A0] rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-all active:scale-[0.98] flex flex-col items-center cursor-pointer relative"
          >
            {/* Top decorative badge */}
            <span className="absolute top-3 right-3 text-[9px] bg-emerald-500/10 text-emerald-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              En Ruta
            </span>

            <div className="w-16 h-16 bg-[#7294A0]/10 group-hover:bg-[#7294A0]/20 text-[#305975] rounded-full flex items-center justify-center mb-4 transition-colors">
              <Smartphone className="w-8 h-8 transition-transform group-hover:scale-110" />
            </div>
            
            <h3 className="text-lg font-black text-[#305975] uppercase tracking-tight">
              Vendedor
            </h3>
            
            <p className="text-xs text-slate-500 mt-2 max-w-[180px] leading-relaxed">
              Terminal de venta móvil, registro de litros, cobros y facturas para operadores.
            </p>
            
            <div className="mt-5 text-[10px] bg-[#305975]/5 text-[#305975] group-hover:bg-[#305975] group-hover:text-white px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider transition-colors">
              Ingresar Terminal
            </div>
          </button>

          {/* Card 2: ADMIN ROLE */}
          <button
            id="role-admin-btn"
            onClick={() => onSelectRole('admin')}
            className="group bg-slate-50 hover:bg-white border-2 border-gray-100 hover:border-[#305975] rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-all active:scale-[0.98] flex flex-col items-center cursor-pointer relative"
          >
            {/* Top decorative badge */}
            <span className="absolute top-3 right-3 text-[9px] bg-indigo-500/10 text-[#305975] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              Oficina
            </span>

            <div className="w-16 h-16 bg-[#305975]/10 group-hover:bg-[#305975]/20 text-[#305975] rounded-full flex items-center justify-center mb-4 transition-colors">
              <Settings className="w-8 h-8 transition-transform group-hover:scale-110" />
            </div>
            
            <h3 className="text-lg font-black text-[#305975] uppercase tracking-tight">
              Administrador
            </h3>
            
            <p className="text-xs text-slate-500 mt-2 max-w-[180px] leading-relaxed">
              Precios por litro, bitácora de tickets, cortes de caja y monitoreo en tiempo real.
            </p>
            
            <div className="mt-5 text-[10px] bg-[#305975]/5 text-[#305975] group-hover:bg-[#305975] group-hover:text-white px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider transition-colors">
              Panel de Control
            </div>
          </button>

        </div>

        {/* Safe footer status display */}
        <div className="mt-8 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
          Coyote Gas • Red de Distribución Segura
        </div>

      </div>
    </div>
  );
}
