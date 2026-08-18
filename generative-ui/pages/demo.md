---
layout: default
---

# デモの構成

<div class="mt-6 grid grid-cols-3 gap-4 text-center text-sm">

<div class="box">💬 <strong>Next.js</strong><br>チャット入力 + ストリーミング受信</div>
<div class="box">🤖 <strong>Claude API</strong><br>カタログ制約付きで JSON Patch を 1 行ずつ生成</div>
<div class="box">📦 <strong>json-render</strong><br>Patch を逐次適用 → React コンポーネント</div>

</div>

<div class="mt-8 text-sm opacity-70">

1. カタログ(コンポーネント定義)がプロンプトに変換される様子
2. JSON Patch が 1 行ずつ届き、UI が段階的に組み上がる様子
3. カタログ外のコンポーネントを頼んでも壊れないこと

</div>

<style>
.box { background: #282a36; border: 1px solid #44475a; border-radius: 0.5rem; padding: 1rem; }
</style>

---
layout: default
---

# Demo ①：カタログを定義する — catalog.ts

```ts {1|5-6|all}
export const catalog = defineCatalog(schema, {
  components: {
    Card:  { description: "見出し付きのカードコンテナ。他のコンポーネントを子に持てる",
             props: z.object({ title: z.string() }) },
    Stat:  { description: "数値のハイライト表示(KPI など)",
             props: z.object({ label: z.string(), value: z.string() }) },
    Table: { description: "表形式のデータ表示",
             props: z.object({ headers: z.array(z.string()),
                               rows: z.array(z.array(z.string())) }) },
    Button: { description: "アクションを実行するボタン",
              props: z.object({ label: z.string() }) },
  },
});
```

<div class="mt-1 text-xs opacity-50">デモ実装 lib/catalog.ts より(簡略化)</div>

<div class="mt-2 text-sm">

<div>① カタログがすべての起点。このデモの UI 語彙はこのファイルで完結する</div>
<div v-click="1">② 各部品は <strong>description</strong>(LLM に読ませる説明)と <strong>props</strong>(Zod スキーマ)のペアで定義する</div>
<div v-click="2">③ ここに定義した 4 つだけが LLM の出力候補になる。カタログ外のコンポーネントは「存在しない」</div>

</div>

---
layout: default
---

# Demo ②：カタログがプロンプトになる — route.ts

```ts {10|14|all}
import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { catalog } from "@/lib/catalog";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const result = streamText({
    model: anthropic("claude-sonnet-5"),
    system: catalog.prompt(),
    prompt,
  });

  return result.toTextStreamResponse();
}
```

<div class="mt-1 text-xs opacity-50">デモ実装 app/api/generate/route.ts(ほぼ全文)</div>

<div class="mt-2 text-sm">

<div>① <code>catalog.prompt()</code> がカタログ定義からシステムプロンプトを自動生成 —「この部品を JSON Patch で出力せよ」という指示になる</div>
<div v-click="1">② LLM の出力(1 行 = 1 Patch の JSONL)を、加工せずそのままストリーミングで返す</div>
<div v-click="2">③ サーバーはこれで全部。UI の知識はカタログに集約されている</div>

</div>

---
layout: default
---

# Demo ③：Patch を逐次適用して描画 — page.tsx

```tsx {2-9|13|all}
// streamSpec(): チャンクを push し、spec が育つたびに yield
const compiler = createSpecStreamCompiler<Spec>({ elements: {} });
while (!done) {
  const { result } = compiler.push(decoder.decode(value));
  yield result;
}

// generate(): yield された spec を setSpec するたびに UI が育つ
for await (const partial of streamSpec(prompt, signal)) setSpec(partial);

return (
  <JSONUIProvider registry={registry}>
    <Renderer spec={spec} registry={registry} />
  </JSONUIProvider>
);
```

<div class="mt-1 text-xs opacity-50">デモ実装 app/page.tsx より抜粋(簡略化)</div>

<div class="mt-2 text-sm">

<div>① チャンクを <code>push</code> すると、<strong>完成した Patch 行だけ</strong>が spec に適用される。yield された spec を <code>setSpec</code> するたびに UI が育つ</div>
<div v-click="1">② <code>Renderer</code> が spec を registry(カタログ各部品の React 実装)で描画。カタログ外の type は描画しない</div>
<div v-click="2">③ つまり、壊れた中間状態が画面に出ない — ここをデモで確かめる(初期値 <code>{ elements: {} }</code> は、最初の Patch 直後に elements 未定義で描画が落ちるのを防ぐ保険)</div>

</div>

---
layout: center
class: text-center
---

# 🎬 Live Demo

<div class="mt-4 opacity-70">
pnpm --filter demo dev
</div>

---
layout: default
---

# デモで見せたポイント

<div class="grid grid-cols-2 gap-6 mt-4 items-center">

<div>

- ✅ カタログ定義(Zod)が、そのままプロンプトと型安全性の源になる
- ✅ ストリーミング中は、完成した Patch 行だけが適用される(壊れた中間状態が出ない)
- ✅ LLM がカタログ外のコンポーネントを出そうとしても、描画されない

</div>

<img src="/demo-screenshot.png" class="rounded-lg border border-gray-600 shadow-lg" alt="デモアプリのレンダリング結果" />

</div>
