---
layout: default
---

# デモ①：タイムゾーン変換を触ってみる

スライド内でそのまま編集して実行できる（`temporal-polyfill` 使用）

```ts {monaco-run} {autorun:false}
import { Temporal } from 'temporal-polyfill'

const nyMeeting = Temporal.ZonedDateTime.from(
  '2026-08-18T09:00[America/New_York]'
)

// ニューヨークの朝 9 時の会議は、東京では何時？
console.log(nyMeeting.withTimeZone('Asia/Tokyo').toString())

// イミュータブル: add しても元の値は変わらない
const nextDay = nyMeeting.add({ days: 1 })
console.log(nyMeeting.day, '→', nextDay.day)
```

<!--
注意: Slidev の runner は「import 文と次のステートメントの間」にコメントがあると
import の書き換えに失敗する。ライブ編集時もこの位置にコメントを書かないこと
-->

---
layout: default
---

```ts {monaco-run} {autorun:false}
import { Temporal } from 'temporal-polyfill'

const birthday = Temporal.PlainDate.from('1990-08-18')

// 誕生日は PlainDate — どの環境で実行しても 18 のまま
console.log('日付:', birthday.day)

// 年齢は Duration で
const today = Temporal.PlainDate.from('2026-08-18')
const age = birthday.until(today, { largestUnit: 'years' })
console.log('年齢:', age.years)

// 曖昧な文字列は受け付けない（コメントを外して実行）
// console.log(Temporal.PlainDate.from('1990/08/18'))
```
