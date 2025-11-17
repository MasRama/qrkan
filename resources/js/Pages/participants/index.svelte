<script>
  import Header from '../../Components/Header.svelte';
  import { router } from '@inertiajs/svelte';

  export let event;
  export let participants = [];
  let deletingId = null;

  function statusColor(s) {
    switch (s) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'sent':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'checked_in':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  }

  function goCreate() {
    router.get(`/events/${event.id}/participants/create`);
  }

  async function deleteParticipant(p) {
    if (!p || !p.id) return;
    const ok = confirm(`Hapus peserta "${p.name}"? Tiket dan log check-in terkait akan ikut terhapus.`);
    if (!ok) return;

    deletingId = p.id;

    try {
      const res = await fetch(`/events/${event.id}/participants/${p.id}`, {
        method: 'DELETE',
        headers: {
          'X-Inertia': 'true',
          Accept: 'application/json'
        }
      });

      if (!res.ok && res.status !== 204) {
        console.error('Failed to delete participant', await res.text());
      } else {
        participants = participants.filter((x) => x.id !== p.id);
      }
    } catch (err) {
      console.error('Participant delete error', err);
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
        <p class="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Peserta</p>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{event.name}</h1>
        <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">Kelola peserta dan tiket untuk event ini.</p>
      </div>
      <div class="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-end">
        <div class="flex gap-2">
          <a
            href={`/events/${event.id}/edit`}
            class="inline-flex items-center px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50/80 dark:hover:bg-gray-800/40"
          >
            Kembali ke event
          </a>
          <a
            href={`/events/${event.id}/scan`}
            class="inline-flex items-center px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800 hover:bg-emerald-50/80 dark:hover:bg-emerald-900/30"
          >
            Scan gate
          </a>
        </div>
        <button
          type="button"
          on:click={goCreate}
          class="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 shadow-sm hover:shadow-md transition-all"
        >
          + Tambah Peserta
        </button>
      </div>
    </div>

    <div class="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/70 shadow-sm">
      <table class="min-w-full text-sm">
        <thead class="bg-gray-50 dark:bg-gray-800/80">
          <tr>
            <th class="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Nama</th>
            <th class="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Kontak</th>
            <th class="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Seat</th>
            <th class="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Status tiket</th>
            <th class="px-4 py-3 text-right font-semibold text-gray-600 dark:text-gray-300">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {#if participants.length === 0}
            <tr>
              <td colspan="5" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                Belum ada peserta terdaftar.
              </td>
            </tr>
          {:else}
            {#each participants as p}
              <tr class="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50/60 dark:hover:bg-gray-800/60">
                <td class="px-4 py-3">
                  <div class="font-medium text-gray-900 dark:text-gray-50">{p.name}</div>
                </td>
                <td class="px-4 py-3 text-xs text-gray-700 dark:text-gray-200">
                  <div>{p.email || '-'}</div>
                  <div class="text-gray-500 dark:text-gray-400">{p.phone || ''}</div>
                </td>
                <td class="px-4 py-3 text-xs text-gray-700 dark:text-gray-200">
                  {#if p.seat_name}
                    <div>{p.seat_name}</div>
                    {#if p.seat_price != null}
                      <div class="text-gray-500 dark:text-gray-400">
                        Rp {Number(p.seat_price).toLocaleString('id-ID')}
                      </div>
                    {/if}
                  {:else}
                    <span class="text-xs text-gray-400">-</span>
                  {/if}
                </td>
                <td class="px-4 py-3">
                  {#if p.ticket_status}
                    <span class={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor(p.ticket_status)}`}>
                      {p.ticket_status}
                    </span>
                  {:else}
                    <span class="text-xs text-gray-400">-</span>
                  {/if}
                </td>
                <td class="px-4 py-3 text-right space-x-2">
                  {#if p.ticket_token}
                    <a
                      href={`/tickets/${p.ticket_token}`}
                      class="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold text-primary-700 dark:text-primary-300 border border-primary-100 dark:border-primary-900 hover:bg-primary-50/80 dark:hover:bg-primary-900/30"
                    >
                      Download
                    </a>
                  {/if}
                  <button
                    type="button"
                    on:click={() => deleteParticipant(p)}
                    disabled={deletingId === p.id}
                    class="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold text-red-700 dark:text-red-300 border border-red-100 dark:border-red-900 hover:bg-red-50/80 dark:hover:bg-red-900/30 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                  >
                    {#if deletingId === p.id}
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
