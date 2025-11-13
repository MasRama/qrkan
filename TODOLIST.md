# TODOLIST – QR Attendance App

Dokumen ini adalah breakdown langkah implementasi berdasarkan `README.md`.

Gunakan sebagai panduan urutan kerja, bukan aturan kaku. Setiap bullet bisa dijadikan task kecil di issue tracker.

**Catatan desain:** Seluruh desain UI aplikasi (terutama halaman scan untuk gate operator) harus menggunakan pendekatan *mobile-first* terlebih dahulu, lalu dioptimalkan untuk tablet dan desktop.

---

## Fase 1 – Desain Data & Migrasi

- [x] **Definisikan skema tabel utama** (di folder `migrations/`)
  - [x] Tabel `users`
    - [x] `id`, `name`, `email` (unique), `password_hash` (jika pakai login klasik), `role` (`super_admin`, `organizer`, `gate_operator`).
  - [x] Tabel `events`
    - [x] `id`, `name`, `description`, `location`, `start_at`, `end_at`, `capacity`, `status` (`draft`, `published`, `closed`), owner `organizer_id`.
  - [x] Tabel `participants`
    - [x] `id`, `event_id`, `name`, `email`, `phone`.
  - [x] Tabel `tickets`
    - [x] `id`, `event_id`, `participant_id`, `token`, `status` (`pending`, `sent`, `checked_in`).
  - [x] Tabel `checkin_logs`
    - [x] `id`, `ticket_id`, `gate_name`/`gate_id`, `operator_id`, `checkin_at`.

- [x] **Buat migrasi Knex**
  - [x] Tambahkan file migrasi untuk setiap tabel.
  - [x] Jalankan `npx knex migrate:latest`.
  - [x] Cek struktur tabel di SQLite (via tool/CLI) untuk memastikan field sesuai.

- [x] **(Opsional) Seeder minimal**
  - [x] Buat seeder/manual insert untuk 1 `super_admin` default.

---

## Fase 2 – Autentikasi & Role Management

- [x] **Autentikasi dasar**
  - [x] Implementasi login sederhana (email + password) atau gunakan flow yang sudah tersedia di boilerplate jika ada.
  - [x] Hash password (misalnya bcrypt) saat registrasi/seed.

- [ ] **Role & otorisasi**
  - [x] Tambahkan middleware untuk cek role (`super_admin`, `organizer`, `gate_operator`).
  - [x] Lindungi route dashboard, manajemen event, manajemen peserta.
  - [x] Batasi halaman scan hanya untuk `gate_operator` (dan event/gate terkait, dengan `super_admin` sebagai override).

---

## Fase 3 – Manajemen Event

- [x] **Backend: EventController & service**
  - [x] Endpoint list event (untuk organizer & admin).
  - [x] Endpoint create event (form + store).
  - [x] Endpoint edit/update event.
  - [x] Endpoint change status event (`draft` → `published` → `closed`).

- [x] **Frontend: halaman event (Svelte/Inertia)**
  - [x] Halaman daftar event (table + filter by status).
  - [x] Halaman create/edit event (form).
  - [x] Indikator status event (draft/published/closed) di UI.

- [x] **Validasi dasar**
  - [x] Pastikan tanggal/waktu valid (start <= end).
  - [x] Batasi perubahan event jika status sudah `closed`.

---

## Fase 4 – Manajemen Peserta & Ticket

- [x] **Backend: Participant & Ticket service**
  - [x] Endpoint untuk menambah peserta ke event (input manual).
  - [ ] (Opsional) Endpoint untuk import peserta dari CSV.
  - [ ] Saat peserta ditambahkan:
    - [x] Generate record `ticket` untuk kombinasi `(event, participant)`.
    - [x] Generate `token` unik (mis. UUID v7 atau kombinasi Hashids + signature).
    - [x] Set status tiket awal `pending`.

- [ ] **QR Code & e-ticket generation (backend)**
  - [x] Pilih library generator QR untuk Node.js.
  - [x] Buat service untuk:
    - [x] Mengenerate QR code image dari `token`.
    - [x] Menyimpan file QR/e-ticket ke storage lokal (mis. di folder `public/tickets/` atau sejenis).
  - [x] Buat URL public download e-ticket berdasarkan token/slug aman.

