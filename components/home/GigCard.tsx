'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Clock } from 'lucide-react'
import { motion } from 'framer-motion'

interface GigCardProps {
  title: string
  location: string
  budget: string
  tag: string
  timeLabel?: string
  distance?: string
  onApply?: () => void
}

export default function GigCard({
  title,
  location,
  budget,
  tag,
  timeLabel,
  distance,
  onApply,
}: GigCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
      className="flex-shrink-0"
    >
      <Card className="bg-[#FFFDF7] border-2 border-slate-200 rounded-2xl p-6 w-80 shadow-md hover:shadow-xl transition-all h-full flex flex-col">
        <CardContent className="p-0 flex flex-col flex-1">
          <div className="flex items-start justify-between mb-4">
            <Badge className="bg-orange-100 text-orange-700 border-orange-200">{tag}</Badge>
            {timeLabel && (
              <Badge variant="outline" className="text-xs">
                <Clock className="w-3 h-3 mr-1" />
                {timeLabel}
              </Badge>
            )}
          </div>

          <h3 className="font-bold text-lg text-slate-900 mb-3 line-clamp-2">{title}</h3>

          <div className="space-y-2 mb-4 flex-1">
            <div className="flex items-center gap-2 text-slate-600">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{location}</span>
            </div>
            <p className="text-sm font-semibold text-slate-900">{budget}</p>
            {distance && (
              <p className="text-xs text-slate-500">Yakınında • {distance}</p>
            )}
          </div>

          <Button
            variant="outline"
            className="w-full border-orange-300 text-orange-600 hover:bg-orange-50"
            onClick={onApply}
          >
            Başvur
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}

