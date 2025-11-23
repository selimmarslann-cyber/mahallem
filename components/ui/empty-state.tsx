import { Card, CardContent } from '@/components/ui/card'
import { Inbox } from 'lucide-react'

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: React.ReactNode
}

export default function EmptyState({
  title = 'Henüz burada bir kayıt yok',
  description = 'Yakında burada içerik görünecek.',
  icon,
}: EmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 px-4">
        {icon || <Inbox className="w-12 h-12 text-muted-foreground mb-4" />}
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground text-center max-w-sm">
          {description}
        </p>
      </CardContent>
    </Card>
  )
}

