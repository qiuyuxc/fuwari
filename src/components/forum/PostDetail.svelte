<script lang="ts">
  import { onMount } from "svelte";
  import { getPostById, updatePost, getCurrentUser, type ForumPost, type ForumUser } from "@lib/forum-api";
  import CommentSection from "./CommentSection.svelte";
  import MarkdownIt from "markdown-it";

  const md = new MarkdownIt({ html: true, linkify: true, breaks: true });

  let post: ForumPost | null = null;
  let loading = true;
  let error = "";
  let editing = false;
  let editTitle = "";
  let editContent = "";
  let saving = false;
  let saveError = "";

  const currentUser: ForumUser | null = getCurrentUser();
  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const postId = searchParams ? Number(searchParams.get("id")) : 0;
  $: isAuthor = currentUser && post && currentUser.id === post.user_id;

  onMount(async () => {
    if (!postId) { error = "缺少帖子 ID"; loading = false; return; }
    try { post = await getPostById(postId); }
    catch (e) { error = e instanceof Error ? e.message : "加载失败"; }
    loading = false;
  });

  const startEdit = () => {
    if (!post) return;
    editing = true;
    editTitle = post.title;
    editContent = post.content;
    saveError = "";
  };

  const cancelEdit = () => { editing = false; };

  const handleSave = async () => {
    if (!editTitle.trim() || !editContent.trim()) {
      saveError = "标题和内容不能为空";
      return;
    }
    saving = true;
    saveError = "";
    try {
      await updatePost(postId, {
        title: editTitle.trim(),
        content: editContent.trim(),
      });
      post = await getPostById(postId);
      editing = false;
    } catch (e) {
      saveError = e instanceof Error ? e.message : "保存失败";
    }
    saving = false;
  };

  const formatDateTime = (d: string) =>
    new Date(d).toLocaleString("zh-CN", { dateStyle: "full", timeStyle: "short" });
</script>

<div class="forum-post-detail">
  {#if loading}
    <div class="animate-pulse">
      <div class="h-8 bg-black/5 dark:bg-white/5 rounded w-2/3 mb-4"></div>
      <div class="h-4 bg-black/5 dark:bg-white/5 rounded w-1/3 mb-6"></div>
      <div class="space-y-2">
        <div class="h-3 bg-black/5 dark:bg-white/5 rounded w-full"></div>
        <div class="h-3 bg-black/5 dark:bg-white/5 rounded w-full"></div>
        <div class="h-3 bg-black/5 dark:bg-white/5 rounded w-4/5"></div>
      </div>
    </div>
  {:else if error}
    <div class="text-center py-8 text-red-500">{error}</div>
  {:else if post}
    <article>
      {#if !editing}
        <div class="flex items-start justify-between mb-3">
          <h1 class="text-2xl font-bold text-90">{post.title}</h1>
          {#if currentUser && currentUser.id === post.user_id}
            <button class="btn-plain rounded-lg px-3 py-1.5 text-sm shrink-0 ml-4" on:click={startEdit}>编辑</button>
          {/if}
        </div>
        <div class="flex flex-wrap items-center gap-3 text-sm text-50 mb-6 pb-6 border-b border-black/5 dark:border-white/10">
          <span>{post.user?.username || `用户#${post.user_id}`}</span>
          <span>{formatDateTime(post.created_at)}</span>
          {#if post.category}
            <span class="text-[var(--primary)]">{post.category.name}</span>
          {/if}
        </div>
        <div class="prose dark:prose-invert max-w-none text-75">
          {#if post.content}
            {@html md.render(post.content || "")}
          {:else}
            <p class="text-50">（内容为空）</p>
          {/if}
        </div>
      {:else}
        {#if saveError}
          <div class="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">{saveError}</div>
        {/if}
        <form on:submit|preventDefault={handleSave} class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-75 mb-1" for="edit-title">标题</label>
            <input id="edit-title" type="text" bind:value={editTitle} required
              class="w-full px-3 py-2 rounded-lg bg-black/[0.04] dark:bg-white/5 focus:bg-black/[0.06] dark:focus:bg-white/10 text-90 text-sm outline-none transition" />
          </div>
          <div>
            <label class="block text-sm font-medium text-75 mb-1" for="edit-content">内容</label>
            <textarea id="edit-content" bind:value={editContent} required rows="12"
              class="w-full px-3 py-2 rounded-lg bg-black/[0.04] dark:bg-white/5 focus:bg-black/[0.06] dark:focus:bg-white/10 text-90 text-sm outline-none transition resize-y"></textarea>
          </div>
          <div class="flex gap-2">
            <button type="submit" disabled={saving} class="bg-[var(--primary)] text-white dark:text-gray-900 rounded-lg px-4 py-2 text-sm hover:opacity-90 disabled:opacity-50">{saving ? "保存中..." : "保存修改"}</button>
            <button type="button" class="btn-plain rounded-lg px-4 py-2 text-sm" on:click={cancelEdit}>取消</button>
          </div>
        </form>
      {/if}
    </article>
  {:else}
    <div class="text-center py-8 text-50">帖子不存在</div>
  {/if}

  <div class="mt-4">
    <a href="/forum/" data-no-swup class="btn-plain inline-flex items-center gap-1 rounded-lg px-4 py-2 text-sm">&larr; 返回列表</a>
  </div>

  <CommentSection {postId} />
</div>
