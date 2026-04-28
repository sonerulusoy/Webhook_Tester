# Webhook Tester

Modern web teknolojileri ile hazırlanmış, üretime (production) hazır, modüler bir SaaS Başlangıç Projesi. 
Backend tarafında **.NET 10 (C#)**, Frontend tarafında ise **Vite + React + TypeScript + Tailwind CSS v4** kullanılmaktadır.

## 🚀 Proje İçeriği ve Özellikler
- **Kullanıcı Kimlik Doğrulaması:** JWT (JSON Web Token) tabanlı güvenli giriş ve kayıt sistemi.
- **Veritabanı:** Geliştirme kolaylığı için **SQLite** (Entity Framework Core ile PostgreSQL'e anında çevrilebilir).
- **Webhook Altyapısı:** Gelen POST ve GET isteklerini boyut sınırlandırması ve XSS korumaları ile loglayan, `react-json-view-lite` tabanlı şık bir izleme arayüzü.
- **Modern Arayüz:** Karanlık tema (Dark Mode) ve Glassmorphism esintilerine sahip `SharedComponents` kullanan temiz React mimarisi.
- **Birim Testler (Unit Tests):** `xUnit` ve `Moq` kütüphaneleri kullanılarak uç noktaların güvenilirliği doğrulanmıştır.

---

## 🛠️ Kurulum Adımları

Bu projeyi çalıştırmak için bilgisayarınızda **.NET 10 SDK** ve **Node.js (npm)** yüklü olmalıdır.

### 1. Backend (API) Kurulumu
Backend projesi `Backend/SaaS.Backend` dizinindedir.
```bash
# Backend klasörüne gidin
cd Backend/SaaS.Backend

# Bağımlılıkları yükleyin ve projeyi derleyin
dotnet build

# Veritabanını (SaaS.db) oluşturun ve güncelleyin
dotnet ef database update

# Uygulamayı ayağa kaldırın (Varsayılan olarak http://localhost:5099 portundan çalışır)
dotnet run
```

### 2. Frontend (Kullanıcı Arayüzü) Kurulumu
Frontend projesi `Frontend` dizinindedir.
```bash
# Frontend klasörüne gidin
cd Frontend

# Paketleri yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

---

## 🔗 API Uç Noktaları (Endpoints)

Arka ucunuz çalışıyorken API dökümantasyonunu şık bir arayüzde görmek için tarayıcıda `http://localhost:5099/scalar/v1` adresini ziyaret edebilirsiniz (Scalar OpenAPI).

Aşağıda bazı temel API uç noktaları listelenmiştir:

| Metot | Uç Nokta (Endpoint) | Açıklama |
| :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Sisteme yeni bir kullanıcı kaydeder. (Body: `{ email, password, fullName }`) |
| **POST** | `/api/auth/login` | Sisteme giriş yapar ve başarılı olursa bir `JWT Token` döner. |
| **POST** | `/api/webhook/receiver` | Dışarıdan gelen webhook (olay tetikleyici) JSON verilerini kaydeder. Maks 1MB sınır vardır. |
| **GET**  | `/api/webhook/receiver` | Test amaçlı; GET isteği ile gelen parametreleri (`?param=value`) veritabanına kaydeder. |
| **GET**  | `/api/webhook/latest` | Veritabanındaki en güncel 10 Webhook logunu listeler (Dashboard'da kullanılır). |

---

## 🧪 Birim Testlerini Çalıştırmak (xUnit)
API uç noktalarının hatasız çalıştığını yönetici veya geliştirici olarak teyit etmek için testleri koşabilirsiniz.
```bash
cd Backend/SaaS.Backend.Tests
dotnet test
```
Tüm testler geçiyorsa sistem stabil çalışıyor demektir.

---

## 🌐 Canlıya Alım (Production) ve Çevresel Değişkenler

Proje canlıya alınırken aşağıdaki değişkenlerin ayarlanması önerilir:

### Backend Değişkenleri
- `DATABASE_URL`: Veritabanı bağlantı dizesi. Ayarlanmazsa `appsettings.json` içindeki varsayılan SQLite kullanılır.
- `Jwt:Token`: Üretim ortamında çok daha uzun ve güvenli bir anahtar kullanılmalıdır.

### Frontend Değişkenleri
Frontend tarafında `Frontend/.env` dosyası oluşturulmalı veya CI/CD süreçlerinde şu değişken tanımlanmalıdır:
- `VITE_API_URL`: Backend API'nizin yayında olduğu URL (Örn: `https://api.saasapp.com`).

