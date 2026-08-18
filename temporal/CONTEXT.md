# CONTEXT

このディレクトリは、社内 FE チーム向け LT「Temporal 入門」の発表スライドを格納する。

## 発表の前提（確定事項・2026-08-18 決定）

| 項目 | 決定 |
|---|---|
| タイトル | Temporal 入門 |
| コアメッセージ | ① Date のつらさは Temporal が設計で根本解決する（API 設計を理解しよう）＋ ② ではいつ使えるのか（Baseline の構造と現実解） |
| 持ち時間 | 15〜20 分（前回 Generative UI 回を踏襲） |
| ボリューム | 25 枚前後 |
| スライドフレームワーク | Slidev + dracula テーマ（pnpm + GitHub Actions で GitHub Pages にデプロイ） |
| インタラクション | Slido なし。Q&A は Google Meet のコメント |
| デモ | スライド内実行（Slidev Monaco Runner + `temporal-polyfill`）。API キー不要なので GitHub Pages にそのまま公開する。締めに Chrome DevTools でネイティブ実演 |
| 聴衆のスタック | React / Next.js |

### 構成上の決定

- Date のつらみは **4 本柱に絞る**（ミュータブル / タイムゾーン / パース / 型の不在）。月 0 始まり・DST 等は「他にもまだある」1 枚の箇条書きに留める（2026-08-18 決定）
- Temporal セクションは**対比駆動**: 4 本柱それぞれに「Temporal ではこう書く」を 1 対 1 でぶつける。型の網羅はせず、2 系統マップ（Plain 系 / Exact-time 系）1 枚で俯瞰
- サポート状況セクションは**フル版**: Baseline の定義 → 現状マトリクス → なぜ時間がかかったか（仕様の巨大さ・V8 の Rust 実装）→ TC39 タイムライン
- npm パッケージセクションは**実践ガイド寄り**: polyfill 2 種比較が主役、既存ライブラリのスタンスは表 1 枚

## ⚠️ 発表前提の重要な修正（2026-08-18 の裏取りで判明）

当初の想定「複数ブラウザ実装済みだが **Chrome (V8) 待ち**で Baseline 未達、Stage 3 滞在中」は**二重に古い**。正しくは:

- Chrome は **144（2026-01-13）で出荷済み**。残る穴は **Safari 安定版のみ**（STP 249 には 2026-07-29 搭載）
- **2026-03 の TC39 第 113 回会合で Stage 4 到達済み**（掲載先は **ES2027**。ES2026〈2026-07-02 公開〉には入っていない。一部メディアの「ES2026 入り」表記は誤り — tc39/proposals の finished-proposals.md と ecma262 リリースタグで確認）
- 「Baseline は limited availability のまま」の部分だけは正しい（webstatus.dev API で 2026-08-18 確認）

→ セクション 03 は「Chrome 待ちで停滞」ではなく「**9 年がかりでゴール直前、残るは Safari のみ**」の物語で構成する。

## 裏取り済みファクト（2026-08-18 確認・出典付き）

### サポート状況

| 環境 | 状況 | 出典 |
|---|---|---|
| Firefox 139（2025-05-27）で出荷 | ✅ | https://spidermonkey.dev/blog/2025/04/11/shipping-temporal.html |
| Chrome 144（2026-01-13）で出荷、フラグ不要 | ✅ | https://developer.chrome.com/release-notes/144 |
| Edge 144（2026-01-15） | ✅ | webstatus.dev API |
| Safari 安定版 26.0〜26.6 は未出荷。STP 249（2026-07-29）で追加 | ⏳ | https://webkit.org/blog/18182/release-notes-for-safari-technology-preview-249/ |
| Node.js 26.0.0（2026-05-05、V8 14.6）でデフォルト有効。LTS 昇格は 2026-10 予定 | ✅ | https://github.com/nodejs/node/releases/tag/v26.0.0 |
| Deno 2.7（2026-02-25）でフラグ不要に | ✅ | https://deno.com/blog/v2.7 |
| Bun は未対応。**根拠は open issue のみ**（公式の対応表明は未確認）— この言い方が正確 | ❌ | https://github.com/oven-sh/bun/issues/15853 |
| TypeScript 6.0 beta で型定義対応（2026-02） | — | https://bloomberg.github.io/js-blog/post/temporal/ |

### Baseline

- Temporal の判定は **limited availability**（webstatus.dev API `"baseline":{"status":"limited"}`、2026-08-18 取得）: https://api.webstatus.dev/v1/features/temporal
- コアブラウザセットは Chrome（デスクトップ・Android）/ Edge / Firefox（デスクトップ・Android）/ Safari（macOS・iOS）の 4 ブラウザ 7 環境。newly = 全コアブラウザ最新安定版でサポート、widely = newly から 30 ヶ月: https://web.dev/baseline
- Safari の出荷 ETA は**公式情報なし**。「STP に入ったので近いはず」は推測なのでスライドでは断定しない

