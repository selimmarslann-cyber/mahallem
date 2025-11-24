import React, { createContext, useContext, useState, useCallback } from 'react'
import { mockVendors } from '../data/mockVendors'
import { mockCategories } from '../data/mockCategories'
import { mockKeywords } from '../data/mockKeywords'

export type UserRole = 'guest' | 'customer' | 'vendor'

export type OrderStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export interface UserProfile {
  id: string
  name: string
  phone: string
  neighborhood?: string
  avatarUrl?: string
  role: UserRole
}

export interface VendorProfile {
  id: string
  name: string
  businessName: string
  phone: string
  category: string
  rating: number
  location: {
    lat: number
    lng: number
    city: string
    district: string
    neighborhood: string
  }
  about?: string
  menu: Array<{
    id: string
    name: string
    price: number
    description?: string
  }>
}

export interface Order {
  id: string
  customerId: string
  vendorId: string
  serviceId?: string
  description: string
  budget?: { min?: number; max?: number }
  scheduledFor: string
  status: OrderStatus
  createdAt: string
}

export interface Keyword {
  id: string
  label: string
  categoryId?: string
  tags?: string[]
}

export interface AppState {
  currentUser: UserProfile | null
  vendors: VendorProfile[]
  orders: Order[]
  keywords: Keyword[]
  selectedCategoryId?: string
  selectedVendorId?: string
}

export interface AppActions {
  loginAsCustomer: (profileInput: {
    name: string
    phone: string
    neighborhood?: string
  }) => void
  loginAsVendor: (input: {
    name: string
    businessName: string
    phone: string
    category: string
    location?: Partial<VendorProfile['location']>
  }) => void
  logout: () => void
  registerVendorMenuItem: (
    vendorId: string,
    item: { name: string; price: number; description?: string }
  ) => void
  setSelectedCategoryId: (categoryId?: string) => void
  setSelectedVendorId: (vendorId?: string) => void
  createOrder: (orderInput: {
    vendorId: string
    serviceId?: string
    description: string
    scheduledFor: string
    budget?: { min?: number; max?: number }
  }) => void
}

const AppStateContext = createContext<AppState | undefined>(undefined)
const AppActionsContext = createContext<AppActions | undefined>(undefined)

// Convert mock vendors to VendorProfile format
const convertMockVendorsToProfiles = (): VendorProfile[] => {
  return mockVendors.map((v) => ({
    id: v.id.toString(),
    name: v.name.split(' ')[0] || v.name,
    businessName: v.name,
    phone: '+90 555 000 00 00', // Mock phone
    category: v.category,
    rating: v.rating,
    location: {
      lat: v.lat,
      lng: v.lng,
      city: 'Tekirdağ',
      district: 'Süleymanpaşa',
      neighborhood: 'Aydoğdu Mahallesi',
    },
    about: v.description,
    menu: [], // Will be populated from mockServices or added dynamically
  }))
}

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null)
  const [vendors, setVendors] = useState<VendorProfile[]>(() =>
    convertMockVendorsToProfiles()
  )
  const [orders, setOrders] = useState<Order[]>([])
  const [keywords] = useState<Keyword[]>(mockKeywords)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>()
  const [selectedVendorId, setSelectedVendorId] = useState<string | undefined>()

  const loginAsCustomer = useCallback(
    (profileInput: { name: string; phone: string; neighborhood?: string }) => {
      const newUser: UserProfile = {
        id: `user-${Date.now()}`,
        name: profileInput.name,
        phone: profileInput.phone,
        neighborhood: profileInput.neighborhood,
        role: 'customer',
      }
      setCurrentUser(newUser)
    },
    []
  )

  const loginAsVendor = useCallback(
    (input: {
      name: string
      businessName: string
      phone: string
      category: string
      location?: Partial<VendorProfile['location']>
    }) => {
      const newUser: UserProfile = {
        id: `vendor-${Date.now()}`,
        name: input.name,
        phone: input.phone,
        role: 'vendor',
      }
      setCurrentUser(newUser)

      const newVendor: VendorProfile = {
        id: `vendor-${Date.now()}`,
        name: input.name,
        businessName: input.businessName,
        phone: input.phone,
        category: input.category,
        rating: 0,
        location: {
          lat: input.location?.lat || 40.978,
          lng: input.location?.lng || 27.511,
          city: input.location?.city || 'Tekirdağ',
          district: input.location?.district || 'Süleymanpaşa',
          neighborhood: input.location?.neighborhood || 'Aydoğdu Mahallesi',
        },
        menu: [],
      }
      setVendors((prev) => [...prev, newVendor])
    },
    []
  )

  const logout = useCallback(() => {
    setCurrentUser(null)
    setSelectedCategoryId(undefined)
    setSelectedVendorId(undefined)
  }, [])

  const registerVendorMenuItem = useCallback(
    (
      vendorId: string,
      item: { name: string; price: number; description?: string }
    ) => {
      setVendors((prev) =>
        prev.map((v) =>
          v.id === vendorId
            ? {
                ...v,
                menu: [
                  ...v.menu,
                  {
                    id: `item-${Date.now()}`,
                    name: item.name,
                    price: item.price,
                    description: item.description,
                  },
                ],
              }
            : v
        )
      )
    },
    []
  )

  const createOrder = useCallback(
    (orderInput: {
      vendorId: string
      serviceId?: string
      description: string
      scheduledFor: string
      budget?: { min?: number; max?: number }
    }) => {
      if (!currentUser || currentUser.role !== 'customer') {
        return
      }

      const newOrder: Order = {
        id: `order-${Date.now()}`,
        customerId: currentUser.id,
        vendorId: orderInput.vendorId,
        serviceId: orderInput.serviceId,
        description: orderInput.description,
        scheduledFor: orderInput.scheduledFor,
        budget: orderInput.budget,
        status: 'pending',
        createdAt: new Date().toISOString(),
      }
      setOrders((prev) => [...prev, newOrder])
    },
    [currentUser]
  )

  const state: AppState = {
    currentUser,
    vendors,
    orders,
    keywords,
    selectedCategoryId,
    selectedVendorId,
  }

  const actions: AppActions = {
    loginAsCustomer,
    loginAsVendor,
    logout,
    registerVendorMenuItem,
    setSelectedCategoryId,
    setSelectedVendorId,
    createOrder,
  }

  return (
    <AppStateContext.Provider value={state}>
      <AppActionsContext.Provider value={actions}>
        {children}
      </AppActionsContext.Provider>
    </AppStateContext.Provider>
  )
}

export const useAppState = (): AppState => {
  const context = useContext(AppStateContext)
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider')
  }
  return context
}

export const useAppActions = (): AppActions => {
  const context = useContext(AppActionsContext)
  if (!context) {
    throw new Error('useAppActions must be used within AppStateProvider')
  }
  return context
}

