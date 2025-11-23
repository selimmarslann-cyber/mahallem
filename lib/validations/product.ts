import { z } from 'zod'

export const deliveryTypeSchema = z.enum(['ON_SITE', 'PICKUP', 'DELIVERY'])

export const createProductSchema = z.object({
  name: z.string().min(2, 'Ürün adı en az 2 karakter olmalı'),
  description: z.string().optional(),
  price: z.number().positive('Fiyat pozitif olmalı'),
  isService: z.boolean().default(false),
  deliveryType: deliveryTypeSchema,
  photoUrl: z.string().url().optional().nullable(),
  active: z.boolean().default(true),
})

export const updateProductSchema = createProductSchema.partial()

