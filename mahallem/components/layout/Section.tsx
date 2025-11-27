'use client'

import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface SectionProps {
  title: string
  subtitle?: string
  children: ReactNode
  actions?: {
    label: string
    href?: string
    onClick?: () => void
  }[]
  className?: string
  contentClassName?: string
}

export default function Section({
  title,
  subtitle,
  children,
  actions,
  className,
  contentClassName,
}: SectionProps) {
  return (
    <section className={cn('w-full py-8 md:py-12', className)}>
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        {(title || subtitle || actions) && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
            {(title || subtitle) && (
              <div>
                {title && (
                  <h2 className="text-2xl md:text-3xl font-semibold text-textPrimary mb-2">
                    {title}
                  </h2>
                )}
                {subtitle && (
                  <p className="text-base text-textSecondary">{subtitle}</p>
                )}
              </div>
            )}
            
            {actions && actions.length > 0 && (
              <div className="flex items-center gap-2">
                {actions.map((action, index) => (
                  action.href ? (
                    <a key={index} href={action.href}>
                      <Button
                        variant={index === 0 ? 'default' : 'outline'}
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        {action.label}
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </a>
                  ) : (
                    <Button
                      key={index}
                      variant={index === 0 ? 'default' : 'outline'}
                      size="sm"
                      onClick={action.onClick}
                      className="flex items-center gap-2"
                    >
                      {action.label}
                      {index === 0 && <ArrowRight className="w-4 h-4" />}
                    </Button>
                  )
                ))}
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className={cn('', contentClassName)}>
          {children}
        </div>
      </div>
    </section>
  )
}
