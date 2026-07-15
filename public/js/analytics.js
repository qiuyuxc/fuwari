(function (global) {
  'use strict';

  /* ========== 配置 ========== */
  const UMAMI_BASE = 'https://um1.kukie.cn';
  const SHARE_ID = 't0FOdLxzFONWoagY';
  let currentDays = 1;

  /* ========== 工具函数 ========== */
  function calcDateRange(days) {
    const now = Date.now();
    if (!days || days === 'all') return { startAt: 0, endAt: now };
    return { startAt: now - days * 86400000, endAt: now };
  }

  function fmt(n) {
    if (n === 0 || n === '0') return '0';
    return new Intl.NumberFormat('zh-CN').format(n);
  }

  function fmtTime(s) {
    if (!s || s === 0) return '0秒';
    if (s < 60) return Math.round(s) + '秒';
    if (s < 3600) return Math.round(s / 60) + '分钟';
    return Math.round(s / 3600) + '小时';
  }

  /* ========== API 请求 ========== */
  async function fetchUmami(path) {
    if (!global.__umamiDataCache) global.__umamiDataCache = new Map();
    const key = 'analytics:' + path;
    if (global.__umamiDataCache.has(key)) return global.__umamiDataCache.get(key);
    const { websiteId, token } = await global.getUmamiShareData(UMAMI_BASE, SHARE_ID);
    const r = await fetch(UMAMI_BASE + '/api/websites/' + websiteId + path, {
      headers: { 'x-umami-share-token': token, 'x-umami-share-context': 'share' },
    });
    if (!r.ok) throw new Error('Umami ' + r.status);
    const data = await r.json();
    global.__umamiDataCache.set(key, data);
    return data;
  }

  /* ========== 渲染 ========== */
  function renderPages(data) {
    const container = document.getElementById('top-pages');
    if (!container) return;
    if (!data || !data.length) {
      container.innerHTML = '<div class="metric-empty">暂无数据</div>';
      return;
    }
    const total = data.reduce(function (s, m) { return s + m.y; }, 0);
    var html = '<div class="text-xs text-gray-400 dark:text-gray-500 mb-3">总浏览量排名，共 ' + fmt(total) + ' 次</div><div class="flex flex-col gap-2.5">';
    data.forEach(function (m) {
      var pct = (m.y / total * 100).toFixed(1);
      var label = (m.x || '/').replace(/^\//, '') || '/';
      html += '<div class="flex items-center gap-3"><span class="text-sm text-[#171717] dark:text-white truncate flex-1 min-w-0">' + label + '</span><div class="w-24 h-1.5 rounded-sm bg-black/6 dark:bg-white/10 overflow-hidden flex-shrink-0"><div class="h-full rounded-sm" style="width:' + pct + '%;background:linear-gradient(90deg,color-mix(in srgb,var(--primary) 50%,transparent),color-mix(in srgb,var(--primary) 30%,transparent))"></div></div><span class="text-sm font-medium text-[#171717] dark:text-white w-12 text-right">' + fmt(m.y) + '</span><span class="text-xs text-gray-400 dark:text-gray-500 w-11 text-right">' + pct + '%</span></div>';
    });
    html += '</div>';
    container.innerHTML = html;
  }

  /* ========== 统计加载 ========== */
  async function loadStats() {
    var dateRange = calcDateRange(currentDays);
    try {
      var results = await Promise.all([
        fetchUmami('/stats?startAt=' + dateRange.startAt + '&endAt=' + dateRange.endAt),
        fetchUmami('/metrics?startAt=' + dateRange.startAt + '&endAt=' + dateRange.endAt + '&type=path&limit=10'),
      ]);
      var stats = results[0], pages = results[1];

      var elPV = document.getElementById('val-pageviews');
      if (elPV) elPV.textContent = fmt(stats.pageviews);
      var elUV = document.getElementById('val-visitors');
      if (elUV) elUV.textContent = fmt(stats.visitors);
      var elVisits = document.getElementById('val-visits');
      if (elVisits) elVisits.textContent = fmt(stats.visits);
      var elBounce = document.getElementById('val-bounce-rate');
      if (elBounce) elBounce.textContent = stats.pageviews > 0 ? Math.round(stats.bounces / stats.visits * 100) + '%' : '0%';
      var elAvg = document.getElementById('val-avg-time');
      if (elAvg) elAvg.textContent = stats.visits > 0 ? fmtTime(stats.totaltime / stats.visits) : '0秒';

      renderPages(pages);
    } catch (e) {
      document.querySelectorAll('.stat-value').forEach(function (el) { el.textContent = 'Error'; });
      document.querySelectorAll('.chart-empty, .metric-empty').forEach(function (el) { el.textContent = '加载失败'; });
    }
  }

  /* ========== 时间选择器 ========== */
  function closeDropdown() {
    var dd = document.getElementById('time-dropdown');
    if (!dd) return;
    dd.style.position = '';
    dd.style.top = '';
    dd.style.left = '';
    dd.style.zIndex = '';
    dd.classList.add('hidden');
    var wrap = document.getElementById('time-wrap');
    if (wrap && dd.parentElement !== wrap) wrap.appendChild(dd);
  }

  function toggleDropdown() {
    var dd = document.getElementById('time-dropdown');
    if (!dd) return;
    if (!dd.classList.contains('hidden')) { closeDropdown(); return; }
    var btn = document.getElementById('time-btn');
    if (!btn) return;
    var r = btn.getBoundingClientRect();
    document.body.appendChild(dd);
    dd.style.position = 'fixed';
    dd.style.top = (r.bottom + 4) + 'px';
    dd.style.zIndex = '9999';
    dd.classList.remove('hidden');
    var left = Math.max(8, r.right - dd.offsetWidth);
    dd.style.left = left + 'px';
  }

  function initTimePicker() {
    var btn = document.getElementById('time-btn');
    if (!btn) return;
    if (btn.dataset.initialized) return;
    btn.dataset.initialized = 'true';
    btn.addEventListener('click', function (e) { e.stopPropagation(); toggleDropdown(); });
    document.querySelectorAll('.time-opt').forEach(function (b) {
      b.addEventListener('click', function () {
        var d = b.dataset.days;
        switchTime(d === '全部' ? 'all' : d === '24小时' ? 1 : parseInt(d));
      });
    });
    document.addEventListener('click', closeDropdown);
  }

  function switchTime(days) {
    currentDays = days;
    var label = days === 'all' ? '全部时间' : days === 1 ? '近 24 小时' : '近 ' + days + ' 天';
    var period = document.getElementById('stats-period');
    if (period) period.textContent = label;
    var btn = document.getElementById('time-btn');
    if (btn) btn.innerHTML = label + ' <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>';
    closeDropdown();
    loadStats();
  }

  /* ========== 对外暴露 ========== */
  global.__analyticsInit = function () {
    initTimePicker();
    loadStats();
  };

  /* ========== 初始化触发 ========== */

  function tryRun() {
    var path = location.pathname.replace(/\/+$/, '');
    if (path === '/analytics') {
      global.__analyticsInit();
    }
  }

  /* 先立即尝试一次（可能已经是 analytics 页面） */
  tryRun();

  /* 监听 astro:page-load（所有 Swup 导航后触发） */
  document.addEventListener('astro:page-load', function () {
    tryRun();
  });

  /* 也监听 popstate 以防浏览器前进后退 */
  global.addEventListener('popstate', function () {
    setTimeout(tryRun, 50);
  });
})(window);
