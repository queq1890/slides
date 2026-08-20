---
layout: default
---

# つらみ①：ミュータブル

`set*` メソッドがオブジェクトを**破壊的に**書き換える

```js
const meeting = new Date('2026-08-18T10:00:00')

function reminderOf(date) {
  date.setDate(date.getDate() - 1) // 引数を直接書き換えてしまう
  return date
}

const reminder = reminderOf(meeting)
console.log(meeting) // 😱 meeting まで 8/17 になっている
```

<div class="mt-4 text-sm opacity-70">
関数に Date を渡すたびに、書き換えられていないかを疑う必要がある
</div>

---
layout: default
---

# つらみ②：タイムゾーンを扱えない

Date の実体は**エポックミリ秒の数値**が 1 つだけ

```js
const meeting = new Date('2026-08-18T09:00:00+09:00')
meeting.getTime() // 1787011200000 ← Date が実際に持っているのはこの数値だけ
```

<div class="grid grid-cols-2 gap-6 mt-4">

<div class="pain">

### 表現できるのは 2 つだけ

- 実行環境の**ローカル**タイムゾーン
- **UTC**（`getUTC*` メソッド）

</div>

<div class="pain">

### 表現できないもの

- ローカルでも UTC でもない**任意のタイムゾーンの日時**（ニューヨークの 8/18 9:00 など）
- フォーマットは `Intl` で可能でも、**算術**（1 日後・比較）は不可能

</div>

</div>

<style>
.pain { background: #331e1e; border-radius: 0.6rem; padding: 0.8rem 1.2rem; }
.pain h3 { color: #ff5555; font-size: 1rem; }
</style>

---
layout: default
---

# つらみ③：文字列パースが不安定

区切り文字が違うだけで、**タイムゾーンの解釈が変わる**

```js
// 日本時間（UTC+9）の環境で実行すると…

new Date('2026-08-18').getHours()  // 9  ← UTC の 0 時として解釈
new Date('2026/08/18').getHours()  // 0  ← ローカルの 0 時として解釈
```

<v-click>

```js
// おまけ：パースに失敗しても throw しない
new Date('not a date') // Invalid Date（気づかず後段まで流れる）
```

</v-click>

<div class="mt-4 text-sm opacity-70">
仕様が保証するのは ISO 8601 形式のみ。それ以外は実装依存のパース
</div>

---
layout: default
---

# つらみ④：日付だけの型、時刻だけの型がない

Date は常に日付＋時刻＋タイムゾーンのフルセット

<div class="grid grid-cols-2 gap-6 mt-6">

<div class="pain">

### 誕生日を Date で持つと

`new Date('1990-08-18')` は UTC 深夜 0 時のタイムスタンプ

UTC より西のタイムゾーンで表示すると **8/17 にずれる**（off-by-one）

</div>

<div class="pain">

### 営業時間 10:00 を持つと

意味のないダミーの日付を抱き合わせるしかない

`new Date(0, 0, 0, 10, 0)` のようなハックが生まれる

</div>

</div>

<style>
.pain { background: #331e1e; border-radius: 0.6rem; padding: 0.8rem 1.2rem; }
.pain h3 { color: #ff5555; font-size: 1rem; }
</style>

---
layout: default
---

# 他にもまだある

<div class="mt-4">

- 月が **0 始まり**（`new Date(2026, 8, 18)` は 9 月 18 日）
- `getYear()` は **1900 を引いた値**を返す（`getFullYear()` との二重化）
- うるう秒・夏時間（DST）境界の計算バグの温床
- グレゴリオ暦以外（和暦・イスラム暦など）を扱えない

</div>
