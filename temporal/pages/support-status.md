---
layout: default
---

# サポート状況マトリクス（2026-08 時点）

<div class="mt-4">

| 環境 | 状況 | 時期 |
| --- | --- | --- |
| Firefox | ✅ **139 で出荷済み** | 2025-05 |
| Chrome / Edge | ✅ **144 で出荷済み**（フラグ不要） | 2026-01 |
| Safari | ⏳ **安定版は未出荷**（Technology Preview 249 には搭載） | TP: 2026-07 |
| Node.js | ✅ **26 でデフォルト有効** | 2026-05 |
| Deno | ✅ **2.7 でフラグ不要に** | 2026-02 |
| Bun | ❌ 未対応（issue はオープンのまま） | — |

</div>

<v-click>

<div class="mt-4 text-center text-lg">
主要環境はほぼ揃った。<strong>最後のピースは Safari 安定版だけ</strong>
</div>

</v-click>

<!--
出典（すべて 2026-08-18 確認）:
- Firefox 139 (2025-05-27): https://spidermonkey.dev/blog/2025/04/11/shipping-temporal.html / webstatus.dev API
- Chrome 144 (2026-01-13): https://developer.chrome.com/release-notes/144 / Edge 144 (2026-01-15): webstatus.dev API
- Safari TP 249 (2026-07-29): https://webkit.org/blog/18182/release-notes-for-safari-technology-preview-249/
- Node 26.0.0 (2026-05-05, V8 14.6): https://github.com/nodejs/node/releases/tag/v26.0.0 （LTS 昇格は 2026-10 予定）
- Deno 2.7 (2026-02-25): https://deno.com/blog/v2.7
- Bun: https://github.com/oven-sh/bun/issues/15853 （open。未対応の根拠はこの issue のみ）
-->

---
layout: default
---

# Baseline とは何か

