<script lang="ts">
  import { login } from "@lib/forum-api";

  let email = "";
  let password = "";
  let totp = "";
  let error = "";
  let loading = false;
  let showTotp = false;

  const handleSubmit = async () => {
    error = "";
    if (!email || !password) {
      error = "请填写邮箱和密码";
      return;
    }
    loading = true;
    try {
      await login(email, password, showTotp ? totp : undefined);
      window.location.href = "/forum/";
    } catch (e) {
      error = e instanceof Error ? e.message : "登录失败";
    } finally {
      loading = false;
    }
  };
</script>

<div class="max-w-md mx-auto">
  <div class="card-base p-6 md:p-8">
    <h2 class="text-xl font-bold text-90 mb-6 text-center">登录论坛</h2>

    {#if error}
      <div class="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">{error}</div>
    {/if}

    <form on:submit|preventDefault={handleSubmit} class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-75 mb-1" for="email">邮箱</label>
        <input
          id="email" type="email" bind:value={email} required
          class="w-full px-3 py-2 rounded-lg bg-black/[0.04] dark:bg-white/5 focus:bg-black/[0.06] dark:focus:bg-white/10 text-90 text-sm outline-none transition"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-75 mb-1" for="password">密码</label>
        <input
          id="password" type="password" bind:value={password} required
          class="w-full px-3 py-2 rounded-lg bg-black/[0.04] dark:bg-white/5 focus:bg-black/[0.06] dark:focus:bg-white/10 text-90 text-sm outline-none transition"
        />
      </div>

      {#if showTotp}
        <div>
          <label class="block text-sm font-medium text-75 mb-1" for="totp">两步验证码</label>
          <input
            id="totp" type="text" bind:value={totp} placeholder="6位验证码"
            class="w-full px-3 py-2 rounded-lg bg-black/[0.04] dark:bg-white/5 focus:bg-black/[0.06] dark:focus:bg-white/10 text-90 text-sm outline-none transition"
          />
        </div>
      {:else}
        <button type="button" class="text-sm text-[var(--primary)] hover:underline" on:click={() => (showTotp = true)}>
          需要两步验证？
        </button>
      {/if}

      <button
        type="submit" disabled={loading}
        class="w-full py-2.5 rounded-lg bg-[var(--primary)] text-white dark:text-gray-900 font-medium text-sm transition hover:opacity-90 disabled:opacity-50"
      >{loading ? "登录中..." : "登录"}</button>
    </form>

    <div class="mt-4 text-center text-sm text-50">
      还没有账号？<a href="/forum/register/" data-no-swup class="text-[var(--primary)] hover:underline">注册</a>
    </div>
  </div>
</div>
