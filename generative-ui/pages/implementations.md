---
layout: default
---

# 実装の全体地図

<div class="mt-6">

| | 出自 | アプローチ |
|---|---|---|
| **OpenUI** | Thesys(2026/3 公開) | 独自言語 OpenUI Lang をストリーミング + パーサーで検証 |
| **A2UI** | Google 発(2025/12)、現 a2ui-project | UI カタログ + 宣言的 JSON |
| **json-render** | Vercel Labs | カタログ型を React で手軽に |

</div>

<div class="mt-4 text-sm opacity-70">
今日は OpenUI と A2UI を軸に、デモは json-render で
</div>

---
layout: default
---

# OpenUI を構成する 4 つの要素

<div class="grid grid-cols-2 gap-4 mt-6 text-sm">

<div class="comp">📚 <strong>コンポーネントライブラリ</strong>(= カタログ)<br>Zod スキーマで props を定義</div>
<div class="comp">📝 <strong>プロンプトジェネレーター</strong><br>ライブラリからシステムプロンプトを自動生成</div>
<div class="comp">🛡️ <strong>パーサー</strong><br>出力を検証。無効な部分は削除し有効な部分のみ表示</div>
<div class="comp">🖼️ <strong>レンダラー</strong><br>ストリーミングで段階的にレンダリング</div>

</div>

<style>
.comp { background: #282a36; border: 1px solid #44475a; border-radius: 0.5rem; padding: 0.9rem 1.1rem; }
</style>

---
layout: default
---

# OpenUI Lang のストリーミング

JSON ではなく、**トークン効率の良い行指向かつ位置指定の構文**(OpenUI Lang)

```coffee {1|2|all}
root = Stack([title, tbl])
title = TextContent("Employees (Sample)", "large-heavy")
tbl = Table(cols, rows)
cols = [Col("Name", "string"), Col("Department", "string"), Col("Salary", "number")]
rows = [["Ava Patel", "Engineering", 132000], ["Marcus Lee", "Sales", 98000]]
```

<div class="mt-2 text-xs opacity-50">実際の出力例(リポジトリ benchmarks/samples より抜粋、一部省略)</div>

<div class="mt-3 text-sm">

<div>① 1 行 = 1 文。<code>root</code> から変数名で他の行を参照して木を組む → 届いた行から順にパースして描画できる(ストリーミングと相性◎)</div>
<div v-click="1">② 引数は名前なしの<strong>位置指定</strong>。<code>"Employees (Sample)"</code> が text、<code>"large-heavy"</code> が variant — 対応は Zod スキーマのキー順で決まる</div>
<div v-click="2">③ キー名を書かないぶん軽い。公式ベンチで JSON 比 最大 67%(7 シナリオ合計 約 52%)のトークン削減 → 速く、安い</div>

</div>

---
layout: default
---

# A2UI の仕組み

<div class="grid grid-cols-2 gap-5 mt-4">

<div class="text-sm">

- Google が 2025/12 に発表した、エージェントが「UI を話す」ためのプロトコル(現在は a2ui-project として独立、v0.9 系)
- エージェントが **宣言的 JSON** で UI を記述し、クライアントへ送る
- クライアントは**信頼済みのコンポーネントカタログ**の範囲でだけレンダリング

<div class="mt-3 opacity-70">
"safe like data, but expressive like code" (公式 README)
</div>

</div>

<div>

```json {3-4|6-7|all}
{
  "version": "v0.9",
  "updateComponents": {
    "surfaceId": "user_profile_card",
    "components": [
      { "id": "root", "component": "Column",
        "children": ["user_name", "user_title"] },
      { "id": "user_name", "component": "Text",
        "text": "John Doe" },
      { "id": "user_title", "component": "Text",
        "text": "Software Engineer" }
    ]
  }
}
```

<div class="mt-1 text-xs opacity-50">実際のメッセージ例(v0.9 公式仕様書より)</div>

<div class="mt-2 text-xs">

<div>① メッセージ種別は createSurface / updateComponents / updateDataModel など数種類。これは surface の中身を更新する例</div>
<div v-click="1">② コンポーネントは入れ子ではなく<strong>フラットなリスト</strong>。親は <code>children</code> に ID を書いて参照する</div>
<div v-click="2">③ <code>component</code> に書けるのはカタログにある名前だけ。運ばれるのは宣言だけで、コードは一切届かない</div>

</div>

</div>

</div>

---
layout: default
---

# A2UI のクライアント実装

```tsx {4-5|7-9|all}
import { MessageProcessor } from "@a2ui/web_core/v0_9";
import { A2uiSurface, basicCatalog } from "@a2ui/react/v0_9";

const processor = new MessageProcessor([basicCatalog]);
processor.processMessages(agentMessages);

return surfaces.map((surface) => (
  <A2uiSurface key={surface.id} surface={surface} />
));
```

<div class="mt-1 text-xs opacity-50">公式 React レンダラーの Quick Start より抜粋</div>

<div class="mt-3 text-sm">

<div>① MessageProcessor がエージェントの JSON メッセージを検証し、カタログ(<code>basicCatalog</code>)の範囲で surface を組み立てる</div>
<div v-click="1">② クライアントは surface を <code>&lt;A2uiSurface&gt;</code> に渡すだけ。「何を出すか」はエージェント側が決めている</div>
<div v-click="2">③ レンダラーは差し替え可能。Lit / Angular / React / Flutter / Markdown が公式に並び、同じ JSON を各実装で描画できる</div>

</div>

---
layout: default
---

# 比較

<div class="mt-4">

| | OpenUI | A2UI | json-render |
|---|---|---|---|
| 表現形式 | OpenUI Lang(独自言語) | JSON(4 種のメッセージ) | JSON Patch の JSONL |
| ストリーミングの単位 | **行**(1 行 = 1 文。生成中の出力をそのままパース) | **メッセージ**(完成した JSON を逐次適用) | **行**(1 行 = 1 Patch) |
| 安全性の担保 | パーサーが無効な部分を落とす | 信頼済みカタログに制約 | カタログ制約 + Zod 検証 |
| レンダラー | React(Vue / Svelte は初期段階) | Lit / Angular / React / Flutter | React / Vue / Svelte / RN ほか |
| 成熟度 | 言語仕様 v0.5、開発活発 | v0.9 系、早期プレビュー | v0.19 |

</div>

<div class="mt-4 text-sm opacity-70">
どれも「カタログ + スキーマ + 検証」と段階描画が前提。json-render はこのカタログ型を最速で試せる → 次のデモで
</div>

<!--
ストリーミングの単位のファクト(2026-07 検証済み):
- OpenUI Lang / json-render は LLM のトークンストリームを行単位でパースし、生成途中から描画できる
- A2UI も段階描画を明示的に設計に組み込んでいる(v0.9.1 仕様書):
  "Rendering can begin as soon as the root component is defined, with the client filling in or updating the rest of the tree progressively"
  フラットな隣接リストゆえ「コンポーネントは任意の順序で送ってよい」、未到着のデータパスは undefined として扱う
- ただし A2UI の適用単位は完成した JSON メッセージ。生成途中の JSON を半分だけ適用することはできず、
  エージェント側がメッセージ単位にバッファして逐次送信する。そのぶんトランスポート(A2A の SSE / AG-UI / WebSocket)に乗せやすい
- 口頭: 「行かメッセージか」の違いは、LLM の生出力を直接描画に繋ぐか、エージェントが刻んで送るかの設計思想の違い
-->

