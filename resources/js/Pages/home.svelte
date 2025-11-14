<!-- home.svelte -->
<script>
  import { inertia } from '@inertiajs/svelte'
  import { fly, fade, scale } from 'svelte/transition'
  import { page } from '@inertiajs/svelte'
  import Header from '../Components/Header.svelte'

  let user = $page.props.user

  let features = [
    {
      title: 'Kelola event dari satu dashboard',
      description:
        'Buat event, atur kapasitas, dan pantau status kehadiran tanpa spread­sheet dan kertas tambahan.',
      icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M4.5 9.75h15M6 20.25h12a2.25 2.25 0 002.25-2.25V7.5A2.25 2.25 0 0018 5.25H6A2.25 2.25 0 003.75 7.5v10.5A2.25 2.25 0 006 20.25z" />`
    },
    {
      title: 'QR e-ticket otomatis',
      description:
        'Setiap peserta langsung mendapat QR unik yang aman, siap discan di gate mana pun.',
      icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 4.5h6v6h-6v-6zM13.5 4.5h6v6h-6v-6zM4.5 13.5h6v6h-6v-6zM15 13.5h1.5a1.5 1.5 0 011.5 1.5V18" />`
    },
    {
      title: 'Scan gate super cepat',
      description:
        'Optimalkan flow antrean dengan tampilan mobile-first, kode warna yang jelas, dan proteksi double-scan.',
      icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M9 4.5v3m6-3v3M4.5 9h15M6.75 20.25h10.5A2.25 2.25 0 0019.5 18V9.75A2.25 2.25 0 0017.25 7.5h-10.5A2.25 2.25 0 004.5 9.75V18a2.25 2.25 0 002.25 2.25z" />`
    }
  ]

  let steps = [
    {
      title: 'Buat event & atur kapasitas',
      description:
        'Definisikan jadwal, lokasi, kapasitas, dan multi-gate hanya dalam beberapa klik dari dashboard.',
      badge: 'Organizer'
    },
    {
      title: 'Kirim e-ticket QR ke peserta',
      description:
        'Import daftar peserta lalu kirim e-ticket lewat email atau bagikan link registrasi publik.',
      badge: 'Ticketing'
    },
    {
      title: 'Scan & pantau real-time',
      description:
        'Operator gate cukup buka halaman scan, arahkan ke QR, dan lihat status kehadiran bergerak real-time.',
      badge: 'Gate operator'
    }
  ]

  let roles = [
    {
      id: 'organizer',
      label: 'Organizer',
      headline: 'Satu tempat untuk seluruh event-mu',
      points: [
        'Buat banyak event dengan konfigurasi berbeda dalam satu akun.',
        'Lihat ringkasan kapasitas, tiket terpakai, dan kehadiran secara langsung.',
        'Undang tim untuk mengelola gate tanpa memberikan akses penuh admin.'
      ]
    },
    {
      id: 'operator',
      label: 'Gate operator',
      headline: 'UI yang ramah di lapangan, bukan hanya di mockup',
      points: [
        'Mode scan layar penuh dengan feedback warna hijau/merah yang jelas.',
        'Info peserta penting tampil besar: nama, jenis tiket, dan status kehadiran.',
        'Bisa digunakan dari HP pribadi tanpa instalasi aplikasi tambahan.'
      ]
    },
    {
      id: 'admin',
      label: 'Super admin',
      headline: 'Kontrol dan keamanan data kehadiran',
      points: [
        'Kelola role pengguna (organizer, operator, admin) dari satu panel.',
        'Audit log check-in untuk investigasi jika ada komplain gate.',
        'Export laporan kehadiran untuk kebutuhan sponsor atau internal.'
      ]
    }
  ]

  let selectedRole = 'organizer'

  let stats = [
    { label: 'Max check-in / menit', value: '500+' },
    { label: 'Keberhasilan scan', value: '99.9%' },
    { label: 'Waktu setup event', value: '< 5 menit' }
  ]

  let faqs = [
    {
      question: 'Apakah bisa dipakai tanpa instalasi aplikasi khusus?',
      answer:
        'Bisa. QR Attendance berjalan lewat browser modern (Chrome, Safari, dll.) di laptop maupun smartphone.'
    },
    {
      question: 'Apakah sistem mendukung lebih dari satu gate?',
      answer:
        'Mendukung. Kamu bisa membuat beberapa gate sekaligus dan semua check-in tercatat ke event yang sama.'
    },
    {
      question: 'Bagaimana jika koneksi internet di venue tidak stabil?',
      answer:
        'Kami mengoptimalkan request agar tetap ringan. Untuk skenario ekstrem, kamu bisa atur strategi pre-check atau backup manual.'
    }
  ]

  let openFaq = 0

  const toggleFaq = (index) => {
    openFaq = openFaq === index ? null : index
  }
