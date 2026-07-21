const API_BASE = 'https://bbs.kukie.cn';

// ── Token & user cache (cookie-based, not localStorage) ──

const TOKEN_KEY = 'forum_token';
const USER_KEY = 'forum_user';

function getToken(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${TOKEN_KEY}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setToken(token: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${TOKEN_KEY}=${encodeURIComponent(token)}; path=/; SameSite=Lax; max-age=${60 * 60 * 24 * 30}`;
}

function clearToken(): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
}

function getCachedUser(): ForumUser | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${USER_KEY}=([^;]*)`));
  if (!match) return null;
  try { return JSON.parse(decodeURIComponent(match[1])); } catch { return null; }
}

function setCachedUser(user: ForumUser): void {
  if (typeof document === 'undefined') return;
  const val = encodeURIComponent(JSON.stringify(user));
  document.cookie = `${USER_KEY}=${val}; path=/; SameSite=Lax; max-age=${60 * 60 * 24 * 30}`;
}

function clearCachedUser(): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${USER_KEY}=; path=/; max-age=0`;
}

// ── HTTP ────────────────────────────────────────────────

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Timestamp': String(Math.floor(Date.now() / 1000)),
    'X-Nonce': crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
    ...(options.headers as Record<string, string> | undefined),
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: `HTTP ${res.status}` }));
    throw new Error(err.message || err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// ── Types ──────────────────────────────────────────────

export interface ForumUser {
  id: number;
  email: string;
  username: string;
  role?: string;
  avatar_url?: string;
  bio?: string;
  gender?: string;
  age?: number;
  region?: string;
  totp_enabled?: boolean;
  email_notifications?: boolean;
  article_notifications?: boolean;
  created_at: string;
}

export interface ForumPost {
  id: number;
  title: string;
  content: string;
  category_id: number;
  category?: ForumCategory;
  user_id: number;
  user?: ForumUser;
  created_at: string;
  updated_at: string;
}

export interface ForumCategory {
  id: number;
  name: string;
  description?: string;
}

export interface ForumComment {
  id: number;
  post_id: number;
  author_id: number;
  content: string;
  parent_id: number | null;
  is_pinned: number;
  created_at: string;
  updated_at: string;
  username: string;
  avatar_url?: string;
  role: string;
  like_count: number;
  liked: boolean;
}

export interface PostsResponse {
  posts: ForumPost[];
  total: number;
}

// ── API response normalization ──────────────────────────

function normalizePost(raw: any): ForumPost {
  return {
    id: raw.id,
    title: raw.title,
    content: raw.content,
    category_id: raw.category_id,
    category: raw.category_name ? { id: raw.category_id, name: raw.category_name } : undefined,
    user_id: raw.author_id ?? raw.user_id,
    user: raw.author_name ? {
      id: raw.author_id ?? raw.user_id,
      username: raw.author_name,
      avatar_url: raw.author_avatar,
      role: raw.author_role,
      email: '',
      created_at: '',
    } : raw.user,
    created_at: raw.created_at,
    updated_at: raw.updated_at ?? raw.created_at,
  };
}

// ── Auth helpers ───────────────────────────────────────

export function isLoggedIn(): boolean {
  return !!getToken();
}

export function getCurrentUser(): ForumUser | null {
  return getCachedUser();
}

export function logout(): void {
  clearToken();
  clearCachedUser();
}

export function isAdmin(user?: ForumUser | null): boolean {
  return (user || getCachedUser())?.role === 'admin';
}

// ── Auth endpoints ─────────────────────────────────────

export async function login(email: string, password: string, totp_code?: string) {
  const body: Record<string, string> = { email, password };
  if (totp_code) body.totp_code = totp_code;
  const res = await request<{ token: string; user: ForumUser }>('/api/login', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  setToken(res.token);
  setCachedUser(res.user);
  return res;
}

export async function register(email: string, password: string, username: string) {
  const res = await request<{ token: string; user: ForumUser }>('/api/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, username }),
  });
  // Auto-login after register: save token + user
  if (res.token) {
    setToken(res.token);
    setCachedUser(res.user);
  }
  return res;
}

export async function getSession() {
  try {
    const res = await request<{ valid: boolean; user: { id: number; email: string; role: string } }>('/api/session');
    return { user: { id: res.user.id, email: res.user.email, role: res.user.role } as ForumUser };
  } catch {
    // Fallback to cached user
    const cached = getCachedUser();
    if (cached) return { user: cached };
    throw new Error('未登录');
  }
}

export function forgotPassword(email: string) {
  return request<{ message: string }>('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export function resetPassword(token: string, new_password: string) {
  return request<{ message: string }>('/api/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, new_password }),
  });
}

// ── User ───────────────────────────────────────────────

export async function getUserMe() {
  const user = await request<ForumUser>('/api/user/me');
  if (user && user.id) setCachedUser(user);
  return { user };
}

export function getUserPosts(limit = 20, offset = 0, sort_by = 'created_at', sort_dir = 'desc') {
  return request<PostsResponse>(
    `/api/user/me/posts?limit=${limit}&offset=${offset}&sort_by=${sort_by}&sort_dir=${sort_dir}`
  ).then(res => ({
    posts: res.posts.map(normalizePost),
    total: res.total,
  }));
}

export async function updateProfile(data: { username?: string; avatar_url?: string; email_notifications?: boolean; article_notifications?: boolean }) {
  const res = await request<{ success: boolean; user: ForumUser }>('/api/user/profile', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (res.user) setCachedUser(res.user);
  return res;
}

export async function updateProfileExt(data: { gender?: string; bio?: string; age?: number; region?: string }) {
  const res = await request<{ success: boolean; user: ForumUser }>('/api/user/me/profile', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (res.user) setCachedUser(res.user);
  return res;
}

export function getUserAvatar(id: number) {
  return `${API_BASE}/api/user/avatar?id=${id}`;
}

export function changeEmail(new_email: string) {
  return request<{ message: string }>('/api/user/change-email', {
    method: 'POST',
    body: JSON.stringify({ new_email }),
  });
}

export function changePassword(old_password: string, new_password: string) {
  return request<{ success: boolean }>('/api/user/change-password', {
    method: 'POST',
    body: JSON.stringify({ old_password, new_password }),
  });
}

// ── TOTP ────────────────────────────────────────────────

export function setupTOTP() {
  return request<{ secret: string; uri: string }>('/api/user/totp/setup', { method: 'POST' });
}

export function verifyTOTP(token: string) {
  return request<{ success: boolean }>('/api/user/totp/verify', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
}

export function disableTOTP(password: string, totp_code: string) {
  return request<{ success: boolean }>('/api/user/totp/disable', {
    method: 'POST',
    body: JSON.stringify({ password, totp_code }),
  });
}

export function getTOTPStatus() {
  return request<{ enabled: boolean }>('/api/user/totp/status');
}

export function deleteAccount() {
  return request<{ message: string }>('/api/user/delete', { method: 'POST' });
}

export function getLikedPosts() {
  return request<ForumPost[]>('/api/user/likes');
}

// ── Posts ──────────────────────────────────────────────

export function getPosts(limit = 20, offset = 0, category?: number, sort_by = 'created_at', sort_dir = 'desc') {
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset), sort_by, sort_dir });
  if (category) params.set('category_id', String(category));
  return request<PostsResponse>(`/api/posts?${params}`).then(res => ({
    posts: res.posts.map(normalizePost),
    total: res.total,
  }));
}

export function createPost(title: string, content: string, category_id: number) {
  return request<{ success: boolean; id: number }>('/api/posts', {
    method: 'POST',
    body: JSON.stringify({ title, content, category_id }),
  });
}

export function updatePost(id: number, data: { title?: string; content?: string; category_id?: number }) {
  return request<{ success: boolean }>(`/api/posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function getNewPostCount() {
  return request<{ count: number }>('/api/posts/new-count');
}

