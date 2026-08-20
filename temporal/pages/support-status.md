---
layout: default
---

# サポート状況マトリクス（2026-08 時点）

<div class="mt-4">

| 環境 | 状況 | 時期 |
| --- | --- | --- |
| Firefox | ✅ **139 で shipped** | 2025-05 |
| Chrome / Edge | ✅ **144 で shipped**（フラグ不要） | 2026-01 |
| Safari | ⏳ **安定版は未 ship**（Technology Preview 249 には搭載） | TP: 2026-07 |
| Node.js | ✅ **26 でデフォルト有効** | 2026-05 |
| Deno | ✅ **2.7 でフラグ不要に** | 2026-02 |
| Bun | ⏳ **安定版では未搭載**（デフォルト有効化 PR はマージ済み） | PR: 2026-08 |

</div>

<!--
出典（すべて 2026-08-18 確認）:
- Firefox 139 (2025-05-27): https://spidermonkey.dev/blog/2025/04/11/shipping-temporal.html / webstatus.dev API
- Chrome 144 (2026-01-13): https://developer.chrome.com/release-notes/144 / Edge 144 (2026-01-15): webstatus.dev API
- Safari TP 249 (2026-07-29): https://webkit.org/blog/18182/release-notes-for-safari-technology-preview-249/
- Node 26.0.0 (2026-05-05, V8 14.6): https://github.com/nodejs/node/releases/tag/v26.0.0 （LTS 昇格は 2026-10 予定）
- Deno 2.7 (2026-02-25): https://deno.com/blog/v2.7
- Bun: デフォルト有効化 PR #32978 が 2026-08-05 にマージ済み（issue #15853 はクローズ）。最新安定版 1.3.14（2026-05-13）には未搭載。発表当日までに新リリースが出ていないか要再確認: https://github.com/oven-sh/bun/pull/32978
-->

---
layout: default
---

# Baseline とは何か

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
Temporal は現在 <strong class="text-red-400">Limited availability</strong>。Safari ではまだサポートしきれていない
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

# Proposal から Stage 4 まで 9 年

<div class="mt-4 timeline">

<div class="tl-item">
<div class="tl-year">2017</div>
<div class="tl-body">Proposal スタート（Stage 1）</div>
</div>

<div class="tl-item">
<div class="tl-year">2021-03</div>
<div class="tl-body"><strong>Stage 3 到達</strong>。仕様は完成し、あとは実装するだけのはずだった</div>
</div>

<div class="tl-item">
<div class="tl-year">2024-06</div>
<div class="tl-body">仕様の大幅縮小を決定（<code>Temporal.Calendar</code> / <code>Temporal.TimeZone</code> クラスを削除）</div>
</div>

<div class="tl-item">
<div class="tl-year">2026-03</div>
<div class="tl-body"><strong>Stage 4 到達 🎉</strong>。ECMA-262 へのマージ PR がレビュー中で、ES2027 に掲載予定</div>
</div>

</div>

<v-click>

<div class="mt-6 text-center text-lg">
Stage 3（実装候補）のまま <strong>5 年</strong>。この間に何があったのか
</div>

</v-click>

<!--
出典:
- Stage 3 到達 2021-03-10: https://spidermonkey.dev/blog/2025/04/11/shipping-temporal.html
- 2024 仕様縮小: https://github.com/tc39/proposal-temporal/issues/2853 / 2854（2024-04 チャンピオン会議 → 2024-06 TC39 承認）
- Stage 4 (2026-03, 第 113 回会合): https://www.igalia.com/2026/03/13/Temporal-Reaches-Stage-4.html
- 掲載先は ES2027: tc39/proposals finished-proposals.md の Expected Publication Year が 2027。ES2026（2026-07-02 公開）には Temporal は入っていない（Bloomberg / socket.dev の「ES2026 入り」は誤り）
- ECMA-262 へのマージ PR #3759 は 2026-08-20 時点でオープン（エディターレビュー中）: https://github.com/tc39/ecma262/pull/3759
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
タイムゾーン、カレンダー、サマータイム、うるう年。日時は人類の合意の集積で、正しくやると本質的に重い
</div>

<!--
出典: Bloomberg JS Blog (2026-03): https://bloomberg.github.io/js-blog/post/temporal/
- "Temporal is the biggest addition to ECMAScript since ES2015"、ECMA-402 比較（"This GIANT spec is bigger than all of ECMA-402"）
- test262 4,500 vs 594 の出典は Igalia Stage 4 記事。集計方法によっては 6,764 という数字もある（Igalia JSC 記事）ので、聞かれたら「約 4,500（集計方法で変動）」と答える
注意: 「仕様◯◯ページ」という具体的なページ数は一次情報で確認できなかったため使わない
-->

