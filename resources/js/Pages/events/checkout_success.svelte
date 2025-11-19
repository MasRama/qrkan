<script>
  import Header from '../../Components/Header.svelte';

  export let event;
  export let participant;
  export let ticket;
  export let seat;
  export let is_paid = false;
  export let qr_image_url;
  export let qr_download_url;

  function formatPrice(v) {
    if (v == null) return '-';
    const n = Number(v);
    if (Number.isNaN(n)) return '-';
    return `Rp ${n.toLocaleString('id-ID')}`;
  }

  function formatDate(ts) {
    if (!ts) return '-';
    const d = new Date(Number(ts));
    if (Number.isNaN(d.getTime())) return '-';
    return d.toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
</script>

<Header group="home" />

<div class="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900 pt-24 pb-10 sm:pt-28 sm:pb-12">
  <main class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
    <section class="text-center space-y-3">
      <p class="text-xs uppercase tracking-[0.18em] text-primary-600/80 dark:text-primary-300/80">
        {#if is_paid}
          Checkout berhasil
        {:else}
          Menunggu pembayaran Tripay
        {/if}
      </p>
      <h1 class="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white">
        {#if is_paid}
          Tiket kamu siap dipakai
        {:else}
          Selesaikan pembayaranmu terlebih dahulu
        {/if}
      </h1>
      <p class="text-sm text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
        {#if is_paid}
          Simpan QR di bawah ini. QR ini akan dipindai saat check-in di gate event.
        {:else}
          Pembayaran kamu belum kami terima. Selesaikan pembayaran di halaman Tripay, lalu refresh halaman ini untuk
          melihat QR tiket.
        {/if}
      </p>
    </section>

    <section class="grid grid-cols-1 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-5 items-start">
      <div class="rounded-2xl bg-white/90 dark:bg-gray-900/90 border border-gray-200/80 dark:border-gray-800 px-4 sm:px-5 py-5 shadow-sm flex flex-col items-center gap-4">
        <div class="inline-flex items-center px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-200">
          Tiket aktif • {event?.name}
        </div>

        {#if qr_image_url}
          <div class="mt-2 bg-white dark:bg-gray-950 rounded-2xl p-3 shadow-sm border border-gray-100 dark:border-gray-800">
            <img
              src={qr_image_url}
              alt="QR Ticket"
              class="w-56 h-56 sm:w-64 sm:h-64 object-contain mx-auto"
            />
          </div>
        {/if}

        <div class="w-full flex flex-col sm:flex-row items-center justify-center gap-3 mt-2">
          {#if qr_download_url}
            <a
              href={qr_download_url}
              class="inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 shadow-sm hover:shadow-md transition-all w-full sm:w-auto"
            >
              Download QR
            </a>
          {:else}
            <span class="text-[11px] sm:text-xs text-gray-600 dark:text-gray-300">
              QR akan tersedia setelah pembayaran Tripay kamu berstatus berhasil. Refresh halaman ini setelah
              menyelesaikan pembayaran.
            </span>
          {/if}
          <a
            href={`/events/${event?.id}/checkout`}
            class="inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all w-full sm:w-auto"
          >
            Beli tiket lain
          </a>
        </div>
      </div>

      <aside class="rounded-2xl bg-white/90 dark:bg-gray-900/90 border border-gray-200/80 dark:border-gray-800 px-4 sm:px-5 py-4 shadow-sm space-y-3 text-xs sm:text-sm text-gray-700 dark:text-gray-200">
        <div>
          <p class="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Detail event</p>
          <p class="font-semibold text-gray-900 dark:text-white">{event?.name}</p>
          <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
            {formatDate(event?.start_at)}
            <span class="mx-1 text-gray-400">→</span>
            {formatDate(event?.end_at)}
          </p>
          <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{event?.location || 'Lokasi belum diisi'}</p>
        </div>

        <div>
          <p class="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Atas nama</p>
          <p class="font-medium">{participant?.name}</p>
          <p class="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{participant?.email || '-'}</p>
          <p class="text-[11px] text-gray-500 dark:text-gray-400">{participant?.phone || '-'}</p>
        </div>

        <div>
          <p class="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Seat</p>
          {#if seat}
            <p class="font-medium">{seat.name}</p>
            <p class="text-[11px] text-gray-500 dark:text-gray-400">{formatPrice(seat.price)}</p>
          {:else}
            <p class="text-[11px] text-gray-500 dark:text-gray-400">Tidak ada informasi seat.</p>
          {/if}
        </div>

        <div>
          <p class="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Info tiket</p>
          <p class="text-[11px] text-gray-500 dark:text-gray-400">
            Status: <span class="font-medium text-gray-800 dark:text-gray-100">{ticket?.status || 'pending'}</span>
          </p>
          <p class="text-[11px] text-gray-500 dark:text-gray-400 break-all">
            Token: <span class="font-mono">{ticket?.token || '-'}</span>
          </p>
        </div>

        <div class="pt-1 border-t border-dashed border-gray-200 dark:border-gray-800 mt-2">
          <p class="text-[11px] text-gray-500 dark:text-gray-400">
            Simpan QR ini di galeri atau aplikasi catatan kamu. Saat hari-H, cukup tunjukkan QR ini ke petugas gate
            untuk proses check-in.
          </p>
        </div>
      </aside>
    </section>
  </main>
</div>
