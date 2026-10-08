/* ============================================================
   Tech Stack Map · 学习台  —— 交互脚本
   三块功能各自独立，可以单独看懂：
     1) 进度打卡：读 → 还原 → 监听 → 算百分比 → 存
     2) 点积实验室：读输入 → 算数 → 画图
     3) 复习卡：点击展开 / 收起
   ============================================================ */

/* ------------------------------------------------------------
   1) 进度打卡
   ------------------------------------------------------------ */

// 存储用的钥匙名。改版本号（v1 → v2）可以"作废"旧的存档。
const STORE_KEY = 'tsm-checks-v1';

// 用户系统里若开启了"减少动态效果"，就跳过所有动画，只改数值。
const REDUCE_MOTION = window.matchMedia
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
  : false;

// 给元素重放一次"一次性"动画：先摘掉类 → 强制重排 → 再挂上。
// 不强制重排的话，浏览器认为类没变过，动画不会重播。
function replay(el, cls) {
  if (!el) return;
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
}

// 让数字从当前显示值滚动到目标值，而不是"啪"地跳过去。
function animateNumber(el, to) {
  if (REDUCE_MOTION) { el.textContent = to + '%'; return; }
  if (el._raf) cancelAnimationFrame(el._raf);        // 上一次还没滚完就先取消
  const from = parseInt(el.textContent, 10) || 0;
  if (from === to) { el.textContent = to + '%'; return; }

  const start = performance.now();
  const DURATION = 420;
  function frame(now) {
    const k = Math.min(1, (now - start) / DURATION);
    const eased = 1 - Math.pow(1 - k, 3);            // ease-out：先快后慢
    el.textContent = Math.round(from + (to - from) * eased) + '%';
    el._raf = k < 1 ? requestAnimationFrame(frame) : null;
  }
  el._raf = requestAnimationFrame(frame);
}

// 从 localStorage 读回上次的勾选状态。读不到就当空对象。
// try/catch 是因为：某些浏览器在 file:// 下会禁用 localStorage。
function loadChecks() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY)) || {};
  } catch (e) {
    return {};
  }
}

function saveChecks(state) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch (e) {
    /* 存不了就算了，页面依然能用，只是刷新后不记得 */
  }
}

// 把勾选状态写回 localStorage：以 data-id 为键
function persistFromInputs() {
  const state = {};
  document.querySelectorAll('.checks input[type="checkbox"]').forEach(function (box) {
    state[box.dataset.id] = box.checked;
  });
  saveChecks(state);
}

// 重算：每个阶段一张卡片的百分比 + 顶部"总进度"
function renderProgress() {
  let totalAll = 0;
  let doneAll = 0;

  document.querySelectorAll('.stage').forEach(function (stage) {
    const boxes = stage.querySelectorAll('input[type="checkbox"]');
    let done = 0;
    boxes.forEach(function (box) { if (box.checked) done += 1; });

    const pct = boxes.length ? Math.round((done / boxes.length) * 100) : 0;

    // 阶段卡片自己的百分比文字 + 进度条宽度
    stage.querySelector('.stage__pct').textContent = pct + '%';
    stage.querySelector('.bar > span').style.width = pct + '%';

    // 整张阶段的条目全部勾完 → 卡片切成"完成"样式（红边 + ✓）
    stage.classList.toggle('is-complete', pct === 100);

    totalAll += boxes.length;
    doneAll += done;
  });

  // 顶部总进度：条形图宽度直接改（CSS 有 transition），数字滚动过去
  const overallPct = totalAll ? Math.round((doneAll / totalAll) * 100) : 0;
  document.getElementById('overall-fill').style.width = overallPct + '%';
  animateNumber(document.getElementById('overall-pct'), overallPct);
}

