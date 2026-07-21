<script lang="ts">
  import { onMount } from "svelte";
  import {
    getComments, createComment, deleteComment, likeComment,
    getCurrentUser, isLoggedIn, type ForumComment, type ForumUser,
  } from "@lib/forum-api";

  export let postId: number;

  let comments: ForumComment[] = [];
  let loading = true;
  let error = "";

  let newContent = "";
  let replyingTo: { id: number; username: string } | null = null;
  let submitting = false;
  let submitError = "";

  const currentUser: ForumUser | null = getCurrentUser();

  const fetchComments = async () => {
    loading = true;
    error = "";
    try {
      comments = await getComments(postId);
    } catch (e) {
      error = e instanceof Error ? e.message : "加载评论失败";
    } finally {
      loading = false;
    }
  };

  onMount(fetchComments);

  // Build comment tree: top-level comments, each with replies
  $: topComments = comments.filter(c => !c.parent_id);
  $: replies = (parentId: number) => comments.filter(c => c.parent_id === parentId);

  const handleSubmit = async () => {
    if (!newContent.trim()) return;
    submitting = true;
    submitError = "";
    try {
      await createComment(postId, newContent.trim(), replyingTo?.id);
      newContent = "";
      replyingTo = null;
      await fetchComments();
    } catch (e) {
      submitError = e instanceof Error ? e.message : "发送失败";
    } finally {
      submitting = false;
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("确定删除此评论？")) return;
    try {
      await deleteComment(id);
      comments = comments.filter(c => c.id !== id);
    } catch (e) {
      alert(e instanceof Error ? e.message : "删除失败");
    }
  };

  const handleLike = async (id: number) => {
    try {
      const res = await likeComment(id);
      comments = comments.map(c => c.id === id ? { ...c, liked: res.liked, like_count: c.like_count + (res.liked ? 1 : -1) } : c);
    } catch (e) {
      // ignore
    }
  };

  const handleReply = (comment: ForumComment) => {
    replyingTo = { id: comment.id, username: comment.username };
    newContent = "";
  };

  const formatDate = (d: string) => new Date(d).toLocaleString("zh-CN", { dateStyle: "medium", timeStyle: "short" });

  const getReplyHandler = (comment: ForumComment) => () => handleReply(comment);
  const getLikeHandler = (commentId: number) => () => handleLike(commentId);
  const getDeleteHandler = (commentId: number) => () => handleDelete(commentId);
</script>

