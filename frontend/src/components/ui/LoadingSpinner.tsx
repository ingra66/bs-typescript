import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-32 h-32',
};

const textSizes = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

export default function LoadingSpinner({
  message = 'Cargando...',
  size = 'md',
  className = '',
}: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center justify-center min-h-[60vh] p-8 gap-4 ${className}`}>
      <div className="relative flex items-center justify-center">
        {/* Logo titilando */}
        <motion.div
          animate={{
            opacity: [1, 0.5, 1],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className={`relative z-10 ${sizeClasses[size]}`}
        >
          <img
            src="/logo-beltspot.png"
            alt="BeltSpot"
            className="w-full h-full object-contain drop-shadow-lg"
            draggable={false}
          />
        </motion.div>
      </div>
      {/* Mensaje de carga */}
      <motion.p
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        className={`text-[#cc0000] font-bold text-[0.6rem] text-center mt-2`}
      >
        {message}
      </motion.p>
    </div>
  );
} 