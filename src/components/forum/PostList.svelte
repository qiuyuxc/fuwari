<script lang="ts">
  import { onMount } from "svelte";
  import { getPosts, getCategories, type ForumPost, type ForumCategory } from "@lib/forum-api";

  let posts: ForumPost[] = [];
  let categories: ForumCategory[] = [];
  let total = 0;
  let offset = 0;
  let selectedCategory: number | undefined = undefined;
  let loading = true;
  let error = "";
  const limit = 20;

  const fetchPosts = async () => {
    loading = true;
    error = "";
    try {
      const res = await getPosts(limit, offset, selectedCategory);
      posts = res.posts;
      total = res.total;
    } catch (e) {
      error = e instanceof Error ? e.message : "加载失败";
    } finally {
      loading = false;
    }
  };

  const fetchCategories = async () => {
    try {
      categories = await getCategories();
    } catch { /* categories are optional */ }
  };

  onMount(() => {
    fetchPosts();
    fetchCategories();
  });

  const goToPage = (newOffset: number) => {
    offset = newOffset;
    fetchPosts();
  };

  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  const formatDate = (d: string) => new Date(d).toLocaleDateString("zh-CN");
</script>

<div class="forum-post-list">
  {#if categories.length > 0}
    <div class="flex flex-wrap gap-2 mb-6">
      <button
        class="transition rounded-full px-4 py-1.5 text-sm {selectedCategory === undefined ? 'bg-[var(--primary)] text-white dark:text-gray-900' : 'bg-black/[0.04] dark:bg-white/5 text-75 hover:bg-black/[0.06] dark:hover:bg-white/10'}"
        on:click={() => { selectedCategory = undefined; offset = 0; fetchPosts(); }}
      >全部</button>
      {#each categories as cat}
        <button
          class="transition rounded-full px-4 py-1.5 text-sm {selectedCategory === cat.id ? 'bg-[var(--primary)] text-white dark:text-gray-900' : 'bg-black/[0.04] dark:bg-white/5 text-75 hover:bg-black/[0.06] dark:hover:bg-white/10'}"
          on:click={() => { selectedCategory = cat.id; offset = 0; fetchPosts(); }}
        >{cat.name}</button>
      {/each}
    </div>
  {/if}

  {#if loading}
    <div class="space-y-3">
      {#each Array(5) as _}
        <div class="card-base p-5 animate-pulse">
          <div class="h-5 bg-black/5 dark:bg-white/5 rounded w-3/4 mb-2"></div>
          <div class="h-3 bg-black/5 dark:bg-white/5 rounded w-1/4"></div>
        </div>
      {/each}
    </div>
  {:else if error}
    <div class="card-base p-8 text-center text-red-500">{error}</div>
  {:else if posts.length === 0}
    <div class="card-base p-8 text-center text-50">暂无帖子</div>
  {:else}
    <div class="space-y-3">
      {#each posts as post}
        <a href="/forum/post/?id={post.id}" data-no-swup class="card-base block p-5 transition hover:shadow-md">
          <h3 class="text-lg font-semibold text-90 mb-1">{post.title}</h3>
          <div class="flex items-center gap-3 text-sm text-50">
            <span>{post.user?.username || `用户#${post.user_id}`}</span>
            <span>{formatDate(post.created_at)}</span>
            {#if post.category}
              <span class="text-[var(--primary)]">{post.category.name}</span>
            {/if}
          </div>
        </a>
      {/each}
    </div>

    {#if totalPages > 1}
      <div class="flex justify-center items-center gap-2 mt-8">
        <button
          class="btn-plain rounded-lg px-3 py-1.5 text-sm"
          disabled={offset === 0}
          on:click={() => goToPage(Math.max(0, offset - limit))}
        >上一页</button>
        <span class="text-sm text-50">{currentPage} / {totalPages}</span>
        <button
          class="btn-plain rounded-lg px-3 py-1.5 text-sm"
          disabled={offset + limit >= total}
          on:click={() => goToPage(offset + limit)}
        >下一页</button>
      </div>
    {/if}
  {/if}
</div>
