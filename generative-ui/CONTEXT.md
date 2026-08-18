# CONTEXT

このリポジトリは、社内 FE チーム向け LT「Generative UI」の発表スライドとライブデモを格納する。

## 発表の前提(確定事項)

| 項目 | 決定 |
|---|---|
| 持ち時間 | 15〜20 分 |
| ボリューム | 25 枚前後(参考元 [sun-choma/febi-view-transition-api-26.07.08](https://github.com/sun-choma/febi-view-transition-api-26.07.08) と同等) |
| スライドフレームワーク | Slidev(参考元と同じ。pnpm + GitHub Actions で GitHub Pages にデプロイ) |
| インタラクション | Slido は使わない。アイスブレイク・クイズのスライドは廃止(2026-07-22)。Q&A は Google Meet のコメントで行う |
| デモ | ライブのみ(ローカル実行)。GitHub Pages は静的ホスティングのため LLM API キーを伴うデモは公開しない |
| 聴衆のスタック | React / Next.js |

## 用語集

### レスポンス
LLM がプロンプトに対して返すもの。本リポジトリの正準語は**「レスポンス」**であり、スライド・ドキュメント内で「応答」とは表記しない(2026-07-22 決定。「レスポンスとしての UI」のようなキーフレーズを含め全箇所で統一)。

### Generative UI
LLM がチャットのレスポンスとしてテキストではなく **UI そのものを生成・返却**する仕組み。v0 のような「開発時のコード生成」とは区別する(こちらはランタイム生成)。

### OpenUI
**Thesys 社の [thesysdev/openui](https://github.com/thesysdev/openui)** を指す。Generative UI のオープン標準(MIT、2026-03 公開)。
- W3C Open UI(HTML 標準仕様策定)、wandb/openui(プロトタイピングツール)とは**別物**。混同注意。
- 構成: コンポーネントライブラリ(Zod スキーマ)/ プロンプトジェネレーター / パーサー / レンダラー
- 出力は **OpenUI Lang**(独自言語、仕様 v0.5): 1 行 = 1 文、位置引数は Zod キー順。トークン効率は公式ベンチで JSON 比「最大 67% 削減(7 シナリオ合計 約 52%)」— この言い方が正確
- npm は `@openuidev` スコープ(react-lang 等)
- 参考記事: https://azukiazusa.dev/blog/openui-framework-for-generative-ui/

### A2UI
Google が 2025-12 に発表した agent→UI プロトコル。事前定義した**信頼済み UI カタログ**の範囲で、エージェントに宣言的 JSON(createSurface / updateComponents / updateDataModel など)を生成させる。
- リポジトリは **[a2ui-project/a2ui](https://github.com/a2ui-project/a2ui) に移管済み**(旧 google/A2UI は 301 リダイレクト)。v0.9 系、早期プレビュー
- **「A2A エコシステムの一部」は不正確**: トランスポート非依存の独立プロトコルで、A2A は公式バインディングの一つ(AG-UI や WebSocket でも運べる)
- レンダラーは Lit / Angular / React / Flutter / Markdown

### json-render
Vercel Labs のライブラリ。A2UI と同じ「JSON カタログ型」アプローチを React で手軽に実装できる。**ライブデモはこれを採用**(Next.js + json-render)。

### Server Driven UI (SDUI)
サーバーが UI をデータ(JSON など)で記述し、クライアントがコンポーネントカタログからレンダリングする従来手法。本 LT では「JSON を書く主体がサーバーから LLM に変わった」という Generative UI の系譜上の先祖として位置づける。
- 事例のファクト(2026-07 検証済み): Airbnb Ghost Platform は検索・リスティング・チェックアウトの大半を SDUI 化 / **Lyft は Bikes & Scooters アプリで protobuf 配信**(「ドライバーアプリを JSON で」は誤り)/ Shopify checkout 拡張は remote-ui によるサンドボックス + Shopify 定義コンポーネント制約
- Claude の実例は「地図」ではなく「**チャート・図・ビジュアライゼーション**」(2026-03 公式発表)と書くのが正確
