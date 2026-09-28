---
layout: section
---

<div class="section-num" style="--accent: #bd93f9">04</div>

# 周りの技術との関係

<div class="section-sub">置き換えるもの、組み合わせるもの</div>

---
layout: default
---

# メールアドレスの確認方法を並べると

<table class="vs">
<thead>
<tr><th></th><th>OTP / マジックリンク</th><th>ソーシャルログイン</th><th class="evp">EVP</th></tr>
</thead>
<tbody>
<tr v-click><td>ユーザーの操作</td><td>メールを開いてコピー</td><td>ボタン → 同意画面</td><td class="evp">アドレスを選ぶだけ</td></tr>
<tr v-click><td>RP の準備</td><td>メール送信の仕組み</td><td>IdP ごとに登録と統合</td><td class="evp">input 1 つ + 検証</td></tr>
<tr v-click><td>提供側が RP を知るか</td><td>メール本文から知りうる</td><td>知る（<code>client_id</code>）</td><td class="evp">知らない</td></tr>
<tr v-click><td>フィッシング中継</td><td>通ってしまう</td><td>防げる</td><td class="evp">防げる（<code>aud</code>）</td></tr>
<tr v-click><td>証明できること</td><td>受信できること</td><td>IdP のアカウント（ログインも兼ねる）</td><td class="evp">アドレスを管理していること</td></tr>
</tbody>
</table>

<div v-click class="ask">EVP はログインの仕組みではありません。「このアドレスは本人のもの」だけを答えます。</div>

<style>
.vs { margin-top: 1rem; font-size: 0.8rem; }
.vs th { color: #6272a4; font-weight: 700; }
.vs td:first-child { color: #6272a4; white-space: nowrap; }
.vs .evp { color: #50fa7b; }
</style>

---
layout: default
---

# 競合ではなく、部品を借りている

<div class="rels">

<div v-click class="rel">
<div class="name">FedCM</div>
<div class="desc">Login Status API とアカウント選択の UI を<b>再利用</b>します。ただし RP と IdP の個別統合は不要で、IdP は RP を知りません。</div>
</div>

<div v-click class="rel">
<div class="name">OIDC</div>
<div class="desc"><code>iss</code> の定義をそろえています。ソーシャルログインでも検証済みメールは取れますが、IdP に RP が見えて、個別統合も必要です。</div>
</div>

<div v-click class="rel">
<div class="name">passkeys</div>
<div class="desc">組み合わせるものです。EVP でアドレスを確認してから passkey を作る、という順につながります。Issuer 自身へのログインに passkey を使う案もあります。</div>
</div>

<div v-click class="rel">
<div class="name">Digital Credentials API</div>
<div class="desc">将来つながる可能性がある、と言及されているだけです。</div>
</div>

</div>

<style>
.rels { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1.5rem; }
.rel { background: #282a36; border: 1px solid #44475a; border-radius: 0.6rem; padding: 0.8rem 1rem; }
.name { font-family: 'Fira Code', monospace; font-weight: 700; color: #bd93f9; }
.desc { font-size: 0.82rem; margin-top: 0.4rem; line-height: 1.55; }
</style>

<!--
https://github.com/WICG/email-verification （README の FedCM / passkeys / Digital Credentials との関係）
-->
