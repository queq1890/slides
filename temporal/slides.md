---
theme: dracula
title: Temporal 入門
transition: slide-left
monacoRunAdditionalDeps:
  - temporal-polyfill
---

# 🕰️ Temporal 入門

Date のつらさを根本から解決する、新しい日時 API

---
layout: default
---

# 今日話すこと

<div class="mt-8 text-lg">

1. JavaScript の Date の振る舞い
2. Temporal は何を解決するのか
3. サポート状況と、Baseline に乗らない理由
4. npm パッケージでの対応方針
5. 実装デモ

</div>

---
layout: section
---

<div class="section-num">01</div>

# JavaScript の Date の振る舞い

<div class="section-sub">30 年前の設計を、今も引きずっている</div>

<style>
.section-num { font-size: 1rem; font-weight: 700; color: #ff5555; letter-spacing: 0.2em; opacity: 0.8; }
.section-sub { font-size: 1rem; color: #6272a4; margin-top: 0.5rem; }
</style>

---
src: ./pages/date-pain.md
---

---
layout: section
---

<div class="section-num">02</div>

# Temporal は何を解決するのか

<div class="section-sub">つらみの一つひとつに、設計で答える</div>

<style>
.section-num { font-size: 1rem; font-weight: 700; color: #50fa7b; letter-spacing: 0.2em; opacity: 0.8; }
.section-sub { font-size: 1rem; color: #6272a4; margin-top: 0.5rem; }
</style>

---
src: ./pages/temporal-solves.md
---

---
layout: section
---

<div class="section-num">03</div>

# サポート状況と Baseline

<div class="section-sub">実装は複数あるのに、なぜまだ「使える」と言えないのか</div>

<style>
.section-num { font-size: 1rem; font-weight: 700; color: #bd93f9; letter-spacing: 0.2em; opacity: 0.8; }
.section-sub { font-size: 1rem; color: #6272a4; margin-top: 0.5rem; }
</style>

---
src: ./pages/support-status.md
---

---
layout: section
---

<div class="section-num">04</div>

# npm パッケージでの対応方針

<div class="section-sub">Baseline 前の今、どう Temporal に触るか</div>

<style>
.section-num { font-size: 1rem; font-weight: 700; color: #ffb86c; letter-spacing: 0.2em; opacity: 0.8; }
.section-sub { font-size: 1rem; color: #6272a4; margin-top: 0.5rem; }
</style>

---
src: ./pages/ecosystem.md
---

---
layout: section
---

<div class="section-num">05</div>

# 実装デモ

<div class="section-sub">スライドの中で、そのまま動かす</div>

<style>
.section-num { font-size: 1rem; font-weight: 700; color: #8be9fd; letter-spacing: 0.2em; opacity: 0.8; }
.section-sub { font-size: 1rem; color: #6272a4; margin-top: 0.5rem; }
</style>

---
src: ./pages/demo.md
---

---
layout: default
---

# まとめ

<div class="mt-8">

- Date のつらさ（ミュータブル、タイムゾーン、パース、型の不在）は **Temporal が設計で解決する**
- 仕様は **Stage 4 到達（ES2027 掲載予定）**。Chrome / Firefox / Node も出荷済みで、**残るは Safari 安定版だけ**
- Baseline はまだ Limited。本番は **polyfill** で埋めつつ、**学ぶなら今がちょうどいい**

</div>

<div class="mt-10 text-center opacity-80">
Thanks! 🙌
</div>
