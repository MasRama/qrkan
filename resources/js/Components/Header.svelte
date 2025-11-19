<script>
  import { fly } from 'svelte/transition';
  import { page, router, inertia } from '@inertiajs/svelte';
  import { clickOutside } from '../Components/helper';
  import DarkModeToggle from './DarkModeToggle.svelte'; 

  let user = $page.props.user;
 
  let isMenuOpen = false;
  let isUserMenuOpen = false;

  export let group; 

  const landingLinks = [
    { href: '/#features', label: 'Fitur', show: true },
    { href: '/#flow', label: 'Alur', show: true },
    { href: '/#roles', label: 'Peran', show: true },
    { href: '/#cta', label: 'Mulai', show: true }
  ];

  let menuLinks = landingLinks;

  $: {
    if (group === 'home') {
      menuLinks = landingLinks;
    } else {
      const isLoggedIn = !!(user && user.id);
      const isOrganizerLike = isLoggedIn && (user.role === 'super_admin' || user.role === 'organizer');

      menuLinks = [
        { href: '/dashboard', label: 'Dashboard', show: isLoggedIn },
        { href: '/events', label: 'Event', show: isOrganizerLike }
      ];
    }
  }
 
  function handleLogout() {
    router.post('/logout');
  }

  const handleNavClick = (event, href) => {
    if (href && href.includes('#')) {
      const id = href.split('#')[1];
      const target = document.getElementById(id);
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        isMenuOpen = false;
      }
    }
  };
</script>

<header class="fixed inset-x-0 top-0 z-50" in:fly={{ y: -20, duration: 800, delay: 150 }}>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="mt-3 flex items-center justify-between rounded-full border border-gray-200/70 dark:border-gray-800/80 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl shadow-sm shadow-gray-900/5 dark:shadow-black/40 px-3 sm:px-4 py-2.5">
      <div class="flex items-center gap-3">
        <a href={user && user.id ? '/dashboard' : '/'} use:inertia class="flex items-center gap-2">
          <img src="/public/logo.png" alt="QRScan" class="h-8 w-8 rounded-lg">
          <div class="hidden sm:flex flex-col leading-tight">
            <span class="text-sm font-semibold text-gray-900 dark:text-white">QRScan</span>
          </div>
        </a>
      </div>

      <!-- Desktop Menu -->
      <nav class="hidden md:flex items-center gap-1 lg:gap-2">
        {#each menuLinks.filter((item) => item.show) as item}
          {#if group === 'home' && item.href && item.href.includes('#')}
            <button
              type="button"
              on:click={(event) => handleNavClick(event, item.href)}
              class="relative px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/70 dark:hover:bg-gray-800/80"
            >
              <span>{item.label}</span>
            </button>
          {:else}
            <a
              use:inertia
              href={item.href}
              class="relative px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/70 dark:hover:bg-gray-800/80"
            >
              <span>{item.label}</span>
            </a>
          {/if}
        {/each}
      </nav>

      <div class="flex items-center gap-1 sm:gap-2">
        <DarkModeToggle />

        <!-- Auth Buttons / User -->
        <div class="hidden sm:flex items-center gap-2 ml-1">
          {#if user && user.id}
            <div class="relative" use:clickOutside on:click_outside={() => (isUserMenuOpen = false)}>
              <button
                class="flex items-center gap-2 rounded-full border border-gray-200/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 px-2.5 py-1.5 hover:border-primary-400/70 hover:bg-primary-50/70 dark:hover:bg-gray-800/90 transition-all"
                on:click={() => (isUserMenuOpen = !isUserMenuOpen)}
              >
                <div class="h-7 w-7 rounded-full bg-gradient-to-tr from-primary-500 to-emerald-400 text-[11px] font-semibold text-white flex items-center justify-center">
                  <span>{user.name[0].toUpperCase()}</span>
                </div>
                <span class="hidden md:inline text-xs font-medium text-gray-800 dark:text-gray-100 max-w-[120px] truncate">
                  {user.name}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="h-4 w-4 text-gray-400"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              {#if isUserMenuOpen}
                <div
                  class="absolute right-0 mt-2 w-52 rounded-2xl bg-white/95 dark:bg-gray-900/95 shadow-xl ring-1 ring-black/5 dark:ring-white/10 py-2 text-xs text-gray-700 dark:text-gray-200"
                  transition:fly={{ y: -10, duration: 180 }}
                >
                  <a
                    href="/profile/{user.username}"
                    use:inertia
                    class="block px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    Profile
                  </a>
                  <a
                    href="/profile"
                    use:inertia
                    class="block px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    Edit Profile
                  </a>
                  <a
                    href="/settings"
                    use:inertia
                    class="block px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    Settings
                  </a>
                  <button
                    on:click={handleLogout}
                    class="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-gray-800"
                  >
                    Logout
                  </button>
                </div>
              {/if}
            </div>
          {:else}
            <a
              href="/login"
              use:inertia
              class="inline-flex items-center justify-center rounded-full bg-primary-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-primary-700 hover:shadow-md transition-all"
            >
              Masuk
            </a>
          {/if}
        </div>

        <!-- Mobile Menu Button -->
        <button
          class="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-full border border-gray-200/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-900/80 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 ml-1"
          on:click={() => (isMenuOpen = !isMenuOpen)}
          aria-label="Menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-5 h-5"
          >
            {#if !isMenuOpen}
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            {:else}
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            {/if}
          </svg>
        </button>
      </div>
    </div>
  </div>

  <!-- Mobile Menu -->
  {#if isMenuOpen}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      use:clickOutside
      on:click_outside={() => (isMenuOpen = false)}
      class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
      on:click={() => (isMenuOpen = false)}
    >
      <div
        class="absolute right-3 top-20 w-64 rounded-3xl bg-white/95 dark:bg-gray-950/95 shadow-2xl ring-1 ring-black/5 dark:ring-white/10 overflow-hidden"
        on:click|stopPropagation
      >
        <div class="px-4 pt-4 pb-3 border-b border-gray-100 dark:border-gray-800">
          <p class="text-[11px] font-medium uppercase tracking-[0.18em] text-gray-400 mb-1">
            Navigasi
          </p>
          <div class="flex flex-col space-y-1">
            {#each menuLinks.filter((item) => item.show) as item}
              {#if group === 'home' && item.href && item.href.includes('#')}
                <button
                  type="button"
                  on:click={(event) => handleNavClick(event, item.href)}
                  class="mobile-nav-link dark:text-gray-200 dark:hover:bg-gray-800/90 dark:hover:text-white {item.group === group ? 'active' : ''}"
                >
                  {item.label}
                </button>
              {:else}
                <a
                  href={item.href}
                  use:inertia
                  class="mobile-nav-link dark:text-gray-200 dark:hover:bg-gray-800/90 dark:hover:text-white {item.group === group ? 'active' : ''}"
                >
                  {item.label}
                </a>
              {/if}
            {/each}
          </div>
        </div>
        <div class="px-4 py-3 space-y-2">
          {#if user}
            <button
              class="w-full btn-secondary dark:bg-gray-900 dark:border-gray-700 dark:hover:bg-gray-800 dark:hover:text-white dark:text-gray-300 text-xs py-2"
              on:click={handleLogout}
            >
              Logout
            </button>
          {:else}
            <a
              href="/login"
              use:inertia
              class="w-full btn-primary text-xs py-2"
            >
              Masuk
            </a>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</header>