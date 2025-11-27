<script>
  import Header from '../../Components/Header.svelte';
  import { router } from '@inertiajs/svelte';

  export let event;
  export let seats = [];

  let name = '';
  let email = '';
  let phone = '';
  let gender = '';
  let age = '';
  let seat_id = '';
  let error = '';
  let processing = false;

  function formatPrice(v) {
    if (v == null) return '-';
    const n = Number(v);
    if (Number.isNaN(n)) return '-';
    return `Rp ${n.toLocaleString('id-ID')}`;
  }

  function submit(e) {
    e.preventDefault();
    if (processing) return;
    error = '';

    if (!name || (!email && !phone) || !seat_id) {
      error = 'Nama, seat, dan minimal salah satu kontak (email/phone) wajib diisi.';
      return;
    }

    processing = true;

    router.post(
      `/events/${event.id}/checkout`,
      {
        name,
        email,
        phone,
        gender,
        age,
        seat_id
      },
      {
        onFinish: () => {
          processing = false;
        }
      }
    );
  }
</script>

<Header group="home" />

<div class="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900 pt-24 pb-10 sm:pt-28 sm:pb-12">
  <main class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
    <section class="space-y-3">
      <p class="text-xs uppercase tracking-[0.18em] text-primary-600/80 dark:text-primary-300/80">Checkout tiket</p>
      <div>
        <h1 class="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white">{event.name}</h1>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-300 max-w-2xl">
          Pilih seat dan isi data kontak kamu. Pembayaran akan diproses melalui gateway Tripay, lalu kamu akan mendapatkan QR tiket.
        </p>
      </div>
      <div class="flex flex-wrap gap-3 text-[11px] text-gray-500 dark:text-gray-400">
        <span>
          <span class="font-semibold text-gray-700 dark:text-gray-200">Waktu:</span>
          {' '}
          {new Date(Number(event.start_at)).toLocaleString('id-ID')} → {new Date(Number(event.end_at)).toLocaleString('id-ID')}
        </span>
        <span>
          <span class="font-semibold text-gray-700 dark:text-gray-200">Lokasi:</span>
          {' '}
          {event.location || 'Lokasi belum diisi'}
        </span>
      </div>
    </section>

    <section class="grid grid-cols-1 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-5 items-start">
      <form class="space-y-4 rounded-2xl bg-white/90 dark:bg-gray-900/90 border border-gray-200/80 dark:border-gray-800 px-4 sm:px-5 py-4 shadow-sm" on:submit|preventDefault={submit}>
        {#if error}
          <div class="mb-2 text-xs sm:text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 dark:bg-red-900/20 dark:text-red-200 dark:border-red-800">
            {error}
          </div>
        {/if}

        <div class="space-y-1">
          <label class="block text-xs font-medium text-gray-700 dark:text-gray-200" for="name">Nama lengkap</label>
          <input
            id="name"
            bind:value={name}
            class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Nama sesuai identitas"
          />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="space-y-1">
            <label class="block text-xs font-medium text-gray-700 dark:text-gray-200" for="email">Email</label>
            <input
              id="email"
              type="email"
              bind:value={email}
              class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="email@contoh.com"
            />
          </div>
          <div class="space-y-1">
            <label class="block text-xs font-medium text-gray-700 dark:text-gray-200" for="phone">No HP</label>
            <input
              id="phone"
              bind:value={phone}
              class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="08xxxxxxxxxx"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="space-y-1">
            <label class="block text-xs font-medium text-gray-700 dark:text-gray-200" for="gender">Jenis Kelamin</label>
            <select
              id="gender"
              bind:value={gender}
              class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Pilih...</option>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </div>
          <div class="space-y-1">
            <label class="block text-xs font-medium text-gray-700 dark:text-gray-200" for="age">Umur</label>
            <input
              id="age"
              type="number"
              bind:value={age}
              class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Contoh: 25"
            />
          </div>
        </div>

        <p class="text-[11px] text-gray-500 dark:text-gray-400">
          Minimal salah satu dari email atau no HP harus diisi untuk pengiriman e-ticket.
        </p>

        <div class="pt-2 space-y-2">
          <p class="text-xs font-semibold text-gray-800 dark:text-gray-100">Pilih seat</p>
          {#if seats.length === 0}
            <p class="text-[11px] text-red-600 dark:text-red-300">
              Seat belum dikonfigurasi untuk event ini. Silakan hubungi penyelenggara.
            </p>
          {:else}
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {#each seats as seat}
                <label
                  class="relative flex items-start gap-3 rounded-2xl border px-3 py-2.5 text-xs sm:text-sm cursor-pointer transition-all
                    {seat_id === seat.id
                      ? 'border-primary-500 bg-primary-50/60 dark:border-primary-500 dark:bg-primary-900/30'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 hover:border-primary-300/80'}"
                >
                  <input
                    type="radio"
                    name="seat"
                    class="mt-1 h-3.5 w-3.5 text-primary-600 focus:ring-primary-500 border-gray-300"
                    value={seat.id}
                    bind:group={seat_id}
                  />
                  <div class="flex-1 min-w-0">
                    <p class="font-semibold text-gray-900 dark:text-gray-100">{seat.name}</p>
                    <p class="text-[11px] text-primary-700 dark:text-primary-200 font-semibold">{formatPrice(seat.price)}</p>
                  </div>
                </label>
              {/each}
            </div>
          {/if}
        </div>

        <div class="pt-3 flex items-center justify-between gap-3">
          <a href="/" class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 hover:underline">Kembali ke beranda</a>
          <button
            type="submit"
            disabled={processing || seats.length === 0}
            class="inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-md transition-all"
          >
            {#if processing}
              Memproses...
            {:else}
              Beli tiket
            {/if}
          </button>
        </div>
      </form>

      <aside class="rounded-2xl bg-gradient-to-br from-primary-600 via-emerald-500 to-sky-500 text-white px-4 sm:px-5 py-4 shadow-md">
        <h2 class="text-sm sm:text-base font-semibold mb-2">Catatan penting</h2>
        <ul class="text-[11px] sm:text-xs space-y-1.5 text-primary-50/95">
          <li>• Pembayaran menggunakan Tripay Payment Gateway.</li>
          <li>• Setelah menyelesaikan pembayaran, kamu akan mendapatkan QR yang bisa dipakai untuk masuk gate.</li>
          <li>• Simpan QR tersebut dan jangan dibagikan ke orang lain.</li>
        </ul>
      </aside>
    </section>
  </main>
</div>