<div class="mt-8 pt-6 border-t border-black/5 dark:border-white/10">
  <h3 class="text-lg font-bold text-90 mb-4">评论 ({comments.length})</h3>

  {#if isLoggedIn()}
    <div class="mb-6">
      {#if replyingTo}
        <div class="text-sm text-50 mb-1">
          回复 <span class="font-medium text-75">@{replyingTo.username}</span>
          <button class="ml-2 text-[var(--primary)]" on:click={() => replyingTo = null}>取消</button>
        </div>
      {/if}
      {#if submitError}
        <div class="mb-2 p-2 rounded text-sm text-red-500 bg-red-50 dark:bg-red-900/20">{submitError}</div>
      {/if}
      <form on:submit|preventDefault={handleSubmit} class="flex gap-2">
        <textarea
          bind:value={newContent}
          placeholder="写下你的评论..."
          rows="3"
          maxlength="3000"
          class="flex-1 px-3 py-2 rounded-lg bg-black/[0.04] dark:bg-white/5 focus:bg-black/[0.06] dark:focus:bg-white/10 text-90 text-sm outline-none transition resize-y"
        ></textarea>
        <button
          type="submit"
          disabled={submitting || !newContent.trim()}
          class="bg-[var(--primary)] text-white dark:text-gray-900 rounded-lg px-4 py-2 text-sm self-end hover:opacity-90 disabled:opacity-50 shrink-0"
        >{submitting ? "发送中..." : "发送"}</button>
      </form>
    </div>
  {:else}
    <div class="mb-6 text-sm text-50">
      <a href="/forum/login/" data-no-swup class="text-[var(--primary)] hover:underline">登录</a>后参与评论
    </div>
  {/if}

  {#if loading}
    <div class="space-y-3">
      {#each Array(3) as _}
        <div class="animate-pulse p-3">
          <div class="h-4 bg-black/5 dark:bg-white/5 rounded w-1/4 mb-2"></div>
          <div class="h-3 bg-black/5 dark:bg-white/5 rounded w-3/4"></div>
        </div>
      {/each}
    </div>
  {:else if error}
    <div class="text-center py-4 text-red-500 text-sm">{error}</div>
  {:else if comments.length === 0}
    <div class="text-center py-4 text-50 text-sm">暂无评论，来说两句吧</div>
  {:else}
    <div class="space-y-1">
      {#each topComments as comment (comment.id)}
        <div class="p-3 rounded-lg hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
          <div class="flex items-center gap-2 mb-1">
            {#if comment.avatar_url}
              <img src={comment.avatar_url} alt="" class="w-5 h-5 rounded-full object-cover" />
            {:else}
              <span class="w-5 h-5 rounded-full bg-[var(--primary)]/20 text-[var(--primary)] flex items-center justify-center text-xs font-bold">{(comment.username || "?").charAt(0).toUpperCase()}</span>
            {/if}
            <span class="text-sm font-medium text-90">{comment.username}</span>
            {#if comment.role === "admin"}
              <span class="text-[var(--primary)] text-xs bg-[var(--primary)]/10 px-1 rounded">管理</span>
            {/if}
            <span class="text-xs text-50">{formatDate(comment.created_at)}</span>
          </div>
          <div class="text-sm text-75 ml-7">
            {@html comment.content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/\n/g, "<br>")}
          </div>
          <div class="flex items-center gap-3 ml-7 mt-1">
            <button
              class="text-xs {comment.liked ? 'text-[var(--primary)]' : 'text-50'} hover:text-[var(--primary)] transition"
              on:click={getLikeHandler(comment.id)}
            >
              {comment.liked ? '❤' : '♡'} {comment.like_count || ''}
            </button>
            {#if isLoggedIn()}
              <button class="text-xs text-50 hover:text-75 transition" on:click={getReplyHandler(comment)}>
                回复
              </button>
            {/if}
            {#if currentUser && currentUser.id === comment.author_id}
              <button class="text-xs text-red-500 hover:underline" on:click={getDeleteHandler(comment.id)}>删除</button>
            {/if}
          </div>

          {#each replies(comment.id) as reply (reply.id)}
            <div class="ml-7 mt-1 p-3 rounded-lg bg-black/[0.02] dark:bg-white/[0.02]">
              <div class="flex items-center gap-2 mb-1">
                {#if reply.avatar_url}
                  <img src={reply.avatar_url} alt="" class="w-4 h-4 rounded-full object-cover" />
                {:else}
                  <span class="w-4 h-4 rounded-full bg-[var(--primary)]/20 text-[var(--primary)] flex items-center justify-center text-xs font-bold">{(reply.username || "?").charAt(0).toUpperCase()}</span>
                {/if}
                <span class="text-sm font-medium text-90">{reply.username}</span>
                {#if reply.role === "admin"}
                  <span class="text-[var(--primary)] text-xs bg-[var(--primary)]/10 px-1 rounded">管理</span>
                {/if}
                <span class="text-xs text-50">{formatDate(reply.created_at)}</span>
              </div>
              <div class="text-sm text-75 ml-6">
                {@html reply.content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/\n/g, "<br>")}
              </div>
              <div class="flex items-center gap-3 ml-6 mt-1">
                <button
                  class="text-xs {reply.liked ? 'text-[var(--primary)]' : 'text-50'} hover:text-[var(--primary)] transition"
                  on:click={getLikeHandler(reply.id)}
                >
                  {reply.liked ? '❤' : '♡'} {reply.like_count || ''}
                </button>
                {#if currentUser && currentUser.id === reply.author_id}
                  <button class="text-xs text-red-500 hover:underline" on:click={getDeleteHandler(reply.id)}>删除</button>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      {/each}
    </div>
  {/if}
</div>
