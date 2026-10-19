# Panduan Referensi & Solusi Error

Dokumen ini berisi daftar kendala dan pesan error yang paling sering muncul selama pengembangan aplikasi **Katalog UMKM**, beserta akar masalah dan langkah-langkah solusinya.

> [!TIP]
> **Cek panduan ini terlebih dahulu secara mandiri sebelum memanggil pendamping workshop.**

---

## Ringkasan Cepat

| Kategori | Masalah / Pesan Error | Tindakan Cepat |
| :--- | :--- | :--- |
| **Tampilan** | Halaman kosong putih, tidak ada pesan error | Periksa 4 titik: Terminal, `.env.local`, Supabase Table Editor, dan Console Browser (F12). |
| **Konfigurasi** | `.env.local` baru diubah tetapi tidak ada efek | Hentikan server lokal (`Ctrl + C`), lalu jalankan ulang `npm run dev`. |
| **Deployment** | Berhasil di localhost, tetapi gagal di link Vercel | Cek apakah git sudah di-push, Environment Variables di Vercel sudah diisi, dan lakukan **Redeploy**. |
| **Database** | `relation "produk" does not exist` | Skema database belum dibuat. Jalankan ulang isi file `docs/schema.sql` di SQL Editor Supabase. |
| **Build** | Build gagal di Vercel | Buka Vercel > Deployments > Deployment gagal > baca Build Logs, salin baris teks error merah ke AI Agent. |
| **Dependensi** | Error `Module not found` | AI mengimpor paket baru. Beri prompt: *"Gunakan hanya paket yang ada di package.json"*. |
| **Desain** | Tampilan komponen berubah berantakan | Tambahkan aturan pada prompt: *"Pertahankan styling UI di components/, cukup sambungkan fungsionalitas data"*. |
| **AI Tooling** | Kuota Antigravity habis / limit | Ganti model di pilihan model Antigravity, atau hubungi pendamping untuk akses cadangan. |
| **AI Tooling** | AI memodifikasi terlalu banyak file | Tolak/revert perubahan, lalu batasi nama file secara eksplisit pada prompt berikutnya. |
| **Autentikasi** | Lupa password admin yang baru | Reset password melalui dashboard Supabase: **Authentication > Users > titik tiga > Reset password**. |

---

## Penjelasan Detail & Solusi Langkah demi Langkah

### 1. Halaman Kosong (Blank Page) Tanpa Pesan Error
* **Gejala:** Browser hanya menampilkan halaman kosong putih tanpa teks apapun.
* **Langkah Pengecekan:**
  1. **Cek Terminal:** Lihat terminal tempat `npm run dev` berjalan. Apakah ada pesan *syntax error* atau error *module evaluation*?
  2. **Cek `.env.local`:** Pastikan URL dan key Supabase sudah terisi, tidak kosong, dan tidak memakai awalan `NEXT_PUBLIC_`.
  3. **Cek Supabase Table Editor:** Pastikan tabel `produk` sudah ada dan RLS aktif dengan policy yang benar.
  4. **Cek Browser Console (F12):** Buka tab *Console* dan tab *Network* di browser untuk melihat status kode HTTP (misalnya `500 Internal Server Error`, `404 Not Found`, atau redirect loop `307`).

---

### 2. Baru Mengubah `.env.local` Tetapi Tidak Berpengaruh
* **Penyebab:** Next.js hanya membaca variabel lingkungan (`process.env`) saat proses server pertama kali dinyalakan. Perubahan file `.env.local` saat server berjalan tidak langsung dimuat.
* **Solusi:**
  1. Tekan kombinasi tombol `Ctrl + C` di terminal untuk mematikan dev server.
  2. Jalankan kembali:
     ```bash
     npm run dev
     ```

---

### 3. Berhasil di Localhost, Tetapi Gagal di Link Vercel
* **Penyebab & Solusi:**
  1. **Kode belum terkirim ke remote repository:**
     Pastikan Anda sudah melakukan push perubahan:
     ```bash
     git add .
     git commit -m "update fitur"
     git push
     ```
  2. **Environment Variables di Vercel belum diatur:**
     Buka dashboard Vercel $\rightarrow$ pilih proyekmu $\rightarrow$ **Settings** $\rightarrow$ **Environment Variables**.
     Pastikan 3 variabel ini diisi dengan nilai yang sama dari `.env.local`:
     - `SUPABASE_URL`
     - `SUPABASE_PUBLISHABLE_KEY`
     - `SUPABASE_SECRET_KEY`
  3. **Belum melakukan Redeploy:**
     Setelah menyimpan Environment Variables di Vercel, buka menu **Deployments** $\rightarrow$ klik titik tiga `...` pada deployment terakhir $\rightarrow$ pilih **Redeploy**.

