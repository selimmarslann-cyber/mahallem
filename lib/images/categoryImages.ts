/**
 * Kategori görsel stok haritası
 * Her kategori için doğru görselleri eşleştirir
 */

export const CATEGORY_IMAGE_POOL: Record<string, string[]> = {
  'ev-temizligi': [
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=800&h=600&fit=crop'
  ],
  'hali-temizligi': [
    'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=800&h=600&fit=crop'
  ],
  'ofis-temizligi': [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop'
  ],
  'duzen-toplama': [
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop'
  ],
  'boya-badana': [
    'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&h=600&fit=crop'
  ],
  'boya-tadilat': [
    'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&h=600&fit=crop'
  ],
  'nakliyat': [
    'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop'
  ],
  'cilingir': [
    'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&h=600&fit=crop'
  ],
  'beyaz-esya': [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
  ],
  'evcil-hayvan': [
    'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=600&fit=crop'
  ],
  'bahce-bakimi': [
    'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop'
  ],
  'klima': [
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&h=600&fit=crop'
  ],
  'cam-balkon': [
    'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&h=600&fit=crop'
  ],
  'fotografci': [
    'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=600&fit=crop'
  ],
  'güvenlik': [
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop'
  ],
  'tasiyici': [
    'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop'
  ],
  'esnaf-market': [
    'https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=800&h=600&fit=crop'
  ],
  'tesisat': [
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop'
  ],
  'elektrik': [
    'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&h=600&fit=crop'
  ],
  'default': [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
  ]
}

/**
 * Kategori slug'ına göre görsel al
 */
export function getCategoryImage(categoryId: string, index: number = 0): string {
  const images = CATEGORY_IMAGE_POOL[categoryId] || CATEGORY_IMAGE_POOL['default']
  return images[index % images.length]
}

