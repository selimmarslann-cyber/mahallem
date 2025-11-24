'use client'

import { motion } from 'framer-motion'

export default function Logo({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className={className}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Bold Thick M - Premium Design */}
        {/* Left vertical bar - thick */}
        <rect
          x="15"
          y="15"
          width="18"
          height="60"
          rx="3"
          fill="url(#orangeGradient)"
          opacity="0.95"
        />
        
        {/* Right vertical bar - thick */}
        <rect
          x="67"
          y="15"
          width="18"
          height="60"
          rx="3"
          fill="url(#orangeGradient)"
          opacity="0.95"
        />
        
        {/* Left diagonal - thick */}
        <path
          d="M 33 15 L 50 45 L 33 60 Z"
          fill="url(#orangeGradient)"
          opacity="0.95"
        />
        
        {/* Right diagonal - thick */}
        <path
          d="M 67 15 L 50 45 L 67 60 Z"
          fill="url(#orangeGradient)"
          opacity="0.95"
        />
        
        {/* Center vertical connector - thick */}
        <rect
          x="47"
          y="45"
          width="6"
          height="30"
          rx="2"
          fill="url(#orangeGradient)"
          opacity="0.95"
        />
        
        {/* Inner highlight for depth */}
        <rect
          x="18"
          y="18"
          width="12"
          height="54"
          rx="2"
          fill="url(#orangeHighlight)"
          opacity="0.3"
        />
        <rect
          x="70"
          y="18"
          width="12"
          height="54"
          rx="2"
          fill="url(#orangeHighlight)"
          opacity="0.3"
        />
        
        {/* Glow effect */}
        <rect
          x="15"
          y="15"
          width="18"
          height="60"
          rx="3"
          fill="url(#orangeGlow)"
          opacity="0.2"
        />
        <rect
          x="67"
          y="15"
          width="18"
          height="60"
          rx="3"
          fill="url(#orangeGlow)"
          opacity="0.2"
        />
        
        <defs>
          {/* Main vibrant orange gradient */}
          <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF7A00" stopOpacity="1" />
            <stop offset="50%" stopColor="#FF8A00" stopOpacity="0.98" />
            <stop offset="100%" stopColor="#FFB347" stopOpacity="0.95" />
          </linearGradient>
          
          {/* Highlight gradient */}
          <linearGradient id="orangeHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFB347" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#FF7A00" stopOpacity="0.2" />
          </linearGradient>
          
          {/* Glow gradient */}
          <radialGradient id="orangeGlow" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#FFB347" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FF7A00" stopOpacity="0.1" />
          </radialGradient>
        </defs>
      </svg>
    </motion.div>
  )
}