---

### 4. Error Database: `relation "produk" does not exist`
* **Penyebab:** Tabel `produk` belum dibuat di dalam proyek Supabase yang sedang terhubung.
* **Solusi:**
  1. Buka dashboard proyek di [supabase.com](https://supabase.com).
  2. Buka menu **SQL Editor** pada navigasi sebelah kiri.
  3. Klik **New query**.
  4. Buka file `docs/schema.sql` di editor proyek, salin seluruh kodenya, lalu tempel ke SQL Editor Supabase.
  5. Klik tombol hijau **Run**. Pastikan muncul status *"Success"*.

---

### 5. Build Gagal di Vercel
* **Penyebab:** Terjadi error saat Next.js menjalankan `next build` di mesin Vercel (misal: typo, export bermasalah, atau import yang salah).
* **Solusi:**
  1. Buka dashboard Vercel $\rightarrow$ masuk ke menu **Deployments**.
  2. Klik pada deployment yang statusnya merah (*Failed*).
  3. Klik bagian **Build Logs** lalu scroll ke bawah.
  4. Cari teks berwarna merah yang menjelaskan letak error.
  5. Salin baris error tersebut dan berikan ke AI Agent untuk dianalisis dan diperbaiki.

---

### 6. Error `Module not found`
* **Penyebab:** AI memasukkan `import` dari paket npm baru yang belum terpasang di `package.json` (misalnya paket icon baru atau utility tambahan).
* **Solusi:**
  - Tegaskan batasan dependensi pada prompt Anda:
    > *"Gunakan hanya paket yang sudah terpasang di `package.json` (Next.js, Tailwind CSS, @supabase/ssr, @supabase/supabase-js). Jangan mengimpor atau memasang dependensi baru."*

---

### 7. Tampilan Berubah / Berantakan
* **Penyebab:** AI mengubah struktur class Tailwind atau mengganti file komponen yang ada di folder `components/`.
* **Solusi:**
  - Tambahkan batasan tampilan pada prompt:
    > *"Jangan ubah tampilan, layout, maupun kelas Tailwind di folder `components/`. Pertahankan desain yang sudah ada, hanya sambungkan fungsionalitas datanya saja."*

---

### 8. Kuota Antigravity Habis
* **Penyebab:** Penggunaan token model AI telah mencapai batas limit harian/sesi.
* **Solusi:**
  1. Ubah model AI yang aktif melalui selector model Antigravity (pilih tier model lain yang masih memiliki kuota).
  2. Jika seluruh opsi habis, laporkan ke mentor/pendamping workshop untuk mendapatkan token atau tools cadangan.

---

### 9. AI Mengubah Terlalu Banyak File Sekaligus
* **Penyebab:** Instruksi prompt terlalu umum sehingga AI menyentuh file yang tidak relevan dengan tugas.
* **Solusi:**
  1. Batalkan (*revert/discard*) perubahan yang dibuat AI.
  2. Berikan instruksi yang berfokus pada 1 file spesifik per perintah, misalnya:
     > *"Hanya ubah file `app/admin/actions.js` dan `app/admin/login/page.jsx`. Jangan menyentuh file lainnya."*

---

### 10. Lupa Password Admin yang Baru
* **Penyebab:** Password admin telah diubah melalui fitur US-05, tetapi Anda lupa kredensial yang baru.
* **Solusi:**
  1. Buka dashboard [supabase.com](https://supabase.com).
  2. Masuk ke menu **Authentication** $\rightarrow$ **Users**.
  3. Cari baris email akun admin Anda (`pujadavi779@gmail.com`).
  4. Klik tombol titik tiga `...` di ujung kanan baris.
  5. Pilih **Send password reset** atau ubah langsung melalui dashboard Supabase, lalu coba login kembali di `/admin/login`.

---

> [!NOTE]
> Semua aturan keamanan proyek wajib tetap dipatuhi: kunci Supabase hanya boleh dipanggil dari server (Server Component/Server Action), dan tidak boleh memakai awalan `NEXT_PUBLIC_`.

