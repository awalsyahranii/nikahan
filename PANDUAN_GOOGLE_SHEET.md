# Panduan Integrasi RSVP & Ucapan ke Google Sheets

File integrasi Google Apps Script telah disiapkan di file [`google-apps-script.js`](./google-apps-script.js).

Fitur ini akan mencatat semua data dari form RSVP website langsung ke Google Sheets secara real-time:
- **Timestamp** (Waktu kirim)
- **Nama Tamu**
- **Konfirmasi Kehadiran** (Hadir / Tidak Hadir / Masih Ragu)
- **Jumlah Tamu** (1 Orang / 2 Orang)
- **Stiker Reaksi** (Nama stiker: Quby Cheering, Dancing, Bubu Dudu, Cute Bear, Hearts, Cheers, Cake, Rings, Happy, Dudu Dance, atau Polos)
- **File Stiker** (URL gambar stiker)
- **Ucapan & Doa**

---

## Langkah 1: Buat Google Sheet Baru
1. Buka [Google Sheets](https://sheets.new) di browser Anda.
2. Beri nama file Spreadsheet, misalnya: **"RSVP Baso & Indah"**.

---

## Langkah 2: Buka Apps Script
1. Di menu Google Sheet atas, klik menu: **Ekstensi** > **Apps Script** (*Extensions > Apps Script*).
2. Akan terbuka tab baru Google Apps Script. Hapus semua tulisan/kode bawaan yang ada di editor.

---

## Langkah 3: Pasang Kode Script
1. Buka file [`google-apps-script.js`](./google-apps-script.js) yang ada di folder proyek ini.
2. Salin (**Copy**) seluruh isi kodenya.
3. Tempel (**Paste**) ke editor Google Apps Script tadi.
4. Klik tombol **Simpan** (ikon disket) atau tekan `Ctrl + S`.

---

## Langkah 4: Terapkan Sebagai Aplikasi Web (Deploy)
1. Di pojok kanan atas, klik tombol biru **Terapkan** (*Deploy*) > pilih **Penerapan baru** (*New deployment*).
2. Klik ikon gerigi (Pilih jenis penerapan) di sebelah kiri > pilih **Aplikasi web** (*Web app*).
3. Atur pengaturannya seperti berikut:
   - **Deskripsi**: `RSVP Undangan Baso & Indah`
   - **Jalankan sebagai** (*Execute as*): **Saya** (*Me* - email Google Anda)
   - **Siapa yang memiliki akses** (*Who has access*): **Siapa saja** (*Anyone*) ⚠️ *(Wajib pilih 'Anyone' agar tamu undangan bisa mengirim RSVP tanpa perlu login Google)*.
4. Klik **Terapkan** (*Deploy*).
5. Jika muncul jendela *"Beri akses"* (*Authorize access*), pilih akun Google Anda > klik *"Advanced"* (Lanjutan) > klik *"Go to RSVP (unsafe)"* > klik **Allow**.
6. Setelah selesai, Google akan menampilkan **URL Aplikasi Web** (*Web App URL*) yang berakhiran `/exec`.
7. Klik **Salin** (*Copy*) pada URL tersebut.

---

## Langkah 5: Tempel URL ke Website
1. Buka file [`src/main.js`](./src/main.js).
2. Temukan baris ke-287:
   ```javascript
   const GOOGLE_SHEET_URL = '';
   ```
3. Tempel URL yang disalin tadi di dalam tanda petik, contoh:
   ```javascript
   const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxAbCdEf123456789/exec';
   ```
4. Simpan file (`Ctrl + S`), lalu jalankan build jika ingin mengunggah ke hosting:
   ```bash
   npx vite build
   ```

---

## Hasil di Google Sheets
Setiap kali tamu mengklik tombol **"Kirim Ucapan & Konfirmasi"**, Google Sheet Anda akan otomatis menambahkan baris baru dengan format tabel rapi bertema biru tua (Navy) dan teks tebal:

| Waktu Kirim (Timestamp) | Nama Tamu | Konfirmasi Kehadiran | Jumlah Tamu | Stiker Reaksi | File Stiker (URL) | Ucapan & Doa |
| :--- | :--- | :---: | :---: | :---: | :--- | :--- |
| 20 Okt 2026, 11:30 WITA | Budi Santoso | Hadir | 2 Orang | Quby Cheering | `./stickers/quby-cheering-2590833d.gif` | Selamat menempuh hidup baru Baso & Indah! |
