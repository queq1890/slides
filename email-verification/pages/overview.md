---
layout: section
---

<div class="section-num" style="--accent: #8be9fd">01</div>

# 登場人物と全体像

<div class="section-sub">メールは 1 通も飛びません</div>

---
layout: default
---

# 登場人物は 4 つ

<div class="sub">主役はブラウザです</div>

<div class="actors">
  <div v-click class="actor" style="--c: #ff79c6">
    <div class="name">RP</div>
    <div class="desc">メールアドレスを確認したいサイト。W3C 側の仕様では Verifier とも呼びます</div>
  </div>
  <div v-click class="actor" style="--c: #50fa7b">
    <div class="name">Browser</div>
    <div class="desc">Issuer からトークンをもらい、RP 向けに<b>自分で署名し直して</b>渡す</div>
  </div>
  <div v-click class="actor" style="--c: #8be9fd">
    <div class="name">Issuer</div>
    <div class="desc">「このアドレスはこの人のもの」と署名する。Gmail なら accounts.google.com</div>
  </div>
  <div v-click class="actor" style="--c: #ffb86c">
    <div class="name">DNS</div>
    <div class="desc">メールドメインが「確認はこの Issuer に任せる」と宣言する場所</div>
  </div>
</div>

<div v-click class="ask">RP と Issuer は、ユーザーのことで直接話しません。</div>

<style>
.actors { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-top: 1.5rem; }
.actor {
  border: 1px solid var(--c); border-radius: 0.6rem; padding: 0.9rem 1rem;
  background: #282a36;
}
.name { font-family: 'Fira Code', monospace; font-weight: 700; color: var(--c); font-size: 1.1rem; }
.desc { font-size: 0.8rem; margin-top: 0.5rem; line-height: 1.5; }
</style>

---
layout: default
clicks: 9
---

# 全体の流れ

<div class="sub">1 回のフォーム送信の裏で起きていること</div>

<FlowDiagram />

---
layout: default
---

# 仕様は 2 つに分かれています

<div class="sub">W3C TAG のレビューを受けて、ブラウザの外と内で分割されました</div>

<div class="cols">

<div class="spec">
<div class="where"><span class="i-lucide-globe"/> Browser ↔ Issuer の HTTP</div>

### Email Verification Protocol

- IETF の個人ドラフト `draft-hardt-email-verification-02`（2026-08）
- DNS による Issuer 探し、発行リクエスト、トークンの形式
- ワーキンググループには未採択。IETF 126 の DISPATCH で「どこで標準化するか」を議論

</div>

<div class="spec">
<div class="where"><span class="i-lucide-app-window"/> RP ↔ Browser の HTML/JS</div>

### Email Verification API

- WICG の Community Group Draft
- `autocomplete` 属性と `nonce` による宣言的な API
- 著者は同じ 2 人：Sam Goto（Google）と Dick Hardt（Hellō）

</div>

</div>

<div v-click class="ask">この発表では、まとめて「EVP」と呼びます。</div>

<style>
.spec { background: #282a36; border: 1px solid #44475a; border-radius: 0.6rem; padding: 0.9rem 1.2rem; }
.spec h3 { font-size: 1.05rem; margin-bottom: 0.5rem; }
.spec ul { font-size: 0.85rem; }
</style>

<!--
https://datatracker.ietf.org/doc/draft-hardt-email-verification/
https://wicg.github.io/email-verification/
https://datatracker.ietf.org/meeting/126/materials/slides-126-dispatch-email-verification-protocol-evp-01
-->
