import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Share, ExternalLink, Send, CheckCircle2, PhoneCall, X, Printer } from 'lucide-react';
import { Venta } from '../types';

interface TicketModalProps {
  venta: Venta | null;
  isOpen: boolean;
  onClose: () => void;
}

// Convert numbers to letters for elegant receipts (Simple Mexican Pesos formatter)
function numeroALetras(num: number): string {
  const enteros = Math.floor(num);
  const centavos = Math.round((num - enteros) * 100);
  
  // Basic translation dictionary for common transaction ranges
  const UNIDADES = ['', 'un', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce', 'trece', 'catorce', 'quince'];
  const DECENAS = ['', 'diez', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
  const CENTENAS = ['', 'cien', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];

  if (enteros === 0) return `Cero pesos ${centavos}/100 M.N.`;

  let letras = '';
  if (enteros >= 1000) {
    const miles = Math.floor(enteros / 1000);
    const resto = enteros % 1000;
    letras += miles === 1 ? 'mil ' : `${UNIDADES[miles]} mil `;
    // Simplified secondary parsing for standard tickets
  }

  const deTrunc = enteros % 1000;
  if (deTrunc > 0) {
    if (deTrunc >= 100) {
      const cent = Math.floor(deTrunc / 100);
      letras += cent === 1 && deTrunc % 100 === 0 ? 'cien ' : `${CENTENAS[cent]} `;
    }
    const dec = deTrunc % 100;
    if (dec > 0) {
      if (dec <= 15) {
        letras += `${UNIDADES[dec]} `;
      } else {
        const decen = Math.floor(dec / 10);
        const uni = dec % 10;
        letras += uni === 0 ? `${DECENAS[decen]} ` : `${DECENAS[decen]} y ${UNIDADES[uni]} `;
      }
    }
  }

  return `(${letras.toUpperCase()}PESOS ${centavos}/100 M.N.)`;
}

export function TicketModal({ venta, isOpen, onClose }: TicketModalProps) {
  const [successMsg, setSuccessMsg] = useState(false);
  const [overrideWhats, setOverrideWhats] = useState('');

  if (!isOpen || !venta) return null;

  const currentWhats = overrideWhats || venta.clienteWhats;

  // Build formatted WhatsApp link
  const handleSendWhatsApp = () => {
    if (!currentWhats || currentWhats.length < 10) {
      alert('Favor de ingresar un número de celular a 10 dígitos.');
      return;
    }

    const cleanNum = currentWhats.replace(/\D/g, '');
    const readableDate = new Date(venta.fecha).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const mensaje = 
      `🔥 *COYOTE GAS* 🔥\n` +
      `¡Muchas gracias por su compra!\n` +
      `----------------------------------------\n` +
      `*Comprobante de Suministro de Gas LP*\n` +
      `📄 *Ticket:* ${venta.id}\n` +
      `📅 *Fecha:* ${readableDate}\n` +
      `🚛 *Surtido por:* ${venta.vendedorNombre}\n` +
      `👤 *Cliente:* ${venta.clienteNombre}\n` +
      `----------------------------------------\n` +
      `*Litros Despachados:* ${venta.litros.toFixed(1)} L\n` +
      `*Precio Oficial:* $${venta.precioPorLitro.toFixed(2)} por litro\n` +
      `💰 *TOTAL COBRADO:* $${venta.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN\n` +
      `----------------------------------------\n` +
      `_Servicio Express Coyote Gas 🐺. ¡Energía confiable a su domicilio!_`;

    const encoded = encodeURIComponent(mensaje);
    const whatsappUrl = `https://wa.me/52${cleanNum}?text=${encoded}`;
    
    // Simulate send visual feedback
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      window.open(whatsappUrl, '_blank', 'noreferrer,noopener');
    }, 1200);
  };

  const formattedDate = new Date(venta.fecha).toLocaleString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-sm bg-gray-100 rounded-3xl overflow-hidden shadow-2xl p-4 border border-gray-200"
        >
          {/* Header Action Tools */}
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-gray-400 capitalize">Comprobante de Venta</span>
            <button
              onClick={onClose}
              className="p-1 px-1.5 hover:bg-gray-200 text-gray-500 hover:text-gray-900 rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* MAIN THERMAL TICKET SHAPE */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-5 font-mono text-xs text-gray-800 relative select-text">
            
            {/* Top Thermal jagged edge visual simulator */}
            <div className="absolute top-0 inset-x-5 h-1 bg-repeat bg-[radial-gradient(circle,transparent_1px,#fff_1px)] bg-[length:6px_6px] -translate-y-[5px]"></div>

            {/* Coyote Gas Logo - DISPLAYING FULLY, NOT ENCAPSULATED OR CLIPPED */}
            <div className="flex flex-col items-center text-center mt-3 mb-4">
              <img
                src="https://cossma.com.mx/coyotegaslogo.png"
                alt="Coyote Gas"
                className="w-48 h-auto object-contain"
                referrerPolicy="no-referrer"
              />
              <span className="text-[11px] font-black text-slate-800 tracking-widest mt-2 uppercase">COYOTE GAS S.A. DE C.V.</span>
              <p className="text-[9px] text-[#7294A0] font-sans font-bold leading-none mt-1">RFC: CGA-180423-LP4</p>
              <p className="text-[9px] text-gray-400 font-sans leading-relaxed mt-0.5 max-w-[200px]">Carr. Federal México-Puebla Km 23.5, CDMX, México</p>
            </div>

            {/* Ticket Metadata */}
            <div className="border-t border-b border-dashed border-gray-300 py-3.5 space-y-1 mb-4 text-[10px] leading-relaxed">
              <div className="flex justify-between">
                <span>COMPROBANTE:</span>
                <span className="font-bold text-gray-900">{venta.id}</span>
              </div>
              <div className="flex justify-between">
                <span>ESTACIÓN / CAMIÓN:</span>
                <span className="font-bold text-gray-900 truncate max-w-[150px]">{venta.vendedorNombre}</span>
              </div>
              <div className="flex justify-between">
                <span>CLIENTE:</span>
                <span className="font-bold text-gray-900 truncate max-w-[150px]">{venta.clienteNombre}</span>
              </div>
              <div className="flex justify-between">
                <span>MÉTODO DE PAGO:</span>
                <span className="font-bold text-gray-900">EFECTIVO M.N.</span>
              </div>
              <div className="flex justify-between text-[8px] text-gray-400 mt-1 uppercase text-center border-t border-dashed border-gray-100 pt-1">
                <span>FECHA DE EMISIÓN:</span>
                <span>{formattedDate}</span>
              </div>
            </div>

            {/* Line Items layout */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between font-bold border-b border-gray-200 pb-1 text-[10px]">
                <span>CONCEPTO DE CARGA</span>
                <span>TOTAL</span>
              </div>
              
              <div className="flex justify-between items-start pt-1">
                <div className="flex flex-col">
                  <span className="font-bold text-gray-900">SUITABLE GAS LP</span>
                  <span className="text-[9px] text-gray-500 font-sans">
                    {venta.litros.toFixed(1)} Litros x ${venta.precioPorLitro.toFixed(2)}/L
                  </span>
                </div>
                <span className="font-bold text-gray-900 font-mono">
                  ${venta.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Total Block */}
            <div className="border-t border-dashed border-gray-300 pt-3 mb-4 space-y-1.5 text-right font-mono">
              <div className="flex justify-between text-[11px]">
                <span>SUBTOTAL:</span>
                <span>${(venta.total / 1.16).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span>IVA DESGLOSADO (16%):</span>
                <span>${(venta.total - (venta.total / 1.16)).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-base font-black text-gray-950 border-t border-gray-100 pt-1.5">
                <span>NETO TOTAL:</span>
                <span>${venta.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="text-[8px] text-gray-400 leading-tight block text-left font-sans italic pt-1">
                {numeroALetras(venta.total)}
              </div>
            </div>

            {/* Bottom Slogans */}
            <div className="text-center space-y-2 pt-1">
              {/* Barcode simulation */}
              <div className="font-mono text-[8px] text-gray-400 bg-gray-50 p-1 border border-gray-100 uppercase tracking-widest leading-none flex flex-col justify-center items-center gap-0.5">
                <span className="text-[12px] tracking-tight block font-normal">||| | ||||| | ||| |||| | ||| | ||||</span>
                <span>{venta.id}-COYOTE2026-AUTORIZADO</span>
              </div>
              <div className="text-[8px] text-slate-500 leading-relaxed font-sans max-w-sm mx-auto">
                ¡Gracias por su compra! Conserve su ticket para futuras aclaraciones.<br/>
                Para reportar fugas o emergencias llame al <strong className="text-red-600 block">800-GAS-COYOTE</strong>
              </div>
            </div>
          </div>

          {/* WHATSAPP ACTION CARD BELOW TICKET */}
          <div className="mt-3.5 bg-white p-3.5 rounded-2xl border border-gray-200 space-y-3 shadow-md">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Compartir Comprobante</span>
            
            <div className="space-y-2">
              <div className="flex gap-1.5">
                <div className="relative flex-1">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold font-mono text-gray-400">+52</span>
                  <input
                    type="tel"
                    placeholder="Celular destinatario"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    value={currentWhats}
                    onChange={(e) => setOverrideWhats(e.target.value)}
                    className="w-full text-xs pl-10 pr-2 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#7294A0] font-bold"
                  />
                </div>
                
                <button
                  onClick={handleSendWhatsApp}
                  disabled={successMsg}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-500 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1 active:scale-95 transition-all shadow"
                >
                  {successMsg ? (
                    'Enviando...'
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5-center" /> Whatsapp
                    </>
                  )}
                </button>
              </div>

              {successMsg && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[10px] font-bold text-emerald-600 text-center font-sans"
                >
                  ¡Abriendo ventana de WhatsApp para enviar el ticket!
                </motion.p>
              )}
            </div>

            <button
              onClick={() => {
                window.print();
              }}
              className="w-full py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-[10px] uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 transition-all"
            >
              <Printer className="w-3.5 h-3.5" /> Imprimir Ticket (Bluetooth / POS)
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