</script>

<Header group="home" />

<!-- Hero Section -->
<main class="bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900">
  <section id="hero" class="relative overflow-hidden">
    <div class="pointer-events-none absolute inset-0">
      <div class="absolute -top-32 -left-16 h-64 w-64 rounded-full bg-primary-500/20 blur-3xl"></div>
      <div class="absolute top-48 -right-10 h-72 w-72 rounded-full bg-primary-300/10 blur-3xl"></div>
    </div>

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 lg:pt-32 lg:pb-28">
      <div class="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div in:fly={{ y: 20, duration: 700 }}>
          <div class="inline-flex items-center gap-2 rounded-full bg-gray-900/5 dark:bg-gray-100/5 px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-200 mb-4">
            <span class="h-1.5 w-1.5 rounded-full bg-primary-500"></span>
            QR-powered attendance untuk event modern
          </div>

          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
            Satu platform untuk
            <span class="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">mengatur kehadiran event dengan rapi</span>
          </h1>

          <p class="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-xl mb-6">
            Kelola event, kirim QR e-ticket, dan proses check-in di gate hanya dengan browser. Tanpa antrian kacau,
            tanpa daftar manual yang berantakan.
          </p>

          <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
            <a
              href={user && user.id ? '/dashboard' : '/login'}
              use:inertia
              class="px-6 py-3 rounded-xl bg-primary-600 text-white text-sm sm:text-base font-semibold shadow-lg shadow-primary-500/30 hover:bg-primary-700 transition-all flex items-center justify-center gap-2"
            >
              Mulai kelola event
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-4 h-4"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </a>

            <a
              href="/login"
              use:inertia
              class="px-6 py-3 rounded-xl bg-white/70 dark:bg-gray-900/60 text-sm sm:text-base text-gray-800 dark:text-gray-100 border border-gray-200/70 dark:border-gray-700 hover:bg-gray-100/80 dark:hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
            >
              Coba sebagai gate operator
            </a>
          </div>

          <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <span class="inline-flex -space-x-2 overflow-hidden rounded-full border border-gray-200/60 dark:border-gray-700/60 bg-white/50 dark:bg-gray-900/60 px-1 py-0.5">
              <span class="h-6 w-6 rounded-full bg-primary-500/80"></span>
              <span class="h-6 w-6 rounded-full bg-emerald-400/80"></span>
              <span class="h-6 w-6 rounded-full bg-sky-400/80"></span>
            </span>
            Dipakai untuk seminar, konser mini, workshop kampus, dan internal company gathering.
          </p>
        </div>

        <div class="relative" in:fly={{ y: 20, duration: 700, delay: 150 }}>
          <div
            class="relative mx-auto max-w-md rounded-3xl border border-gray-100/80 dark:border-gray-800/80 bg-white/70 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl shadow-primary-500/20 p-5 sm:p-6"
            in:scale={{ duration: 300, delay: 200 }}
          >
            <div class="flex items-center justify-between mb-4">
              <div>
                <p class="text-xs font-medium uppercase tracking-wide text-gray-400">Live check-in</p>
                <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">Tech Conference 2025</p>
              </div>
              <span class="inline-flex items-center gap-1 rounded-full bg-emerald-100/80 dark:bg-emerald-500/10 px-2 py-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
                <span class="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Gate aktif
              </span>
            </div>

            <div class="grid grid-cols-3 gap-3 mb-4">
              <div class="rounded-2xl bg-gray-900 text-gray-50 p-3 flex flex-col justify-between">
                <p class="text-[11px] text-gray-300">Check-in</p>
                <p class="text-xl font-semibold">324</p>
                <p class="text-[11px] text-emerald-400 mt-1">+27 baru</p>
              </div>
              <div class="rounded-2xl bg-gray-50 dark:bg-gray-800 p-3">
                <p class="text-[11px] text-gray-500 dark:text-gray-400">Kapasitas</p>
                <p class="text-xl font-semibold text-gray-900 dark:text-gray-100">500</p>
                <p class="text-[11px] text-gray-400 mt-1">64% terisi</p>
              </div>
              <div class="rounded-2xl bg-gray-50 dark:bg-gray-800 p-3">
                <p class="text-[11px] text-gray-500 dark:text-gray-400">Gate aktif</p>
                <p class="text-xl font-semibold text-gray-900 dark:text-gray-100">3</p>
                <p class="text-[11px] text-gray-400 mt-1">Hall A, B, C</p>
              </div>
            </div>

            <div class="flex items-center justify-between rounded-2xl bg-gray-50 dark:bg-gray-900/70 p-3 mb-3">
              <div class="flex items-center gap-3">
                <div class="h-10 w-10 rounded-xl bg-gray-900 text-white flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    class="h-5 w-5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M3.75 4.5h16.5M3.75 9.75h16.5m-13.5 5.25h4.5"
                    />
                  </svg>
                </div>
                <div>
                  <p class="text-xs font-medium text-gray-500">Scan terakhir</p>
                  <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">Galih Pratama</p>
                  <p class="text-[11px] text-gray-500 dark:text-gray-400">Gate B · 2 detik lalu</p>
                </div>
              </div>
              <span class="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                VALID
              </span>
            </div>

            <div class="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 pt-1">
              <span>Proteksi double-scan aktif</span>
              <span>Data sinkron real-time</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Features Section -->
  <section id="features" class="py-20 bg-white/70 dark:bg-gray-950/90">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl mb-10" in:fly={{ y: 10, duration: 600 }}>
        <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Semua alur kehadiran di satu aplikasi
        </h2>
        <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300">
          Dari registrasi hingga laporan akhir, QRKan membantu mengurangi titik rawan error di setiap
          tahapan. Tanpa copy-paste data, tanpa verifikasi manual yang melelahkan.
        </p>
      </div>

      <div class="grid gap-6 md:grid-cols-3">
        {#each features as feature, i}
          <article
            class="group relative overflow-hidden rounded-2xl bg-gray-50 dark:bg-gray-900/70 border border-gray-100 dark:border-gray-800 p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary-500/60"
            in:fly={{ y: 20, duration: 700, delay: 150 + i * 120 }}
          >
            <div>
              <div class="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="h-5 w-5"
                >
                  {@html feature.icon}
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </div>

            <span class="mt-5 inline-flex items-center text-xs font-medium text-primary-600 dark:text-primary-300 group-hover:translate-x-0.5 transition-transform">
              Lihat bagaimana ini bekerja
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="ml-1 h-3 w-3"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </span>
          </article>
        {/each}
      </div>
    </div>
  </section>

  <section id="flow" class="py-20 bg-gray-50/80 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-center">
        <div>
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Alur check-in dalam 3 langkah
          </h2>
          <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6 max-w-xl">
            Flow yang dirancang untuk tim kecil maupun panitia besar. Setiap langkah dibuat eksplisit sehingga mudah
            di-onboard ke kru baru dalam hitungan menit.
          </p>

          <ol class="space-y-4">
            {#each steps as step, index}
              <li
                class="relative rounded-2xl bg-white dark:bg-gray-950/70 border border-gray-100 dark:border-gray-800 p-4 sm:p-5 flex gap-4"
                in:fly={{ y: 16, duration: 650, delay: 120 + index * 100 }}
              >
                <div class="flex flex-col items-center">
                  <span class="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-[13px] font-semibold text-white shadow-md shadow-primary-500/40">
                    {index + 1}
                  </span>
                  {#if index < steps.length - 1}
                    <span class="mt-2 h-full w-px bg-gradient-to-b from-primary-500/40 via-gray-300/40 to-transparent dark:from-primary-500/50 dark:via-gray-700/60"></span>
                  {/if}
                </div>
                <div>
                  <div class="mb-1 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-primary-600 dark:text-primary-300">
                    <span class="h-1.5 w-1.5 rounded-full bg-primary-500"></span>
                    {step.badge}
                  </div>
                  <p class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {step.title}
                  </p>
                  <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </li>
            {/each}
          </ol>
        </div>

        <div class="space-y-5">
          <div
            class="rounded-3xl bg-gray-900 text-gray-50 p-5 sm:p-6 shadow-2xl shadow-black/40 border border-gray-800"
            in:fade={{ duration: 400, delay: 180 }}
          >
            <div class="flex items-center justify-between mb-4">
              <p class="text-xs font-medium tracking-wide text-gray-400 uppercase">Realtime overview</p>
              <span class="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">
                Antrean stabil
              </span>
            </div>

            <div class="grid grid-cols-3 gap-3 mb-3">
              {#each stats as item}
                <div class="rounded-2xl bg-gray-800/80 p-3">
                  <p class="text-[11px] text-gray-400 mb-1">{item.label}</p>
                  <p class="text-lg font-semibold">{item.value}</p>
                </div>
              {/each}
            </div>

            <div class="mt-4 space-y-2 text-[11px] text-gray-400">
              <p class="flex items-center gap-2">
                <span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                Check-in valid langsung menutup kemungkinan double-scan di gate lain.
              </p>
              <p class="flex items-center gap-2">
                <span class="h-1.5 w-1.5 rounded-full bg-sky-400"></span>
                Operator cukup fokus ke antrean, sistem yang mengurus status.
              </p>
            </div>
          </div>

          <div class="rounded-2xl border border-dashed border-gray-300/70 dark:border-gray-700/80 bg-white/70 dark:bg-gray-950/50 p-4 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
            "Yang paling membantu adalah saat event ramai, kami tidak lagi bingung siapa yang sudah check-in di gate
            sebelah." — Panitia internal perusahaan
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="roles" class="py-20 bg-white dark:bg-gray-950">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-10">
        <div class="max-w-xl">
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Dibuat untuk peran yang berbeda dalam satu tim
          </h2>
          <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Organizer, gate operator, dan super admin punya kebutuhan yang berbeda. Interface dan akses disesuaikan
            supaya setiap orang hanya melihat hal yang relevan.
          </p>
        </div>

        <div class="flex bg-gray-100 dark:bg-gray-900 rounded-full p-1 text-xs sm:text-sm">
          {#each roles as role}
            <button
              type="button"
              class={`relative flex-1 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 font-medium transition-all ${
                selectedRole === role.id
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
              on:click={() => (selectedRole = role.id)}
            >
              {role.label}
            </button>
          {/each}
        </div>
      </div>

      {#each roles as role (role.id)}
        {#if selectedRole === role.id}
          <div
            class="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-start"
            in:fade={{ duration: 250 }}
          >
            <div class="rounded-3xl bg-gray-50 dark:bg-gray-900/80 border border-gray-100 dark:border-gray-800 p-6 sm:p-7">
              <h3 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {role.headline}
              </h3>
              <ul class="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                {#each role.points as point}
                  <li class="flex gap-2">
                    <span class="mt-1 h-1.5 w-1.5 rounded-full bg-primary-500"></span>
                    <span>{point}</span>
                  </li>
                {/each}
              </ul>
            </div>

            <div class="space-y-4">
              <div class="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-950/80 p-4 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                Tampilan dan aksi utama dioptimalkan untuk peran {role.label.toLowerCase()}, sehingga onboarding kru
                baru menjadi lebih cepat dan minim kesalahan.
              </div>
              <div class="rounded-2xl bg-gradient-to-r from-primary-600/10 via-primary-500/10 to-sky-500/10 border border-primary-500/30 p-4 text-xs sm:text-sm text-gray-700 dark:text-gray-100">
                Kombinasi role inilah yang membuat event lebih tertib: organizer mengatur, operator menjalankan,
                super admin memantau.
              </div>
            </div>
          </div>
        {/if}
      {/each}
    </div>
  </section>

  <!-- CTA Section -->
  <section id="cta" class="py-20 bg-gradient-to-r from-primary-600 via-primary-500 to-emerald-500">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="rounded-3xl bg-white/5 border border-white/20 px-6 py-10 sm:px-10 sm:py-12 text-center sm:text-left flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h2 class="text-2xl sm:text-3xl font-bold text-white mb-2">
            Siap pakai QRKan di event berikutnya?
          </h2>
          <p class="text-sm sm:text-base text-primary-50/90 max-w-xl">
            Masuk ke dashboard, buat event, dan coba alur check-in dengan timmu. Mulai dari event internal kecil
            sampai acara besar, QRKan bantu jagain flow kehadiran.
          </p>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center sm:justify-end">
          <a
            href={user && user.id ? '/dashboard' : '/login'}
            use:inertia
            class="inline-flex items-center justify-center rounded-xl bg-white text-primary-700 px-6 py-3 text-sm sm:text-base font-semibold shadow-md hover:bg-primary-50 transition-colors"
          >
            Masuk ke dashboard QRKan
          </a>
        </div>
      </div>
    </div>
  </section>

  <section class="py-14 bg-gray-950 text-gray-400">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm">
      <p>QRKan · Dibangun di atas laju.dev stack (HyperExpress, Svelte, Inertia).</p>
      <p class="text-gray-500">Fokus ke experience di gate, bukan hanya tampilan admin.</p>
    </div>
  </section>
</main>