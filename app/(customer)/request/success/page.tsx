'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'

export default function RequestSuccessPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
          </div>
          <h1 className="text-2xl font-bold mb-2">İş isteğin gönderildi</h1>
          <p className="text-gray-600 mb-6">
            Mahallendeki uygun esnaflara ilettik. Gelen teklifleri 'İşlerim' sekmesinden görebilirsin.
          </p>
          <Button
            onClick={() => router.push('/jobs')}
            className="w-full"
          >
            İşlerime Git
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

