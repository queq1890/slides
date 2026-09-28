---
layout: section
---

<div class="section-num" style="--accent: #ffb86c">03</div>

# 何が守られて、何が守られないか

<div class="section-sub">うれしいことと、割り切っていること</div>

---
layout: default
---

# Issuer は、どのサイトで使われたかを知らない

<div class="sub">三者モデルにした一番の理由です</div>

<div class="cols">

<div>
<div class="where"><span class="i-lucide-server"/> Issuer が受け取るもの</div>

```json
{ "email": "user@example.com" }
```

<div class="where mt-4"><span class="i-lucide-app-window"/> RP の名前が出てくるのはここだけ（KB-JWT）</div>

```json
{ "aud": "https://rp.example", "nonce": "..." }
```

</div>

<v-clicks>

- RP 宛ての一筆（KB-JWT）は、ブラウザが**Issuer に見えないところで**付けます
- ソーシャルログインでは、IdP は `client_id` でどのサイトかを必ず知ります
- ただし「いつ検証されたか」は Issuer に見えるので、時刻から推測される余地は残ります

</v-clicks>

</div>

<!--
draft-02 §9.4 Issuer Knowledge / §9.2 Timing Correlation by Email Providers / §11.2 Why the Three-Party Model?
-->

---
layout: default
---

# 偽サイトで取られても、本物では使えない

<div class="sub">OTP との一番大きな違いです</div>

<div class="cols">

<div class="case bad">
<div class="where">OTP の場合</div>

```text
偽サイト  「コードを入力してください」
ユーザー   482913 を入力
攻撃者     本物のサイトに 482913 を中継
          ✓ 通ってしまう
```

</div>

<div class="case good">
<div class="where">EVP の場合</div>

```text
偽サイト   トークンを受け取る
          aud = https://evil.example
攻撃者     本物のサイトに中継
          ✕ aud が違う → 拒否
```

</div>

</div>

<v-clicks>

- `aud` はブラウザがアドレスバーのオリジンから入れるので、偽サイトは本物を名乗れません
- ページの JS から Issuer に頼んでも拒否されます。`Sec-Fetch-Dest: email-verification` はブラウザしか付けられないからです。

</v-clicks>

<style>
.case { border-radius: 0.6rem; padding: 0.6rem 0.9rem 0.2rem; }
.bad { background: #331e1e; }
.good { background: #1e3325; }
</style>

<!--
draft-02 §6.5（aud は RP のオリジンと一致すること）/ §8.2 Invalid Sec-Fetch-Dest Header
-->

---
layout: default
---

# サイトごとに別のアドレスを渡せる

<div class="sub">対応する Issuer なら、発行リクエストに 1 行足すだけです</div>

<div class="cols">

<div>
<div class="where"><span class="i-lucide-app-window"/> Browser → Issuer</div>

```json
{ "email": "user@example.com", "private_email": true }
```

<div class="where mt-4"><span class="i-lucide-server"/> 返ってくる EVT（抜粋）</div>

```json
{
  "email": "x7k2p9@privaterelay.issuer.example",
  "email_verified": true,
  "is_private_email": true
}
```

</div>

<v-clicks>

- 本当のアドレスの代わりに、転送用のアドレスが発行されます
- RP をまたいだ**名寄せ**ができなくなります
- 対応しているかは、メタデータの `private_email_supported` でわかります
- 引き換えに、転送を担う Issuer にはメールのやり取りが見えます

</v-clicks>

</div>

<!--
draft-02 §7 Private Email Addresses / §9.4（転送するメールは Issuer に見える）
転送先アドレスの値は説明用のダミー
-->

---
layout: default
---

# 仕様が認めている弱点

<v-clicks>

- **受信できることは保証しない**：証明できるのは「Issuer にログインしている」ことまで。メールが届くかはわかりません。explainer（README）は「この点では OTP より弱い」と明記しています。
- **RP 側の DNS を偽装されると破られる**：ブラウザ側だけの偽装は、RP が自分で DNS を引き直すので防げます。RP 側は「設計上の残存リスク」とされていて、RP は DNSSEC を検証すべき（SHOULD）です。
- **ログイン状態は RP に漏れる**：トークンが返ってきたか、エラーになったかで、Issuer にログインしているかどうかが RP にわかります

</v-clicks>

<div v-click class="ask">「メールを 1 通送る」ことの代わりには、完全にはなりません。</div>

<!--
README "this proposal is weaker than OTPs"
draft-02 §10.4 DNS Delegation / §9.5 RP Knowledge
-->

---
layout: default
---

# まだ決まっていないこと

<div class="sub">GitHub の issue とドラフトで議論が続いています <span class="asof">2026-09 時点</span></div>

<div class="open">

<v-clicks>

- well-known ファイルを FedCM のものと **1 つにまとめる**か
- `nonce` や結果の値を、ページのスクリプトから隠すべきか
- iframe の中や Permissions Policy をどう扱うか
- Issuer からログアウトしている時にどうするか（passkey で再ログインさせる案）
- 確認のプロンプトは本当に必要か
- `email` だけでなく `username` にも広げるか

</v-clicks>

</div>

<style>
.open ul { font-size: 0.95rem; }
</style>

<!--
https://github.com/WICG/email-verification （README の Open Questions / Alternatives Considered）
-->
