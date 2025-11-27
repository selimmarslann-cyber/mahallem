import type { ReactNode } from 'react'

import { cn } from '@/lib/utils/cn'

export type SectionProps = {
  title?: ReactNode
  subtitle?: ReactNode
  actions?: ReactNode
  children: ReactNode
  className?: string
  contentClassName?: string
}

/**
 * Uygulama genelinde kullanılan, kart görünümlü bölüm wrapper'ı.
 * Sadece UI bileşenidir, business logic içermez.
 */
function Section({
  title,
  subtitle,
  actions,
  children,
  className,
  contentClassName,
}: SectionProps) {
  return (
    <section
      className={cn(
        'rounded-2xl bg-surface shadow-[0_18px_45px_rgba(15,23,42,0.08)] border border-borderSoft/70 p-5 md:p-6',
        className
      )}
    >
      {(title || subtitle || actions) && (
        <header className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            {title && (
              <h2 className="text-lg md:text-xl font-semibold text-slate-900">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-sm text-textSecondary mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {actions && (
            <div className="mt-2 md:mt-0 flex items-center gap-2">
              {actions}
            </div>
          )}
        </header>
      )}
      <div className={cn('space-y-3', contentClassName)}>
        {children}
      </div>
    </section>
  )
}

export default Section
