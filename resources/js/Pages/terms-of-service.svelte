<script>
  import Header from '../Components/Header.svelte';
</script>

<Header group="home" />

<main class="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900 pt-24 pb-16">
  <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-sm sm:text-base text-gray-700 dark:text-gray-200">
    <header class="space-y-2">
      <p class="text-xs font-medium uppercase tracking-[0.18em] text-primary-600/80 dark:text-primary-300/80">
        Ketentuan Layanan
      </p>
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text白">
        Ketentuan Layanan QRScan
      </h1>
      <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
        Terakhir diperbarui: 19 November 2025
      </p>
    </header>

    <p>
      Dengan menggunakan QRScan, Anda setuju untuk terikat dengan Ketentuan Layanan ini. Jika Anda tidak menyetujui
      sebagian atau seluruh ketentuan, harap tidak menggunakan layanan QRScan.
    </p>

    <section class="space-y-3">
      <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
        1. Deskripsi Layanan
      </h2>
      <p>
        QRScan adalah layanan berbasis web yang membantu penyelenggara event dalam mengelola tiket dan kehadiran
        peserta menggunakan QR code, termasuk pembuatan event, distribusi e-ticket, dan proses check-in di gate.
      </p>
    </section>

    <section class="space-y-3">
      <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
        2. Akun & Tanggung Jawab Pengguna
      </h2>
      <ul class="list-disc pl-5 space-y-1">
        <li>Anda bertanggung jawab atas kerahasiaan kredensial login (email, nomor telepon, kata sandi).</li>
        <li>Anda wajib memastikan data event dan data peserta yang diinput adalah benar dan sah.</li>
        <li>Segala bentuk komunikasi, konten, dan aktivitas yang dilakukan melalui akun Anda menjadi tanggung jawab Anda.</li>
      </ul>
    </section>

    <section class="space-y-3">
      <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
        3. Penggunaan yang Dilarang
      </h2>
      <p>Anda dilarang menggunakan QRScan untuk:</p>
      <ul class="list-disc pl-5 space-y-1">
        <li>Kegiatan yang melanggar hukum atau peraturan yang berlaku di Indonesia.</li>
        <li>Mendistribusikan konten yang melanggar hak cipta, menyesatkan, atau merugikan pihak lain.</li>
        <li>Mengupayakan akses tidak sah ke sistem, database, atau infrastruktur QRScan.</li>
      </ul>
    </section>

    <section class="space-y-3">
      <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
        4. Pembayaran & Kebijakan Transaksi
      </h2>
      <p>
        Untuk event yang menggunakan pembayaran online, transaksi dapat diproses melalui mitra payment gateway
        pihak ketiga (saat ini Tripay). Ketentuan berikut berlaku:
      </p>
      <ul class="list-disc pl-5 space-y-1">
        <li>
          Nominal, biaya layanan, dan detail lain terkait transaksi akan ditampilkan dengan jelas sebelum Anda
          melakukan pembayaran.
        </li>
        <li>
          Status keberhasilan pembayaran mengikuti konfirmasi dari sistem Tripay. QRScan menampilkan status tersebut
          di dashboard/event Anda.
        </li>
        <li>
          Kebijakan refund, pembatalan, dan penjadwalan ulang event merupakan kebijakan masing-masing penyelenggara
          event. QRScan dan Tripay hanya menyediakan infrastruktur pembayaran dan pencatatan transaksi.
        </li>
      </ul>
    </section>

    <section class="space-y-3">
      <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
        5. Batas Tanggung Jawab
      </h2>
      <p>
        QRScan berupaya menjaga layanan tetap stabil dan dapat diandalkan, namun Anda memahami bahwa:
      </p>
      <ul class="list-disc pl-5 space-y-1">
        <li>
          Gangguan teknis dapat terjadi sewaktu-waktu (misalnya karena jaringan, gangguan server, atau pemeliharaan
          sistem).
        </li>
        <li>
          QRScan tidak bertanggung jawab atas kerugian tidak langsung, kehilangan keuntungan, atau kerusakan lain yang
          muncul akibat penggunaan atau ketidakmampuan menggunakan layanan.
        </li>
        <li>
          Penyelenggara event bertanggung jawab penuh atas isi acara, perizinan, dan hubungan hukum dengan peserta.
        </li>
      </ul>
    </section>

    <section class="space-y-3">
      <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
        6. Penghentian Layanan
      </h2>
      <p>
        Kami berhak untuk menangguhkan atau mengakhiri akses ke akun/layanan jika ditemukan pelanggaran terhadap
        Ketentuan Layanan ini, penyalahgunaan sistem, atau aktivitas lain yang berpotensi merugikan QRScan maupun
        pengguna lain.
      </p>
    </section>

    <section class="space-y-3">
      <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
        7. Perubahan Ketentuan
      </h2>
      <p>
        Ketentuan Layanan ini dapat diperbarui dari waktu ke waktu. Versi terbaru akan selalu tersedia di halaman ini.
        Dengan tetap menggunakan layanan setelah perubahan berlaku, Anda dianggap menyetujui Ketentuan Layanan yang
        baru.
      </p>
    </section>

    <section class="space-y-3">
      <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
        8. Kontak & Dukungan
      </h2>
      <p>
        Untuk pertanyaan terkait akun, event, pembayaran, atau kendala teknis, Anda dapat menghubungi kami melalui:
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
