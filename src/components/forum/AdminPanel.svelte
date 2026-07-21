<script lang="ts">
  import { onMount } from "svelte";
  import {
    getSession, getAdminStats, getAdminUsers, deleteAdminUser,
    getPosts, deleteAdminPost, getCategories, createCategory,
    getAdminSettings, updateAdminSettings, type ForumUser, type ForumPost, type ForumCategory,
  } from "@lib/forum-api";

  let adminUser: ForumUser | null = null;
  let authLoading = true;
  let authError = "";

  type Tab = "dashboard" | "posts" | "users" | "categories" | "settings";
  let tab: Tab = "dashboard";

  // Dashboard
  let stats: Record<string, unknown> = {};
  let statsLoading = false;

  // Posts
  let posts: ForumPost[] = [];
  let postsLoading = false;

  // Users
  let users: ForumUser[] = [];
  let usersLoading = false;
  let userSearch = "";

  // Categories
  let categories: ForumCategory[] = [];
  let catLoading = false;
  let newCatName = "";
  let newCatDesc = "";

  // Settings
  let settings: Record<string, string> = {};
  let settingsLoading = false;
  let settingsSaving = false;
  let settingsSaved = false;

  const settingsLabels: Record<string, string> = {
    turnstile_enabled: "Turnstile 验证",
    notify_on_user_delete: "用户删除通知",
    notify_on_post_delete: "帖子删除通知",
    notify_on_new_post: "新帖通知",
    notify_on_username_change: "用户名修改通知",
    notify_on_avatar_change: "头像修改通知",
    notify_on_manual_verify: "手动验证通知",
    session_ttl_days: "会话过期天数",
    draw_cooldown_seconds: "抽签冷却秒数",
    home_intro_markdown: "首页介绍 (Markdown)",
    site_footer_markdown: "页脚 (Markdown)",
  };

  onMount(async () => {
    try {
      const res = await getSession();
      if (res.user.role !== "admin") { authError = "无管理权限"; return; }
      adminUser = res.user;
      loadTab();
    } catch { authError = "请先登录"; }
    authLoading = false;
  });

  const loadTab = () => {
    switch (tab) {
      case "dashboard": loadStats(); break;
      case "posts": loadPosts(); break;
      case "users": loadUsers(); break;
      case "categories": loadCategories(); break;
      case "settings": loadSettings(); break;
    }
  };

  const switchTab = (t: Tab) => { tab = t; loadTab(); };

  const loadStats = async () => { statsLoading = true; try { stats = await getAdminStats(); } catch { /* */ } statsLoading = false; };
  const loadPosts = async () => { postsLoading = true; try { const r = await getPosts(50, 0); posts = r.posts; } catch { /* */ } postsLoading = false; };
  const handleDeletePost = async (id: number) => { if (!confirm("确定删除？")) return; try { await deleteAdminPost(id); posts = posts.filter(p => p.id !== id); } catch (e: any) { alert(e.message); } };

  const loadUsers = async () => { usersLoading = true; try { const r = await getAdminUsers(userSearch || undefined); users = r.users; } catch { /* */ } usersLoading = false; };
  const handleDeleteUser = async (id: number) => { if (!confirm("确定删除？")) return; try { await deleteAdminUser(id); users = users.filter(u => u.id !== id); } catch (e: any) { alert(e.message); } };

  const loadCategories = async () => { catLoading = true; try { categories = await getCategories(); } catch { /* */ } catLoading = false; };
  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    try { await createCategory(newCatName.trim(), newCatDesc.trim() || undefined); newCatName = ""; newCatDesc = ""; loadCategories(); }
    catch (e: any) { alert(e.message); }
  };

  const loadSettings = async () => { settingsLoading = true; try { const s = await getAdminSettings(); settings = {}; for (const [k, v] of Object.entries(s)) { settings[k] = typeof v === "string" ? v : JSON.stringify(v); } } catch { /* */ } settingsLoading = false; };
  const handleSaveSettings = async () => {
    settingsSaving = true; settingsSaved = false;
    try {
      const data: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(settings)) {
        if (v === "true") data[k] = true;
        else if (v === "false") data[k] = false;
        else if (/^\d+$/.test(v)) data[k] = parseInt(v);
        else data[k] = v;
      }
      await updateAdminSettings(data);
      settingsSaved = true;
    } catch (e: any) { alert(e.message); }
    settingsSaving = false;
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "dashboard", label: "概览" },
    { key: "posts", label: "帖子" },
    { key: "users", label: "用户" },
    { key: "categories", label: "分类" },
    { key: "settings", label: "设置" },
  ];
</script>

