#!/usr/bin/env node
/**
 * 把仓库里的 markdown 笔记汇总成一份 site/notes-data.js，供学习台页面读取。
 *
 * 为什么要有这一步：
 *   浏览器在 file:// 下用 fetch 读本地 .md 会被拦住（跨域限制）。
 *   所以改成"先把 markdown 打包进一个 .js 文件"，页面只要 <script> 引进来即可，
 *   双击 index.html 就能用，不需要起服务器。
 *
 * 纯 Node，零第三方依赖。用法（在 tech-stack-map 目录下）：
 *     node site/build-notes.js
 *
 * 改完笔记后重新跑一次，页面里的内容就更新了。
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');          // → tech-stack-map/
const OUT = path.join(__dirname, 'notes-data.js');   // → site/notes-data.js

/**
 * 收录清单：想加新的笔记目录/文件，改这里就行。
 * 顺序 = 页面上目录的展示顺序。
 */
const SOURCES = [
  { category: '总览',     files: ['TECH-STACK-MAP.md', 'LEARNING.md', 'README.md'] },
  { category: 'AI 课程',  dir: 'notes/ai' },
  { category: 'Python',   dir: 'notes/python' },
  { category: '前端',     dir: 'notes/frontend' },
  { category: '环境配置', dir: 'environment' },
  { category: '速查表',   files: [
      'notes/tech-terms-cheatsheet.md',
      'notes/command-line-cheatsheet.md',
      'notes/markdown-cheatsheet.md'
    ] },
  { category: '日志与踩坑', files: ['notes/learning-log.md', 'notes/errors.md'] },
  { category: '实战项目', files: [
      'stage-01-python-data/projects/README.md',
      'stage-05-ai-tools/model-orchestrator/README.md'
    ] }
];

/** 递归收集目录下的所有 .md（按文件名排序，保证每次生成结果稳定） */
function collectMarkdown(dirAbs) {
  if (!fs.existsSync(dirAbs)) return [];
  const out = [];
  fs.readdirSync(dirAbs, { withFileTypes: true })
    .sort(function (a, b) { return a.name.localeCompare(b.name); })
    .forEach(function (entry) {
      const abs = path.join(dirAbs, entry.name);
      if (entry.isDirectory()) {
        out.push.apply(out, collectMarkdown(abs));
      } else if (entry.name.toLowerCase().endsWith('.md')) {
        out.push(abs);
      }
    });
  return out;
}

/**
 * 取第一个 `# 标题`，但跳过 ``` 代码块内部的行
 * （否则代码示例里的一行注释会被误当成标题）。
 */
function titleOf(md, fallback) {
  const lines = md.split(/\r?\n/);
  let inFence = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*```/.test(line)) { inFence = !inFence; continue; }
    if (inFence) continue;
    const m = line.match(/^#\s+(.+?)\s*$/);
    if (m) return m[1];
  }
  return fallback;
}

/** 给目录列表用的一句话摘要：正文里第一段"像人话"的文字 */
function excerptOf(md) {
  const lines = md.split(/\r?\n/);
  let inFence = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (/^```/.test(line)) { inFence = !inFence; continue; }
    if (inFence || !line) continue;
    if (/^#{1,6}\s/.test(line)) continue;   // 标题
    if (/^<!--/.test(line)) continue;       // HTML 注释
    if (/^[|>]/.test(line)) continue;       // 表格 / 引用
    if (/^[-*+]\s/.test(line)) continue;    // 列表
    if (/^\d+\.\s/.test(line)) continue;    // 有序列表
    if (/^!?\[/.test(line)) continue;       // 以链接/图片开头（多是索引行）
    if (/^[-=*_]{3,}$/.test(line)) continue;// 分隔线

    // 剥掉行内标记，留下纯文本
    const plain = line
      .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/[*_`]/g, '')
      .trim();
    if (plain.length < 4) continue;
    return plain.length > 56 ? plain.slice(0, 56) + '…' : plain;
  }
  return '';
}

/** 取文件最后修改日期，页面上当"档案日期"用 */
function updatedOf(fileAbs) {
  const d = fs.statSync(fileAbs).mtime;
  const pad = function (n) { return String(n).padStart(2, '0'); };
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
}

// ---------- 主流程 ----------
const notes = [];
const seen = new Set();

SOURCES.forEach(function (source) {
  const files = source.dir
    ? collectMarkdown(path.join(ROOT, source.dir)).map(function (abs) {
        return path.relative(ROOT, abs);
      })
    : source.files || [];

  files.forEach(function (rel) {
    const abs = path.join(ROOT, rel);
    if (!fs.existsSync(abs)) {
      console.warn('[跳过] 找不到文件：' + rel);
      return;
    }
    const relPosix = rel.split(path.sep).join('/');
    if (seen.has(relPosix)) return;
    seen.add(relPosix);

    const md = fs.readFileSync(abs, 'utf8').replace(/^\uFEFF/, '');
    notes.push({
      id: relPosix.replace(/\.md$/i, ''),        // 例如 notes/python/python-notes
      title: titleOf(md, path.basename(relPosix, '.md')),
      category: source.category,
      path: relPosix,
      updated: updatedOf(abs),
      excerpt: excerptOf(md),
      md: md
    });
  });
});

const header =
  '/* 本文件由 site/build-notes.js 自动生成，请勿手改。\n' +
  '   改完笔记后在 tech-stack-map 目录下重新执行：node site/build-notes.js */\n';

fs.writeFileSync(OUT, header + 'window.NOTES = ' + JSON.stringify(notes, null, 2) + ';\n', 'utf8');

const kb = Math.round(fs.statSync(OUT).size / 1024);
console.log('已生成 ' + path.relative(ROOT, OUT) + ' —— ' + notes.length + ' 篇，约 ' + kb + ' KB');
