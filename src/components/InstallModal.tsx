import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Share, PlusSquare, Smartphone, Download, CheckCircle, X, ShieldCheck } from 'lucide-react';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstall: () => void;
  isInstallable: boolean;
}

export function InstallModal({ isOpen, onClose, onInstall, isInstallable }: InstallModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          className="relative w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl p-6 border border-gray-100"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 px-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Logo illustration - NO ENCAPSULAR */}
          <div className="flex flex-col items-center text-center mt-2 mb-6">
            <img
              src="https://cossma.com.mx/coyotegasicono.png"
              alt="Coyote Gas Icon"
              className="w-20 h-20 object-contain rounded-2xl shadow-md border border-gray-100"
              referrerPolicy="no-referrer"
            />
            <h3 className="text-lg font-bold text-gray-900 mt-4">Instalar App de Coyote Gas</h3>
            <p className="text-xs text-gray-500 max-w-xs mt-1">
              Lleva el punto de venta y la administración contigo en tu pantalla de inicio sin ocupar almacenamiento pesado.
            </p>
          </div>

          <div className="space-y-4">
            {/* If direct installation is supported on this browser */}
            {isInstallable ? (
              <div className="p-4 bg-slate-50 rounded-xl border border-[#7294A0]/30 text-center">
                <span className="text-xs font-semibold text-[#305975] uppercase tracking-wider block mb-1">Detección de Sistema</span>
                <p className="text-sm text-gray-600 mb-4">¡Tu dispositivo es 100% compatible para instalación directa!</p>
                <button
                  onClick={() => {
                    onInstall();
                    onClose();
                  }}
                  className="w-full py-3 bg-[#305975] hover:bg-[#305975]/90 text-white font-bold text-sm rounded-xl shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4 animate-bounce" /> Instalar Aplicación Ahora
                </button>
              </div>
            ) : (
              /* Informative message */
              <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-lg text-xs text-blue-700 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>Si no se muestra el prompt automático, puedes forzar la instalación agregándola manualmente a continuación.</span>
              </div>
            )}

            {/* Instruction Tabs (Android & Apple instructions side by side/stacked) */}
            <div className="border-t border-gray-100 pt-4">
              <span className="text-xs font-bold text-gray-800 uppercase tracking-widest block mb-3">
                Instrucciones Manuales:
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Paso a paso iOS / Safari */}
                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-[#305975] mb-2">
                    <Smartphone className="w-3.5 h-3.5 text-[#7294A0]" />
                    Para iPhone / iPad (Safari)
                  </div>
                  <ol className="text-xs text-gray-600 space-y-2 list-decimal list-inside font-sans leading-relaxed">
                    <li>Abre esta app en el navegador <span className="font-semibold text-gray-900">Safari</span>.</li>
                    <li>Sube la barra inferior y presiona el botón <span className="font-semibold text-gray-900 inline-flex items-center gap-0.5 bg-white px-1.5 py-0.5 rounded border shadow-sm text-blue-600"><Share className="w-3 h-3" /> Compartir</span>.</li>
                    <li>Desliza y selecciona <span className="font-semibold text-gray-900 inline-flex items-center gap-0.5 bg-white px-1.5 py-0.5 rounded border shadow-sm"><PlusSquare className="w-3 h-3 text-gray-700" /> Agr. a inicio</span>.</li>
                    <li>Presiona <span className="font-bold text-gray-900">Agregar</span> arriba a la derecha.</li>
                  </ol>
                </div>

                {/* Paso a paso Android / Chrome */}
                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-[#305975] mb-2">
                    <Smartphone className="w-3.5 h-3.5 text-[#7294A0]" />
                    Para Android (Chrome)
                  </div>
                  <ol className="text-xs text-gray-600 space-y-2 list-decimal list-inside font-sans leading-relaxed">
                    <li>Presiona los <span className="font-bold text-gray-900">3 puntos verticales</span> en la esquina superior de Chrome.</li>
                    <li>Busca la opción que dice <span className="font-semibold text-gray-900 inline-flex items-center gap-0.5 bg-white px-1.5 py-0.5 rounded border shadow-sm"><Download className="w-3 h-3 text-gray-700" /> Instalar aplicación</span>.</li>
                    <li>Confirma la instalación en la ventana emergente de Android.</li>
                    <li>¡Listo! Coyote Gas se abrirá en pantalla completa nativa.</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-5 pt-3.5 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
            <span>Versión 1.3.0 (Optimizada PWA)</span>
            <span className="flex items-center gap-1 text-emerald-600 font-semibold uppercase">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Certificado Seguro SSL
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
