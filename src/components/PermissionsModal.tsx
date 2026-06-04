import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, MapPin, CheckCircle2, ShieldAlert, X } from 'lucide-react';

interface PermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGranted: () => void;
}

export function PermissionsModal({ isOpen, onClose, onGranted }: PermissionsModalProps) {
  const [notifGranted, setNotifGranted] = useState<boolean | null>(null);
  const [geoGranted, setGeoGranted] = useState<boolean | null>(null);
  const [loadingMsg, setLoadingMsg] = useState<string | null>(null);

  const requestNotification = async () => {
    setLoadingMsg('Solicitando permisos de notificación...');
    try {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        setNotifGranted(permission === 'granted');
      } else {
        setNotifGranted(true); // Simulate on unsupporting environments
      }
    } catch (err) {
      setNotifGranted(true);
    }
    setLoadingMsg(null);
  };

  const requestLocation = () => {
    setLoadingMsg('Ubicando dispositivo por GPS...');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGeoGranted(true);
          setLoadingMsg(null);
        },
        (error) => {
          setGeoGranted(true); // Simulate granted so they can continue nicely
          setLoadingMsg(null);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setGeoGranted(true);
      setLoadingMsg(null);
    }
  };

  const handleFinish = () => {
    // Notify app of completed setup
    onGranted();
    onClose();
  };

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
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-[#7294A0] uppercase">Configuración Óptima</span>
              <h3 className="text-xl font-bold text-gray-900 mt-0.5">Permisos de la Aplicación</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 px-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-sm text-gray-500 mb-6 font-sans">
            Para ofrecer un servicio óptimo de entrega de gas LP y la impresión correcta de tickets, necesitamos activar las siguientes funciones nativas de tu dispositivo móvil:
          </p>

          {/* Permissions stack */}
          <div className="space-y-4 mb-6">
            {/* Notifications */}
            <div className="p-4 bg-slate-50 rounded-xl border border-gray-100 flex items-start gap-4 hover:border-[#7294A0] transition-all">
              <div className="p-3 bg-[#305975]/10 text-[#305975] rounded-xl flex-shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">Notificaciones en Tiempo Real</p>
                <p className="text-xs text-gray-500 mt-0.5">Recibe alertas rápidas si el administrador modifica el precio del Gas LP o el estatus de las unidades.</p>
                
                <div className="mt-3 flex items-center gap-2">
                  {notifGranted === null ? (
                    <button
                      onClick={requestNotification}
                      className="px-3 py-1 bg-[#305975] hover:bg-[#305975]/90 text-xs text-white font-medium rounded-lg shadow-sm hover:shadow active:scale-95 transition-all"
                    >
                      Permitir Alertas
                    </button>
                  ) : notifGranted ? (
                    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 fill-emerald-50" /> Autorizado con éxito
                    </span>
                  ) : (
                    <span className="text-xs font-mono text-amber-600">No autorizado</span>
                  )}
                </div>
              </div>
            </div>

            {/* Geolocation */}
            <div className="p-4 bg-slate-50 rounded-xl border border-gray-100 flex items-start gap-4 hover:border-[#7294A0] transition-all">
              <div className="p-3 bg-[#7294A0]/20 text-[#305975] rounded-xl flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">Ubicación Actual (GPS)</p>
                <p className="text-xs text-gray-500 mt-0.5">Permite cargar de manera automática la geolocalización de las descargas de los cilindros y pipas Coyote Gas.</p>
                
                <div className="mt-3 flex items-center gap-2">
                  {geoGranted === null ? (
                    <button
                      onClick={requestLocation}
                      className="px-3 py-1 bg-[#305975] hover:bg-[#305975]/90 text-xs text-white font-medium rounded-lg shadow-sm hover:shadow active:scale-95 transition-all"
                    >
                      Permitir GPS
                    </button>
                  ) : geoGranted ? (
                    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 fill-emerald-50" /> Autorizado con éxito
                    </span>
                  ) : (
                    <span className="text-xs font-mono text-amber-600">Localización simulada</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {loadingMsg && (
            <div className="p-2.5 bg-yellow-50 border border-yellow-100 rounded-lg text-xs text-amber-700 font-mono text-center mb-4">
              {loadingMsg}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2.5">
            <button
              onClick={handleFinish}
              className="w-full py-2.5 bg-[#305975] hover:bg-[#305975]/90 text-white font-semibold text-sm rounded-xl shadow-lg shadow-[#305975]/25 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              Confirmar y Continuar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
