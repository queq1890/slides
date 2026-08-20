---
layout: default
---

# polyfill は 2 つある。選ぶべきは？

<div class="mt-4">

| | **temporal-polyfill**<br>(FullCalendar 製) | **@js-temporal/polyfill**<br>(元 champions 発) |
| --- | --- | --- |
| 最新リリース | **1.0.4（2026-08）** | 0.5.1（2025-03 で停滞） |
| 準拠する仕様 | **Stage 4 後の 2026-08 版** | 2025-03 版（その後の変更が未反映） |
| サイズ（gzip） | **19.8 kB** | 45.3 kB |
| ネイティブ優先 | ✅ `/global` で自動フォールバック | ❌ グローバルを張らない設計 |
| 週間 DL | 284 万 | 182 万 |

</div>

<v-click>

<div class="mt-4 text-center">
現時点の推奨は <strong class="text-green-400">temporal-polyfill</strong> 一択
</div>

</v-click>

<!--
出典（2026-08-18 確認）:
- https://github.com/fullcalendar/temporal-polyfill（README 比較表「Spec date: August 2026」、意図的逸脱 2 件のみと主張）
- https://github.com/js-temporal/temporal-polyfill（0.5.1 は 2025-03-31。npm の description は今も「Stage 3 proposal」のまま）
- サイズ: bundlephobia API（min+gzip、同一手法）
- DL 数: api.npmjs.org 2026-08-09〜15
- 注意: temporal-polyfill のデフォルト entrypoint は iso8601/gregory カレンダーのみ。和暦などは /full/（23.4 kB gzip）
- test262 の「通過率 %」はどちらも公表数値なし
-->

---
layout: default
---

# 今日から使う推奨パターン

```ts
// エントリーポイントで 1 回だけ
import 'temporal-polyfill/global'

// あとはグローバルの Temporal をそのまま使う
// ネイティブ実装があるブラウザではネイティブが動き、
// Safari だけ polyfill で埋まる
const now = Temporal.Now.zonedDateTimeISO()
```

<div class="mt-4">

- **TypeScript 6.0+**: `"lib": ["esnext"]` で `Temporal` の型が入る
- **Safari が ship したら**: import を 1 行消すだけ。書いたコードはそのまま動く
- ライブラリ作者向けには peer dependency パターンや codemod も整備されている

</div>

<!--
出典: fullcalendar/temporal-polyfill README（/global のネイティブフォールバック動作、temporal-polyfill-codemod、fns/* peer dependency パターン）
TS <6.0 では import 'temporal-polyfill/types/global'
-->
