<script lang="ts">
  import { onMount } from "svelte";
  import { getSession, getCurrentUser, logout, isAdmin, type ForumUser } from "@lib/forum-api";

  let user: ForumUser | null = getCurrentUser();
  let showMenu = false;

  const refreshUser = () => {
    user = getCurrentUser();
  };

  onMount(async () => {
    window.addEventListener("user-updated", refreshUser);
    try {
      const res = await getSession();
      if (res.user && res.user.id) user = getCurrentUser() || res.user;
    } catch { /* use cached user */ }
  });

  const handleLogout = () => {
    logout();
    user = null;
    showMenu = false;
    window.location.href = "/forum/";
  };

  const toggleMenu = () => (showMenu = !showMenu);
</script>

<header class="mb-6">
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-3">
      <h1 class="text-2xl font-bold text-90">
        <a href="/forum/" data-no-swup>论坛</a>
      </h1>
    </div>

    <div class="flex items-center gap-2">
      {#if user}
        {#if isAdmin(user)}
          <a href="/forum/admin/" data-no-swup class="btn-plain rounded-lg px-3 py-1.5 text-sm text-[var(--primary)]">管理</a>
        {/if}
        <a href="/forum/create/" data-no-swup class="bg-[var(--primary)] text-white dark:text-gray-900 rounded-lg px-4 py-2 text-sm hover:opacity-90 transition">发帖</a>
        <div class="relative">
          <button on:click={toggleMenu} class="btn-plain rounded-full w-9 h-9 text-sm font-bold overflow-hidden">
            {#if user.avatar_url}
              <img src={user.avatar_url} alt="" class="w-full h-full rounded-full object-cover" />
            {:else}
              <span class="w-full h-full rounded-full bg-[var(--primary)]/20 text-[var(--primary)] flex items-center justify-center">{(user.username || "?").charAt(0).toUpperCase()}</span>
            {/if}
          </button>
          {#if showMenu}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div class="fixed inset-0 z-40" on:click={toggleMenu}></div>
            <div class="absolute right-0 top-11 float-panel p-1 min-w-[8rem] z-50">
              <a href="/forum/profile/" data-no-swup class="block rounded-lg px-4 py-2 text-sm text-75 hover:bg-[var(--btn-plain-bg-hover)] transition">个人中心</a>
              <button on:click={handleLogout} class="w-full text-left rounded-lg px-4 py-2 text-sm text-75 hover:bg-[var(--btn-plain-bg-hover)] transition">退出登录</button>
            </div>
          {/if}
        </div>
      {:else}
        <a href="/forum/login/" data-no-swup class="btn-plain rounded-lg px-4 py-2 text-sm">登录</a>
        <a href="/forum/register/" data-no-swup class="bg-[var(--primary)] text-white dark:text-gray-900 rounded-lg px-4 py-2 text-sm hover:opacity-90 transition">注册</a>
      {/if}
    </div>
  </div>
</header>
