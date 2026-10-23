/**
 * ==============================================================================
 * GOOGLE APPS SCRIPT: INTEGRASI RSVP & BUKU UCAPAN (GOOGLE SHEETS)
 * Undangan Pernikahan Baso Salahuddin, S.Pd & Haslinda, S.Pd (Indah)
 * ==============================================================================
 * 
 * CARA MENGGUNAKAN:
 * 1. Buat Google Spreadsheet baru di Google Drive (misal beri nama: "RSVP Baso & Indah").
 * 2. Di menu atas Google Sheet, klik: Ekstensi (Extensions) > Apps Script.
 * 3. Hapus semua kode default di Apps Script, lalu COPY & PASTE seluruh isi file ini.
 * 4. Klik tombol Simpan (ikon disket) atau Ctrl + S.
 * 5. Klik tombol biru "Terapkan" (Deploy) di kanan atas > "Penerapan Baru" (New deployment).
 * 6. Klik ikon gerigi (Pilih jenis) > pilih "Aplikasi Web" (Web app).
 * 7. Isi konfigurasi:
 *    - Deskripsi: RSVP Undangan
 *    - Jalankan sebagai (Execute as): Saya (Me / email Anda)
 *    - Siapa yang memiliki akses (Who has access): Siapa saja (Anyone) -> [PENTING!]
 * 8. Klik "Terapkan" (Deploy). Berikan izin akses Google jika diminta.
 * 9. Salin "URL Aplikasi Web" (Web App URL) yang berakhiran "/exec".
 * 10. Buka file `src/main.js` di proyek undangan, lalu paste URL tersebut ke variabel:
 *     `const GOOGLE_SHEET_URL = 'PASTE_URL_WEB_APP_DI_SINI';`
 * 
 * Selesai! Setiap ada tamu yang mengisi RSVP & Ucapan beserta stikernya,
 * data akan otomatis masuk dan tercatat rapi di Google Sheet Anda!
 * ==============================================================================
 */

// Nama Sheet (Tab) di Google Spreadsheet Anda
var SHEET_NAME = "RSVP";

/**
 * Menerima kiriman form RSVP & Ucapan dari website (POST)
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  // Kunci script selama 10 detik agar tidak terjadi bentrok saat banyak tamu kirim bersamaan
  lock.tryLock(10000);

  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getSheetByName(SHEET_NAME);

    // Jika tab dengan nama 'RSVP' belum ada, gunakan tab aktif atau buat baru
    if (!sheet) {
      sheet = doc.getActiveSheet();
      sheet.setName(SHEET_NAME);
    }

    // Inisialisasi Header otomatis jika baris pertama masih kosong
    if (sheet.getLastRow() === 0) {
      var headers = [
        "Waktu Kirim (Timestamp)",
        "Nama Tamu",
        "Konfirmasi Kehadiran",
        "Jumlah Tamu",
        "Stiker Reaksi",
        "File Stiker (URL)",
        "Ucapan & Doa"
      ];
      sheet.appendRow(headers);

      // Desain Header agar rapi & mewah (Tema Navy Blue & Gold)
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight("bold");
      headerRange.setFontFamily("Arial");
      headerRange.setBackground("#1A365D"); // Navy Blue
      headerRange.setFontColor("#FFFFFF"); // Putih
      headerRange.setHorizontalAlignment("center");
      headerRange.setVerticalAlignment("middle");
      sheet.setRowHeight(1, 35);
      sheet.setFrozenRows(1);
    }

    // Ekstraksi data dari parameter kiriman
    var data;
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else {
      data = e.parameter || {};
    }

    // Format waktu jika tidak dikirim dari klien
    var timestamp = data.timestamp || Utilities.formatDate(new Date(), "Asia/Makassar", "dd MMM yyyy, HH:mm") + " WITA";
    var name = data.name || "-";
    var attendance = data.attendance || "-";
    var pax = data.pax || "-";
    var stickerName = data.stickerName || (data.sticker ? "Stiker Reaksi" : "Tanpa Stiker (Polos)");
    var stickerUrl = data.sticker || data.stickerUrl || "-";
    var message = data.message || "-";

    // Tambahkan baris baru ke Google Sheet
    sheet.appendRow([
      timestamp,
      name,
      attendance,
      pax,
      stickerName,
      stickerUrl,
      message
    ]);

    // Format alignment baris baru
    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1).setHorizontalAlignment("center"); // Timestamp
    sheet.getRange(lastRow, 3).setHorizontalAlignment("center"); // Kehadiran
    sheet.getRange(lastRow, 4).setHorizontalAlignment("center"); // Jumlah Tamu
    sheet.getRange(lastRow, 5).setHorizontalAlignment("center"); // Stiker Nama

    // Berikan response sukses ke website
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Data RSVP & Stiker berhasil disimpan di Google Sheet."
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

/**
 * Menampilkan daftar ucapan yang tersimpan di Google Sheet saat website dibuka (GET)
 */
function doGet(e) {
  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getSheetByName(SHEET_NAME) || doc.getActiveSheet();
    var rows = sheet.getDataRange().getValues();

    var wishes = [];
    // Baris ke-0 adalah header, data dimulai dari baris ke-1
    for (var i = 1; i < rows.length; i++) {
      var row = rows[i];
      if (row[1]) { // jika kolom nama tidak kosong
        wishes.push({
          time: row[0],
          name: row[1],
          attendance: row[2],
          pax: row[3],
          stickerName: row[4],
          sticker: row[5] === "-" ? "" : row[5],
          message: row[6]
        });
      }
    }

    // Urutkan ucapan dari yang paling baru ke terlama
    wishes.reverse();

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      data: wishes
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString(),
      data: []
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
