# Mahallem Mobile App

Mahallem platformunun React Native (Expo) mobil uygulaması.

## Kurulum

1. **Bağımlılıkları yükleyin:**
```bash
cd mobile
npm install
```

2. **Expo CLI'yi global olarak yükleyin (opsiyonel):**
```bash
npm install -g expo-cli
```

3. **Uygulamayı başlatın:**
```bash
npm start
# veya
expo start
```

## Özellikler

- ✅ Ana sayfa (Kategoriler, Öne çıkan hizmetler)
- ✅ Harita görünümü (Esnaf konumları)
- ✅ Anlık işler listesi
- ✅ Kullanıcı profili
- ✅ Ayarlar sayfası

## Teknolojiler

- **Expo**: React Native framework
- **React Navigation**: Navigasyon
- **React Native Maps**: Harita entegrasyonu
- **TypeScript**: Tip güvenliği

## Geliştirme

### Android
```bash
npm run android
```

### iOS
```bash
npm run ios
```

### Web
```bash
npm run web
```

## Proje Yapısı

```
mobile/
├── App.tsx
├── src/
│   ├── navigation/
│   │   └── BottomTabs.tsx
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── MapScreen.tsx
│   │   ├── LiveJobsScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   └── SettingsScreen.tsx
│   └── data/
│       ├── mockCategories.ts
│       ├── mockJobs.ts
│       ├── mockServices.ts
│       └── mockVendors.ts
├── package.json
└── app.json
```

## Notlar

- Şu an mock data kullanılıyor
- Backend API entegrasyonu yapılacak
- Harita için Google Maps API key gerekli (production)

