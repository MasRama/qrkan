<script>
  import Header from '../../Components/Header.svelte';
  import { router } from '@inertiajs/svelte';

  export let event;

  let name = event?.name || '';
  let description = event?.description || '';
  let location = event?.location || '';
  let start_at = event?.start_at ? new Date(Number(event.start_at)).toISOString().slice(0, 16) : '';
  let end_at = event?.end_at ? new Date(Number(event.end_at)).toISOString().slice(0, 16) : '';
  let capacity = event?.capacity ?? '';
  let error = '';

  function submit(e) {
    e.preventDefault();
    error = '';

    const startTs = Number(new Date(start_at).getTime());
    const endTs = Number(new Date(end_at).getTime());

    if (!name || !start_at || !end_at || Number.isNaN(startTs) || Number.isNaN(endTs) || startTs > endTs) {
      error = 'Tanggal mulai/selesai tidak valid.';
      return;
    }

    router.post(`/events/${event.id}`, {
      name,
      description,
      location,
      start_at: startTs,
      end_at: endTs,
      capacity: capacity ? Number(capacity) : null
    });
  }

  function changeStatus(nextStatus) {
    router.post(`/events/${event.id}/status`, { status: nextStatus });
  }
</script>

<Header group="events" />

<div class="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 py-8 sm:py-12">
  <div class="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Edit Event</h1>
      <span
        class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
        class:bg-yellow-100={event.status === 'draft'}
        class:text-yellow-800={event.status === 'draft'}
        class:bg-emerald-100={event.status === 'published'}
        class:text-emerald-800={event.status === 'published'}
        class:bg-red-100={event.status === 'closed'}
        class:text-red-800={event.status === 'closed'}
      >
        {event.status}
      </span>
    </div>

    {#if error}
      <div class="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 dark:bg-red-900/20 dark:text-red-200 dark:border-red-800">
        {error}
      </div>
    {/if}

    <form class="space-y-4" on:submit|preventDefault={submit}>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Nama Event</label>
        <input
          bind:value={name}
          class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Deskripsi</label>
        <textarea
          bind:value={description}
          rows="3"
          class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Lokasi</label>
        <input
          bind:value={location}
          class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Mulai</label>
          <input
            type="datetime-local"
            bind:value={start_at}
            class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Selesai</label>
          <input
            type="datetime-local"
            bind:value={end_at}
            class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Kapasitas (opsional)</label>
        <input
          type="number"
          min="0"
          bind:value={capacity}
          class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div class="flex items-center justify-between pt-2">
        <a href="/events" class="text-sm text-gray-600 dark:text-gray-300 hover:underline">Kembali ke daftar</a>
        <button
          type="submit"
          class="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 shadow-sm hover:shadow-md transition-all"
        >
          Simpan Perubahan
        </button>
      </div>
    </form>

    <div class="mt-6 border-t border-gray-200 dark:border-gray-800 pt-4 flex items-center justify-between">
      <p class="text-xs text-gray-500 dark:text-gray-400">Ubah status event:</p>
      <div class="flex gap-2">
        <button
          type="button"
          class="px-3 py-1.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
          on:click={() => changeStatus('draft')}
        >
          Draft
        </button>
        <button
          type="button"
          class="px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100"
          on:click={() => changeStatus('published')}
        >
          Publish
        </button>
        <button
          type="button"
          class="px-3 py-1.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
          on:click={() => changeStatus('closed')}
        >
          Close
        </button>
      </div>
    </div>
  </div>
</div>