export function getCategories() {
  return request<ForumCategory[]>('/api/categories');
}

export async function getPostById(id: number): Promise<ForumPost> {
  try {
    const raw = await request<any>(`/api/posts/${id}`);
    return normalizePost(raw);
  } catch {
    const data = await getPosts(100, 0);
    const post = data.posts.find(p => p.id === id);
    if (!post) throw new Error('帖子不存在');
    return post;
  }
}

// ── Upload ─────────────────────────────────────────────

export function uploadImage(file: File) {
  const form = new FormData();
  form.append('file', file);
  const token = getToken();
  const headers: Record<string, string> = {
    'X-Timestamp': String(Math.floor(Date.now() / 1000)),
    'X-Nonce': crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return fetch(`${API_BASE}/api/upload`, { method: 'POST', body: form, headers })
    .then(r => r.json()) as Promise<{ url: string }>;
}

// ── Admin ───────────────────────────────────────────────

export function getAdminStats() {
  return request<{ total_users?: number; total_posts?: number; total_comments?: number }>('/api/admin/stats');
}

export function getAdminSettings() {
  return request<Record<string, unknown>>('/api/admin/settings');
}

export function updateAdminSettings(data: Record<string, unknown>) {
  return request<{ message: string }>('/api/admin/settings', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getAdminUsers(q?: string, limit = 50, offset = 0) {
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
  if (q) params.set('q', q);
  const data = await request<ForumUser[]>(`/api/admin/users?${params}`);
  // Backend returns plain array, not { users, total }
  return { users: Array.isArray(data) ? data : (data as any).users || [], total: Array.isArray(data) ? data.length : (data as any).total || 0 };
}

export function deleteAdminUser(id: number) {
  return request<{ message: string }>(`/api/admin/users/${id}`, { method: 'DELETE' });
}

export function deleteAdminPost(id: number) {
  return request<{ message: string }>(`/api/admin/posts/${id}`, { method: 'DELETE' });
}

export function deleteAdminComment(id: number) {
  return request<{ message: string }>(`/api/admin/comments/${id}`, { method: 'DELETE' });
}

export function createCategory(name: string, description?: string) {
  return request<ForumCategory>('/api/admin/categories', {
    method: 'POST',
    body: JSON.stringify({ name, description }),
  });
}

export function testEmail() {
  return request<{ message: string }>('/api/admin/email/test', { method: 'POST' });
}

export function getUsers() {
  return request<ForumUser[]>('/api/users');
}

// ── Comments ─────────────────────────────────────────────

export function getComments(postId: number, sort_by = 'likes', sort_dir = 'desc') {
  return request<ForumComment[]>(`/api/posts/${postId}/comments?sort_by=${sort_by}&sort_dir=${sort_dir}`);
}

export function createComment(postId: number, content: string, parent_id?: number) {
  return request<ForumComment>(`/api/posts/${postId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ content, parent_id }),
  });
}

export function deleteComment(id: number) {
  return request<{ message: string }>(`/api/comments/${id}`, { method: 'DELETE' });
}

export function likeComment(id: number) {
  return request<{ liked: boolean }>(`/api/comments/${id}/like`, { method: 'POST' });
}
