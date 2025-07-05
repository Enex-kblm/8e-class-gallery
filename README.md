# Galeri Kelas 8E

Sebuah aplikasi web galeri foto modern dan responsif yang dirancang khusus untuk memamerkan kenangan siswa-siswi Kelas 8E dengan antarmuka yang elegan dan user-friendly.

## 🌟 Fitur Utama

### 📸 Galeri Foto
- **Tampilan Grid & List**: Dua mode tampilan yang dapat disesuaikan
- **Lazy Loading**: Pemuatan gambar yang dioptimalkan untuk performa terbaik
- **Modal Foto**: Tampilan foto fullscreen dengan navigasi yang mudah
- **Thumbnail Navigation**: Navigasi cepat antar foto dalam modal

### 🔍 Pencarian & Filter
- **Pencarian Real-time**: Cari siswa berdasarkan nama secara instan
- **Filter Favorit**: Tampilkan hanya siswa yang ditandai sebagai favorit
- **Statistik**: Lihat ringkasan data siswa, foto, dan kelengkapan

### ❤️ Sistem Favorit
- **Tandai Favorit**: Simpan siswa favorit dengan penyimpanan lokal
- **Persistensi Data**: Favorit tersimpan antar sesi browser

### 📱 Responsif & Modern
- **Dark Mode**: Mode gelap yang dapat diaktifkan/nonaktifkan
- **Responsive Design**: Tampilan optimal di semua perangkat
- **Animasi Smooth**: Transisi dan animasi yang halus menggunakan Framer Motion

### 🔗 Berbagi & Download
- **Share URL**: Bagikan foto spesifik dengan URL langsung
- **Download Foto**: Unduh foto individual atau batch
- **Direct Photo View**: Tampilan foto langsung melalui URL khusus
- **Social Sharing**: Bagikan ke WhatsApp, Facebook, Twitter

### 🎨 UI/UX Premium
- **Apple-level Design**: Desain dengan perhatian detail tinggi
- **Micro-interactions**: Animasi halus untuk feedback visual
- **Consistent Spacing**: Sistem spacing 8px yang konsisten
- **Color System**: Sistem warna komprehensif dengan multiple shades

## 🛠️ Teknologi yang Digunakan

### Frontend Framework
- **React 18** - Library UI modern dengan hooks
- **TypeScript** - Type safety dan developer experience yang lebih baik
- **Vite** - Build tool yang cepat dan modern

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Library animasi untuk React
- **Lucide React** - Icon library yang konsisten

### State Management & Hooks
- **React Context** - Untuk theme management
- **Custom Hooks** - Untuk lazy loading dan URL parameters
- **Local Storage** - Untuk persistensi data favorit

### Performance & Optimization
- **Lazy Loading** - Pemuatan gambar yang dioptimalkan
- **Image Optimization** - Kompresi dan resize otomatis
- **Code Splitting** - Pemisahan kode untuk loading yang lebih cepat

## 🚀 Instalasi & Menjalankan Proyek

### Prasyarat
- Node.js (versi 16 atau lebih baru)
- npm atau yarn

### Langkah Instalasi

1. **Clone repository**
   ```bash
   git clone https://github.com/Enex-kblm/8e-class-gallery.git
   cd 8e-class-gallery
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Jalankan development server**
   ```bash
   npm run dev
   ```

4. **Buka browser**
   Akses `http://localhost:5173` untuk melihat aplikasi

### Build untuk Production

```bash
# Build aplikasi
npm run build

# Preview build
npm run preview
```

## 📁 Struktur Proyek

```
src/
├── components/          # Komponen React
│   ├── DarkModeToggle.tsx
│   ├── DirectPhotoView.tsx
│   ├── DownloadModal.tsx
│   ├── Gallery.tsx
│   ├── GroupPhotoCarousel.tsx
│   ├── LazyImage.tsx
│   ├── Navigation.tsx
│   ├── PhotoModal.tsx
│   ├── SearchAndFilter.tsx
│   ├── ShareModal.tsx
│   ├── StudentCard.tsx
│   ├── StudentHorizontalScroll.tsx
│   └── StudentStats.tsx
├── contexts/            # React Context
│   └── ThemeContext.tsx
├── data/               # Data JSON
│   ├── students.json
│   ├── groupPhotos.json
│   └── featuredStudents.json
├── hooks/              # Custom Hooks
│   ├── useLazyImage.ts
│   └── useUrlParams.ts
├── types/              # TypeScript Types
│   └── index.ts
├── App.tsx             # Komponen utama
├── main.tsx           # Entry point
└── index.css          # Global styles
```

## 🎯 Fitur Khusus

### Direct Photo View
Aplikasi mendukung URL langsung ke foto spesifik:
```
https://yoursite.com/?student=1&photo=0&view=direct
```

### URL Parameters
- `student`: ID siswa
- `photo`: Index foto (dimulai dari 0)
- `view=direct`: Mode tampilan langsung

### Keyboard Shortcuts
- `←/→`: Navigasi foto sebelumnya/selanjutnya
- `Esc`: Tutup modal atau keluar dari direct view
- `F`: Toggle fullscreen (dalam direct view)

## 📊 Data Management

### Format Data Siswa
```json
{
  "id": 1,
  "name": "Nama Siswa",
  "photos": [
    "https://example.com/photo1.jpg",
    "https://example.com/photo2.jpg"
  ]
}
```

### Format Data Grup Foto
```json
{
  "id": 1,
  "title": "Kenangan Kelas 8E",
  "photos": [
    "https://example.com/group1.jpg",
    "https://example.com/group2.jpg"
  ]
}
```

## 🎨 Customization

### Mengubah Tema
Edit file `tailwind.config.js` untuk menyesuaikan warna dan spacing:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#eff6ff',
        500: '#3b82f6',
        900: '#1e3a8a',
      }
    }
  }
}
```

### Menambah Data Siswa
Edit file `src/data/students.json` untuk menambah atau mengubah data siswa.

## 🔧 Scripts yang Tersedia

```bash
npm run dev          # Jalankan development server
npm run build        # Build untuk production
npm run preview      # Preview build production
npm run lint         # Jalankan ESLint
```

## 🌐 Browser Support

- Chrome (versi terbaru)
- Firefox (versi terbaru)
- Safari (versi terbaru)
- Edge (versi terbaru)

## 📱 Mobile Support

Aplikasi fully responsive dan dioptimalkan untuk:
- iOS Safari
- Android Chrome
- Mobile browsers lainnya

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan:

1. Fork repository
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 Lisensi

Proyek ini dibuat untuk keperluan edukasi dan dokumentasi kenangan kelas.

## 👨‍💻 Developer

Dibuat dengan ❤️ untuk melestarikan kenangan Kelas 8E.

**Fitur Unggulan:**
- Modern React architecture dengan TypeScript
- Performance-optimized dengan lazy loading
- Apple-level design aesthetics
- Comprehensive sharing capabilities
- Dark mode support
- Mobile-first responsive design

## 🔮 Roadmap

- [ ] PWA (Progressive Web App) support
- [ ] Offline mode
- [ ] Advanced search filters
- [ ] Photo tagging system
- [ ] Comments system
- [ ] Admin panel untuk management

## 📞 Support

Jika ada pertanyaan atau masalah, silakan buat issue di repository ini atau hubungi developer.

---

**Made with ❤️ for Class 8E** | © 2024-2025 Class 8E Gallery