### V8 / 実装事情

- V8 は Rust 製 `temporal_rs`（Boa プロジェクト発）を採用。**Chromium で主要 JS API が Rust 実装されたのは初**。Boa / V8 / Kiesel が同一実装を共有し test262 100% パス: https://boajs.dev/blog/2025/09/24/temporal-release / https://bloomberg.github.io/js-blog/post/temporal/
- 仕様の巨大さの表現は「**Temporal の仕様は ECMA-402 全体より大きい**」「**test262 約 4,500 件（Date は 594 件）**」を使う。「仕様◯◯ページ」という具体的なページ数は**一次情報で確認できなかったため使わない** — この制約を守ること

### TC39

- 2017 提案開始 → **2021-03-10 Stage 3** → 2024 仕様ダイエット（`Temporal.Calendar` / `Temporal.TimeZone` クラスとカスタム化プロトコルを削除。低スペック端末のバイナリサイズ懸念が理由。issues #2853 / #2854）→ **2026-03 Stage 4**（第 113 回会合）: https://www.igalia.com/2026/03/13/Temporal-Reaches-Stage-4.html
- 掲載先は **ES2027**（finished-proposals.md の Expected Publication Year: 2027。「ES2026 入り」は誤りなのでスライドで使わない — この言い方が正確）
- Stage 4 の要件は「test262 完備＋出荷実装 2 つ以上＋ECMA-262 マージ承認」: https://tc39.es/process-document/

### polyfill / エコシステム（2026-08-18 確認）

- **推奨は `temporal-polyfill`（FullCalendar 製）v1.0.4**: 準拠スナップショット 2026-08（Stage 4 後）、gzip 19.8 kB、`import 'temporal-polyfill/global'` でネイティブ優先フォールバック内蔵、週間 DL 284 万: https://github.com/fullcalendar/temporal-polyfill
  - 注意: デフォルト entrypoint は iso8601/gregory カレンダーのみ。和暦等は `/full/`（23.4 kB gzip）
  - test262 の「通過率 %」は公表数値なし。「意図的逸脱 2 件を除き準拠」が公式の言い方
- **`@js-temporal/polyfill` は 0.5.1（2025-03-31）で停滞**: 2025-03 の仕様のままで Stage 4 直前の normative changes 未反映、gzip 45.3 kB、グローバルを張らない設計。「元 champions 発だが TC39 非公式」— この言い方が正確: https://github.com/js-temporal/temporal-polyfill
- 既存ライブラリ: moment は 2020 年に「maintenance mode」宣言＋Temporal 推奨（2026-08-17 に 6 年ぶりの Status 更新あり。AI エージェント起因で DL 3 倍超、ただし Temporal への言及はこの更新にはない）。date-fns は作者が Temporal 対応を blog で公言（v4 の TZ 対応は布石）。Day.js / Luxon は公式言及なし
- デモの import は説明の単純さを優先して ponyfill 形式（`import { Temporal } from 'temporal-polyfill'`）を使うが、実アプリの推奨は `/global`（スライドでもそう案内する）

## デモ（Monaco Runner）の技術ノート

- スライド内実行は Slidev の `{monaco-run}` を使用。依存は headmatter の `monacoRunAdditionalDeps: [temporal-polyfill]` で登録（headmatter 変更は dev サーバー再起動が必要）
- **既知の罠（2026-08-18 検証）**: Slidev のランナーは「import 文と次のステートメントの間」にコメント行があると import の書き換えに失敗し、`Failed to resolve module specifier` になる。デモコードでは import 直後に必ず実ステートメントを置き、コメントはその後に書く。**ライブ編集時もこの位置にコメントを書かないこと**
- `{autorun:false}` を付けて「Run を押して見せる」演出にしている

## 用語集

### Temporal
TC39 で標準化された JavaScript の新しい日時 API。`Date` を置き換えるのではなく**併存**する（`Date` の削除は Web 互換性上不可能）。グローバルオブジェクト `Temporal` の下に型が生える。

### Wall-clock 系 / Exact-time 系
本スライドでの Temporal 型の 2 分類。Wall-clock 系（`PlainDate` / `PlainTime` / `PlainDateTime` / `PlainYearMonth` / `PlainMonthDay`）はタイムゾーンを持たない「見た目の日時」、Exact-time 系（`Instant` / `ZonedDateTime`）は地球上の一意な瞬間を指す。

### RFC 9557
ISO 8601 / RFC 3339 を拡張し、`2026-08-18T09:00+09:00[Asia/Tokyo]` のようにタイムゾーン名サフィックスを定義した標準（2024-04）。Temporal の文字列表現の基盤。

### Baseline
web.dev が定義するブラウザ互換性の指標。limited / newly / widely の 3 段階。本発表の後半の山場はこの仕組みの説明を含む。
