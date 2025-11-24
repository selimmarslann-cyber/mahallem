# 📱 Mahallem Mobile App

Mahallem platformunun React Native (Expo) mobil uygulaması.

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Node.js 18+
- npm veya yarn
- Expo CLI (opsiyonel)
- iOS Simulator (Mac) veya Android Emulator

### Kurulum

1. **Mobil klasörüne gidin:**
```bash
cd mobile
```

2. **Bağımlılıkları yükleyin:**
```bash
npm install
```

3. **Uygulamayı başlatın:**
```bash
npm start
# veya
expo start
```

4. **QR kodu tarayın:**
- iOS: Expo Go uygulaması ile
- Android: Expo Go uygulaması ile
- Emulator: `a` (Android) veya `i` (iOS) tuşuna basın

## 📁 Proje Yapısı

```
mobile/
├── App.tsx                    # Ana uygulama giriş noktası
├── package.json               # Bağımlılıklar
├── app.json                   # Expo yapılandırması
├── tsconfig.json              # TypeScript yapılandırması
├── babel.config.js           # Babel yapılandırması
└── src/
    ├── navigation/
    │   └── BottomTabs.tsx     # Alt navigasyon
    ├── screens/
    │   ├── HomeScreen.tsx     # Ana sayfa
    │   ├── MapScreen.tsx      # Harita
    │   ├── LiveJobsScreen.tsx # Anlık işler
    │   ├── ProfileScreen.tsx  # Profil
    │   └── SettingsScreen.tsx # Ayarlar
    └── data/
        ├── mockCategories.ts  # Kategori mock data
        ├── mockJobs.ts        # İş ilanları mock data
        ├── mockServices.ts    # Hizmetler mock data
        └── mockVendors.ts     # Esnaf mock data
```

## ✨ Özellikler

### ✅ Tamamlanan
- **Ana Sayfa**: Kategori listesi, öne çıkan hizmetler
- **Harita**: Esnaf konumları, marker'lar
- **Anlık İşler**: İş ilanları listesi
- **Profil**: Kullanıcı bilgileri, bio
- **Ayarlar**: Bildirim ayarları, hesap yönetimi

### 🚧 Yapılacaklar
- [ ] Backend API entegrasyonu
- [ ] Authentication (Login/Register)
- [ ] Gerçek harita verileri
- [ ] Push notifications
- [ ] Sipariş takibi
- [ ] Chat/mesajlaşma
- [ ] Ödeme entegrasyonu
- [ ] Referral sistemi

## 🛠️ Teknolojiler

- **Expo**: React Native framework
- **React Navigation**: Navigasyon sistemi
- **React Native Maps**: Harita görünümü
- **TypeScript**: Tip güvenliği
- **Expo Vector Icons**: İkonlar

## 📱 Platform Desteği

- ✅ iOS
- ✅ Android
- ✅ Web (Expo Web)

## 🔧 Geliştirme Komutları

```bash
# Development server başlat
npm start

# Android emulator'de çalıştır
npm run android

# iOS simulator'de çalıştır (sadece Mac)
npm run ios

# Web'de çalıştır
npm run web
```

## 📦 Build ve Deployment

### Android APK
```bash
expo build:android
```

### iOS IPA
```bash
expo build:ios
```

### EAS Build (Önerilen)
```bash
npm install -g eas-cli
eas build --platform android
eas build --platform ios
```

## 🔗 Backend Entegrasyonu

Mobil uygulama şu an mock data kullanıyor. Backend API entegrasyonu için:

1. **API Base URL** ayarlayın:
```typescript
// src/config/api.ts
export const API_BASE_URL = 'https://api.mahallem.app'
```

2. **API servisleri oluşturun:**
```typescript
// src/services/api.ts
export const fetchBusinesses = async () => {
  const response = await fetch(`${API_BASE_URL}/api/businesses`)
  return response.json()
}
```

3. **Mock data yerine API çağrıları kullanın**

## 🎨 Tasarım

- **Brand Color**: `#FF7A00` (Turuncu)
- **Font**: System default
- **Icons**: Expo Vector Icons (Ionicons)

## 📝 Notlar

- Şu an tüm veriler mock data
- Harita için Google Maps API key gerekli (production)
- Push notifications için Expo Push Notification servisi
- Authentication için JWT token yönetimi eklenecek

## 🤝 Katkıda Bulunma

1. Feature branch oluşturun
2. Değişikliklerinizi commit edin
3. Pull request açın

## 📄 Lisans

© 2025 Mahallem. Tüm hakları saklıdır.

