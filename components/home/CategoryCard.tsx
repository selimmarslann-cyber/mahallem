'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { LucideIcon } from 'lucide-react'

interface CategoryCardProps {
  id: string
  name: string
  icon: LucideIcon
  color: string
  image?: string
  description?: string
  href: string
  index: number
}

export default function CategoryCard({
  name,
  icon: Icon,
  color,
  image,
  description,
  href,
  index,
}: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 + index * 0.02 }}
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.95 }}
    >
      <Link href={href}>
        <Card className="hover:shadow-xl transition-all cursor-pointer border-2 border-slate-200 hover:border-orange-400 group h-full overflow-hidden">
          {/* Category Image/Visual */}
          <div className="relative h-32 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
            {image ? (
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-300"
                style={{ backgroundImage: `url(${image})` }}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`w-20 h-20 rounded-2xl ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-10 h-10" />
                </div>
              </div>
            )}
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-orange-600 transition-colors">
                {name}
              </h3>
            </div>
            {description && (
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {description}
              </p>
            )}
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}

