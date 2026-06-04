import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, Settings, Smartphone, Download, Sparkles, 
  Flame, Monitor, Menu, User, UserCheck, CheckCircle2, Lock
} from 'lucide-react';

import { Role, Vendedor, Venta, CorteCaja } from './types';
import { getInitialState, saveState, AppState } from './dataStore';

// Dynamic subcomponents
import { Splash } from './components/Splash';
import { PermissionsModal } from './components/PermissionsModal';
import { InstallModal } from './components/InstallModal';
import { AdminView } from './components/AdminView';
import { VendedorView } from './components/VendedorView';
import { TicketModal } from './components/TicketModal';
import { HomeSelector } from './components/HomeSelector';
import { PerfilView } from './components/PerfilView';
import { AdminProfile } from './dataStore';

export default function App() {
  // --- 1. Core States ---
  const [appState, setAppState] = useState<AppState>(getInitialState);
  const [activeRole, setActiveRole] = useState<Role | 'home'>('home');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'perfil'>('dashboard');
  
  // Custom Flow States
  const [showSplash, setShowSplash] = useState(true);
  const [showPermissions, setShowPermissions] = useState(false);
  const [showInstallHelp, setShowInstallHelp] = useState(false);
  const [hasPermissionsGranted, setHasPermissionsGranted] = useState(false);
  
  // PWA Support States
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  // Active Ticket Viewer state
  const [selectedVenta, setSelectedVenta] = useState<Venta | null>(null);
  const [isTicketOpen, setIsTicketOpen] = useState(false);

  // --- 2. Persist state changes in real-time ---
  useEffect(() => {
    saveState(appState);
  }, [appState]);

  // --- 3. Watch for PWA Install Prompt ---
  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      // Prevent browser automated info bar
      e.preventDefault();
      // Save the event for manual trigger
      setDeferredPrompt(e);
      // Show PWA options
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Load permission records from localStorage to not bug user
    const savedPerms = localStorage.getItem('coyo_gas_perms_ok');
    if (savedPerms === 'true') {
      setHasPermissionsGranted(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  // Action to prompt installation
  const triggerPWAInstall = async () => {
    if (!deferredPrompt) {
      // In case we don't have event, open help modal
      setShowInstallHelp(true);
      return;
    }
    // Show PWA prompt
    deferredPrompt.prompt();
    // Wait for response
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallSuccess(true);
      setIsInstallable(false);
      setTimeout(() => setInstallSuccess(false), 5000);
    }
    setDeferredPrompt(null);
  };

  // --- 4. Central Mutation Handlers ---
  const handleUpdatePrecio = (nuevoPrecio: number) => {
    setAppState(prev => ({
      ...prev,
      precioPorLitro: nuevoPrecio
    }));
  };

  const handleAddVendedor = (nuevoVendedor: Vendedor) => {
    setAppState(prev => ({
      ...prev,
      vendedores: [...prev.vendedores, nuevoVendedor]
    }));
  };

  const handleAddVenta = (nuevaVenta: Venta) => {
    setAppState(prev => ({
      ...prev,
      ventas: [...prev.ventas, nuevaVenta]
    }));
  };

  const handleAddCorte = (nuevoCorte: CorteCaja) => {
    setAppState(prev => ({
      ...prev,
      cortes: [...prev.cortes, nuevoCorte],
      // Clear associated sales for that salesperson so they can perform next shift nicely
      // In a real DB, these sales are marked as archived/closed
    }));
  };

  const handleOpenTicket = (venta: Venta) => {
    setSelectedVenta(venta);
    setIsTicketOpen(true);
  };

  const handleVendedorSelectedChange = (id: string) => {
    setAppState(prev => ({
      ...prev,
      activeVendedorId: id
    }));
  };

  const handlePermissionsCompleted = () => {
    setHasPermissionsGranted(true);
    localStorage.setItem('coyo_gas_perms_ok', 'true');
  };

  const handleSaveAdminProfile = (updated: AdminProfile) => {
    setAppState(prev => ({
      ...prev,
      adminProfile: updated
    }));
  };

  const handleSaveVendedorProfile = (updated: Vendedor) => {
    setAppState(prev => ({
      ...prev,
      vendedores: prev.vendedores.map(v => v.id === updated.id ? updated : v)
    }));
  };

  // --- 5. Splash screen gate ---
  if (showSplash) {
    return <Splash onComplete={() => setShowSplash(false)} />;
  }

  // --- 5b. Home Role Selection Gate ---
  if (activeRole === 'home') {
    return (
      <div className="min-h-screen bg-[#f0f2f5] flex flex-col antialiased">
        <HomeSelector onSelectRole={(role) => {
          setActiveRole(role);
          setActiveTab('dashboard');
        }} />
        
        {/* Modals needed during home screen can attach here silently */}
        <PermissionsModal
          isOpen={showPermissions}
          onClose={() => setShowPermissions(false)}
          onGranted={handlePermissionsCompleted}
        />
        <InstallModal
          isOpen={showInstallHelp}
          onClose={() => setShowInstallHelp(false)}
          onInstall={triggerPWAInstall}
          isInstallable={isInstallable}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col md:flex-row antialiased font-sans">
      
      {/* 
        A. SIDEBAR NAVIGATION - DESKTOP ONLY (md: & larger match '#305975' background, '#7294A0' and '#000000' accent elements)
      */}
      <aside className="hidden md:flex flex-col w-64 bg-[#305975] text-white flex-shrink-0 border-r border-[#305975]/40 relative z-30 shadow-xl justify-between">
        
        {/* Top brand header */}
        <div className="p-6">
          <div className="flex flex-col items-center text-center">
            {/* Logo is not encapsulated, visual displays fully */}
            <div className="w-full bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10">
              <img 
                src="https://cossma.com.mx/coyotegaslogo.png" 
                alt="Coyote Gas Logo" 
                className="w-full h-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-[10px] font-bold text-[#7294A0] uppercase tracking-widest mt-3 block">
              Suministro Confiable LP
            </span>
          </div>

          <div className="mt-8 space-y-2">
            <span className="text-[10px] font-black text-white/40 tracking-wider uppercase block px-3">
              Módulos Coyote
            </span>

            {/* Home selector option (Return to Home to change role) */}
            <button
              onClick={() => setActiveRole('home')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeRole === 'home' 
                  ? 'bg-black/30 text-white border-l-4 border-[#7294A0] shadow-inner' 
                  : 'text-[#7294A0] hover:text-white hover:bg-white/5'
              }`}
            >
              <User className="w-5 h-5 text-[#7294A0]" />
              Inicio (Cambiar Rol)
            </button>

            {/* Seller terminal option - Only visible in vendedor role */}
            {activeRole === 'vendedor' && (
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeTab === 'dashboard' 
                    ? 'bg-black/30 text-white border-l-4 border-[#7294A0] shadow-inner' 
                    : 'text-[#7294A0] hover:text-white hover:bg-white/5'
                }`}
              >
                <Smartphone className="w-5 h-5 text-[#7294A0]" />
                Terminal Vendedor
              </button>
            )}

            {/* Admin administration option - Only visible in admin role */}
            {activeRole === 'admin' && (
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeTab === 'dashboard' 
                    ? 'bg-black/30 text-white border-l-4 border-[#7294A0] shadow-inner' 
                    : 'text-[#7294A0] hover:text-white hover:bg-white/5'
                }`}
              >
                <Settings className="w-5 h-5 text-[#7294A0]" />
                Dashboard Admin
              </button>
            )}

            {/* Unified User Profile Option - Visible in both logged-in roles */}
            {(activeRole === 'vendedor' || activeRole === 'admin') && (
              <button
                onClick={() => setActiveTab('perfil')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeTab === 'perfil' 
                    ? 'bg-black/30 text-white border-l-4 border-[#7294A0] shadow-inner' 
                    : 'text-[#7294A0] hover:text-white hover:bg-white/5'
                }`}
              >
                <UserCheck className="w-5 h-5 text-[#7294A0]" />
                Mi Perfil Personal
              </button>
            )}
          </div>
        </div>

        {/* Bottom utility items inside Desktop sidebar */}
        <div className="p-4 bg-black/15 border-t border-white/10 space-y-2">
          
          {/* PWA Direct trigger */}
          <button
            onClick={() => setShowInstallHelp(true)}
            className="w-full py-2.5 bg-[#7294A0] hover:bg-[#7294A0]/90 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition-all active:scale-[0.98] uppercase tracking-wider flex items-center justify-center gap-1.5"
          >
            <Download className="w-4 h-4 animate-bounce" /> Instalar App PWA
          </button>

          {/* Toggle manual permissions */}
          <button
            onClick={() => setShowPermissions(true)}
            className="w-full py-2 bg-white/5 hover:bg-white/10 text-white font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 border border-white/10"
          >
            <ShieldAlert className="w-4 h-4" /> Configurar Permisos
          </button>

          <div className="text-center pt-2 border-t border-white/5">
            <span className="text-[10px] text-white/50 font-mono">Coyote Gas © 2026</span>
          </div>
        </div>
      </aside>

      {/* 
        B. MOBILE NAVIGATION - BOTTOM BAR (Viewable on small viewports with responsive fallback)
      */}
      <nav className="md:hidden fixed bottom-1.5 inset-x-3.5 bg-[#305975] text-white rounded-2xl shadow-xl border border-[#305975]/50 flex items-center justify-around py-2.5 px-4 z-40">
        
        {/* Mobile menu point: Return to Home selection */}
        <button
          onClick={() => setActiveRole('home')}
          className={`flex flex-col items-center gap-0.5 transition-all outline-none ${
            activeRole === 'home' ? 'scale-110 text-[#7294A0]' : 'text-slate-200 opacity-70'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[9px] font-black">Inicio</span>
        </button>

        {/* Mobile menu point: Seller tab - Only visible in vendedor role */}
        {activeRole === 'vendedor' && (
          <button
            onClick={() => {
              setActiveRole('vendedor');
              setActiveTab('dashboard');
            }}
            className={`flex flex-col items-center gap-0.5 transition-all outline-none ${
              activeTab === 'dashboard' ? 'scale-110 text-[#7294A0]' : 'text-slate-300 opacity-70'
            }`}
          >
            <Smartphone className="w-5 h-5" />
            <span className="text-[9px] font-bold">Vendedor</span>
          </button>
        )}

        {/* Mobile menu point: Admin tab - Only visible in admin role */}
        {activeRole === 'admin' && (
          <button
            onClick={() => {
              setActiveRole('admin');
              setActiveTab('dashboard');
            }}
            className={`flex flex-col items-center gap-0.5 transition-all outline-none ${
              activeTab === 'dashboard' ? 'scale-110 text-[#7294A0]' : 'text-slate-300 opacity-70'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="text-[9px] font-bold">Admin</span>
          </button>
        )}

        {/* Mobile menu point: Mi Perfil - visible for both logged-in roles */}
        {(activeRole === 'vendedor' || activeRole === 'admin') && (
          <button
            onClick={() => {
              setActiveTab('perfil');
            }}
            className={`flex flex-col items-center gap-0.5 transition-all outline-none ${
              activeTab === 'perfil' ? 'scale-110 text-[#7294A0]' : 'text-slate-300 opacity-70'
            }`}
          >
            <UserCheck className="w-5 h-5" />
            <span className="text-[9px] font-bold">Mi Perfil</span>
          </button>
        )}

        {/* Mobile menu point: Install PWA */}
        <button
          onClick={() => {
            if (isInstallable) {
              triggerPWAInstall();
            } else {
              setShowInstallHelp(true);
            }
          }}
          className="flex flex-col items-center gap-0.5 text-slate-300 opacity-70 hover:opacity-100 transition-all outline-none"
        >
          <Download className="w-5 h-5 text-amber-300 animate-pulse" />
          <span className="text-[9px] font-bold text-amber-200">Instalar</span>
        </button>

        {/* Mobile menu point: Direct settings prompt */}
        <button
          onClick={() => setShowPermissions(true)}
          className="flex flex-col items-center gap-0.5 text-slate-300 opacity-70 hover:opacity-100 transition-all outline-none"
        >
          <ShieldAlert className="w-5 h-5 text-emerald-300" />
          <span className="text-[9px] font-bold">Permisos</span>
        </button>

      </nav>

      {/* 
        C. MAIN APPLICATION ROUTE CONTENT INTERACTION GAP
      */}
      <main className="flex-1 overflow-y-auto max-h-screen pt-4 pb-24 md:py-8">
        
        {/* Mobile top minimalist logo bar (so logo stays present on mobile viewports) */}
        <div className="md:hidden flex items-center justify-between px-4 mb-4 border-b border-gray-100 pb-2">
          <img 
            src="https://cossma.com.mx/coyotegaslogo.png" 
            alt="Coyote Gas" 
            className="h-10 w-auto object-contain"
            referrerPolicy="no-referrer"
          />
          <div className="text-right">
            <span className="text-[8px] bg-[#305975]/10 text-[#305975] px-2 py-0.5 rounded font-black uppercase font-mono block">
              Red Camiones LP
            </span>
          </div>
        </div>

        {/* Dynamic switcher based on current role requested and tab select state */}
        {activeTab === 'perfil' ? (
          <PerfilView
            role={activeRole as 'admin' | 'vendedor'}
            adminProfile={appState.adminProfile}
            activeVendedor={appState.vendedores.find(v => v.id === appState.activeVendedorId)}
            onSaveAdmin={handleSaveAdminProfile}
            onSaveVendedor={handleSaveVendedorProfile}
            onBack={() => setActiveTab('dashboard')}
          />
        ) : activeRole === 'admin' ? (
          <AdminView
            precioPorLitro={appState.precioPorLitro}
            onUpdatePrecio={handleUpdatePrecio}
            vendedores={appState.vendedores}
            onAddVendedor={handleAddVendedor}
            ventas={appState.ventas}
            cortes={appState.cortes}
            onOpenTicket={handleOpenTicket}
          />
        ) : (
          <VendedorView
            precioPorLitro={appState.precioPorLitro}
            vendedores={appState.vendedores}
            ventas={appState.ventas}
            cortes={appState.cortes}
            onAddVenta={handleAddVenta}
            onAddCorte={handleAddCorte}
            activeVendedorId={appState.activeVendedorId}
            onChangeVendedor={handleVendedorSelectedChange}
            onOpenTicket={handleOpenTicket}
          />
        )}
      </main>

      {/* PWA Banner Notification on landing if permissions not completed */}
      {!hasPermissionsGranted && (
        <div className="fixed top-2 inset-x-2 md:left-auto md:right-4 md:w-80 bg-white border-2 border-[#7294A0] rounded-2xl p-4 shadow-xl z-40 flex gap-3 items-start animate-bounce">
          <ShieldAlert className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-xs space-y-1.5 flex-1">
            <p className="font-bold text-gray-900">Activa el Punto de Venta completo</p>
            <p className="text-gray-500">Concede permisos para usar notificaciones de precio y GPS para agilizar tus entregas.</p>
            <button
              onClick={() => setShowPermissions(true)}
              className="px-3 py-1 bg-[#305975] text-white font-bold rounded-lg uppercase tracking-wider text-[9px] hover:bg-[#305975]/95 shadow transition-all block"
            >
              Configurar Ahora
            </button>
          </div>
        </div>
      )}

      {/* --- 6. MODALS ROOT ATTACHMENTS --- */}

      {/* PERMISSIONS REQUEST DIALOG */}
      <PermissionsModal
        isOpen={showPermissions}
        onClose={() => setShowPermissions(false)}
        onGranted={handlePermissionsCompleted}
      />

      {/* PWA INSTALLATION PROCESS OPTIONS */}
      <InstallModal
        isOpen={showInstallHelp}
        onClose={() => setShowInstallHelp(false)}
        onInstall={triggerPWAInstall}
        isInstallable={isInstallable}
      />

      {/* DIGITAL TICKET MODAL COMPONENT */}
      <TicketModal
        venta={selectedVenta}
        isOpen={isTicketOpen}
        onClose={() => {
          setSelectedVenta(null);
          setIsTicketOpen(false);
        }}
      />

    </div>
  );
}
