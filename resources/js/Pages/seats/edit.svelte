<script>
  import Header from '../../Components/Header.svelte';
  import { router } from '@inertiajs/svelte';

  export let event;
  export let seat;

  let name = seat?.name || '';
  let price = seat?.price != null ? String(seat.price) : '';
  let error = '';

  function submit(e) {
    e.preventDefault();
    error = '';

    const priceNumber = Number(price);

    if (!name || Number.isNaN(priceNumber) || priceNumber < 0) {
      error = 'Nama seat dan harga (>= 0) wajib diisi.';
      return;
    }

    router.post(`/events/${event.id}/seats/${seat.id}`, {
      name,
      price: priceNumber
    });
  }
</script>

<Header group="events" />

<div class="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 pt-24 pb-8 sm:pt-28 sm:pb-12">
  <div class="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">Edit Seat</h1>

    {#if error}
      <div class="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 dark:bg-red-900/20 dark:text-red-200 dark:border-red-800">
        {error}
      </div>
    {/if}

    <form class="space-y-4" on:submit|preventDefault={submit}>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1" for="name">Nama seat</label>
        <input
          id="name"
          bind:value={name}
          class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1" for="price">Harga</label>
        <input
          id="price"
          type="number"
          min="0"
          bind:value={price}
          class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div class="flex items-center justify-between pt-2">
        <a href={`/events/${event.id}/seats`} class="text-sm text-gray-600 dark:text-gray-300 hover:underline">Kembali ke daftar</a>
        <button
          type="submit"
          class="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 shadow-sm hover:shadow-md transition-all"
        >
          Simpan Perubahan
        </button>
      </div>
    </form>
  </div>
</div>
