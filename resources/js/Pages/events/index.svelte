<script>
  import Header from '../../Components/Header.svelte';
  import { router } from '@inertiajs/svelte';

  export let events = [];
  export let status = 'all';

  let selectedStatus = status || 'all';

  const statusOptions = [
    { value: 'all', label: 'Semua status' },
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'closed', label: 'Closed' }
  ];

  function applyFilter() {
    router.get('/events', { status: selectedStatus }, { preserveState: true, replace: true });
  }

  function formatDate(ts) {
    if (!ts) return '-';
    const d = new Date(Number(ts));
    if (Number.isNaN(d.getTime())) return '-';
    return d.toLocaleString();
  }

  function statusColor(s) {
    switch (s) {
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'published':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
      case 'closed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  }
</script>

<Header group="events" />

<div class="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 py-8 sm:py-12">
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Manajemen Event</h1>
        <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">Kelola event, jadwal, kapasitas dan status publikasinya.</p>
      </div>

      <a
        href="/events/create"
        class="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 shadow-sm hover:shadow-md transition-all"
        >
        + Buat Event
      </a>
    </div>

    <div class="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
      <div class="flex items-center gap-2">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-200">Filter status</label>
        <select
          bind:value={selectedStatus}
          on:change={applyFilter}
          class="text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {#each statusOptions as opt}
            <option value={opt.value}>{opt.label}</option>
          {/each}
        </select>
      </div>
      <p class="text-xs text-gray-500 dark:text-gray-400">Total: {events.length} event</p>
    </div>

    <div class="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/70 shadow-sm">
      <table class="min-w-full text-sm">
        <thead class="bg-gray-50 dark:bg-gray-800/80">
          <tr>
            <th class="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Nama</th>
            <th class="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Waktu</th>
            <th class="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Lokasi</th>
            <th class="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Status</th>
            <th class="px-4 py-3 text-right font-semibold text-gray-600 dark:text-gray-300">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {#if events.length === 0}
            <tr>
              <td colspan="5" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                Belum ada event. Mulai dengan membuat event baru.
              </td>
            </tr>
          {:else}
            {#each events as event}
              <tr class="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50/60 dark:hover:bg-gray-800/60">
                <td class="px-4 py-3">
                  <div class="font-medium text-gray-900 dark:text-gray-50">{event.name}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">{event.description}</div>
                </td>
                <td class="px-4 py-3 text-xs text-gray-700 dark:text-gray-200">
                  <div>{formatDate(event.start_at)}</div>
                  <div class="text-gray-500 dark:text-gray-400">→ {formatDate(event.end_at)}</div>
                </td>
                <td class="px-4 py-3 text-xs text-gray-700 dark:text-gray-200">{event.location || '-'}</td>
                <td class="px-4 py-3">
                  <span class={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor(event.status)}`}>
                    {event.status}
                  </span>
                </td>
                <td class="px-4 py-3 text-right">
                  <a
                    href={`/events/${event.id}/edit`}
                    class="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold text-primary-700 dark:text-primary-300 border border-primary-100 dark:border-primary-900 hover:bg-primary-50/80 dark:hover:bg-primary-900/30"
                  >
                    Edit
                  </a>
                </td>
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    </div>
  </div>
</div>