<style>
.fact { background: #282a36; border: 1px solid #44475a; border-radius: 0.6rem; padding: 0.8rem 1.2rem; text-align: center; }
.fact h3 { color: #bd93f9; font-size: 1rem; }
</style>

---
layout: default
---

# なぜ時間がかかったのか②：Stage 3 でも仕様が変わり続けた

<div class="mt-4">

- Stage 3 は本来、仕様を凍結して実装フィードバックを集める段階
- Temporal では実装から問題が次々に見つかり、**仕様変更（normative change）が Stage 4 直前まで続いた**
- 最大の変更が 2024-06 に決定された**大幅縮小**：`Temporal.Calendar` / `Temporal.TimeZone` クラスとカスタム化プロトコルを削除
- 縮小を求めたのは**エンジン実装者の側**（低スペック端末でのバイナリサイズへの懸念）

</div>

<v-click>

<div class="mt-6 text-sm opacity-80">

この経験は TC39 のプロセス自体も変えた。2023-11 に新設された **Stage 2.7**（仕様承認とテスト・実装の間の中間段階）をめぐる議論の中で、Temporal が名指しで例に挙げられた

</div>

</v-click>

<!--
出典:
- 2024 縮小: https://github.com/tc39/proposal-temporal/issues/2853 / 2854（実装者の要請であることも issue に記載）
- Stage 2.7 新設 (2023-11-30 TC39 総会、提案者は Michael Ficarra): https://github.com/tc39/notes/blob/main/meetings/2023-11/november-30.md
  Temporal を名指しした発言は Jordan Harband (JHD): "If we had this new stage 5 years ago, Temporal would have been sitting in it for many years, appropriately. Because the main reason that Temporal wanted to be at Stage 3 was so tests could be written and people could implement it and try it out."（発言者を Ficarra と言わないこと）
- process-document への反映: https://github.com/tc39/process-document/pull/37（2023-12-01 マージ）
-->

---
layout: default
---

# Safari はなぜ最後になったのか

<div class="mt-4">

- Temporal を**安定版で ship したことは一度もない**（2026-08 時点）
- JSC には Stage 3 直後の **2021 年からフラグ付き（`--useTemporal`）の部分実装**があった
- 完成しないまま数年停滞。2024 年の仕様縮小では、**初期実装が作り込んでいた `Temporal.Calendar` / `Temporal.TimeZone` がまるごと仕様から削除された**
- **2025 年に Igalia が実装を再開**し、1 年で約 40 の PR を投入して完成へ
- **2026-07 の Technology Preview 249 で初めてデフォルト有効化**。安定版と Safari 27 beta にはまだ入っていない

</div>

<div class="mt-4 text-sm opacity-70">
停滞の原因は仕様変更だけではなく、実装リソースの事情も重なっている
</div>

<!--
出典（2026-08-20 調査）:
- メタバグ bug 223166「[JSC] Implement Temporal」(2021-03-14 起票、Apple の Yusuke Suzuki 氏): https://bugs.webkit.org/show_bug.cgi?id=223166
- フラグ付き実装の傍証: STP 154 リリースノート「Behind the --useTemporal flag」(2022-09-21): https://webkit.org/blog/13207/release-notes-for-safari-technology-preview-154/
- Igalia の再開と約 40 PR: Tim Chevalier のブログ (2026-02-02): https://blogs.igalia.com/compilers/2026/02/02/implementing-the-temporal-proposal-in-javascriptcore/
- デフォルト有効化: bug 318885 (2026-07-08) / STP 249 (2026-07-29): https://webkit.org/blog/18182/release-notes-for-safari-technology-preview-249/
- 安定版 26.0〜26.6・Safari 27 beta に Temporal の記載なし（2026-08-20 確認）
- STP 249 の実装は JSC 自前の C++ 実装（temporal_rs は参照設計としてコメントで言及されるのみ）
- 「一度 ship した」は安定版出荷を意味するなら誤りなので使わない — この言い方が正確
-->

---
layout: default
---

# いつ使えるようになるのか

<div class="mt-6 flow">

<div class="step step-now">
<div class="step-title">今（2026-08）</div>
<div class="step-body">Limited availability<br>Safari 安定版のみ未 ship<br>（TP 249 には搭載済み）</div>
</div>

<div class="arrow">→</div>

<div class="step">
<div class="step-title">Safari が ship した瞬間</div>
<div class="step-body">Baseline <strong>Newly available</strong><br>最新ブラウザなら動く</div>
</div>

<div class="arrow">→</div>

<div class="step">
<div class="step-title">その 30 ヶ月後</div>
<div class="step-body">Baseline <strong>Widely available</strong><br>polyfill なしで本番投入できる</div>
</div>

</div>

<!--
Safari が ship する時期の公式 ETA は存在しない（TP 249 搭載から近いと推測はできるが、スライドでは断定しない）
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
