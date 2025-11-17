<script>
  import Header from '../../Components/Header.svelte';
  import { router } from '@inertiajs/svelte';

  export let event;
  export let seats = [];

  let deletingId = null;

  function formatPrice(v) {
    if (v == null) return '-';
    const n = Number(v);
    if (Number.isNaN(n)) return '-';
    return `Rp ${n.toLocaleString('id-ID')}`;
  }

  function goCreate() {
    router.get(`/events/${event.id}/seats/create`);
  }

  async function deleteSeat(seat) {
    if (!seat || !seat.id) return;
    const ok = confirm(`Hapus seat "${seat.name}"? Peserta yang memakai seat ini akan tetap tersimpan, tetapi tanpa seat.`);
    if (!ok) return;

    deletingId = seat.id;

    try {
      const res = await fetch(`/events/${event.id}/seats/${seat.id}`, {
        method: 'DELETE',
        headers: {
          'X-Inertia': 'true',
          Accept: 'application/json'
        }
      });

      if (!res.ok && res.status !== 204) {
        console.error('Failed to delete seat', await res.text());
      } else {
        seats = seats.filter((x) => x.id !== seat.id);
      }
    } catch (err) {
      console.error('Seat delete error', err);
    } finally {
      deletingId = null;
    }
  }
</script>

<Header group="events" />

<div class="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 pt-24 pb-8 sm:pt-28 sm:pb-12">
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <p class="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Seat</p>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{event.name}</h1>
        <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">Kelola kategori seat dan harga untuk event ini.</p>
      </div>
      <div class="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-end">
        <a
          href={`/events/${event.id}/participants`}
          class="inline-flex items-center px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50/80 dark:hover:bg-gray-800/40"
        >
          Peserta
        </a>
        <button
          type="button"
          on:click={goCreate}
          class="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 shadow-sm hover:shadow-md transition-all"
        >
          + Tambah Seat
        </button>
      </div>
    </div>

    <div class="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/70 shadow-sm">
      <table class="min-w-full text-sm">
        <thead class="bg-gray-50 dark:bg-gray-800/80">
          <tr>
            <th class="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Nama</th>
            <th class="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Harga</th>
            <th class="px-4 py-3 text-right font-semibold text-gray-600 dark:text-gray-300">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {#if seats.length === 0}
            <tr>
              <td colspan="3" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                Belum ada seat. Tambahkan kategori seat seperti Ekonomi, VIP, dll.
              </td>
            </tr>
          {:else}
            {#each seats as seat}
              <tr class="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50/60 dark:hover:bg-gray-800/60">
                <td class="px-4 py-3">
                  <div class="font-medium text-gray-900 dark:text-gray-50">{seat.name}</div>
                </td>
                <td class="px-4 py-3 text-xs text-gray-700 dark:text-gray-200">{formatPrice(seat.price)}</td>
                <td class="px-4 py-3 text-right space-x-2">
                  <a
                    href={`/events/${event.id}/seats/${seat.id}/edit`}
                    class="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold text-primary-700 dark:text-primary-300 border border-primary-100 dark:border-primary-900 hover:bg-primary-50/80 dark:hover:bg-primary-900/30"
                  >
                    Edit
                  </a>
                  <button
                    type="button"
                    on:click={() => deleteSeat(seat)}
                    disabled={deletingId === seat.id}
                    class="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold text-red-700 dark:text-red-300 border border-red-100 dark:border-red-900 hover:bg-red-50/80 dark:hover:bg-red-900/30 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                  >
                    {#if deletingId === seat.id}
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
