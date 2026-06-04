import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, CheckCircle, ShieldCheck } from 'lucide-react';

interface SplashProps {
  onComplete: () => void;
}

export function Splash({ onComplete }: SplashProps) {
  const [progress, setProgress] = useState(0);
  const [stepText, setStepText] = useState('Iniciando sistemas...');

  useEffect(() => {
    const texts = [
      'Cargando inventarios...',
      'Sincronizando precios de Gas LP en México...',
      'Estableciendo conexión segura...',
      '¡Listo para despachar!'
    ];

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 8) + 4;
        const index = Math.min(Math.floor((next / 100) * texts.length), texts.length - 1);
        setStepText(texts[index]);
        return next > 100 ? 100 : next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const delay = setTimeout(() => {
        onComplete();
      }, 700);
      return () => clearTimeout(delay);
    }
  }, [progress, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-b from-gray-900 via-slate-900 to-[#1e3444] px-6 py-12 text-white"
    >
      {/* Top Decorator */}
      <div className="flex flex-col items-center gap-1 opacity-70">
        <div className="flex items-center gap-1 text-xs tracking-widest font-mono text-secondary">
          <Flame className="w-4 h-4 animate-pulse text-[#7294A0]" />
          SISTEMA AUTOMATIZADO LP
        </div>
      </div>

      {/* Main Content Area: NO ENCAPSULES EL LOGO */}
      <div className="flex flex-col items-center justify-center max-w-sm text-center">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="mb-6 w-72 md:w-80"
        >
          {/* Logo element: original full aspect ratio, no circular clipping */}
          <img
            src="https://cossma.com.mx/coyotegaslogo.png"
            alt="Coyote Gas Logo"
            className="w-full h-auto object-contain drop-shadow-[0_8px_24px_rgba(114,148,160,0.3)]"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg font-medium text-slate-300 font-sans tracking-wide"
        >
          Servicio de Gas LP a domicilio
        </motion.h2>
        <p className="text-xs text-[#7294A0] uppercase tracking-widest mt-1 font-semibold">
          Precios actualizados para México
        </p>
      </div>

      {/* Bottom Progress Bar */}
      <div className="w-full max-w-xs flex flex-col items-center gap-3">
        <div className="w-full h-1.5 bg-gray-800/80 rounded-full overflow-hidden border border-white/5">
          <motion.div
            className="h-full bg-gradient-to-r from-[#7294A0] to-[#305975]"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut' }}
          />
        </div>
        
        <div className="flex flex-col items-center justify-center min-h-[40px]">
          <span className="text-sm font-medium tracking-wide text-slate-200">
            {progress}%
          </span>
          <span className="text-xs text-slate-400 font-mono italic animate-pulse mt-0.5">
            {stepText}
          </span>
        </div>

        {/* Quick Skip for dev speed or immediate access */}
        <button
          onClick={onComplete}
          className="mt-4 px-4 py-1.5 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/40 rounded-full border border-white/10 flex items-center gap-1 active:scale-95 transition-all"
        >
          <ShieldCheck className="w-3.5 h-3.5" /> Omitir y entrar
        </button>
      </div>
    </motion.div>
  );
}
