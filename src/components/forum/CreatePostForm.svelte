<script lang="ts">
  import { onMount } from "svelte";
  import { getCategories, createPost, type ForumCategory } from "@lib/forum-api";

  let title = "";
  let content = "";
  let categoryId = 0;
  let categories: ForumCategory[] = [];
  let error = "";
  let loading = false;
  let success = false;

  onMount(async () => {
    try {
      categories = await getCategories();
      if (categories.length > 0) categoryId = categories[0].id;
    } catch { /* handled later */ }
  });

  const handleSubmit = async () => {
    error = "";
    if (!title.trim() || !content.trim()) {
      error = "标题和内容不能为空";
      return;
    }
    if (!categoryId) {
      error = "请选择分类";
      return;
    }
    loading = true;
    try {
      await createPost(title.trim(), content.trim(), categoryId);
      success = true;
      setTimeout(() => { window.location.href = "/forum/"; }, 1500);
    } catch (e) {
      error = e instanceof Error ? e.message : "发布失败";
    } finally {
      loading = false;
    }
  };
</script>

<div class="max-w-2xl mx-auto">
  <div class="card-base p-6 md:p-8">
    <h2 class="text-xl font-bold text-90 mb-6">发布帖子</h2>

    {#if success}
      <div class="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm text-center">
        发布成功，正在跳转...
      </div>
    {:else}
      {#if error}
        <div class="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">{error}</div>
      {/if}

      <form on:submit|preventDefault={handleSubmit} class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-75 mb-1" for="category">分类</label>
          <select
            id="category" bind:value={categoryId}
            class="w-full px-3 py-2 rounded-lg bg-black/[0.04] dark:bg-white/5 focus:bg-black/[0.06] dark:focus:bg-white/10 text-90 text-sm outline-none transition"
          >
            <option value={0} disabled>选择分类</option>
            {#each categories as cat}
              <option value={cat.id}>{cat.name}</option>
            {/each}
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-75 mb-1" for="title">标题</label>
          <input
            id="title" type="text" bind:value={title} required
            class="w-full px-3 py-2 rounded-lg bg-black/[0.04] dark:bg-white/5 focus:bg-black/[0.06] dark:focus:bg-white/10 text-90 text-sm outline-none transition"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-75 mb-1" for="content">内容</label>
          <textarea
            id="content" bind:value={content} required rows="12"
            class="w-full px-3 py-2 rounded-lg bg-black/[0.04] dark:bg-white/5 focus:bg-black/[0.06] dark:focus:bg-white/10 text-90 text-sm outline-none transition resize-y"
          ></textarea>
        </div>

        <button
          type="submit" disabled={loading}
          class="w-full py-2.5 rounded-lg bg-[var(--primary)] text-white dark:text-gray-900 font-medium text-sm transition hover:opacity-90 disabled:opacity-50"
        >{loading ? "发布中..." : "发布"}</button>
      </form>
    {/if}
  </div>
</div>