// 初始化：先还原状态，再挂监听
function initProgress() {
  const saved = loadChecks();

  document.querySelectorAll('.checks input[type="checkbox"]').forEach(function (box) {
    // 存档里有这个 id 就按存档来；没有就保留 HTML 里写死的 checked
    if (Object.prototype.hasOwnProperty.call(saved, box.dataset.id)) {
      box.checked = saved[box.dataset.id];
    }
    box.addEventListener('change', function () {
      replay(box.closest('.stage'), 'is-bumped');   // 卡片弹一下
      renderProgress();
      persistFromInputs();
    });
  });

  renderProgress();
}

/* ------------------------------------------------------------
   2) 点积实验室
   画布坐标：viewBox 260×260，原点在正中 (130,130)，
   单位长度 unit 会根据数字大小自动缩放，保证箭头不出框。
   ------------------------------------------------------------ */

const OX = 130;   // 原点 x（屏幕坐标）
const OY = 130;   // 原点 y（屏幕坐标）
const HALF = 110; // 离原点的最大像素距离

// 数学坐标 (x, y) → 屏幕坐标 [px, py]。注意 y 要翻转（屏幕 y 向下增长）
function toScreen(x, y, unit) {
  return [OX + x * unit, OY - y * unit];
}

function drawVectors(ax, ay, bx, by) {
  const maxAbs = Math.max(Math.abs(ax), Math.abs(ay), Math.abs(bx), Math.abs(by), 1);
  const span = Math.max(2, Math.ceil(maxAbs));   // 网格范围：-span .. +span
  const unit = HALF / span;                      // 每单位占多少像素

  // --- 网格 ---
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  for (let i = 1; i <= span; i++) {
    const off = i * unit;
    // 竖线（上下两条对称）
    [OX + off, OX - off].forEach(function (x) {
      grid.insertAdjacentHTML('beforeend',
        '<line x1="' + x + '" y1="' + (OY - span * unit) + '" x2="' + x +
        '" y2="' + (OY + span * unit) + '" stroke="#e2ddd2" stroke-width="1"/>');
    });
    // 横线（左右两条对称）
    [OY + off, OY - off].forEach(function (y) {
      grid.insertAdjacentHTML('beforeend',
        '<line x1="' + (OX - span * unit) + '" y1="' + y + '" x2="' +
        (OX + span * unit) + '" y2="' + y + '" stroke="#e2ddd2" stroke-width="1"/>');
    });
  }

  // --- 坐标轴 ---
  const axisX = document.getElementById('axis-x');
  axisX.setAttribute('x1', OX - span * unit);
  axisX.setAttribute('y1', OY);
  axisX.setAttribute('x2', OX + span * unit);
  axisX.setAttribute('y2', OY);

  const axisY = document.getElementById('axis-y');
  axisY.setAttribute('x1', OX);
  axisY.setAttribute('y1', OY + span * unit);
  axisY.setAttribute('x2', OX);
  axisY.setAttribute('y2', OY - span * unit);

  // --- 两支箭 ---
  const pa = toScreen(ax, ay, unit);
  const va = document.getElementById('vec-a');
  va.setAttribute('x1', OX); va.setAttribute('y1', OY);
  va.setAttribute('x2', pa[0]); va.setAttribute('y2', pa[1]);
  const da = document.getElementById('vec-a-dot');
  da.setAttribute('cx', pa[0]); da.setAttribute('cy', pa[1]);

  const pb = toScreen(bx, by, unit);
  const vb = document.getElementById('vec-b');
  vb.setAttribute('x1', OX); vb.setAttribute('y1', OY);
  vb.setAttribute('x2', pb[0]); vb.setAttribute('y2', pb[1]);
  const db = document.getElementById('vec-b-dot');
  db.setAttribute('cx', pb[0]); db.setAttribute('cy', pb[1]);
}

// 把数字格式化：整数不带小数点，其余保留 3 位
function fmt(n) {
  if (!isFinite(n)) return '—';
  return Number.isInteger(n) ? String(n) : n.toFixed(3);
}

