---
layout: default
---

# チャット UI の限界

<div class="mt-6">

「東京から大阪、明日の朝イチで行きたい」

<div class="grid grid-cols-2 gap-6 mt-6">

<div class="pain">

### 😩 テキストの壁

のぞみ 1 号は 6:00 東京発、8:22 新大阪着です。<br>
のぞみ 3 号は 6:15 東京発…(以下 20 行続く)

<!-- 時刻は 2026 年 7 月時点の実ダイヤ(駅探・Yahoo!路線情報で検証済み) -->

</div>

<v-click>
<div class="gain">

### ✨ UI で返る世界

時刻表テーブル + 絞り込み + 予約ボタン<br>
読むのではなく、**操作する**

</div>
</v-click>

</div>
</div>

<style>
.pain, .gain { border-radius: 0.6rem; padding: 0.8rem 1.2rem; }
.pain { background: #331e1e; } .pain h3 { color: #ff5555; }
.gain { background: #1e3226; } .gain h3 { color: #50fa7b; }
</style>

---
layout: default
---

# Generative UI の定義

<div class="mt-8 text-center text-xl">

LLM のレスポンスが **テキストではなく UI そのもの** になる

</div>

<div class="mt-8 flow">

<div class="step">
<div class="step-icon">💬</div>
<div class="step-title">自然言語で依頼</div>
<div class="step-body">「チームの KPI を<br>ダッシュボードで見たい」</div>
</div>

<div class="arrow">→</div>

<div class="step">
<div class="step-icon">🤖</div>
<div class="step-title">LLM が UI の構造を生成</div>
<div class="step-body"><code>{ type: "Card", ... }</code></div>
</div>

<div class="arrow">→</div>

<div class="step">
<div class="step-icon">🖼️</div>
<div class="step-title">クライアントがレンダリング</div>
<div class="step-body">手元のコンポーネントで描画</div>
</div>

</div>

<style>
.flow { display: flex; align-items: stretch; justify-content: center; gap: 0.8rem; }
.step {
  background: #282a36; border: 1px solid #44475a; border-radius: 0.5rem;
  padding: 1rem 1.2rem; text-align: center; width: 15rem;
  display: flex; flex-direction: column; justify-content: center;
}
.step-icon { font-size: 1.6rem; }
.step-title { font-weight: 700; color: #bd93f9; margin-top: 0.4rem; font-size: 0.9rem; }
.step-body { font-size: 0.78rem; color: #6272a4; margin-top: 0.4rem; }
.arrow { align-self: center; font-size: 1.5rem; color: #6272a4; }
</style>

---
layout: default
---

# もう身近にある実例

<div class="mt-4">

- **ChatGPT**：Apps SDK(2025/10 発表、MCP を拡張したオープン規格)。チャット内に Spotify や Zillow のアプリ UI が開く
- **Claude**：レスポンスの中にチャートや図をインラインで生成し、会話で修正できる(2026/3 ベータ)
- **Gemini**：Dynamic View(2025/11、Gemini 3 と同時発表)。プロンプトごとに UI を設計してコーディングする

</div>

<div class="mt-6 text-sm opacity-70">
主要 3 プラットフォームが、この 1 年で一斉に「レスポンスとしての UI」へ踏み出した
</div>

<!--
出典:
- OpenAI: Introducing apps in ChatGPT and the new Apps SDK (2025-10-06)。ローンチパートナー 7 社に Spotify・Zillow を含む
- Anthropic: Claude builds interactive visuals right in your conversation (2026-03-12)。公式は「charts, diagrams and visualizations」
- Google: Gemini 3 発表 (2025-11-18)。generative interfaces の実験として visual layout と dynamic view
-->

---
layout: default
---

# 2 つのアプローチ

<div class="grid grid-cols-2 gap-6 mt-6">

<div class="cat">

### 🎨 自由生成

LLM に HTML / コードを直接書かせる

- 表現力は無限
- ⚠️ XSS、壊れたレイアウト、ブランド逸脱

</div>

<div class="cat cat-hl">

### 📦 カタログ型(スキーマ制約)

事前定義したコンポーネントの組み合わせを JSON 等で出力させる

- 安全で、デザインも一貫する
- 出せる UI はカタログの範囲内

</div>

</div>

<div class="mt-6 text-center opacity-80">
プロダクションの本命は<strong>カタログ型</strong>
</div>

<style>
.cat { background: #282a36; border: 1px solid #44475a; border-radius: 0.6rem; padding: 0.8rem 1.4rem; }
.cat-hl { border-color: #50fa7b; }
.cat h3 { color: #f8f8f2; }
</style>