<div class="admin-panel">
  {#if authLoading}
    <div class="text-center py-12 text-50">验证中...</div>
  {:else if authError}
    <div class="text-center py-12">
      <p class="text-red-500 mb-4">{authError}</p>
      <a href="/forum/login/" data-no-swup class="text-[var(--primary)] hover:underline text-sm">去登录</a>
    </div>
  {:else}
    <div class="flex flex-wrap gap-1 mb-6 border-b border-black/5 dark:border-white/10 pb-0">
      {#each tabs as t}
        <button
          class="px-4 py-2.5 text-sm transition border-b-2 -mb-[1px] {tab === t.key ? 'border-[var(--primary)] text-[var(--primary)] font-medium' : 'border-transparent text-50 hover:text-75'}"
          on:click={() => switchTab(t.key)}>{t.label}</button>
      {/each}
    </div>

    {#if tab === "dashboard"}
      {#if statsLoading}<div class="text-center py-8 text-50">加载中...</div>{:else}
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div class="card-base p-4 text-center"><div class="text-2xl font-bold text-[var(--primary)]">{stats.users ?? "-"}</div><div class="text-xs text-50 mt-1">用户数</div></div>
          <div class="card-base p-4 text-center"><div class="text-2xl font-bold text-[var(--primary)]">{stats.posts ?? "-"}</div><div class="text-xs text-50 mt-1">帖子数</div></div>
          <div class="card-base p-4 text-center"><div class="text-2xl font-bold text-[var(--primary)]">{stats.comments ?? "-"}</div><div class="text-xs text-50 mt-1">评论数</div></div>
        </div>
      {/if}
    {/if}

    {#if tab === "posts"}
      {#if postsLoading}<div class="text-center py-8 text-50">加载中...</div>{:else if posts.length === 0}<div class="text-center py-8 text-50">暂无帖子</div>{:else}
        <div class="space-y-2">
          {#each posts as post}
            <div class="flex items-center justify-between p-3 rounded-lg hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
              <div><span class="text-90 font-medium">{post.title}</span><span class="text-50 text-sm ml-2">#{post.id} · {post.user?.username || "?"}</span></div>
              <button class="text-red-500 text-sm hover:underline" on:click={() => handleDeletePost(post.id)}>删除</button>
            </div>
          {/each}
        </div>
      {/if}
    {/if}

    {#if tab === "users"}
      <div class="flex gap-2 mb-4">
        <input type="text" placeholder="搜索用户..." bind:value={userSearch} class="flex-1 px-3 py-2 rounded-lg bg-black/[0.04] dark:bg-white/5 text-90 text-sm outline-none transition" />
        <button class="bg-[var(--primary)] text-white dark:text-gray-900 rounded-lg px-4 py-2 text-sm" on:click={loadUsers}>搜索</button>
      </div>
      {#if usersLoading}<div class="text-center py-8 text-50">加载中...</div>{:else if users.length === 0}<div class="text-center py-8 text-50">暂无用户</div>{:else}
        <div class="space-y-2">
          {#each users as u}
            <div class="flex items-center justify-between p-3 rounded-lg hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
              <div><span class="text-90 font-medium">{u.username}</span><span class="text-50 text-sm ml-2">{u.email}</span>
                {#if u.role === "admin"}<span class="text-[var(--primary)] text-xs ml-2 bg-[var(--primary)]/10 px-1.5 py-0.5 rounded">管理员</span>{/if}</div>
              <button class="text-red-500 text-sm hover:underline" on:click={() => handleDeleteUser(u.id)}>删除</button>
            </div>
          {/each}
        </div>
      {/if}
    {/if}

    {#if tab === "categories"}
      <form on:submit|preventDefault={handleAddCategory} class="flex gap-2 mb-6">
        <input type="text" placeholder="分类名称" bind:value={newCatName} required class="flex-1 px-3 py-2 rounded-lg bg-black/[0.04] dark:bg-white/5 text-90 text-sm outline-none transition" />
        <button type="submit" class="bg-[var(--primary)] text-white dark:text-gray-900 rounded-lg px-4 py-2 text-sm">添加</button>
      </form>
      {#if catLoading}<div class="text-center py-8 text-50">加载中...</div>{:else}
        <div class="space-y-2">
          {#each categories as cat}
            <div class="p-3 rounded-lg"><span class="text-90 font-medium">{cat.name}</span>{#if cat.description}<span class="text-50 text-sm ml-2">{cat.description}</span>{/if}</div>
          {/each}
        </div>
      {/if}
    {/if}

    {#if tab === "settings"}
      {#if settingsLoading}
        <div class="text-center py-8 text-50">加载中...</div>
      {:else if Object.keys(settings).length === 0}
        <div class="text-center py-8 text-50">暂无设置</div>
      {:else}
        <div class="space-y-3 mb-6">
          {#each Object.entries(settings) as [key, value]}
            <div>
              <label class="block text-sm font-medium text-75 mb-1" for="set-{key}">{settingsLabels[key] || key}</label>
              {#if value === "true" || value === "false"}
                <select id="set-{key}" bind:value={settings[key]} class="w-full px-3 py-2 rounded-lg bg-black/[0.04] dark:bg-white/5 text-90 text-sm outline-none transition">
                  <option value="true">true</option>
                  <option value="false">false</option>
                </select>
              {:else if value.length > 80}
                <textarea id="set-{key}" bind:value={settings[key]} rows="3" class="w-full px-3 py-2 rounded-lg bg-black/[0.04] dark:bg-white/5 text-90 text-sm outline-none transition resize-y"></textarea>
              {:else}
                <input id="set-{key}" type="text" bind:value={settings[key]} class="w-full px-3 py-2 rounded-lg bg-black/[0.04] dark:bg-white/5 text-90 text-sm outline-none transition" />
              {/if}
            </div>
          {/each}
        </div>
        <div class="flex gap-2">
          <button on:click={handleSaveSettings} disabled={settingsSaving} class="bg-[var(--primary)] text-white dark:text-gray-900 rounded-lg px-4 py-2 text-sm hover:opacity-90 disabled:opacity-50">
            {settingsSaving ? "保存中..." : "保存设置"}</button>
          {#if settingsSaved}<span class="text-green-500 text-sm py-2">已保存</span>{/if}
        </div>
      {/if}
    {/if}
  {/if}
</div>
