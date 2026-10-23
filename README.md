# Undangan Pernikahan Digital - Sora Botanica (Inveet.id Theme)

Proyek website undangan pernikahan digital berbasis tema **Sora Botanica** (dari Inveet.id), dibangun dengan arsitektur modern yang ringan, cepat, dan **siap di-hosting langsung di Vercel**.

---

## ✨ Fitur-Fitur Utama

1. **Cover & Envelope Interaktif**:
   - Pembuka layar penuh dengan animasi *botanical unfurl*.
   - Deteksi otomatis nama tamu undangan melalui URL parameter: `?to=Nama+Tamu` (contoh: `?to=Bapak+Joko+%26+Partner`).
   - Tombol **"Buka Undangan"** yang secara otomatis memutar musik latar (*Backsound Undangan Syar'i / Nasheed*).

2. **Desain Split Layout (Desktop) & Fluid Mobile**:
   - Tampilan Desktop: Split panel mewah (panel kiri tetap dengan ornamen & foto, panel kanan dapat di-scroll).
   - Tampilan Mobile: Responsif penuh dengan navigasi cepat di bagian bawah.

3. **Ornamen & Palet Warna Botani**:
   - Ornamen dedaunan asli format `.webp` (*garland, arch, wreath, meadow, canopy*).
   - Tekstur kertas linen (*paper wash*).
   - Efek partikel daun melayang halus (*canvas particle animation*).

4. **Konten Undangan Lengkap**:
   - **Kutipan Suci**: Q.S. Ar-Rum: 21 (teks Arab & terjemahan).
   - **Profil Mempelai**: Baso Salahuddin, S.Pd & Haslinda, S.Pd (Indah).
   - **Save The Date / Acara**: Akad Nikah & Resepsi dengan tombol *Petunjuk Lokasi Google Maps* & *Simpan ke Google Calendar*.
   - **Countdown Timer**: Penghitung mundur live (Hari, Jam, Menit, Detik).
   - **Voice of Us (Pesan Suara)**: Pemutar sapaan personal dari kedua mempelai dengan animasi *waveform*.
   - **Kisah Cinta (Love Story)**: Timeline perjalanan romantis tahun 2019.
   - **Galeri Foto (Bento Grid)**: 6 foto dokumentasi dengan modal *Lightbox* interaktif (Next, Prev, Zoom).
   - **Love Gift / Amplop Digital**: Rekening BCA dengan tombol *Salin Nomor Rekening* (disertai feedback *toast*) & konfirmasi via WhatsApp.
   - **Buku Tamu (RSVP & Wishes)**: Form ucapan dengan **25 pilihan stiker animasi**, disimpan secara otomatis di *LocalStorage*.
   - **Protokol Kesehatan & Penutup**.

---

## 🚀 Cara Menjalankan Secara Lokal

```bash
# 1. Masuk ke direktori proyek
cd Undangan11

# 2. Instal dependensi (jika belum)
npm install

# 3. Jalankan server pengembang
npm run dev
```

Buka browser di:
- Standar: `http://localhost:3000`
- Dengan nama tamu khusus: `http://localhost:3000/?to=Budi+Santoso+%26+Partner`

---

## 🌐 Cara Hosting di Vercel (100% Kompatibel)

Proyek ini telah dilengkapi dengan konfigurasi `vercel.json` dan skrip build Vite standar:

### Opsi 1: Menggunakan Git + Vercel Dashboard (Rekomendasi)
1. Buat repositori baru di GitHub / GitLab.
2. Push seluruh file proyek ke repositori tersebut:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Sora Botanica Wedding Invitation"
   git branch -M main
   git remote add origin https://github.com/USERNAME/REPO_NAME.git
   git push -u origin main
   ```
3. Buka [vercel.com](https://vercel.com), login, dan klik **"Add New Project"**.
4. Impor repositori GitHub tersebut.
5. Vercel akan otomatis mengenali framework **Vite**, Output Directory `dist`, dan Build Command `npm run build`.
6. Klik **Deploy**! Selesai dalam hitungan detik.

### Opsi 2: Menggunakan Vercel CLI Langsung dari Terminal
```bash
npx vercel
```
Ikuti instruksi login dan pemilihan project, undangan Anda akan langsung live di domain `https://nama-proyek.vercel.app`.