function updateLab() {
  const ax = parseFloat(document.getElementById('ax').value) || 0;
  const ay = parseFloat(document.getElementById('ay').value) || 0;
  const bx = parseFloat(document.getElementById('bx').value) || 0;
  const by = parseFloat(document.getElementById('by').value) || 0;

  const dot = ax * bx + ay * by;                            // 点积
  const ma = Math.sqrt(ax * ax + ay * ay);                  // |a|
  const mb = Math.sqrt(bx * bx + by * by);                  // |b|

  document.getElementById('out-dot').textContent = fmt(dot);
  document.getElementById('out-ma').textContent = fmt(ma);
  document.getElementById('out-mb').textContent = fmt(mb);

  const cosEl = document.getElementById('out-cos');
  const angleEl = document.getElementById('out-angle');
  const verdictEl = document.getElementById('out-verdict');

  // 零向量没有方向，余弦相似度无定义
  if (ma === 0 || mb === 0) {
    cosEl.textContent = '—';
    angleEl.textContent = '—';
    verdictEl.textContent = '有向量长度是 0，它没有方向，余弦相似度无从谈起。';
    drawVectors(ax, ay, bx, by);
    return;
  }

  const cos = dot / (ma * mb);                              // 余弦相似度
  const angle = Math.acos(Math.max(-1, Math.min(1, cos))) * 180 / Math.PI; // 弧度转角度

  cosEl.textContent = fmt(cos);
  angleEl.textContent = angle.toFixed(1) + '°';

  // 用 cos 给出人话结论
  if (cos > 0.999) {
    verdictEl.textContent = 'cos ≈ 1：两支箭几乎完全同向——方向"像到不能再像"。';
  } else if (cos > 0.6) {
    verdictEl.textContent = 'cos 偏大（' + fmt(cos) + '）：方向相近，夹角 ' + angle.toFixed(1) + '°。';
  } else if (Math.abs(cos) < 0.02) {
    verdictEl.textContent = 'cos ≈ 0：两支箭垂直，点积为 0——一个方向"完全不含"另一个方向。';
  } else if (cos < -0.999) {
    verdictEl.textContent = 'cos ≈ -1：两支箭完全反向。';
  } else if (cos < 0) {
    verdictEl.textContent = 'cos 为负（' + fmt(cos) + '）：夹角大于 90°，方向"反着来"。';
  } else {
    verdictEl.textContent = 'cos = ' + fmt(cos) + '：有一点像，但不算同向，夹角 ' + angle.toFixed(1) + '°。';
  }

  drawVectors(ax, ay, bx, by);
}

function initLab() {
  const inputs = ['ax', 'ay', 'bx', 'by'].map(function (id) {
    return document.getElementById(id);
  });
  inputs.forEach(function (input) {
    input.addEventListener('input', updateLab);
  });

  // 预设按钮：一键摆出"同向 / 垂直 / 反向 / 随机"
  const presetValues = {
    similar:  [1, 1, 2, 2],
    perp:     [1, 0, 0, 1],
    opposite: [2, 1, -2, -1]
  };

  document.querySelectorAll('.presets button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      let v;
      if (btn.dataset.preset === 'random') {
        // 在 -4..4 之间随机取 4 个整数
        v = Array.from({ length: 4 }, function () {
          return Math.floor(Math.random() * 9) - 4;
        });
      } else {
        v = presetValues[btn.dataset.preset];
      }
      ['ax', 'ay', 'bx', 'by'].forEach(function (id, i) {
        document.getElementById(id).value = v[i];
      });
      updateLab();
    });
  });

  updateLab();
}

/* ------------------------------------------------------------
   3) 复习卡：点击整张卡片展开答案
   ------------------------------------------------------------ */

function initFlashes() {
  document.querySelectorAll('.flash').forEach(function (card) {
    card.addEventListener('click', function () {
      card.classList.toggle('is-open');
    });
  });
}

/* ------------------------------------------------------------
   4) 随机抽卡：点一次抽一张没抽过的，滚过去 + 自动展开
   ------------------------------------------------------------ */

