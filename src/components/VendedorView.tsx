import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Calculator, User, Flame, Phone, Receipt, CheckCircle, 
  Trash2, Send, Save, Share2, LogOut, Award, RefreshCw, Layers
} from 'lucide-react';
import { Vendedor, Venta, CorteCaja } from '../types';

interface VendedorViewProps {
  precioPorLitro: number;
  vendedores: Vendedor[];
  ventas: Venta[];
  cortes: CorteCaja[];
  onAddVenta: (venta: Venta) => void;
  onAddCorte: (corte: CorteCaja) => void;
  activeVendedorId: string;
  onChangeVendedor: (id: string) => void;
  onOpenTicket: (venta: Venta) => void;
}

export function VendedorView({
  precioPorLitro,
  vendedores,
  ventas,
  cortes,
  onAddVenta,
  onAddCorte,
  activeVendedorId,
  onChangeVendedor,
  onOpenTicket
}: VendedorViewProps) {
  // Tabs for sub-dashboard: 'venta' | 'historial' | 'corte'
  const [activeTab, setActiveTab] = useState<'venta' | 'historial'>('venta');

  // Calculator liters state (as string for formatting)
  const [litrosStr, setLitrosStr] = useState('0');
  
  // Client details
  const [clienteNombre, setClienteNombre] = useState('');
  const [clienteWhats, setClienteWhats] = useState('');

  // Find active seller profile
  const currentVendedor = vendedores.find(v => v.id === activeVendedorId) || vendedores[0];

  // Filter sales of THIS salesman TODAY which have NOT been cleared by a previous corte de caja in this simulation
  // Since we also have historical seeded ones, let's show all of them for this operator on today's calendar
  const todaySlash = new Date().toISOString().split('T')[0];
  const misVentasHoy = ventas.filter(
    v => v.vendedorId === currentVendedor.id && v.fecha.startsWith(todaySlash)
  );

  const totalLitrosVendedor = misVentasHoy.reduce((acc, v) => acc + v.litros, 0);
  const totalPesosVendedor = misVentasHoy.reduce((acc, v) => acc + v.total, 0);

  // Keypad actions
  const handleKeyPress = (num: string) => {
    setLitrosStr((prev) => {
      if (prev === '0' && num !== '.') {
        return num;
      }
      // Max 1 decimal point
      if (num === '.' && prev.includes('.')) {
        return prev;
      }
      // Guard max length
      if (prev.length >= 7) return prev;
      return prev + num;
    });
  };

  const handleBackspace = () => {
    setLitrosStr((prev) => {
      if (prev.length <= 1) return '0';
      return prev.slice(0, -1);
    });
  };

  const handleClear = () => {
    setLitrosStr('0');
  };

  const handleAddPreset = (lts: number) => {
    setLitrosStr((prev) => {
      const current = parseFloat(prev) || 0;
      return (current + lts).toString();
    });
  };

  // Create Venta transaction
  const handleProcesarVenta = (e: React.FormEvent) => {
    e.preventDefault();
    const lts = parseFloat(litrosStr);
    if (isNaN(lts) || lts <= 0) {
      alert('Por favor ingrese un número de litros válido para surtir.');
      return;
    }

    const totalCobro = lts * precioPorLitro;
    const ticketId = `T-${1000 + ventas.length + 1}`;

    const nuevaVenta: Venta = {
      id: ticketId,
      vendedorId: currentVendedor.id,
      vendedorNombre: currentVendedor.nombre,
      litros: lts,
      total: parseFloat(totalCobro.toFixed(2)),
      precioPorLitro: precioPorLitro,
      fecha: new Date().toISOString(),
      clienteNombre: clienteNombre.trim() || 'Consumidor Final',
      clienteWhats: clienteWhats.trim()
    };

    onAddVenta(nuevaVenta);
    
    // Clear inputs
    setLitrosStr('0');
    setClienteNombre('');
    setClienteWhats('');

    // Open ticket directly for preview
    onOpenTicket(nuevaVenta);
  };

  // Perform shift closeout (Corte de Caja)
  const handleRealizarCorte = () => {
    if (misVentasHoy.length === 0) {
      alert('No tienes ventas registradas para este turno todavía.');
      return;
    }

    const confirmCorte = window.confirm(
      `¿Desea cerrar el turno para ${currentVendedor.nombre}?\n\n` +
      `- Ventas: ${misVentasHoy.length}\n` +
      `- Litros Vendidos: ${totalLitrosVendedor.toFixed(1)} L\n` +
      `- Total Recaudado: $${totalPesosVendedor.toFixed(2)}\n\n` +
      `Se enviará el reporte a la cuenta del Admin y se iniciará un nuevo turno.`
    );

    if (confirmCorte) {
      const nuevoCorte: CorteCaja = {
        id: `C-0${cortes.length + 1}`,
        vendedorId: currentVendedor.id,
        vendedorNombre: currentVendedor.nombre,
        fecha: new Date().toISOString().split('T')[0],
        ventasCount: misVentasHoy.length,
        litrosVendidos: parseFloat(totalLitrosVendedor.toFixed(1)),
        totalVendido: parseFloat(totalPesosVendedor.toFixed(2)),
        retirado: true
      };

      onAddCorte(nuevoCorte);
      alert(`¡Corte ${nuevoCorte.id} procesado con éxito!\n$${nuevoCorte.totalVendido} M.N. ha sido entregado en administración.`);
    }
  };

  const activeLiters = parseFloat(litrosStr) || 0;
  const activeCost = activeLiters * precioPorLitro;

  return (
    <div className="max-w-md mx-auto px-4 pb-16 font-sans">
      
      {/* Vendedor Operator Switcher (Header banner) */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 shadow-lg mb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-[#7294A0]/20 rounded-xl flex items-center justify-center text-[#7294A0]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Vendedor en Ruta</span>
              <select
                value={activeVendedorId}
                onChange={(e) => onChangeVendedor(e.target.value)}
                className="bg-transparent text-sm font-bold text-white pr-6 focus:outline-none focus:ring-0 select-none cursor-pointer"
              >
                {vendedores.map((v) => (
                  <option key={v.id} value={v.id} className="text-slate-900 font-semibold bg-white">
                    {v.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] bg-[#7294A0] text-slate-950 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider font-mono">
              ${precioPorLitro.toFixed(2)} / L
            </span>
            <span className="text-[9px] text-slate-400 block mt-1">Precio Sincronizado</span>
          </div>
        </div>
      </div>

      {/* Screen Sub-Tabs */}
      <div className="grid grid-cols-2 bg-slate-200/60 p-1.5 rounded-xl mb-5">
        <button
          onClick={() => setActiveTab('venta')}
          className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'venta' 
              ? 'bg-white text-[#305975] shadow-sm' 
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calculator className="w-4 h-4" /> Calculadora Surtidora
        </button>
        <button
          onClick={() => setActiveTab('historial')}
          className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'historial' 
              ? 'bg-white text-[#305975] shadow-sm' 
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Receipt className="w-4 h-4" /> Mi Turno ({misVentasHoy.length})
        </button>
      </div>

      {/* TAB A: CALCULATOR DISPLAY & BUTTONS */}
      {activeTab === 'venta' && (
        <div className="space-y-4">
          
          <div className="bg-[#305975] rounded-3xl p-6 shadow-xl flex flex-col">
            
            {/* LCD DISPLAY */}
            <div className="bg-white/10 border border-white/20 rounded-2xl p-4 mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-[10px] text-[#7294A0] uppercase font-bold tracking-widest">Precio LP</span>
                <span className="text-sm text-white font-mono font-bold">${precioPorLitro.toFixed(2)} / L</span>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-4xl font-mono text-white font-bold">
                  {activeLiters.toLocaleString('es-MX', { minimumFractionDigits: 1 })} L
                </div>
                <div className="text-xl text-[#7294A0] font-mono mt-1 font-bold">
                  TOTAL: ${activeCost.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>

            {/* PRESETS ON ROUTE */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 mb-4">
              <span className="text-[10px] font-bold text-[#7294A0] uppercase tracking-wider block mb-2 font-mono">Surtidos Comunes (Cargas rápidas)</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleAddPreset(10)}
                  className="py-1.5 bg-white/5 hover:bg-white/10 border border-white/15 rounded-xl text-[10px] font-bold text-white transition-colors"
                >
                  +10 L
                </button>
                <button
                  onClick={() => handleAddPreset(20)}
                  className="py-1.5 bg-white/5 hover:bg-white/10 border border-white/15 rounded-xl text-[10px] font-bold text-white transition-colors"
                >
                  +20 L
                </button>
                <button
                  onClick={() => handleAddPreset(50)}
                  className="py-1.5 bg-white/5 hover:bg-white/10 border border-white/15 rounded-xl text-[10px] font-bold text-white transition-colors"
                >
                  +50 L
                </button>
                <button
                  onClick={() => { handleClear(); handleAddPreset(37.0); }}
                  className="py-1.5 bg-[#7294A0]/10 hover:bg-[#7294A0]/25 rounded-xl text-[9px] leading-tight font-bold text-white transition-colors"
                >
                  Cilindro 20kg
                </button>
                <button
                  onClick={() => { handleClear(); handleAddPreset(55.0); }}
                  className="py-1.5 bg-[#7294A0]/10 hover:bg-[#7294A0]/25 rounded-xl text-[9px] leading-tight font-bold text-white transition-colors"
                >
                  Cilindro 30kg
                </button>
                <button
                  onClick={() => { handleClear(); handleAddPreset(100.0); }}
                  className="py-1.5 bg-[#7294A0]/10 hover:bg-[#7294A0]/25 rounded-xl text-[9px] leading-tight font-bold text-white transition-colors"
                >
                  Tanque Est.
                </button>
              </div>
            </div>

            {/* KEYPAD GRID */}
            <div className="grid grid-cols-3 gap-3">
              {[7, 8, 9, 4, 5, 6, 1, 2, 3].map((num) => (
                <button
                  key={num}
                  onClick={() => handleKeyPress(num.toString())}
                  className="bg-white/5 border border-white/10 rounded-2xl py-3.5 text-2xl font-bold text-white hover:bg-white/10 transition-colors active:scale-95"
                >
                  {num}
                </button>
              ))}
              <button
                onClick={() => handleKeyPress('.')}
                className="bg-white/5 border border-white/10 rounded-2xl py-3.5 text-2xl font-bold text-white hover:bg-white/10 transition-colors active:scale-95"
              >
                .
              </button>
              <button
                onClick={() => handleKeyPress('0')}
                className="bg-white/5 border border-white/10 rounded-2xl py-3.5 text-2xl font-bold text-white hover:bg-white/10 transition-colors active:scale-95"
              >
                0
              </button>
              <button
                onClick={handleClear}
                className="bg-orange-500 border border-orange-400 rounded-2xl py-3.5 text-xl font-bold text-white hover:bg-orange-400 transition-colors active:scale-95 animate-none"
              >
                CLR
              </button>
            </div>

            {/* ACTION DIRECTIVES */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <button
                onClick={handleBackspace}
                className="bg-[#7294A0] text-slate-950 hover:bg-[#5e7d88] py-4 rounded-2xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-1.5 border border-white/20 active:scale-95 transition-all"
              >
                ⌫ BORRAR
              </button>
              <button
                onClick={(e) => handleProcesarVenta(e)}
                disabled={activeLiters <= 0}
                className="bg-white text-[#305975] hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-white py-4 rounded-2xl font-black uppercase tracking-wider text-xs shadow-lg flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                Generar Ticket
              </button>
            </div>

          </div>

          {/* CUSTOMER DIRECTIVES PREVENT FORM */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block border-b border-gray-50 pb-1.5">Información del Cliente (Opcional)</span>
            
            <div className="grid grid-cols-1 gap-2.5">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Nombre Completo</label>
                <input
                  type="text"
                  placeholder="Ej. Familia González Juárez"
                  value={clienteNombre}
                  onChange={(e) => setClienteNombre(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:border-[#7294A0] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">WhatsApp Cliente (envío ticket)</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold font-mono text-slate-400">+52</span>
                  <input
                    type="tel"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    placeholder="Ej. 5588776655"
                    value={clienteWhats}
                    onChange={(e) => setClienteWhats(e.target.value)}
                    className="w-full text-xs pl-10 pr-2.5 p-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:border-[#7294A0] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB B: CURRENT SHIFT SALES LIST & END OF DAY CASHIER CLOSING */}
      {activeTab === 'historial' && (
        <div className="space-y-4">
          
          {/* SHIFT STATS */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm text-center">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Litros Despachados</span>
              <p className="text-xl font-black text-gray-950 mt-1 font-mono">{totalLitrosVendedor.toFixed(1)} L</p>
            </div>
            <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm text-center">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Acumulado Turno</span>
              <p className="text-xl font-black text-[#305975] mt-1 font-mono">${totalPesosVendedor.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>

          {/* REALIZAR CORTE DE CAJA BUTTON */}
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 shadow-sm text-center">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block mb-1">Final de Turno</span>
            <p className="text-xs text-amber-700/80 mb-3.5 max-w-sm mx-auto">
              Realiza el corte de caja para enviar tus depósitos del día a administración y resetear tus registros del camión.
            </p>
            <button
              onClick={handleRealizarCorte}
              className="w-full py-2.5 bg-[#305975] hover:bg-[#305975]/90 text-white font-bold text-xs rounded-xl shadow transition-all hover:scale-[1.01] active:scale-[0.99] uppercase tracking-wider block"
            >
              Efectuar Corte de Caja (${totalPesosVendedor.toFixed(2)} M.N.)
            </button>
          </div>

          {/* LIST OF SALES FOR THIS VEHICLE TODAY */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-50">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Mis Servicios de Hoy</h3>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold font-mono">
                {misVentasHoy.length} Despachos
              </span>
            </div>

            {misVentasHoy.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <Receipt className="w-8 h-8 mx-auto mb-1 opacity-50" />
                <p className="text-xs">No has emitido de tickets hoy.</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                {[...misVentasHoy].reverse().map((venta) => (
                  <div 
                    key={venta.id} 
                    className="p-3 bg-slate-50 border border-gray-100 rounded-xl flex items-center justify-between hover:border-[#7294A0] cursor-pointer transition-all"
                    onClick={() => onOpenTicket(venta)}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-indigo-950 font-mono">{venta.id}</span>
                        <span className="text-[9px] text-gray-400 font-mono">
                          {new Date(venta.fecha).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 font-semibold mt-1">Cliente: {venta.clienteNombre}</p>
                      <p className="text-[10px] text-[#7294A0] font-mono leading-none mt-0.5">{venta.litros.toFixed(1)} L • ${venta.precioPorLitro.toFixed(2)}/L</p>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <span className="text-xs font-black text-gray-900 font-mono">
                        ${venta.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-[8px] tracking-wide uppercase text-[#305975] font-bold hover:underline mt-1 bg-[#305975]/10 px-1.5 py-0.5 rounded">
                        Ver ticket
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
