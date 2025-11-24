export interface Category {
  id: number
  name: string
  image: string
  icon?: string
}

export const mockCategories: Category[] = [
  {
    id: 1,
    name: 'Elektrikçi',
    image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&h=300&fit=crop',
  },
  {
    id: 2,
    name: 'Su Tesisatçısı',
    image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop',
  },
  {
    id: 3,
    name: 'Boya Badana',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=300&fit=crop',
  },
  {
    id: 4,
    name: 'Temizlik',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop',
  },
  {
    id: 5,
    name: 'Marangoz',
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop',
  },
  {
    id: 6,
    name: 'Nakliyat',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop',
  },
  {
    id: 7,
    name: 'Kuaför',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop',
  },
  {
    id: 8,
    name: 'Bahçıvan',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
  },
  {
    id: 9,
    name: 'Fotoğrafçı',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=300&fit=crop',
  },
  {
    id: 10,
    name: 'Özel Ders',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop',
  },
  {
    id: 11,
    name: 'Evcil Hayvan Bakımı',
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop',
  },
  {
    id: 12,
    name: 'Yemek & Catering',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=300&fit=crop',
  },
  {
    id: 13,
    name: 'Giyim & Dikiş',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
  },
  {
    id: 14,
    name: 'Spor & Fitness',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop',
  },
]

export default mockCategories
