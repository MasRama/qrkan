<script>
  import Header from '../Components/Header.svelte';
  import { page } from '@inertiajs/svelte';

  export let overview;
  export let upcoming_events = [];
  export let recent_events = [];

  const user = $page.props.user;

  function formatNumber(n) {
    if (n == null) return '0';
    return n.toLocaleString('id-ID');
  }

  function formatPercent(v) {
    if (v == null) return '0%';
    return `${v.toFixed(1)}%`;
  }

  function formatDate(ts) {
    if (!ts) return '-';
    const d = new Date(Number(ts));
    if (Number.isNaN(d.getTime())) return '-';
    return d.toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
</script>

<Header group="dashboard" />

<main class="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-50 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900 pt-24 pb-10 sm:pt-28 sm:pb-12">
  <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
    <header class="space-y-3">
      <p class="text-[11px] sm:text-xs uppercase tracking-[0.18em] text-emerald-600/80 dark:text-emerald-300/70">Dashboard</p>
      <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 class="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white leading-tight">
            Halo, {user?.name || 'Organizer'}
          </h1>
          <p class="mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400 max-w-xl">
            Lihat ringkasan event, kapasitas, dan performa check-in dalam satu tampilan. Semua dirancang mobile-first
            supaya mudah dipantau dari HP.
          </p>
        </div>
      </div>
    </header>

    <!-- Overview cards -->
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <article class="rounded-2xl bg-gradient-to-br from-emerald-100 via-emerald-50 to-sky-50 dark:from-emerald-500/15 dark:via-emerald-500/5 dark:to-sky-500/10 border border-emerald-200 dark:border-emerald-500/30 px-4 py-3.5 sm:px-5 sm:py-4 flex items-center justify-between">
        <div>
          <p class="text-[11px] font-medium uppercase tracking-wide text-emerald-700 dark:text-emerald-300">Total event</p>
          <p class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{formatNumber(overview?.total_events)}</p>
          <p class="mt-1 text-[11px] text-emerald-700/80 dark:text-emerald-200/80">Semua status</p>
        </div>
        <div class="hidden sm:flex h-10 w-10 rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-400/20 dark:text-emerald-200 items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 19.5l6-6 4 4 5-5" />
          </svg>
        </div>
      </article>

      <article class="rounded-2xl bg-white/80 dark:bg-gray-900/80 border border-gray-200/70 dark:border-gray-800 px-4 py-3.5 sm:px-5 sm:py-4">
        <p class="text-[11px] font-medium uppercase tracking-wide text-gray-600 dark:text-gray-400">Status event</p>
        <div class="mt-2 grid grid-cols-3 gap-2 text-[11px] sm:text-xs text-gray-700 dark:text-gray-300">
          <div>
            <p class="text-gray-500 dark:text-gray-400">Draft</p>
            <p class="mt-0.5 text-sm sm:text-base font-semibold text-gray-900 dark:text-white">{formatNumber(overview?.draft_events)}</p>
          </div>
          <div>
            <p class="text-gray-500 dark:text-gray-400">Published</p>
            <p class="mt-0.5 text-sm sm:text-base font-semibold text-emerald-700 dark:text-emerald-300">{formatNumber(overview?.published_events)}</p>
          </div>
          <div>
            <p class="text-gray-500 dark:text-gray-400">Closed</p>
            <p class="mt-0.5 text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-300">{formatNumber(overview?.closed_events)}</p>
          </div>
        </div>
      </article>

      <article class="rounded-2xl bg-white/80 dark:bg-gray-900/80 border border-gray-200/70 dark:border-gray-800 px-4 py-3.5 sm:px-5 sm:py-4 flex flex-col justify-between">
        <div>
          <p class="text-[11px] font-medium uppercase tracking-wide text-gray-600 dark:text-gray-400">Peserta & tiket</p>
          <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">Peserta terdaftar</p>
          <p class="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">{formatNumber(overview?.total_participants)}</p>
        </div>
        <div class="mt-2 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
          <span>Total tiket: <span class="text-gray-900 dark:text-gray-100">{formatNumber(overview?.total_tickets)}</span></span>
          <span>Check-in: <span class="text-emerald-700 dark:text-emerald-300">{formatNumber(overview?.checked_in_tickets)}</span></span>
        </div>
      </article>

      <article class="rounded-2xl bg-gradient-to-br from-sky-100 via-sky-50 to-emerald-50 dark:from-sky-500/15 dark:via-sky-500/5 dark:to-emerald-500/10 border border-sky-200 dark:border-sky-500/30 px-4 py-3.5 sm:px-5 sm:py-4 flex flex-col justify-between">
        <div>
          <p class="text-[11px] font-medium uppercase tracking-wide text-sky-700 dark:text-sky-200">Kehadiran</p>
          <p class="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{formatPercent(overview?.attendance_rate)}</p>
        </div>
        <p class="mt-1 text-[11px] text-sky-700/80 dark:text-sky-100/80">
          Dari semua tiket yang dibuat untuk event yang kamu kelola.
        </p>
      </article>
    </section>

    <!-- Upcoming + recent -->
    <section class="grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-4 sm:gap-6">
      <div class="rounded-3xl bg-white/80 dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 p-4 sm:p-5">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">Event yang akan datang</h2>
          <span class="text-[11px] text-gray-500 dark:text-gray-400">{upcoming_events.length || 0} event</span>
        </div>

        {#if upcoming_events.length === 0}
          <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Belum ada event yang terjadwal setelah hari ini.
          </p>
        {:else}
          <ul class="space-y-3">
            {#each upcoming_events as ev}
              <li class="flex items-start justify-between rounded-2xl bg-white/90 dark:bg-gray-950/60 border border-gray-200/80 dark:border-gray-800 px-3 py-3 sm:px-4 sm:py-3.5">
                <div class="mr-3">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{ev.name}</p>
                  <p class="mt-0.5 text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">{ev.location || 'Lokasi belum diisi'}</p>
                  <p class="mt-1 text-[11px] text-gray-500 dark:text-gray-400">{formatDate(ev.start_at)}  ̱ {formatDate(ev.end_at)}</p>
                </div>
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30">
                  {ev.status}
                </span>
              </li>
            {/each}
          </ul>
        {/if}
      </div>

      <div class="rounded-3xl bg-white/80 dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 p-4 sm:p-5">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">Aktivitas event terbaru</h2>
          <span class="text-[11px] text-gray-500 dark:text-gray-400">{recent_events.length || 0} event</span>
        </div>

        {#if recent_events.length === 0}
          <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Belum ada event yang dibuat.
          </p>
        {:else}
          <ul class="space-y-2.5">
            {#each recent_events as ev}
              <li class="flex items-center justify-between text-[11px] sm:text-xs text-gray-700 dark:text-gray-300">
                <div class="flex-1 min-w-0 mr-2">
                  <p class="font-medium truncate text-gray-900 dark:text-white">{ev.name}</p>
                  <p class="mt-0.5 text-[10px] text-gray-500 dark:text-gray-400">{formatDate(ev.start_at)}</p>
                </div>
                <span class="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100 capitalize">
                  {ev.status}
                </span>
              </li>
            {/each}
          </ul>
        {/if}
      </div>
    </section>
  </section>
</main>
