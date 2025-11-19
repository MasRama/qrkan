<script>
  import Header from '../Components/Header.svelte';
</script>

<Header group="home" />

<main class="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900 pt-24 pb-16">
  <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-sm sm:text-base text-gray-700 dark:text-gray-200">
    <header class="space-y-2">
      <p class="text-xs font-medium uppercase tracking-[0.18em] text-primary-600/80 dark:text-primary-300/80">
        Kebijakan Privasi
      </p>
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
        Kebijakan Privasi QRKan
      </h1>
      <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
        Terakhir diperbarui: 19 November 2025
      </p>
    </header>

    <p>
      Kebijakan Privasi ini menjelaskan bagaimana QRKan mengumpulkan, menggunakan, menyimpan, dan melindungi
      data pribadi yang Anda berikan saat menggunakan layanan kami untuk pengelolaan event dan sistem kehadiran
      berbasis QR code.
    </p>

    <section class="space-y-3">
      <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
        1. Data yang Kami Kumpulkan
      </h2>
      <p>Kami dapat mengumpulkan data berikut:</p>
      <ul class="list-disc pl-5 space-y-1">
        <li>Data akun penyelenggara event: nama, email, nomor telepon, dan informasi profil lain yang Anda isi.</li>
        <li>Data peserta event: nama, email, nomor telepon (jika diisi), jenis tiket, dan status kehadiran.</li>
        <li>
          Data teknis: alamat IP, jenis browser, dan informasi perangkat yang digunakan untuk meningkatkan keamanan
          serta performa layanan.
        </li>
      </ul>
    </section>

    <section class="space-y-3">
      <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
        2. Penggunaan Data
      </h2>
      <p>Data yang kami kumpulkan digunakan untuk:</p>
      <ul class="list-disc pl-5 space-y-1">
        <li>Menyediakan dan mengoperasikan fitur QRKan (pembuatan event, tiket, dan proses check-in).</li>
        <li>Mengelola akses pengguna sesuai peran (organizer, gate operator, admin).</li>
        <li>Mengirimkan notifikasi terkait event atau akun (misalnya tiket, reset password, atau informasi teknis).</li>
        <li>Memantau dan meningkatkan keamanan sistem, termasuk pencegahan double-scan dan penyalahgunaan tiket.</li>
      </ul>
    </section>

    <section class="space-y-3">
      <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
        3. Pembayaran & Mitra Payment Gateway
      </h2>
      <p>
        Untuk transaksi online tertentu, QRKan dapat bekerja sama dengan mitra payment gateway pihak ketiga
        (saat ini Tripay) untuk memproses pembayaran. Data yang dapat dibagikan ke mitra antara lain:
      </p>
      <ul class="list-disc pl-5 space-y-1">
        <li>Nomor referensi transaksi dan nominal pembayaran.</li>
        <li>Nama dan kontak yang Anda masukkan saat melakukan transaksi.</li>
        <li>Informasi lain yang dibutuhkan untuk keperluan verifikasi dan pemrosesan pembayaran.</li>
      </ul>
      <p>
        Detail sensitif pembayaran (seperti data kartu) diproses langsung oleh mitra payment gateway sesuai standar
        keamanan mereka dan tidak disimpan oleh QRKan.
      </p>
    </section>

    <section class="space-y-3">
      <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
        4. Penyimpanan & Keamanan Data
      </h2>
      <p>Kami berupaya menjaga keamanan data dengan:</p>
      <ul class="list-disc pl-5 space-y-1">
        <li>Membatasi akses data hanya kepada pihak yang membutuhkan untuk operasional layanan.</li>
        <li>Menerapkan autentikasi akun dan proteksi akses ke dashboard penyelenggara.</li>
        <li>Melakukan pencatatan (log) terhadap aktivitas penting seperti check-in dan perubahan data.</li>
      </ul>
      <p>
        Meskipun kami telah menerapkan langkah keamanan yang wajar, tidak ada sistem yang sepenuhnya bebas risiko.
        Kami menganjurkan Anda menjaga kerahasiaan kredensial login dan mengakses QRKan hanya dari perangkat yang
        Anda percaya.
      </p>
    </section>

    <section class="space-y-3">
      <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
        5. Hak Pengguna
      </h2>
      <p>Anda dapat mengajukan permintaan untuk:</p>
      <ul class="list-disc pl-5 space-y-1">
        <li>Melihat atau memperbarui data akun yang tersimpan di QRKan.</li>
        <li>Memperbaiki kesalahan data jika terdapat informasi yang tidak akurat.</li>
        <li>Menonaktifkan akun jika sudah tidak ingin menggunakan layanan QRKan.</li>
      </ul>
    </section>

    <section class="space-y-3">
      <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
        6. Perubahan Kebijakan Privasi
      </h2>
      <p>
        Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Versi terbaru akan selalu tersedia
        di halaman ini. Jika perubahan bersifat signifikan, kami dapat memberikan pemberitahuan tambahan kepada Anda.
      </p>
    </section>

    <section class="space-y-3">
      <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
        7. Kontak
      </h2>
      <p>
        Jika Anda memiliki pertanyaan terkait Kebijakan Privasi ini atau penggunaan data pribadi di QRKan,
        Anda dapat menghubungi kami melalui:
      </p>
      <ul class="list-disc pl-5 space-y-1">
        <li>
          WhatsApp Support: <span class="font-semibold">0821-3114-3178</span>
          (<a href="https://wa.me/6282131143178" class="text-primary-600 dark:text-primary-300 underline hover:no-underline">klik untuk chat</a>)
        </li>
      </ul>
    </section>
  </section>
</main>