- [x] **Frontend: Manajemen peserta**
  - [x] Halaman daftar peserta per event.
  - [x] Form tambah peserta baru.
  - [x] Tampilkan status tiket (`pending`, `sent`, `checked_in`).
  - [x] Tampilkan link **Download e-ticket** (untuk peserta atau organizer).

- [ ] **Integrasi channel lain (opsional)**
  - [ ] Desain endpoint/API yang bisa dipakai oleh bot Telegram untuk mengirim e-ticket.
  - [ ] Dokumentasikan format payload yang dipakai bot (tidak perlu implementasi bot dulu).

---

## Fase 5 – Halaman Scan Gate (Check-in)

- [x] **Backend: endpoint verifikasi tiket**
  - [x] Route untuk menerima token dari QR (GET/POST).
  - [x] Logika verifikasi:
    - [x] Cek tiket ada & milik event yang sesuai.
    - [x] Cek event belum `closed`.
    - [x] Cek tiket belum `checked_in`.
  - [x] Jika valid:
    - [x] Update status tiket → `checked_in`.
    - [x] Tambah record di `checkin_logs` (waktu, gate, operator).
  - [x] Jika tidak valid:
    - [x] Kembalikan status error (sudah dipakai / tidak ditemukan / event closed).

- [ ] **Frontend: halaman scan QR**
  - [x] Halaman khusus untuk `gate_operator` per event/gate.
  - [ ] Integrasi kamera browser untuk membaca QR (via library JS).
  - [x] Fallback input manual token jika kamera tidak tersedia.
  - [x] Tampilkan hasil verifikasi secara jelas:
    - [x] Sukses (warna hijau, info peserta & event).
    - [x] Sudah check-in sebelumnya (warna kuning/merah + waktu check-in).
    - [x] Tiket invalid (merah).

- [x] **Handling concurrency**
  - [x] Pastikan double-scan cepat pada ticket yang sama tetap aman (gunakan transaksi atau pengecekan status atomik di DB).

---

## Fase 6 – Dashboard & Laporan

- [x] **Ringkasan per event**
  - [x] Hitung total tiket.
  - [x] Hitung total `checked_in`.
  - [x] Hitung persentase kehadiran.

- [x] **Daftar peserta hadir/tidak hadir**
  - [x] Query peserta yang memiliki ticket `checked_in`.
  - [x] Query peserta dengan ticket bukan `checked_in`.

- [x] **UI laporan**
  - [x] Halaman dashboard untuk organizer.
  - [x] Tabel + filter (nama, email, status kehadiran).
  - [ ] (Opsional) Tombol export CSV.

---

## Fase 7 – Keamanan & Kualitas

- [x] **Keamanan token & QR**
  - [x] Pastikan token sulit ditebak (UUID v4/v7 atau kombinasi hash + secret).
  - [x] Jangan menaruh data sensitif langsung di QR; gunakan token yang di-lookup di server.

- [ ] **Validasi & error handling**
  - [ ] Validasi input di semua form (event, peserta, scan).
  - [ ] Tangani error dengan response yang konsisten (kode status + pesan).

- [x] **Rate limiting endpoint scan** (opsional)
  - [x] Tambahkan mekanisme rate limit pada route verifikasi tiket.

- [ ] **Audit log (opsional)**
  - [ ] Simpan informasi siapa yang membuat/mengubah event, menambahkan peserta, dll.

---

## Fase 8 – UX & Polishing

- [ ] **Perbaikan UI/UX (mobile-first)**
  - [ ] Desain layout Svelte + Tailwind dengan pendekatan mobile-first untuk dashboard & terutama halaman scan gate.
  - [ ] Tambahkan feedback visual (loading state, toast notifikasi, dll.).

- [ ] **Desain mobile-first**
  - [ ] Optimalkan seluruh UI untuk layar mobile sebagai target utama, terutama halaman scan (gate operator), lalu pastikan tetap nyaman di tablet & desktop.

- [ ] **Testing**
  - [ ] Uji end-to-end satu flow lengkap:
    - [ ] Buat event → tambah peserta → generate e-ticket → download e-ticket → scan di gate → cek laporan.

---

## Fase 9 – Roadmap Lanjutan (Opsional)

- [ ] Integrasi bot Telegram untuk pengiriman e-ticket & reminder.
- [ ] Dukungan multi-gate dengan monitoring realtime.
- [ ] Integrasi notifikasi lain (WhatsApp/Telegram API resmi).
- [ ] Self-checkin dengan layer validasi tambahan.
