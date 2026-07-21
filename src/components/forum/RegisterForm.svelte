<script lang="ts">
  import { register } from "@lib/forum-api";

  let username = "";
  let email = "";
  let password = "";
  let confirmPassword = "";
  let error = "";
  let loading = false;
  let registered = false;

  const handleSubmit = async () => {
    error = "";
    if (!username || !email || !password) {
      error = "请填写所有必填字段";
      return;
    }
    if (password !== confirmPassword) {
      error = "两次密码不一致";
      return;
    }
    if (password.length < 8 || password.length > 16) {
      error = "密码需要8-16位";
      return;
    }
    loading = true;
    try {
      await register(email, password, username);
      registered = true;
    } catch (e) {
      error = e instanceof Error ? e.message : "注册失败";
    } finally {
      loading = false;
    }
  };
</script>

<div class="max-w-md mx-auto">
  <div class="card-base p-6 md:p-8">
    {#if registered}
      <h2 class="text-xl font-bold text-90 mb-4 text-center">注册成功</h2>
      <p class="text-75 text-sm mb-6 text-center">验证邮件已发送至 {email}，请前往邮箱完成验证。</p>
      <a href="/forum/login/" data-no-swup class="block w-full py-2.5 rounded-lg bg-[var(--primary)] text-white dark:text-gray-900 font-medium text-sm text-center transition hover:opacity-90">去登录</a>
    {:else}
      <h2 class="text-xl font-bold text-90 mb-6 text-center">注册账号</h2>

      {#if error}
        <div class="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">{error}</div>
      {/if}

      <form on:submit|preventDefault={handleSubmit} class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-75 mb-1" for="username">用户名</label>
          <input
            id="username" type="text" bind:value={username} required
            class="w-full px-3 py-2 rounded-lg bg-black/[0.04] dark:bg-white/5 focus:bg-black/[0.06] dark:focus:bg-white/10 text-90 text-sm outline-none transition"
          />
        </div>

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
            id="password" type="password" bind:value={password} required minlength="8"
            class="w-full px-3 py-2 rounded-lg bg-black/[0.04] dark:bg-white/5 focus:bg-black/[0.06] dark:focus:bg-white/10 text-90 text-sm outline-none transition"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-75 mb-1" for="confirm">确认密码</label>
          <input
            id="confirm" type="password" bind:value={confirmPassword} required
            class="w-full px-3 py-2 rounded-lg bg-black/[0.04] dark:bg-white/5 focus:bg-black/[0.06] dark:focus:bg-white/10 text-90 text-sm outline-none transition"
          />
        </div>

        <button
          type="submit" disabled={loading}
          class="w-full py-2.5 rounded-lg bg-[var(--primary)] text-white dark:text-gray-900 font-medium text-sm transition hover:opacity-90 disabled:opacity-50"
        >{loading ? "注册中..." : "注册"}</button>
      </form>

      <div class="mt-4 text-center text-sm text-50">
        已有账号？<a href="/forum/login/" data-no-swup class="text-[var(--primary)] hover:underline">登录</a>
      </div>
    {/if}
  </div>
</div>
