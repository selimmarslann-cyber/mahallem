'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const CATEGORIES = [
  'TESISAT',
  'KUAFOR',
  'MARKET',
  'NAKLIYE',
  'TEMIZLIK',
  'ELEKTRIK',
  'BOYA',
  'MARANGOZ',
  'DIGER',
]

export default function BusinessRegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    lat: 0,
    lng: 0,
    addressText: '',
    coverImageUrl: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Kullanıcı bilgisini session'dan al
      const userRes = await fetch('/api/auth/me', { credentials: 'include' })
      if (!userRes.ok) {
        router.push('/auth/login')
        return
      }
      const userData = await userRes.json()

      const res = await fetch('/api/businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          ownerUserId: userData.user.id,
        }),
        credentials: 'include',
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'İşletme kaydedilemedi')
        return
      }

      router.push('/dashboard/business')
    } catch (err) {
      setError('Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>İşletme Kaydı</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">İşletme Adı *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Açıklama</Label>
                <textarea
                  id="description"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Kategori *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Kategori seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="addressText">Adres *</Label>
                <Input
                  id="addressText"
                  value={formData.addressText}
                  onChange={(e) =>
                    setFormData({ ...formData, addressText: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lat">Enlem (Latitude) *</Label>
                  <Input
                    id="lat"
                    type="number"
                    step="any"
                    value={formData.lat || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        lat: parseFloat(e.target.value) || 0,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lng">Boylam (Longitude) *</Label>
                  <Input
                    id="lng"
                    type="number"
                    step="any"
                    value={formData.lng || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        lng: parseFloat(e.target.value) || 0,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverImageUrl">Kapak Görseli URL (Opsiyonel)</Label>
                <Input
                  id="coverImageUrl"
                  type="url"
                  value={formData.coverImageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, coverImageUrl: e.target.value })
                  }
                  placeholder="https://..."
                />
                <p className="text-xs text-gray-500">
                  TODO: İleride dosya yükleme eklenecek
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  İptal
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Kaydediliyor...' : 'Kaydet'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