function initDraw() {
  const btn = document.getElementById('draw-btn');
  const countEl = document.getElementById('draw-count');
  const cards = Array.from(document.querySelectorAll('.flash'));
  if (!btn || !cards.length) return;

  const drawn = new Set();   // 本轮已抽过的卡，避免老是抽到同一张

  function updateCount() {
    countEl.textContent = '已抽 ' + drawn.size + ' / ' + cards.length;
  }

  btn.addEventListener('click', function () {
    // 一轮全抽完了 → 清空记录，重新洗一轮
    if (drawn.size >= cards.length) {
      drawn.clear();
      cards.forEach(function (c) { c.classList.remove('is-drawn'); });
    }

    const pool = cards.filter(function (c) { return !drawn.has(c); });
    const pick = pool[Math.floor(Math.random() * pool.length)];
    drawn.add(pick);

    pick.classList.add('is-drawn', 'is-open');   // 标记 + 直接展开答案
    replay(pick, 'is-pulse');                    // 冲击波动画

    pick.scrollIntoView({
      behavior: REDUCE_MOTION ? 'auto' : 'smooth',
      block: 'center'
    });

    updateCount();
  });

  updateCount();
}

/* ------------------------------------------------------------
   5) 笔记档案
   数据来源：site/notes-data.js（由 build-notes.js 生成）
   markdown → HTML：site/vendor/marked.min.js
   ------------------------------------------------------------ */

// 调用 marked 时保留 window.marked 作为 this，否则它内部读 this.defaults 会炸
function parseMd(md) {
  const m = window.marked;
  return typeof m.parse === 'function' ? m.parse(md) : m(md);
}

// 把 "notes/../python/a.md" 这种路径拍平
function normalizePath(p) {
  const parts = [];
  p.split('/').forEach(function (seg) {
    if (seg === '' || seg === '.') return;
    if (seg === '..') parts.pop();
    else parts.push(seg);
  });
  return parts.join('/');
}

