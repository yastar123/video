# Smartlink Rotator Documentation

## Overview

Smartlink Rotator adalah sistem untuk mengelola dan merotasi 3 iklan smartlink dari EffectiveGateCPM secara otomatis. Sistem ini dirancang untuk meningkatkan CTR dan memberikan pengalaman yang lebih baik bagi pengguna.

## Smartlinks yang Tersedia

1. **Smartlink 1**: Premium Content
   - URL: `https://www.effectivegatecpm.com/a1pm3et2?key=1bf6eae1539e20a7d049e4876bf00c55`

2. **Smartlink 2**: Exclusive Videos  
   - URL: `https://www.effectivegatecpm.com/k1nsznbwe6?key=4605260c8e2dff4fd591290d334f54c8`

3. **Smartlink 3**: Special Offers
   - URL: `https://www.effectivegatecpm.com/by96i9ee?key=a0e61301b91f693d8a1866f59dd1de66`

## Components

### 1. SmartlinkRotator

Component tunggal yang merotasi smartlink setiap 10 detik.

```tsx
import { SmartlinkRotator } from '@/components/smartlink-rotator'

// Penggunaan dasar
<SmartlinkRotator />

// Dengan custom className
<SmartlinkRotator className="mb-4" />
```

**Fitur:**
- Rotasi otomatis setiap 10 detik
- Progress indicator animasi
- Close button untuk menyembunyikan
- Analytics tracking
- Responsive design

### 2. MultipleSmartlinks

Component untuk menampilkan multiple smartlinks dengan rotasi terpisah.

```tsx
import { MultipleSmartlinks } from '@/components/smartlink-rotator'

// Menampilkan 1 smartlink
<MultipleSmartlinks count={1} />

// Menampilkan 3 smartlink dengan rotasi berbeda
<MultipleSmartlinks count={3} />
```

**Fitur:**
- Rotasi setiap 8 detik untuk setiap link
- Offset rotasi agar tidak sinkron
- Analytics tracking untuk setiap klik

## Analytics

Smartlink Rotator dilengkapi dengan sistem analytics sederhana:

### Tracking Otomatis
Setiap klik pada smartlink akan otomatis di-track dan disimpan di:
- LocalStorage (client-side)
- Console log untuk debugging

### Menggunakan Analytics Hook

```tsx
import { useSmartlinkAnalytics } from '@/hooks/use-smartlink-analytics'

function MyComponent() {
  const { trackClick, getClickStats, getAnalytics, clearAnalytics } = useSmartlinkAnalytics()
  
  // Track klik manual
  const handleCustomClick = () => {
    trackClick('custom_id', 'https://example.com')
  }
  
  // Dapatkan statistik klik
  const stats = getClickStats()
  console.log('Click stats:', stats)
  
  // Dapatkan semua data analytics
  const allData = getAnalytics()
  
  // Hapus semua data analytics
  const clearData = () => {
    clearAnalytics()
  }
}
```

### Data yang Tersimpan

```typescript
interface SmartlinkAnalytics {
  linkId: string
  url: string
  timestamp: number
  userAgent?: string
  referrer?: string
}
```

## Implementasi di Halaman

### Halaman Utama (app/page.tsx)
```tsx
{/* Smartlinks Section */}
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8 w-full">
  <SmartlinkRotator />
  <SmartlinkRotator />
  <SmartlinkRotator />
</div>
```

### Halaman Video Detail (app/video/[id]/page.tsx)
```tsx
{/* Top Ads */}
<div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2">
  <SmartlinkRotator />
  <SmartlinkRotator />
  <SmartlinkRotator />
</div>

{/* Middle Ads */}
<div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
  <MultipleSmartlinks count={1} />
  <MultipleSmartlinks count={1} />
</div>

{/* Bottom Ads */}
<SmartlinkRotator />
```

## Customization

### Mengubah Interval Rotasi

Edit nilai interval di `SmartlinkRotator` component:

```tsx
// Ganti 10000 (10 detik) ke nilai yang diinginkan
useEffect(() => {
  const interval = setInterval(() => {
    setCurrentLinkIndex((prevIndex) => (prevIndex + 1) % SMARTLINKS.length)
  }, 10000) // 10 detik

  return () => clearInterval(interval)
}, [])
```

### Mengubah Styling

Component menggunakan Tailwind CSS. Modifikasi class untuk mengubah tampilan:

```tsx
className="block w-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 border border-purple-500/30 hover:border-purple-500/50 rounded-lg p-4 transition-all duration-300 group"
```

### Menambah/Mengubah Smartlinks

Edit array `SMARTLINKS` di component:

```tsx
const SMARTLINKS = [
  {
    id: 'smartlink_1',
    url: 'https://www.effectivegatecpm.com/a1pm3et2?key=1bf6eae1539e20a7d049e4876bf00c55',
    label: 'Premium Content'
  },
  // Tambah smartlink baru di sini
]
```

## Performance

- **Client-side rendering**: Component menggunakan "use client" untuk rotasi di browser
- **LocalStorage**: Analytics disimpan di localStorage untuk performa cepat
- **Optimized re-renders**: Menggunakan React hooks dengan dependency yang tepat
- **Responsive**: Component sudah dioptimasi untuk mobile dan desktop

## Troubleshooting

### Common Issues

1. **Smartlink tidak muncul**
   - Pastikan import sudah benar
   - Cek console untuk error

2. **Rotasi tidak berfungsi**
   - Pastikan component di-render di client-side
   - Cek useEffect dependency

3. **Analytics tidak ter-track**
   - Pastikan `useSmartlinkAnalytics` hook di-import
   - Cek localStorage availability

### Debug Mode

Aktifkan console log untuk debugging:

```tsx
// Di browser console
localStorage.getItem('smartlink_analytics')
```

## Future Enhancements

- Server-side analytics tracking
- A/B testing untuk smartlinks
- Geo-targeting
- Time-based rotation
- Performance dashboard
