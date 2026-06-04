import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, Users, DollarSign, Flame, RefreshCw, UserPlus, 
  MapPin, CheckCircle, AlertCircle, Eye, Trash2, Calendar, FileText
} from 'lucide-react';
import { Vendedor, Venta, CorteCaja } from '../types';

interface AdminViewProps {
  precioPorLitro: number;
  onUpdatePrecio: (nuevoPrecio: number) => void;
  vendedores: Vendedor[];
  onAddVendedor: (vendedor: Vendedor) => void;
  ventas: Venta[];
  cortes: CorteCaja[];
  onOpenTicket: (venta: Venta) => void;
}

export function AdminView({ 
  precioPorLitro, 
  onUpdatePrecio, 
  vendedores, 
  onAddVendedor, 
  ventas, 
  cortes,
  onOpenTicket
}: AdminViewProps) {
  // Input states
  const [nuevoPrecioInput, setNuevoPrecioInput] = useState(precioPorLitro.toString());
  const [nombreVendedor, setNombreVendedor] = useState('');
  const [telefonoVendedor, setTelefonoVendedor] = useState('');
  const [unidadVendedor, setUnidadVendedor] = useState('Unidad 01');
  const [showPrecioToast, setShowPrecioToast] = useState(false);
  const [showVendedorToast, setShowVendedorToast] = useState(false);

  // Calculate high-quality analytics metrics (Only for today)
  const todaySlash = new Date().toISOString().split('T')[0];
  
  const ventasHoy = ventas.filter(v => v.fecha.startsWith(todaySlash));
  const totalRecaudadoHoy = ventasHoy.reduce((acc, v) => acc + v.total, 0);
  const totalLitrosHoy = ventasHoy.reduce((acc, v) => acc + v.litros, 0);
  const promedioVentaHoy = ventasHoy.length > 0 ? (totalRecaudadoHoy / ventasHoy.length) : 0;

  // Handler for price update
  const handleActualizarPrecio = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(nuevoPrecioInput);
    if (!isNaN(parsed) && parsed > 0) {
      onUpdatePrecio(parsed);
      setShowPrecioToast(true);
      setTimeout(() => setShowPrecioToast(false), 3000);
    }
  };

  // Handler for adding a vendedor
  const handleRegistrarVendedor = (e: React.FormEvent) => {
    e.preventDefault();
    if (nombreVendedor.trim() === '' || telefonoVendedor.trim() === '') return;

    const newV: Vendedor = {
      id: `v-${Date.now()}`,
      nombre: `${nombreVendedor.trim()} (${unidadVendedor})`,
      telefono: telefonoVendedor.trim(),
      fechaRegistro: new Date().toISOString().split('T')[0],
      activo: true
    };

    onAddVendedor(newV);
    setNombreVendedor('');
    setTelefonoVendedor('');
    setUnidadVendedor('Unidad 01');
    setShowVendedorToast(true);
    setTimeout(() => setShowVendedorToast(false), 3000);
  };

  // Sales per salesperson calculation
  const getSellersPerformance = () => {
    return vendedores.map(vend => {
      const vendVentas = ventasHoy.filter(v => v.vendedorId === vend.id);
      const totalPesos = vendVentas.reduce((sum, v) => sum + v.total, 0);
      const totalLitros = vendVentas.reduce((sum, v) => sum + v.litros, 0);
      return {
        id: vend.id,
        nombre: vend.nombre,
        count: vendVentas.length,
        totalPesos,
        totalLitros,
      };
    });
  };

  const performanceList = getSellersPerformance();
  const maxSaleValue = Math.max(...performanceList.map(p => p.totalPesos), 1);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 pb-16 font-sans">
      
      {/* Top Welcome Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-10 bg-[#305975] rounded-full"></span>
            <div>
              <h1 className="text-2xl font-black text-[#305975] tracking-tight">COYOTE GAS</h1>
              <p className="text-xs text-[#7294A0] font-bold uppercase tracking-wider mt-0.5">
                SISTEMA DE ADMINISTRACIÓN LP
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-[#7294A0]/10 border border-[#7294A0]/30 px-3.5 py-1.5 rounded-xl">
          <span className="w-2 h-2 bg-[#305975] rounded-full animate-ping"></span>
          <span className="text-xs font-bold text-[#305975] uppercase tracking-wider">
            Sincronización Activa
          </span>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Ventas de Hoy</span>
            <h3 className="text-2xl font-black text-gray-900">${totalRecaudadoHoy.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            <span className="text-xs text-slate-500 block">Hoy: {ventasHoy.length} despachos</span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Gas LP Despachado</span>
            <h3 className="text-2xl font-black text-gray-900">{totalLitrosHoy.toLocaleString('es-MX')} L</h3>
            <span className="text-xs text-slate-500 block">Litros surtidos hoy</span>
          </div>
          <div className="p-3 bg-sky-50 text-[#305975] rounded-xl">
            <Flame className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Ticket Promedio</span>
            <h3 className="text-2xl font-black text-gray-900">${promedioVentaHoy.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            <span className="text-xs text-slate-500 block">Por cada servicio de gas</span>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Personal de Red</span>
            <h3 className="text-2xl font-black text-gray-900">{vendedores.length}</h3>
            <span className="text-xs text-slate-500 block">Sellers activos en ruta</span>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* PRICE MODULE & NEW SELLER MODULE (Left side) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* 1. ACTUALIZACIÓN DE PRECIO EN TIEMPO REAL */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-[#305975] flex items-center gap-2 mb-4">
              <span className="w-2 h-6 bg-[#305975] rounded-full"></span>
              Actualización de Precios
            </h2>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Precio Actual por Litro (LP) para la Red</label>
            
            <form onSubmit={handleActualizarPrecio} className="space-y-4">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold font-mono text-xl">$</span>
                  <input 
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="18.42"
                    value={nuevoPrecioInput}
                    onChange={(e) => setNuevoPrecioInput(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-2xl font-mono font-bold text-[#305975] focus:outline-none focus:border-[#7294A0]"
                  />
                </div>
                <button 
                  type="submit"
                  className="bg-[#305975] hover:bg-[#25465e] text-white px-6 py-2 rounded-xl text-xs font-black tracking-wider uppercase shadow-sm active:scale-95 transition-all"
                >
                  ACTUALIZAR
                </button>
              </div>
              <p className="text-[10px] text-[#7294A0] italic font-medium">
                * Sincronización en tiempo real activa para todos los vendedores (vigente: ${precioPorLitro.toFixed(2)} MXN/L)
              </p>
            </form>

            {showPrecioToast && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 p-2.5 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-800 text-xs font-medium flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                ¡Sincronizado! Tarifas de vendedores actualizadas a ${parseFloat(nuevoPrecioInput).toFixed(2)} MXN
              </motion.div>
            )}
          </div>

          {/* 2. REGISTRAR NUEVO VENDEDOR */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-[#305975] flex items-center gap-2 mb-4">
              <span className="w-2 h-6 bg-[#305975] rounded-full"></span>
              Registrar Operador
            </h2>

            <p className="text-xs text-gray-500 mb-4">
              Agrega operadores y unidades para autorizar su ingreso a la plataforma y habilitar su corte de caja diario.
            </p>

            <form onSubmit={handleRegistrarVendedor} className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 tracking-wider uppercase mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Manuel Sandoval"
                  value={nombreVendedor}
                  onChange={(e) => setNombreVendedor(e.target.value)}
                  className="w-full p-2.5 text-sm bg-slate-50 border border-gray-200 rounded-xl focus:border-[#7294A0] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 tracking-wider uppercase mb-1">Celular (10 dígitos)</label>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    placeholder="5512345678"
                    value={telefonoVendedor}
                    onChange={(e) => setTelefonoVendedor(e.target.value)}
                    className="w-full p-2.5 text-sm bg-slate-50 border border-gray-200 rounded-xl focus:border-[#7294A0] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 tracking-wider uppercase mb-1">Unidad / Camión</label>
                  <select
                    value={unidadVendedor}
                    onChange={(e) => setUnidadVendedor(e.target.value)}
                    className="w-full p-2.5 text-sm bg-slate-50 border border-gray-200 rounded-xl focus:border-[#7294A0] focus:outline-none"
                  >
                    <option value="Unidad 04">Unidad 04 (Pipa)</option>
                    <option value="Unidad 07">Unidad 07 (Pipa)</option>
                    <option value="Unidad 12">Unidad 12 (Cilindros)</option>
                    <option value="Unidad 15">Unidad 15 (Cilindros)</option>
                    <option value="Unidad 20">Unidad 20 (Refuerzo)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-black text-white font-semibold text-xs rounded-xl shadow transition-all active:scale-[0.98] uppercase tracking-wider"
              >
                Guardar Operador
              </button>
            </form>

            {showVendedorToast && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 p-2.5 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-800 text-xs font-medium flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                Vendedor registrado con éxito en la base de datos Coyote
              </motion.div>
            )}
          </div>

        </div>

        {/* SALES SUMMARY BY SELLER & LIVE TRACK (Right side) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 3. VENDEDORES Y SU VENTA DIARIA */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#305975] flex items-center gap-2">
                <span className="w-2 h-6 bg-[#305975] rounded-full"></span>
                Ventas del Día
              </h2>
              <span className="text-[10px] font-bold text-[#305975] bg-[#305975]/10 px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
                {todaySlash}
              </span>
            </div>

            <div className="space-y-4">
              {performanceList.map((perf) => {
                const percentage = (perf.totalPesos / maxSaleValue) * 100;
                return (
                  <div key={perf.id} className="p-3.5 bg-slate-50/60 rounded-xl border border-gray-100 flex flex-col gap-2 hover:bg-slate-50 hover:shadow-sm transition-all">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-bold text-slate-800 font-sans">{perf.nombre}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {perf.count} ventas • <strong className="text-slate-700 font-mono">{perf.totalLitros.toFixed(1)} L</strong> despachados
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black text-gray-950 block font-mono">
                          ${perf.totalPesos.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider mt-1 inline-block">
                          {perf.totalPesos > 0 ? 'Con Actividad' : 'Sin Ventas'}
                        </span>
                      </div>
                    </div>

                    {/* Progress visual indicator */}
                    <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden mt-1">
                      <div 
                        className="bg-gradient-to-r from-[#7294A0] to-[#305975] h-full rounded-full transition-all duration-500" 
                        style={{ width: `${Math.max(percentage, 2)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. HISTORIAL DE CORTES DE CAJA */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-[#305975] flex items-center gap-2">
                <span className="w-2 h-6 bg-[#305975] rounded-full"></span>
                Cortes de Caja
              </h2>
              <span className="text-xs font-semibold bg-[#7294A0]/10 text-[#305975] px-2.5 py-1 rounded-full uppercase tracking-wider font-bold">
                {cortes.length} Históricos
              </span>
            </div>

            {cortes.length === 0 ? (
              <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-xs text-gray-500 font-medium font-sans">No hay cortes de caja registrados en este turno.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto pr-1">
                {cortes.map((corte) => (
                  <div key={corte.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-[#305975]">{corte.id}</span>
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-mono font-bold">
                          ENTREGADO
                        </span>
                      </div>
                      <p className="text-xs font-bold text-gray-800 mt-1 truncate">{corte.vendedorNombre}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5 font-mono">
                        {corte.fecha} • {corte.ventasCount} despachos • {corte.litrosVendidos} Litros
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-gray-950 font-mono block">
                        ${corte.totalVendido.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-[9px] text-slate-400 block font-sans italic">Efectivo Cuadrado</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* 5. LIVE TICKETS BITACORA */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <h2 className="text-lg font-bold text-[#305975] flex items-center gap-2">
            <span className="w-2 h-6 bg-[#305975] rounded-full"></span>
            Bitácora de Operaciones
          </h2>
        </div>

        {ventas.length === 0 ? (
          <div className="p-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500 font-medium">No hay despachos de gas listados en el sistema.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-slate-400 uppercase font-bold tracking-wider">
                  <th className="py-3 px-4 font-mono">ID Ticket</th>
                  <th className="py-3 px-4">Operador</th>
                  <th className="py-3 px-4">Cliente / Celular</th>
                  <th className="py-3 px-4 text-right">Lts Despacho</th>
                  <th className="py-3 px-4 text-right">M.N. Litro</th>
                  <th className="py-3 px-4 text-right">Total Cobro</th>
                  <th className="py-3 px-4 text-center">Ticket</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[...ventas].reverse().map((venta) => (
                  <tr key={venta.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#305975]">{venta.id}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-gray-900">{venta.vendedorNombre}</div>
                      <div className="text-[10px] text-gray-400 font-mono">{new Date(venta.fecha).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-800">{venta.clienteNombre || 'Consumidor Final'}</div>
                      <div className="text-[10px] text-[#7294A0] font-mono">{venta.clienteWhats || 'Sin whats'}</div>
                    </td>
                    <td className="py-3 px-4 text-right font-black text-gray-900 font-mono">{venta.litros.toFixed(1)} L</td>
                    <td className="py-3 px-4 text-right text-gray-500 font-mono">${venta.precioPorLitro.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right font-black text-slate-950 font-mono">${venta.total.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onOpenTicket(venta)}
                        className="p-1 px-2.5 text-xs font-semibold text-[#305975] hover:bg-[#305975]/10 rounded-lg flex items-center gap-1 mx-auto transition-all"
                      >
                        <FileText className="w-3.5 h-3.5" /> Ver Ticket
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
