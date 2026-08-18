---
layout: default
---

# Server Driven UI(SDUI)とは

<div class="mt-6 text-center">

サーバーが **UI をデータ(JSON など)で記述** → クライアントは **コンポーネントカタログ** からレンダリング

</div>

```json
{
  "type": "section",
  "children": [
    { "type": "image", "props": { "src": "..." } },
    { "type": "title", "props": { "text": "Cozy room in Shibuya" } },
    { "type": "price", "props": { "amount": 8500, "unit": "night" } }
  ]
}
```

<div class="mt-4 text-sm opacity-70">
アプリを再リリースせずに画面を変えられる。ネイティブアプリの世界で発展した手法
</div>

---
layout: default
---

# 各社の事例

<div class="mt-4">

- **Airbnb**：Ghost Platform。検索、リスティング、チェックアウトなど主要機能の大半を SDUI 化
- **Lyft**：Bikes & Scooters アプリの画面定義を protobuf で配信(形式は JSON とは限らない)
- **Shopify**：チェックアウト拡張。サンドボックス内の拡張コードは、Shopify が定義したコンポーネントだけで UI を組める

</div>

<div class="quote mt-5 text-sm">
"a majority of Airbnb's most used features (e.g., search, listing pages, checkout) are built on GP"
<div class="quote-src">Airbnb Tech Blog: A Deep Dive into Airbnb's Server-Driven UI System (2021)</div>
</div>

<div class="mt-4 text-sm opacity-70">
共通点は、画面の構造をデータとして受け渡し、クライアントは事前定義したカタログの範囲で描画すること
</div>

<style>
.quote { border-left: 3px solid #bd93f9; padding-left: 0.8rem; color: #f8f8f2; opacity: 0.85; font-style: italic; }
.quote-src { font-size: 0.7rem; color: #6272a4; font-style: normal; margin-top: 0.2rem; }
</style>

<!--
出典:
- Airbnb: A Deep Dive into Airbnb's Server-Driven UI System (Ryan Brooks, 2021)。Web も対象なのでネイティブ専用の手法ではない
- Lyft: The Journey to Server Driven UI At Lyft Bikes and Scooters (2023)。protobuf 配信
- Shopify: Remote Rendering: Shopify's Take on Extensible UI (2021)。remote-ui(現 Remote DOM)。厳密にはサーバー配信ではなく、クライアント内サンドボックスの拡張コードがコンポーネント木をホストへ送る「リモートレンダリング」— 口頭で補足すること
- 他に DoorDash: Improving Development Velocity with Generic, Server-Driven UI Components (2021)、源流に Spotify HubFramework (2016)
-->

---
layout: default
---

# SDUI が教えてくれた難しさ

<div class="mt-6">

- 📚 **カタログ設計**：粒度をどう切るか(原子的すぎると表現力がなく、大きすぎると柔軟性がない)
- 🔄 **スキーマ進化**：古いクライアントに新しい JSON が届く問題
- ✅ **バリデーション**：不正な JSON をどう防ぎ、どう落とすか

</div>

---
layout: center
class: text-center
---

<div class="text-lg opacity-80">

SDUI: サーバーのロジックが JSON を組み立てる<br>
Generative UI: **LLM が文脈に応じて JSON を組み立てる**

</div>
