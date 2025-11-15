<script>
  import Header from '../../Components/Header.svelte';
  import { router, Link } from '@inertiajs/svelte';

  export let events = [];
  export let status = 'all';

  let selectedStatus = status || 'all';
  let deletingId = null;
  let showToast = false;
  let toastMessage = '';
  let toastTimeout;

  const statusOptions = [
    { value: 'all', label: 'Semua status' },
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'closed', label: 'Closed' }
  ];

  const now = Date.now();

  $: totalEvents = events.length;
  $: draftEvents = events.filter((e) => e.status === 'draft').length;
  $: publishedEvents = events.filter((e) => e.status === 'published').length;
  $: closedEvents = events.filter((e) => e.status === 'closed').length;
  $: upcomingEvents = events.filter((e) => e.start_at && Number(e.start_at) > now).length;

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

  async function deleteEvent(ev) {
    if (!ev || !ev.id) return;
    const ok = confirm(`Hapus event "${ev.name}"? Semua peserta & tiket terkait juga akan ikut terhapus.`);
    if (!ok) return;

    deletingId = ev.id;

    try {
      const res = await fetch(`/events/${ev.id}`, {
        method: 'DELETE',
        headers: {
          'X-Inertia': 'true',
          Accept: 'application/json'
        }
      });

      if (!res.ok && res.status !== 204) {
        console.error('Failed to delete event', await res.text());
        toastMessage = 'Gagal menghapus event';
        showToast = true;
      } else {
        // Hapus dari list lokal supaya UI langsung ter-update tanpa reload
        events = events.filter((e) => e.id !== ev.id);

        toastMessage = 'Event berhasil dihapus';
        showToast = true;
      }

      if (toastTimeout) clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => {
        showToast = false;
      }, 2500);
    } catch (err) {
      console.error('Delete error', err);
      toastMessage = 'Terjadi kesalahan saat menghapus';
      showToast = true;
    } finally {
      deletingId = null;
    }
  }
</script>

<Header group="events" />

<div class="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 pt-24 pb-8 sm:pt-28 sm:pb-12">
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
    {#if showToast}
      <div class="mb-4">
        <div class="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 px-3 py-2 text-xs sm:text-sm dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-100">
          <span>{toastMessage}</span>
          <button
            type="button"
            class="text-[11px] font-medium underline-offset-2 hover:underline"
            on:click={() => (showToast = false)}
          >
            Tutup
          </button>
        </div>
      </div>
    {/if}

    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Manajemen Event</h1>
        <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">Kelola event, jadwal, kapasitas dan status publikasinya.</p>
      </div>

      <Link
        href="/events/create"
        class="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 shadow-sm hover:shadow-md transition-all"
        >
        + Buat Event
      </Link>
    </div>

    <!-- Summary cards -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4">
      <div class="rounded-xl bg-white/80 dark:bg-gray-900/80 border border-gray-200/70 dark:border-gray-800 px-3 py-2.5 sm:px-4 sm:py-3">
        <p class="text-[11px] font-medium text-gray-500 dark:text-gray-400">Total event</p>
        <p class="mt-1 text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{totalEvents}</p>
      </div>
      <div class="rounded-xl bg-emerald-50/80 dark:bg-emerald-900/40 border border-emerald-200/70 dark:border-emerald-800 px-3 py-2.5 sm:px-4 sm:py-3">
        <p class="text-[11px] font-medium text-emerald-700 dark:text-emerald-200">Published</p>
        <p class="mt-1 text-base sm:text-lg font-semibold text-emerald-800 dark:text-emerald-50">{publishedEvents}</p>
      </div>
      <div class="rounded-xl bg-yellow-50/80 dark:bg-yellow-900/40 border border-yellow-200/70 dark:border-yellow-800 px-3 py-2.5 sm:px-4 sm:py-3">
        <p class="text-[11px] font-medium text-yellow-700 dark:text-yellow-200">Draft</p>
        <p class="mt-1 text-base sm:text-lg font-semibold text-yellow-800 dark:text-yellow-50">{draftEvents}</p>
      </div>
      <div class="rounded-xl bg-gray-900/80 dark:bg-gray-900/80 border border-gray-700 px-3 py-2.5 sm:px-4 sm:py-3">
        <p class="text-[11px] font-medium text-gray-300">Upcoming</p>
        <p class="mt-1 text-base sm:text-lg font-semibold text-white">{upcomingEvents}</p>
      </div>
    </div>

    <div class="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
      <div class="flex items-center gap-2">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-200" for="status-filter">Filter status</label>
        <select
          id="status-filter"
          bind:value={selectedStatus}
          on:change={applyFilter}
          class="text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {#each statusOptions as opt}
            <option value={opt.value}>{opt.label}</option>
          {/each}
        </select>
      </div>
      <p class="text-xs text-gray-500 dark:text-gray-400">
        Menampilkan {events.length} event
      </p>
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
                <td class="px-4 py-3 text-right space-x-2">
                  <a
                    href={`/events/${event.id}/participants`}
                    class="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50/80 dark:hover:bg-gray-800/40"
                  >
                    Peserta
                  </a>
                  <a
                    href={`/events/${event.id}/scan`}
                    class="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800 hover:bg-emerald-50/80 dark:hover:bg-emerald-900/30"
                  >
                    Scan
                  </a>
                  <a
                    href={`/events/${event.id}/report`}
                    class="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold text-sky-700 dark:text-sky-300 border border-sky-100 dark:border-sky-800 hover:bg-sky-50/80 dark:hover:bg-sky-900/30"
                  >
                    Laporan
                  </a>
                  <a
                    href={`/events/${event.id}/edit`}
                    class="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold text-primary-700 dark:text-primary-300 border border-primary-100 dark:border-primary-900 hover:bg-primary-50/80 dark:hover:bg-primary-900/30"
                  >
                    Edit
                  </a>
                  <button
                    type="button"
                    on:click={() => deleteEvent(event)}
                    disabled={deletingId === event.id}
                    class="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold text-red-700 dark:text-red-300 border border-red-100 dark:border-red-900 hover:bg-red-50/80 dark:hover:bg-red-900/30 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                  >
                    {#if deletingId === event.id}
                      Menghapus...
                    {:else}
                      Delete
                    {/if}
                  </button>
                </td>
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    </div>
  </div>
</div>
