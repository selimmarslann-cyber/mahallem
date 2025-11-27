/**
 * Profesyonel Stok Görsel Kütüphanesi
 * Unsplash'tan yüksek kaliteli, profesyonel görseller
 */

export const imageStock = {
  // Kategori Görselleri
  categories: {
    // Temizlik
    'ev-temizligi': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop',
    'hali-temizligi': 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=800&h=600&fit=crop',
    'ofis-temizligi': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
    'duzen-toplama': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
    
    // Tamir & Onarım
    'boya-tadilat': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop',
    'beyaz-esya': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    'tesisat': 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop',
    'elektrik': 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&h=600&fit=crop',
    'klima': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&h=600&fit=crop',
    'cilingir': 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&h=600&fit=crop',
    
    // Taşıma & Nakliyat
    'nakliyat': 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop',
    'parca-esya': 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop',
    'mobilya': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
    'hurda': 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&h=600&fit=crop',
    
    // Esnaf & Market
    'market': 'https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=800&h=600&fit=crop',
    'kasap': 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=800&h=600&fit=crop',
    'yemek': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
    'pastane': 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&h=600&fit=crop',
  },
  
  // Avatar Görselleri (Ustalar)
  avatars: {
    'usta-1': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    'usta-2': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    'usta-3': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    'usta-4': 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    'usta-5': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  },
  
  // Hero & Genel Görseller
  hero: {
    'happy-family': 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1200&h=800&fit=crop',
    'workers': 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&h=800&fit=crop',
    'service': 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&h=800&fit=crop',
  },
  
  // Usta Görselleri (Mutlu çalışanlar)
  workers: {
    'cleaning': 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=600&fit=crop',
    'painting': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop',
    'plumber': 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop',
    'electrician': 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&h=600&fit=crop',
    'moving': 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop',
  }
}

/**
 * Kategori görseli al
 */
export function getCategoryImage(categoryId: string): string {
  return imageStock.categories[categoryId as keyof typeof imageStock.categories] || imageStock.categories['ev-temizligi']
}

/**
 * Avatar görseli al
 */
export function getAvatarImage(avatarId: string): string {
  return imageStock.avatars[avatarId as keyof typeof imageStock.avatars] || imageStock.avatars['usta-1']
}

