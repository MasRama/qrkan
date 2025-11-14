<script>
  import Header from '../../Components/Header.svelte';

  let name = '';
  let description = '';
  let location = '';
  let start_at = '';
  let end_at = '';
  let capacity = '';
  let error = '';
  let processing = false;
  let eventId = null;

  async function submit(e) {
    e.preventDefault();
    if (processing) return;
    error = '';

    const startTs = Number(new Date(start_at).getTime());
    const endTs = Number(new Date(end_at).getTime());

    if (!name || !start_at || !end_at || Number.isNaN(startTs) || Number.isNaN(endTs) || startTs > endTs) {
      error = 'Tanggal mulai/selesai tidak valid.';
      return;
    }

    if (!eventId && typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      eventId = crypto.randomUUID();
    }

    processing = true;

    try {
      const res = await fetch('/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: eventId,
          name,
          description,
          location,
          start_at: startTs,
          end_at: endTs,
          capacity: capacity ? Number(capacity) : null
        })
      });

      if (res.status === 422) {
        const data = await res.json().catch(() => null);
        error = data?.error || 'Tanggal mulai/selesai tidak valid.';
        return;
      }

      if (!res.ok) {
        console.error('Failed to create event', await res.text());
        error = 'Gagal menyimpan event.';
        return;
      }

      // Berhasil: arahkan ke daftar event
      window.location.href = '/events';
    } catch (err) {
      console.error('Create event error', err);
      error = 'Terjadi kesalahan saat menyimpan event.';
    } finally {
      processing = false;
    }
  }
</script>

<Header group="events" />

<div class="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 pt-24 pb-8 sm:pt-28 sm:pb-12">
  <div class="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">Buat Event Baru</h1>

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
          placeholder="Contoh: Konferensi Tech 2025"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Deskripsi</label>
        <textarea
          bind:value={description}
          rows="3"
          class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Ringkasan singkat tentang event"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Lokasi</label>
        <input
          bind:value={location}
          class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Alamat / venue / link online"
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
          disabled={processing}
          class="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 disabled:hover:bg-primary-600 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-md transition-all"
        >
          {#if processing}
            Menyimpan...
          {:else}
            Simpan Event
          {/if}
        </button>
      </div>
    </form>
  </div>
</div>
