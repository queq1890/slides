import { defineCatalog } from "@json-render/core";
import { schema } from "@json-render/react/schema";
import { z } from "zod";

// LT デモ用のコンポーネントカタログ。
// ここに定義したものだけが LLM の出力候補になり、カタログ外は描画されない。
export const catalog = defineCatalog(schema, {
  components: {
    Card: {
      description: "見出し付きのカードコンテナ。他のコンポーネントを子に持てる",
      props: z.object({
        title: z.string(),
      }),
      // プロンプトの AVAILABLE COMPONENTS に [accepts children] を付け、
      // 「子を持てるのは Card」であることを LLM に明示する
      slots: ["default"],
    },
    Stat: {
      description: "数値のハイライト表示(KPI など)",
      props: z.object({
        label: z.string(),
        value: z.string(),
      }),
    },
    Table: {
      description: "表形式のデータ表示",
      props: z.object({
        headers: z.array(z.string()),
        rows: z.array(z.array(z.string())),
      }),
    },
    Button: {
      description: "アクションを実行するボタン",
      props: z.object({
        label: z.string(),
      }),
    },
  },
  actions: {},
});
