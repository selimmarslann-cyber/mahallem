# 🚀 GitHub'a Yükleme Rehberi

## ✅ Git Repository Hazır

Git repository initialize edildi ve tüm dosyalar commit edildi.

## 📋 GitHub'a Yükleme Adımları

### 1. GitHub'da Yeni Repository Oluşturun

1. [GitHub](https://github.com) > **New repository**
2. Repository adı: `hizmetgo` (veya istediğiniz isim)
3. **Public** veya **Private** seçin
4. **Initialize with README** seçmeyin (zaten dosyalar var)
5. **Create repository** tıklayın

### 2. Remote Repository'yi Ekleyin

GitHub'da repository oluşturduktan sonra, size verilen URL'i kullanın:

```powershell
# HTTPS kullanarak:
git remote add origin https://github.com/KULLANICI_ADI/REPO_ADI.git

# VEYA SSH kullanarak:
git remote add origin git@github.com:KULLANICI_ADI/REPO_ADI.git
```

### 3. Branch Adını Ayarlayın (Opsiyonel)

```powershell
git branch -M main
```

### 4. GitHub'a Push Yapın

```powershell
git push -u origin main
```

## ⚠️ Önemli Notlar

1. **`.env` dosyası commit edilmedi** - `.gitignore`'da zaten var
2. **Hassas bilgiler** - `.env` dosyasındaki API key'ler, şifreler vs. GitHub'a yüklenmeyecek
3. **Migration dosyaları** - Tüm SQL migration'lar commit edildi
4. **Tüm kod değişiklikleri** - Commit edildi

## 🔍 Kontrol

Push işleminden sonra GitHub'da şunları kontrol edin:

- ✅ Tüm dosyalar yüklendi mi?
- ✅ `.env` dosyası yok mu? (olmalı, güvenlik için)
- ✅ Migration dosyaları var mı? (`supabase/migrations/`)
- ✅ Tüm kod dosyaları var mı?

## 📝 Sonraki Adımlar

1. GitHub repository'nizi oluşturun
2. Remote URL'i ekleyin (yukarıdaki komut)
3. `git push -u origin main` çalıştırın
4. GitHub'da dosyaları kontrol edin

---

**Not:** Eğer zaten bir GitHub repository'niz varsa, sadece remote URL'i ekleyip push yapmanız yeterli.

