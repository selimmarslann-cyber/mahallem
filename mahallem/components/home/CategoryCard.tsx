'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface CategoryCardProps {
  id: string
  name: string
  description: string
  icon?: LucideIcon
  color?: string
  href?: string
  image?: string
}

export default function CategoryCard({
  id,
  name,
  description,
  icon: Icon,
  color = 'bg-orange-100 text-orange-700',
  href = `/request?q=${encodeURIComponent(name.toLowerCase())}`,
  image,
}: CategoryCardProps) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        <Card className="h-full cursor-pointer border-2 border-gray-200 hover:border-[#FF6000]/30 hover:shadow-lg transition-all duration-200 bg-white overflow-hidden">
          <CardContent className="p-0">
            {/* Image */}
            {image ? (
              <div className="relative w-full h-32 md:h-40 overflow-hidden">
                <Image
                  src={image}
                  alt={name}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 20vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                {/* Name Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="font-black text-sm md:text-base text-white leading-tight drop-shadow-lg">
                    {name}
                  </h3>
                </div>
              </div>
            ) : (
              <div className="p-4 md:p-5">
                <div className="flex flex-col items-center text-center space-y-2">
                  {/* Name */}
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm md:text-base text-gray-900 leading-tight">
                      {name}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-600 line-clamp-2 leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  )
}