[web.dev/baseline](https://web.dev/baseline)：「この機能、もう使っていい？」への業界共通の答え

<div class="mt-4">

判定母集団は **4 ブラウザ 7 環境**：Chrome（デスクトップ / Android）・Edge・Firefox（デスクトップ / Android）・Safari（macOS / iOS）

</div>

<div class="grid grid-cols-3 gap-4 mt-6">

<div class="stage stage-limited">

### Limited availability

コアブラウザのどれかが未サポート

</div>

<div class="stage">

### ✅ Newly available

**全コアブラウザ**の最新安定版でサポート

</div>

<div class="stage">

### ✅✅ Widely available

Newly から **30 ヶ月**経過

</div>

</div>

<v-click>

<div class="mt-6 text-center">
Temporal は現在 <strong class="text-red-400">Limited availability</strong>。Safari 安定版が空欄のままだからだ
</div>

</v-click>

<!--
出典: https://web.dev/baseline（2026-08-18 確認）
Temporal の判定: webstatus.dev API が "baseline": {"status": "limited"} を返す（2026-08-18 取得）
https://api.webstatus.dev/v1/features/temporal
-->

<style>
.stage { background: #282a36; border: 1px solid #44475a; border-radius: 0.6rem; padding: 0.8rem 1rem; text-align: center; }
.stage h3 { font-size: 0.9rem; color: #f8f8f2; }
.stage p { font-size: 0.78rem; color: #6272a4; }
.stage-limited { border-color: #ff5555; }
.stage-limited h3 { color: #ff5555; }
</style>

---
layout: default
---

# なぜ時間がかかったのか①：仕様が巨大

「ES2015 以来最大の言語追加」と呼ばれる規模

<div class="mt-6 grid grid-cols-2 gap-6">

<div class="fact">

### 仕様の分量

Temporal の仕様は、**国際化仕様 ECMA-402 全体よりも大きい**

</div>

<div class="fact">

### テストの数

公式テストスイート test262 のテスト数は**約 4,500 件**

（Date は 594 件）

</div>

</div>

<div class="mt-6 text-sm opacity-70">
タイムゾーン、カレンダー、夏時間、うるう年。「日時」は人類の合意の集積で、正しくやると本質的に重い
</div>

<!--
出典: Bloomberg JS Blog (2026-03): https://bloomberg.github.io/js-blog/post/temporal/
- "largest addition to the language since ES2015"、ECMA-402 比較、test262 4,500 vs Date 594
注意: 「仕様◯◯ページ」という具体的なページ数は一次情報で確認できなかったため使わない
-->

<style>
.fact { background: #282a36; border: 1px solid #44475a; border-radius: 0.6rem; padding: 0.8rem 1.2rem; text-align: center; }
.fact h3 { color: #bd93f9; font-size: 1rem; }
</style>

---
layout: default
---

# なぜ時間がかかったのか②：Stage 3 で 5 年の紆余曲折

<div class="mt-4 timeline">

<div class="tl-item">
<div class="tl-year">2017</div>
<div class="tl-body">提案スタート（Stage 1）</div>
</div>

<div class="tl-item">
<div class="tl-year">2021-03</div>
<div class="tl-body"><strong>Stage 3 到達</strong>。「仕様完成、あとは実装」のはずだった</div>
</div>

<div class="tl-item">
<div class="tl-year">2024</div>
<div class="tl-body"><strong>仕様のダイエット</strong>。低スペック端末でのバイナリサイズを懸念した実装者の要請で、<code>Temporal.Calendar</code> / <code>Temporal.TimeZone</code> クラスとカスタム化プロトコルを丸ごと削除</div>
</div>

<div class="tl-item">
<div class="tl-year">2026-03</div>
<div class="tl-body"><strong>Stage 4 到達 🎉</strong>。ECMA-262 にマージされ、ES2027 に掲載予定</div>
</div>

</div>

<div class="mt-4 text-sm opacity-70">
TC39 の Stage 4 には「test262 テスト完備＋出荷実装 2 つ以上」が必要。実装と仕様修正の往復が続いた
</div>

<!--
出典:
- Stage 3 到達 2021-03-10: https://spidermonkey.dev/blog/2025/04/11/shipping-temporal.html
- 2024 仕様ダイエット: https://github.com/tc39/proposal-temporal/issues/2853 / 2854（2024-04 チャンピオン会議 → 2024-06 TC39 承認）
- Stage 4 (2026-03, 第 113 回会合): https://www.igalia.com/2026/03/13/Temporal-Reaches-Stage-4.html
- 掲載先は ES2027: tc39/proposals finished-proposals.md の Expected Publication Year が 2027。ES2026（2026-07-02 公開）には Temporal は入っていない（一部メディアの「ES2026 入り」は誤り）
- TC39 プロセス: https://tc39.es/process-document/（Stage 4 要件: test262 + 2 実装 + 出荷経験）
-->

<style>
.timeline { display: flex; flex-direction: column; gap: 0.6rem; }
.tl-item { display: flex; gap: 1rem; align-items: baseline; }
.tl-year { min-width: 5.5rem; font-weight: 700; color: #ffb86c; text-align: right; }
.tl-body { font-size: 0.9rem; }
</style>

---
layout: default
---

# V8 の Temporal は Rust 製

Chrome 144 の出荷の裏には、実装アプローチの転換があった

<div class="mt-4">

- V8 は自前 C++ 実装をやめ、Rust 製ライブラリ **`temporal_rs`** を採用
- `temporal_rs` は JS エンジン **Boa**（Rust 製）のプロジェクトから生まれ、2024-06 から Google の国際化チームと協業
- **Chromium で主要な JS API が Rust で実装されたのは初**
- Boa / V8 / Kiesel（Zig 製エンジン）が**同一実装を共有** — test262 を 100% パス

</div>

<v-click>

<div class="mt-6 text-center opacity-90">
「巨大で正確さが命の仕様は、エンジン間でロジックを共有する」という新しい前例に
</div>

</v-click>

<!--
出典:
- Boa 公式ブログ (2025-09-24): https://boajs.dev/blog/2025/09/24/temporal-release
- https://github.com/boa-dev/temporal
- Bloomberg JS Blog: 2024-06 協業開始、test262 100% パス（V8 統合時点の conformance 約 99%）
- socket.dev: https://socket.dev/blog/temporal-api-ships-in-chrome-144-major-shift-for-javascript-date-handling
-->

---
layout: default
---

# で、いつ「使える」ようになるのか

<div class="mt-6 flow">

<div class="step step-now">
<div class="step-title">今（2026-08）</div>
<div class="step-body">Limited availability<br>Safari 安定版のみ未出荷<br>（TP 249 には搭載済み）</div>
</div>

<div class="arrow">→</div>

<div class="step">
<div class="step-title">Safari 出荷の瞬間</div>
<div class="step-body">Baseline <strong>Newly available</strong><br>「最新ブラウザなら動く」</div>
</div>

<div class="arrow">→</div>

<div class="step">
<div class="step-title">その 30 ヶ月後</div>
<div class="step-body">Baseline <strong>Widely available</strong><br>「polyfill なしで本番投入」</div>
</div>

</div>

<v-click>

<div class="mt-8 text-center text-lg">
ゴールは見えている。<strong>学ぶなら今がちょうどいい</strong>
</div>

</v-click>

<!--
Safari の出荷時期の公式 ETA は存在しない（TP 249 搭載から「近い」と推測はできるが、スライドでは断定しない）
-->

<style>
.flow { display: flex; align-items: stretch; justify-content: center; gap: 0.8rem; }
.step {
  background: #282a36; border: 1px solid #44475a; border-radius: 0.5rem;
  padding: 1rem 1.2rem; text-align: center; width: 14rem;
  display: flex; flex-direction: column; justify-content: center;
}
.step-now { border-color: #8be9fd; }
.step-title { font-weight: 700; color: #bd93f9; font-size: 0.95rem; }
.step-body { font-size: 0.8rem; color: #6272a4; margin-top: 0.5rem; }
.arrow { align-self: center; font-size: 1.5rem; color: #6272a4; }
</style>