function initArchive() {
  const listEl = document.getElementById('note-list');
  const bodyEl = document.getElementById('note-body');
  const titleEl = document.getElementById('note-title');
  const catEl = document.getElementById('note-cat');
  const metaEl = document.getElementById('note-meta');
  const searchEl = document.getElementById('note-search');
  const archiveEl = document.getElementById('archive');
  if (!listEl || !bodyEl) return;

  const notes = window.NOTES || [];
  const markedReady = window.marked &&
    (typeof window.marked.parse === 'function' || typeof window.marked === 'function');

  if (!notes.length || !markedReady) {
    bodyEl.innerHTML = '<p>笔记数据没加载出来。请在 tech-stack-map 目录下执行 ' +
      '<code>node site/build-notes.js</code> 重新生成 site/notes-data.js。</p>';
    return;
  }

  // 路径 → id：用来把笔记里"指向另一篇笔记"的链接变成站内跳转
  const idByPath = {};
  notes.forEach(function (n) { idByPath[n.path] = n.id; });

  let currentId = null;
  const groupRefs = [];   // 搜索过滤时要整组隐藏，先存好每组的引用

  /* ---------- 建左侧目录（按 category 分组） ---------- */
  const seenGroup = {};
  notes.forEach(function (note) {
    let group = seenGroup[note.category];
    if (!group) {
      const head = document.createElement('p');
      head.className = 'toc__group';
      head.textContent = note.category;
      listEl.appendChild(head);

      const ul = document.createElement('ul');
      ul.className = 'toc__list';
      listEl.appendChild(ul);

      group = { head: head, ul: ul };
      seenGroup[note.category] = group;
      groupRefs.push(group);
    }

    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'toc__item';
    btn.dataset.id = note.id;
    btn.dataset.search = (note.title + ' ' + note.category + ' ' + note.excerpt).toLowerCase();

    const t = document.createElement('span');
    t.className = 'toc__item-title';
    t.textContent = note.title;

    const s = document.createElement('span');
    s.className = 'toc__item-sub';
    s.textContent = note.excerpt || note.path;

    btn.appendChild(t);
    btn.appendChild(s);
    btn.addEventListener('click', function () { goTo(note.id); });
    li.appendChild(btn);
    group.ul.appendChild(li);
  });

  /* ---------- 处理正文里的链接 ---------- */
  function fixLinks(container, currentPath) {
    const dir = currentPath.replace(/[^/]*$/, '');   // 当前笔记所在目录

    container.querySelectorAll('a[href]').forEach(function (a) {
      const href = a.getAttribute('href');

      if (/^https?:/i.test(href)) {                  // 外链：新窗口 + 剪电话线
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener');
        return;
      }

      if (/\.md(#.*)?$/i.test(href)) {               // 指向另一篇笔记
        const target = normalizePath(dir + href.split('#')[0]);
        const id = idByPath[target];
        if (id) {
          a.setAttribute('href', '#note/' + id);
          a.addEventListener('click', function (e) {
            e.preventDefault();
            goTo(id);
          });
        } else {
          // 目标笔记还没被收录（比如待建的 sqlite-notes.md）
          a.classList.add('is-missing');
          a.removeAttribute('href');
          a.setAttribute('title', '这篇还没有收录进档案');
        }
      }
    });
  }

  /* ---------- 渲染一篇笔记 ---------- */
  function render(id) {
    let note = null;
    notes.forEach(function (n) { if (n.id === id) note = n; });
    if (!note) return;
    currentId = id;

    catEl.textContent = note.category;
    titleEl.textContent = note.title;
    metaEl.textContent = note.path + '　·　更新于 ' + note.updated;

    // 开头的 "# 标题" 阅读区顶部已经显示过了，去掉免得重复
    const md = note.md.replace(/^#\s+[^\n]*\r?\n+/, '');
    bodyEl.innerHTML = parseMd(md);
    fixLinks(bodyEl, note.path);

    listEl.querySelectorAll('.toc__item').forEach(function (b) {
      b.classList.toggle('is-active', b.dataset.id === id);
    });
  }

  function scrollToArchive() {
    if (!archiveEl) return;
    archiveEl.scrollIntoView({
      behavior: REDUCE_MOTION ? 'auto' : 'smooth',
      block: 'start'
    });
  }

  // 统一的"打开某篇"入口：改 hash，剩下的交给 hashchange
  function goTo(id) {
    const target = '#note/' + id;
    if (location.hash === target) {
      render(id);
      scrollToArchive();
    } else {
      location.hash = target;
    }
  }

  function fromHash() {
    const m = location.hash.match(/^#note\/(.+)$/);
    if (!m) return;
    const id = decodeURIComponent(m[1]);
    if (id !== currentId) render(id);
    scrollToArchive();
  }

  window.addEventListener('hashchange', function () {
    if (location.hash.indexOf('#note/') === 0) fromHash();
  });

  /* ---------- 搜索过滤 ---------- */
  if (searchEl) {
    searchEl.addEventListener('input', function () {
      const q = searchEl.value.trim().toLowerCase();

      listEl.querySelectorAll('.toc__item').forEach(function (b) {
        const hit = !q || b.dataset.search.indexOf(q) !== -1;
        b.parentElement.hidden = !hit;
      });

      // 整组一条都没命中，就连组标题一起藏起来
      groupRefs.forEach(function (g) {
        const anyVisible = Array.prototype.some.call(
          g.ul.querySelectorAll('li'),
          function (li) { return !li.hidden; }
        );
        g.head.hidden = !anyVisible;
        g.ul.hidden = !anyVisible;
      });
    });
  }

  /* ---------- 首次进入 ---------- */
  if (location.hash.indexOf('#note/') === 0) {
    fromHash();                       // 带笔记链接进来（比如从别的页面跳）
  } else {
    let first = notes[0].id;
    notes.forEach(function (n) { if (n.id === 'TECH-STACK-MAP') first = n.id; });
    render(first);                    // 默认打开总地图
  }
}

/* ------------------------------------------------------------
   启动
   ------------------------------------------------------------ */
initProgress();
initLab();
initFlashes();
initDraw();
initArchive();
