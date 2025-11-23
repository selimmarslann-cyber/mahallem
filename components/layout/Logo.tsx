'use client'

import { motion } from 'framer-motion'

export default function Logo({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={className}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Background Circle */}
        <circle cx="50" cy="50" r="48" fill="url(#gradient1)" />
        
        {/* House/Building Icon */}
        <path
          d="M30 60 L30 75 L70 75 L70 60 L50 45 Z"
          fill="white"
          fillOpacity="0.95"
        />
        <rect x="40" y="60" width="20" height="15" fill="url(#gradient2)" />
        <circle cx="50" cy="52" r="3" fill="white" />
        
        {/* Neighborhood dots */}
        <circle cx="20" cy="70" r="2" fill="white" fillOpacity="0.8" />
        <circle cx="80" cy="70" r="2" fill="white" fillOpacity="0.8" />
        <circle cx="25" cy="50" r="1.5" fill="white" fillOpacity="0.6" />
        <circle cx="75" cy="50" r="1.5" fill="white" fillOpacity="0.6" />
        
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FCD34D" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  )
}

