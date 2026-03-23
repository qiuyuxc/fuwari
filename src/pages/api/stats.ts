// src/pages/api/stats.ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  const { searchParams } = new URL(request.url);
  const WEBSITE_ID = "010a1dd3-7465-4fa7-b73b-09b6ad6efe85";
  const API_KEY = "api_IvUWwgGZfNh0ROGxrYWVR3q92LF9JZ1M";

  const targetUrl = new URL(`https://api.umami.is/v1/websites/${WEBSITE_ID}/stats`);
  
  // 转发所有前端参数
  searchParams.forEach((value, key) => targetUrl.searchParams.set(key, value));

  try {
    const response = await fetch(targetUrl.toString(), {
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    });
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(null, { status: 500 });
  }
};
