<script>
  import Header from '../../Components/Header.svelte';

  export let event;
  export let totalTickets;
  export let totalChecked;
  export let attendancePercent;
  export let present = [];
  export let absent = [];

  function formatPercent(p) {
    return `${p.toFixed(1)}%`;
  }
</script>

<Header group="events" />

<div class="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 py-8 sm:py-12">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
    <div>
      <p class="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Laporan Kehadiran</p>
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{event.name}</h1>
      <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">Ringkasan tiket dan kehadiran peserta untuk event ini.</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Tiket</p>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">{totalTickets}</p>
      </div>
      <div class="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Sudah Check-in</p>
        <p class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{totalChecked}</p>
      </div>
      <div class="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Persentase Kehadiran</p>
        <p class="text-2xl font-bold text-primary-600 dark:text-primary-400">{formatPercent(attendancePercent)}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/70 shadow-sm overflow-hidden">
        <div class="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h2 class="text-sm font-semibold text-gray-800 dark:text-gray-100">Peserta Hadir</h2>
          <span class="text-[11px] text-gray-500 dark:text-gray-400">{present.length} peserta</span>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full text-xs">
            <thead class="bg-gray-50 dark:bg-gray-800/80">
              <tr>
                <th class="px-4 py-2 text-left font-semibold text-gray-600 dark:text-gray-300">Nama</th>
                <th class="px-4 py-2 text-left font-semibold text-gray-600 dark:text-gray-300">Kontak</th>
              </tr>
            </thead>
            <tbody>
              {#if present.length === 0}
                <tr>
                  <td colspan="2" class="px-4 py-6 text-center text-gray-500 dark:text-gray-400">Belum ada peserta hadir.</td>
                </tr>
              {:else}
                {#each present as p}
                  <tr class="border-t border-gray-100 dark:border-gray-800">
                    <td class="px-4 py-2 text-gray-900 dark:text-gray-50">{p.name}</td>
                    <td class="px-4 py-2 text-gray-700 dark:text-gray-200">
                      <div>{p.email || '-'}</div>
                      <div class="text-[11px] text-gray-500 dark:text-gray-400">{p.phone || ''}</div>
                    </td>
                  </tr>
                {/each}
              {/if}
            </tbody>
          </table>
        </div>
      </div>

      <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/70 shadow-sm overflow-hidden">
        <div class="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h2 class="text-sm font-semibold text-gray-800 dark:text-gray-100">Peserta Belum Hadir</h2>
          <span class="text-[11px] text-gray-500 dark:text-gray-400">{absent.length} peserta</span>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full text-xs">
            <thead class="bg-gray-50 dark:bg-gray-800/80">
              <tr>
                <th class="px-4 py-2 text-left font-semibold text-gray-600 dark:text-gray-300">Nama</th>
                <th class="px-4 py-2 text-left font-semibold text-gray-600 dark:text-gray-300">Kontak</th>
              </tr>
            </thead>
            <tbody>
              {#if absent.length === 0}
                <tr>
                  <td colspan="2" class="px-4 py-6 text-center text-gray-500 dark:text-gray-400">Semua peserta sudah hadir.</td>
                </tr>
              {:else}
                {#each absent as p}
                  <tr class="border-t border-gray-100 dark:border-gray-800">
                    <td class="px-4 py-2 text-gray-900 dark:text-gray-50">{p.name}</td>
                    <td class="px-4 py-2 text-gray-700 dark:text-gray-200">
                      <div>{p.email || '-'}</div>
                      <div class="text-[11px] text-gray-500 dark:text-gray-400">{p.phone || ''}</div>
                    </td>
                  </tr>
                {/each}
              {/if}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>
