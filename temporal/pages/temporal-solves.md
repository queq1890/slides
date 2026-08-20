---
layout: default
---

# Temporal の全体像：型は 2 系統

表したい時間の意味ごとに、**専用の型**を使い分ける設計

<div class="grid grid-cols-2 gap-6 mt-4">

<div class="cat">

### 🕰️ Wall-clock 系（Plain*）

カレンダーや時計に書いてある見た目の日時。タイムゾーンを持たない

- `Temporal.PlainDate`：日付だけ（誕生日）
- `Temporal.PlainTime`：時刻だけ（営業時間）
- `Temporal.PlainDateTime`：日付＋時刻
- `Temporal.PlainYearMonth` / `PlainMonthDay`

</div>

<div class="cat cat-hl">

### 🌍 Exact-time 系

地球上の一意な瞬間を指す

- `Temporal.Instant`：エポックからの経過時間（タイムスタンプ）
- `Temporal.ZonedDateTime`：瞬間＋タイムゾーン＋カレンダー

</div>

</div>

<div class="mt-4 text-sm opacity-70">
ほかに期間を表す <code>Temporal.Duration</code> と、現在時刻の取得口 <code>Temporal.Now</code>。すべてイミュータブル
</div>

<style>
.cat { background: #282a36; border: 1px solid #44475a; border-radius: 0.6rem; padding: 0.8rem 1.4rem; }
.cat-hl { border-color: #50fa7b; }
.cat h3 { color: #f8f8f2; font-size: 1rem; }
.cat li { font-size: 0.85rem; }
</style>

---
layout: default
---

# 解決①：すべてイミュータブル

操作は**必ず新しいオブジェクトを返す**。渡した値は壊れない

<div class="grid grid-cols-2 gap-4 mt-4">

<div class="pain">

### 😩 Date

```js
const meeting = new Date('2026-08-18T10:00:00')
meeting.setDate(meeting.getDate() - 1)
// meeting 自体が変わってしまった
```

</div>

<div class="gain">

### ✨ Temporal

```js
const meeting =
  Temporal.PlainDateTime.from('2026-08-18T10:00')
const reminder = meeting.subtract({ days: 1 })
// meeting は 8/18 のまま。reminder は 8/17
```

</div>

</div>

<div class="mt-4 text-sm opacity-70">
そもそもセッターが存在しない。<code>with({ day: 1 })</code> も新しい値を返す
</div>

<style>
.pain, .gain { border-radius: 0.6rem; padding: 0.6rem 1rem; }
.pain { background: #331e1e; } .pain h3 { color: #ff5555; font-size: 0.95rem; }
.gain { background: #1e3226; } .gain h3 { color: #50fa7b; font-size: 0.95rem; }
</style>

---
layout: default
---

# 解決②：タイムゾーンのサポート

`ZonedDateTime` が瞬間とタイムゾーンを丸ごと持ち運ぶ

```js
// ニューヨークの 8/18 朝 9 時の会議は…
const nyMeeting = Temporal.ZonedDateTime.from(
  '2026-08-18T09:00[America/New_York]'
)

// 東京では何時？ — 変換も算術も型が面倒を見る
nyMeeting.withTimeZone('Asia/Tokyo').toString()
// => '2026-08-18T22:00:00+09:00[Asia/Tokyo]'

nyMeeting.add({ days: 1 }) // サマータイムの境界も正しく処理
```

<div class="mt-4 text-sm opacity-70">
タイムゾーン名（IANA）が文字列表現に含まれる記法は [RFC 9557](https://www.rfc-editor.org/rfc/rfc9557) として標準化された
</div>

<!--
検算: 2026-08-18 の NY は EDT (UTC-4)。09:00 EDT = 13:00 UTC = 22:00 JST ✓
RFC 9557 (2024-04) は ISO 8601 / RFC 3339 の拡張で [Asia/Tokyo] のようなサフィックスを定義
-->

---
layout: default
---

# 解決③：パースは厳密に

受理するのは **ISO 8601 / RFC 9557 形式のみ**。曖昧な入力は throw

<div class="grid grid-cols-2 gap-4 mt-4">

<div class="pain">

### 😩 Date

```js
new Date('2026-08-18') // UTC 解釈
new Date('2026/08/18') // ローカル解釈
new Date('not a date') // Invalid Date
```

黙ってそれらしく解釈する

</div>

<div class="gain">

### ✨ Temporal

```js
Temporal.PlainDate.from('2026-08-18')
// => 2026-08-18

Temporal.PlainDate.from('2026/08/18')
// => RangeError を throw
```

壊れた入力がその場で止まる

</div>

</div>

<style>
.pain, .gain { border-radius: 0.6rem; padding: 0.6rem 1rem; }
.pain { background: #331e1e; } .pain h3 { color: #ff5555; font-size: 0.95rem; }
.gain { background: #1e3226; } .gain h3 { color: #50fa7b; font-size: 0.95rem; }
</style>

---
layout: default
---

# 解決④：用途に合った型を選べる

持ちたい情報だけを持つ型があるから、**表現のズレが起きない**

```js
// 誕生日 — タイムゾーンも時刻も無関係
const birthday = Temporal.PlainDate.from('1990-08-18')
birthday.day          // 18（どの環境で実行しても 17 にならない）

// 営業時間 — ダミーの日付は不要
const opensAt = Temporal.PlainTime.from('10:00')

// 年齢計算・期間は Duration で
const age = birthday.until(Temporal.Now.plainDateISO(), {
  largestUnit: 'years',
})
```

