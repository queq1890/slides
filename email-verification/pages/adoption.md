---
layout: default
---

# 今、使えるのか

<div class="sub">実験段階です <span class="asof">2026-09 時点</span></div>

<table class="status">
<tbody>
<tr v-click><td>Chrome</td><td class="ok">Origin Trial 中</td><td>デスクトップ版の 150〜153 が対象（予定）。153 で発行リクエストの形式が変わった</td></tr>
<tr v-click><td>Edge</td><td class="ok">Origin Trial あり</td><td>ドラフトの実装状況より</td></tr>
<tr v-click><td>Issuer</td><td class="ok">Gmail</td><td>Origin Trial のローンチ Issuer。Hellō も試験実装</td></tr>
<tr v-click><td>Firefox</td><td class="ng">Defer</td><td>Mozilla の standards position</td></tr>
<tr v-click><td>Safari</td><td class="ng">表明なし</td><td>正式なシグナルはまだありません</td></tr>
<tr v-click><td>W3C TAG</td><td class="ng">Ambivalent</td><td>early review の結論</td></tr>
<tr v-click><td>IETF</td><td class="ng">個人ドラフト</td><td>どの WG で標準化するかは議論中</td></tr>
</tbody>
</table>

<style>
.status { font-size: 0.8rem; margin-top: 0.5rem; }
.status td:first-child { font-family: 'Fira Code', monospace; font-weight: 700; white-space: nowrap; }
.status td:nth-child(2) { white-space: nowrap; font-weight: 700; }
.status .ok { color: #50fa7b; }
.status .ng { color: #ffb86c; }
.status td:last-child { color: #f8f8f2cc; }
</style>

<!--
https://developer.chrome.com/blog/email-verification-protocol-origin-trial
https://developer.chrome.com/blog/email-verification-august-2026
draft-02 §12 Implementation Status（Edge / Gmail / Hellō）
https://github.com/w3ctag/design-reviews/issues/1169
153 以降に OT が延長されたかは未確認
-->

---
layout: default
---

# 導入するなら、RP がやること

<div class="sub">今の OTP の<b>前段</b>に置くのが現実的です</div>

<div class="cols">

<div>

<v-clicks>

- `nonce` をリクエストごとに生成し、セッションに紐づけて期限を付ける
- フォームに `autocomplete="email-verification-token"` の hidden input を足す
- サーバーで EVT と KB-JWT を検証する（SD-JWT のライブラリが使えます）
- DNS は、DNSSEC を検証するリゾルバで引く
- トークンが空なら、**今までの OTP にフォールバック**する

</v-clicks>

</div>

<div>

<div v-click class="ask">置き換えではなく、先に試す近道として。</div>

<div v-click class="note">
Origin Trial のトークン登録が必要です。仕様はまだ破壊的に変わるので、本番では小さく試すのがおすすめです。
</div>

</div>

</div>

<style>
.note { margin-top: 1.5rem; font-size: 0.9rem; color: #f8f8f2cc; }
</style>

---
layout: center
class: text-center
---

# メール確認に、もう 1 つの選択肢

<div class="cta">ブラウザが Issuer とサイトのあいだに立つことで、手間もフィッシングも名寄せも減らせます。</div>

<div class="pills">

<a class="pill" href="https://github.com/WICG/email-verification" target="_blank">
<span class="i-lucide-link"/>WICG/email-verification</a>

<a class="pill" href="https://datatracker.ietf.org/doc/draft-hardt-email-verification/" target="_blank">
<span class="i-lucide-link"/>draft-hardt-email-verification</a>

<a class="pill" href="https://developer.chrome.com/blog/email-verification-protocol-origin-trial" target="_blank">
<span class="i-lucide-link"/>Chrome Origin Trial のお知らせ</a>

<a class="pill" href="https://developer.chrome.com/blog/email-verification-august-2026" target="_blank">
<span class="i-lucide-link"/>2026 年 8 月のアップデート</a>

</div>

<style>
.cta { font-size: 1.05rem; color: #6272a4; margin-top: 0.75rem; }
.pills {
  display: flex; flex-wrap: wrap; gap: 0.6rem;
  justify-content: center; margin-top: 3rem;
}
.pill {
  display: flex; align-items: center; gap: 0.4rem;
  background: #282a36; border: 1px solid #44475a; border-radius: 999px;
  padding: 0.4rem 0.9rem;
  font-size: 0.78rem; color: #f8f8f2; text-decoration: none;
  transition: border-color 0.15s, color 0.15s;
}
.pill:hover { border-color: #bd93f9; color: #bd93f9; }
</style>
