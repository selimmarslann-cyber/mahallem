'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Star, MapPin, Clock } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface BusinessCardProps {
  id: string
  name: string
  category: string
  rating: number
  reviewCount: number
  distance?: number
  priceRange?: string
  image?: string
  isOnline?: boolean
  href?: string
}

export default function BusinessCard({
  id,
  name,
  category,
  rating,
  reviewCount,
  distance,
  priceRange,
  image,
  isOnline = false,
  href = `/business/${id}`,
}: BusinessCardProps) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        <Card className="h-full cursor-pointer border-2 border-gray-200 hover:border-[#FF6000]/30 hover:shadow-lg transition-all duration-200 bg-white overflow-hidden">
          {/* Image */}
          <div className="relative w-full h-40 md:h-48 bg-gray-100">
            {image ? (
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                <span className="text-4xl font-bold text-slate-400">
                  {name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            
            {/* Online Badge */}
            {isOnline && (
              <Badge className="absolute top-2 right-2 bg-green-500 text-white border-0">
                Online
              </Badge>
            )}
          </div>

          <CardContent className="p-4 md:p-5">
            <div className="space-y-3">
              {/* Name & Category */}
              <div>
                <h3 className="font-bold text-base md:text-lg text-gray-900 mb-1 line-clamp-1">
                  {name}
                </h3>
                <p className="text-xs md:text-sm text-gray-600 line-clamp-1">
                  {category}
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-sm text-gray-900">
                    {rating.toFixed(1)}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  ({reviewCount} değerlendirme)
                </span>
              </div>

              {/* Distance & Price */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                {distance !== undefined && (
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{distance.toFixed(1)} km</span>
                  </div>
                )}
                {priceRange && (
                  <Badge variant="outline" className="text-xs">
                    {priceRange} ₺
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  )
}

