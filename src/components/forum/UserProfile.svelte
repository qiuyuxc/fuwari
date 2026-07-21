<script lang="ts">
  import { onMount } from "svelte";
  import {
    getSession, getUserMe, getUserPosts, updateProfile, updateProfileExt, deleteAccount, logout,
    uploadImage, getCurrentUser, changeEmail, changePassword,
    setupTOTP, verifyTOTP, disableTOTP,
    type ForumUser, type ForumPost,
  } from "@lib/forum-api";

  let user: ForumUser | null = getCurrentUser();
  let myPosts: ForumPost[] = [];
  let loading = true;
  let error = "";
  let fetchError = "";
  let editing = false;

  let editUsername = "";
  let editBio = "";
  let editAvatarUrl = "";
  let saving = false;
  let saveError = "";
  let saved = false;

  // Avatar upload
  let avatarUploading = false;

  // Change email
  let showChangeEmail = false;
  let newEmail = "";
  let emailSaving = false;
  let emailError = "";
  let emailSuccess = "";

  // Change password
  let showChangePwd = false;
  let oldPwd = "";
  let newPwd = "";
  let pwdSaving = false;
  let pwdError = "";
  let pwdSuccess = "";

  // TOTP
  let showTOTP = false;
  let totpEnabled = false;
  let totpLoading = false;
  let totpSecret = "";
  let totpUri = "";
  let totpCode = "";
  let totpSaving = false;
  let totpError = "";
  let totpSuccess = "";
  let totpDisablePwd = "";
  let totpDisableCode = "";

  const fetchProfile = async () => {
    loading = true;
    error = "";
    fetchError = "";
    try {
      const [, userRes, postsRes] = await Promise.all([getSession(), getUserMe(), getUserPosts(10, 0)]);
      user = userRes.user;
      myPosts = postsRes.posts;
      editUsername = user.username;
      editBio = user.bio || "";
      editAvatarUrl = user.avatar_url || "";
    } catch (e) {
      if (!user) {
        error = e instanceof Error ? e.message : "加载失败";
      } else {
        fetchError = e instanceof Error ? e.message : "加载失败";
      }
    } finally {
      loading = false;
    }
  };

  onMount(fetchProfile);

  const handleSave = async () => {
    saveError = "";
    saved = false;
    saving = true;
    try {
      const [res1] = await Promise.all([
        updateProfile({ username: editUsername, avatar_url: editAvatarUrl || undefined }),
        updateProfileExt({ bio: editBio }),
      ]);
      user = res1.user;
      saved = true;
      editing = false;
      window.dispatchEvent(new CustomEvent("user-updated"));
      fetchProfile();
    } catch (e) {
      saveError = e instanceof Error ? e.message : "保存失败";
    } finally {
      saving = false;
    }
  };

  const handleAvatarUpload = async (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    avatarUploading = true;
    try {
      const res = await uploadImage(file);
      const avatarRes = await updateProfile({ avatar_url: res.url });
      user = avatarRes.user;
      window.dispatchEvent(new CustomEvent("user-updated"));
      fetchProfile();
    } catch (err) {
      alert(err instanceof Error ? err.message : "上传失败");
    } finally {
      avatarUploading = false;
    }
  };

  const handleChangeEmail = async () => {
    emailError = "";
    emailSuccess = "";
    if (!newEmail.trim()) { emailError = "请输入新邮箱"; return; }
    emailSaving = true;
    try {
      await changeEmail(newEmail.trim());
      emailSuccess = "验证邮件已发送，请前往新邮箱确认";
      newEmail = "";
    } catch (e) {
      emailError = e instanceof Error ? e.message : "修改失败";
    } finally {
      emailSaving = false;
    }
  };

  const handleChangePwd = async () => {
    pwdError = "";
    pwdSuccess = "";
    if (!oldPwd) { pwdError = "请输入旧密码"; return; }
    if (newPwd.length < 8 || newPwd.length > 16) { pwdError = "新密码需要 8-16 位"; return; }
    pwdSaving = true;
    try {
      await changePassword(oldPwd, newPwd);
      pwdSuccess = "密码修改成功";
      oldPwd = "";
      newPwd = "";
      showChangePwd = false;
    } catch (e) {
      pwdError = e instanceof Error ? e.message : "修改失败";
    } finally {
      pwdSaving = false;
    }
  };

  const handleSetupTOTP = async () => {
    totpError = "";
    totpSuccess = "";
    totpLoading = true;
    try {
      const res = await setupTOTP();
      totpSecret = res.secret;
      totpUri = res.uri;
    } catch (e) {
      totpError = e instanceof Error ? e.message : "初始化失败";
    } finally {
      totpLoading = false;
    }
  };

  const handleVerifyTOTP = async () => {
    if (!totpCode) { totpError = "请输入验证码"; return; }
    totpSaving = true;
    totpError = "";
    try {
      await verifyTOTP(totpCode);
      totpEnabled = true;
      totpSuccess = "两步验证已启用";
      totpSecret = "";
      totpUri = "";
      totpCode = "";
      fetchProfile();
    } catch (e) {
      totpError = e instanceof Error ? e.message : "验证失败";
    } finally {
      totpSaving = false;
    }
  };

  const handleDisableTOTP = async () => {
    if (!totpDisablePwd || !totpDisableCode) { totpError = "请填写密码和验证码"; return; }
    totpSaving = true;
    totpError = "";
    totpSuccess = "";
    try {
      await disableTOTP(totpDisablePwd, totpDisableCode);
      totpEnabled = false;
      totpSuccess = "两步验证已停用";
      totpDisablePwd = "";
      totpDisableCode = "";
      fetchProfile();
    } catch (e) {
      totpError = e instanceof Error ? e.message : "停用失败";
    } finally {
      totpSaving = false;
    }
  };

  const toggleTOTP = async () => {
    showTOTP = !showTOTP;
    if (showTOTP) {
      totpError = "";
      totpSuccess = "";
      // Use user's totp_enabled from profile as initial state
      if (user?.totp_enabled) {
        totpEnabled = true;
      }
    }
  };

  const handleDelete = async () => {
    if (!confirm("确定要删除账号吗？此操作不可撤销。")) return;
    try {
      await deleteAccount();
      logout();
      window.location.href = "/forum/";
    } catch (e) {
      alert(e instanceof Error ? e.message : "删除失败");
    }
  };

  const handleLogoutClick = () => {
    logout();
    window.location.href = "/forum/";
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("zh-CN");
</script>

<div class="max-w-2xl mx-auto">
  {#if loading}
    <div class="animate-pulse">
      <div class="flex items-center gap-4 mb-6">
        <div class="w-16 h-16 rounded-full bg-black/5 dark:bg-white/5"></div>
        <div>
          <div class="h-5 bg-black/5 dark:bg-white/5 rounded w-24 mb-2"></div>
          <div class="h-3 bg-black/5 dark:bg-white/5 rounded w-40"></div>
        </div>
      </div>
    </div>
  {:else if user}
    {#if fetchError}
      <div class="mb-4 p-2 rounded text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20">{fetchError}</div>
    {/if}
    <div class="mb-6">
      {#if !editing}
        <div class="flex items-center gap-4 mb-6">
          <label class="relative cursor-pointer group {avatarUploading ? 'opacity-50 pointer-events-none' : ''}">
            {#if user.avatar_url}
              <img src={user.avatar_url} alt="avatar" class="w-16 h-16 rounded-full object-cover" />
            {:else}
              <div class="w-16 h-16 rounded-full bg-[var(--primary)]/20 flex items-center justify-center text-2xl font-bold text-[var(--primary)]">
                {(user.username || "?").charAt(0).toUpperCase()}
              </div>
            {/if}
            <div class="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <span class="text-white text-xs">{avatarUploading ? "上传中..." : "换头像"}</span>
            </div>
            <input type="file" accept="image/*" class="hidden" on:change={handleAvatarUpload} />
          </label>
          <div>
            <h2 class="text-xl font-bold text-90">{user.username}</h2>
            <p class="text-sm text-50">{user.email}</p>
            {#if user.bio}
              <p class="text-sm text-75 mt-1">{user.bio}</p>
            {/if}
          </div>
        </div>
        <div class="flex gap-2">
          <button class="btn-plain rounded-lg px-4 py-1.5 text-sm" on:click={() => (editing = true)}>编辑资料</button>
          <button class="btn-plain rounded-lg px-4 py-1.5 text-sm" on:click={handleLogoutClick}>退出登录</button>
          <button class="btn-plain rounded-lg px-4 py-1.5 text-sm text-red-500 ml-auto" on:click={handleDelete}>删除账号</button>
        </div>
      {:else}
        <h3 class="text-lg font-bold text-90 mb-4">编辑资料</h3>
        {#if saveError}
          <div class="mb-3 p-2 rounded text-sm text-red-500 bg-red-50 dark:bg-red-900/20">{saveError}</div>
        {/if}
        {#if saved}
          <div class="mb-3 p-2 rounded text-sm text-green-500 bg-green-50 dark:bg-green-900/20">保存成功</div>
        {/if}
        <form on:submit|preventDefault={handleSave} class="space-y-3">
          <div>
            <label class="block text-sm font-medium text-75 mb-1" for="edit-username">用户名</label>
            <input id="edit-username" type="text" bind:value={editUsername}
              class="w-full px-3 py-2 rounded-lg bg-black/[0.04] dark:bg-white/5 focus:bg-black/[0.06] dark:focus:bg-white/10 text-90 text-sm outline-none transition"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-75 mb-1" for="edit-avatar">头像 URL</label>
            <input id="edit-avatar" type="url" bind:value={editAvatarUrl} placeholder="https://..."
              class="w-full px-3 py-2 rounded-lg bg-black/[0.04] dark:bg-white/5 focus:bg-black/[0.06] dark:focus:bg-white/10 text-90 text-sm outline-none transition"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-75 mb-1" for="edit-bio">个人简介</label>
            <textarea id="edit-bio" bind:value={editBio} rows="2"
              class="w-full px-3 py-2 rounded-lg bg-black/[0.04] dark:bg-white/5 focus:bg-black/[0.06] dark:focus:bg-white/10 text-90 text-sm outline-none transition resize-y"
            ></textarea>
          </div>
          <div class="flex gap-2">
            <button type="submit" disabled={saving}
              class="bg-[var(--primary)] text-white dark:text-gray-900 rounded-lg px-4 py-1.5 text-sm hover:opacity-90 disabled:opacity-50"
            >{saving ? "保存中..." : "保存"}</button>
            <button type="button" class="btn-plain rounded-lg px-4 py-1.5 text-sm" on:click={() => (editing = false)}>取消</button>
          </div>
        </form>
      {/if}
    </div>

    <!-- Account Settings -->
    <div class="mb-8 pt-6 border-t border-black/5 dark:border-white/10">
      <h3 class="text-lg font-bold text-90 mb-4">账号设置</h3>

      <div class="space-y-2">
        <!-- Change Email -->
        <div class="rounded-lg border border-black/5 dark:border-white/10 overflow-hidden">
          <button
            class="w-full flex items-center justify-between px-4 py-3 text-sm text-75 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition"
            on:click={() => (showChangeEmail = !showChangeEmail, emailError = "", emailSuccess = "")}>
            <span>修改邮箱</span>
            <span class="text-xs text-50 transition-transform {showChangeEmail ? 'rotate-180' : ''}">▼</span>
          </button>
          {#if showChangeEmail}
            <div class="px-4 pb-4">
              {#if emailError}<div class="mb-2 p-2 rounded text-sm text-red-500 bg-red-50 dark:bg-red-900/20">{emailError}</div>{/if}
              {#if emailSuccess}<div class="mb-2 p-2 rounded text-sm text-green-500 bg-green-50 dark:bg-green-900/20">{emailSuccess}</div>{/if}
              <form on:submit|preventDefault={handleChangeEmail} class="flex gap-2">
                <input type="email" bind:value={newEmail} placeholder="新邮箱地址" required
                  class="flex-1 px-3 py-2 rounded-lg bg-black/[0.04] dark:bg-white/5 text-90 text-sm outline-none transition" />
                <button type="submit" disabled={emailSaving}
                  class="bg-[var(--primary)] text-white dark:text-gray-900 rounded-lg px-4 py-2 text-sm hover:opacity-90 disabled:opacity-50 shrink-0">
                  {emailSaving ? "发送中..." : "发送验证"}
                </button>
              </form>
            </div>
          {/if}
        </div>

        <!-- Change Password -->
        <div class="rounded-lg border border-black/5 dark:border-white/10 overflow-hidden">
          <button
            class="w-full flex items-center justify-between px-4 py-3 text-sm text-75 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition"
            on:click={() => (showChangePwd = !showChangePwd, pwdError = "", pwdSuccess = "")}>
            <span>修改密码</span>
            <span class="text-xs text-50 transition-transform {showChangePwd ? 'rotate-180' : ''}">▼</span>
          </button>
          {#if showChangePwd}
            <div class="px-4 pb-4">
              {#if pwdError}<div class="mb-2 p-2 rounded text-sm text-red-500 bg-red-50 dark:bg-red-900/20">{pwdError}</div>{/if}
              {#if pwdSuccess}<div class="mb-2 p-2 rounded text-sm text-green-500 bg-green-50 dark:bg-green-900/20">{pwdSuccess}</div>{/if}
              <form on:submit|preventDefault={handleChangePwd} class="space-y-3">
                <input type="password" bind:value={oldPwd} placeholder="旧密码" required
                  class="w-full px-3 py-2 rounded-lg bg-black/[0.04] dark:bg-white/5 text-90 text-sm outline-none transition" />
                <input type="password" bind:value={newPwd} placeholder="新密码（8-16位）" required minlength="8" maxlength="16"
                  class="w-full px-3 py-2 rounded-lg bg-black/[0.04] dark:bg-white/5 text-90 text-sm outline-none transition" />
                <button type="submit" disabled={pwdSaving}
                  class="bg-[var(--primary)] text-white dark:text-gray-900 rounded-lg px-4 py-2 text-sm hover:opacity-90 disabled:opacity-50">
                  {pwdSaving ? "修改中..." : "修改密码"}
                </button>
              </form>
            </div>
          {/if}
        </div>

        <!-- TOTP -->
        <div class="rounded-lg border border-black/5 dark:border-white/10 overflow-hidden">
          <button
            class="w-full flex items-center justify-between px-4 py-3 text-sm text-75 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition"
            on:click={toggleTOTP}>
            <span>两步验证 {totpEnabled ? '(已启用)' : ''}</span>
            <span class="text-xs text-50 transition-transform {showTOTP ? 'rotate-180' : ''}">▼</span>
          </button>
          {#if showTOTP}
            <div class="px-4 pb-4">
              {#if totpError}
                <div class="mb-2 p-2 rounded text-sm text-red-500 bg-red-50 dark:bg-red-900/20">{totpError}</div>
              {/if}
              {#if totpSuccess}
                <div class="mb-2 p-2 rounded text-sm text-green-500 bg-green-50 dark:bg-green-900/20">{totpSuccess}</div>
              {/if}

              {#if totpEnabled}
                <!-- Disable TOTP -->
                <p class="text-sm text-50 mb-3">两步验证已启用。如需停用，请输入密码和验证码。</p>
                <form on:submit|preventDefault={handleDisableTOTP} class="space-y-3">
                  <input type="password" bind:value={totpDisablePwd} placeholder="登录密码" required
                    class="w-full px-3 py-2 rounded-lg bg-black/[0.04] dark:bg-white/5 text-90 text-sm outline-none transition" />
                  <input type="text" bind:value={totpDisableCode} placeholder="6位验证码" required maxlength="6"
                    class="w-full px-3 py-2 rounded-lg bg-black/[0.04] dark:bg-white/5 text-90 text-sm outline-none transition" />
                  <button type="submit" disabled={totpSaving}
                    class="bg-red-500 text-white rounded-lg px-4 py-2 text-sm hover:opacity-90 disabled:opacity-50">
                    {totpSaving ? "停用中..." : "停用两步验证"}
                  </button>
                </form>
              {:else if totpSecret}
                <!-- Verify TOTP -->
                <p class="text-sm text-75 mb-2">使用认证器 App 扫描二维码或手动输入密钥：</p>
                <div class="mb-3 font-mono text-sm text-[var(--primary)] break-all bg-black/[0.04] dark:bg-white/5 p-2 rounded">{totpSecret}</div>
                <form on:submit|preventDefault={handleVerifyTOTP} class="flex gap-2">
                  <input type="text" bind:value={totpCode} placeholder="6位验证码" required maxlength="6"
                    class="flex-1 px-3 py-2 rounded-lg bg-black/[0.04] dark:bg-white/5 text-90 text-sm outline-none transition" />
                  <button type="submit" disabled={totpSaving}
                    class="bg-[var(--primary)] text-white dark:text-gray-900 rounded-lg px-4 py-2 text-sm hover:opacity-90 disabled:opacity-50 shrink-0">
                    {totpSaving ? "验证中..." : "验证启用"}
                  </button>
                </form>
              {:else}
                <p class="text-sm text-50 mb-3">启用两步验证可增强账户安全性。</p>
                <button on:click={handleSetupTOTP} disabled={totpLoading}
                  class="bg-[var(--primary)] text-white dark:text-gray-900 rounded-lg px-4 py-2 text-sm hover:opacity-90 disabled:opacity-50">
                  {totpLoading ? "初始化中..." : "启用两步验证"}
                </button>
              {/if}
            </div>
          {/if}
        </div>
      </div>
    </div>

    <div>
      <h3 class="text-lg font-bold text-90 mb-4">我的帖子</h3>
      {#if myPosts.length === 0}
        <p class="text-50 text-sm">暂无帖子</p>
      {:else}
        <div class="space-y-2">
          {#each myPosts as post}
            <a href="/forum/post/?id={post.id}" data-no-swup class="block p-3 rounded-lg hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition">
              <span class="text-90 font-medium">{post.title}</span>
              <span class="text-50 text-sm ml-2">{formatDate(post.created_at)}</span>
            </a>
          {/each}
        </div>
      {/if}
    </div>
  {:else if error}
    <div class="text-center py-8">
      <p class="text-red-500 mb-4">{error}</p>
      <a href="/forum/login/" data-no-swup class="text-[var(--primary)] hover:underline text-sm">去登录</a>
    </div>
  {:else}
    <div class="text-center py-8 text-50">用户信息加载失败</div>
  {/if}
</div>
