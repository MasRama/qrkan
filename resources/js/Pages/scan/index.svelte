<script>
  import Header from '../../Components/Header.svelte';

  export let event;

  let token = '';
  let gate_name = '';
  let gate_id = '';
  let loading = false;
  let result = null;
  let error = null;

  async function verify() {
    loading = true;
    result = null;
    error = null;

    try {
      const res = await fetch('/scan/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, gate_name, gate_id })
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        error = data || { status: 'error', message: 'Verifikasi gagal' };
      } else {
        result = data;
      }
    } catch (e) {
      error = { status: 'network_error', message: 'Tidak dapat terhubung ke server' };
    } finally {
      loading = false;
    }
  }

  function statusColor(status) {
    if (!status) return '';
    if (status === 'ok') return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100';
    if (status === 'already_checked_in') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
  }
</script>

<Header group="scan" />

<div class="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 py-8 sm:py-12">
  <div class="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
    <div>
      <p class="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Gate Scan</p>
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{event.name}</h1>
      <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
        Halaman khusus gate operator untuk verifikasi tiket dengan QR atau input manual.
      </p>
    </div>

    <div class="p-4 rounded-xl bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800 space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1" for="gate_name">Nama Gate (opsional)</label>
          <input
            id="gate_name"
            bind:value={gate_name}
            class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Gate A / Pintu Utama"
          />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1" for="gate_id">ID Gate (opsional)</label>
          <input
            id="gate_id"
            bind:value={gate_id}
            class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="GA-01"
          />
        </div>
      </div>

      <div class="space-y-2">
        <label class="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1" for="token">Token tiket (input manual)</label>
        <div class="flex gap-2">
          <input
            id="token"
            bind:value={token}
            class="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Tempel token dari QR"
          />
          <button
            type="button"
            on:click={verify}
            class="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading || !token}
          >
            {#if loading}
              Memeriksa...
            {:else}
              Verifikasi
            {/if}
          </button>
        </div>
        <p class="text-[11px] text-gray-500 dark:text-gray-400">Scan QR di device lain dan paste token di sini sebagai fallback manual.</p>
      </div>

      <!-- Placeholder area for future camera integration -->
      <div class="mt-4 p-3 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
        Area kamera untuk scan QR bisa diintegrasikan di sini menggunakan library JS (mis. html5-qrcode atau ZXing).
      </div>
    </div>

    {#if result}
      <div class={`p-4 rounded-xl border ${statusColor(result.status)}`}>
        {#if result.status === 'ok'}
          <h2 class="text-sm font-semibold mb-1">Sukses check-in</h2>
          <p class="text-xs mb-2">Tiket valid dan telah tercatat sebagai hadir.</p>
        {:else if result.status === 'already_checked_in'}
          <h2 class="text-sm font-semibold mb-1">Sudah check-in</h2>
          <p class="text-xs mb-2">Tiket ini sudah digunakan sebelumnya.</p>
        {/if}

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mt-2">
          <div>
            <p class="font-semibold mb-1">Peserta</p>
            {#if result.participant}
              <p>{result.participant.name}</p>
              <p class="text-gray-700 dark:text-gray-200">{result.participant.email}</p>
              <p class="text-gray-700 dark:text-gray-200">{result.participant.phone}</p>
            {:else}
              <p class="text-gray-500 dark:text-gray-400">Data peserta tidak tersedia</p>
            {/if}
          </div>
          <div>
            <p class="font-semibold mb-1">Event</p>
            <p>{result.event.name}</p>
            <p class="text-gray-700 dark:text-gray-200">{result.event.location}</p>
          </div>
        </div>
      </div>
    {/if}

    {#if error}
      <div class="p-4 rounded-xl border bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-100 text-xs">
        <p class="font-semibold mb-1">Verifikasi gagal</p>
        <p>{error.message || 'Tiket tidak valid atau terjadi kesalahan.'}</p>
      </div>
    {/if}
  </div>
</div>
