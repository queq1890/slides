---
layout: section
---

<div class="section-num" style="--accent: #50fa7b">02</div>

# フローを 1 手ずつ

<div class="section-sub">実際に流れるものを見ていきます</div>

---
layout: default
---

# RP がやるのは、input を 1 つ足すだけ

<FlowStrip :current="1" />

<div class="cols">

<div>
<div class="where"><span class="i-lucide-app-window"/> RP の HTML</div>

```html
<form action="/signup" method="post">
  <input type="email" name="email"
         autocomplete="email">

  <input type="hidden" name="token"
         nonce="259c5eae-486d-4b0f..."
         autocomplete="email-verification-token">

  <button>登録</button>
</form>
```

</div>

<v-clicks>

- `nonce` はサーバーで毎回生成し、セッションに紐づけておきます。128 bit 以上のランダム値にします。
- ユーザーがメールアドレスを選ぶと、ブラウザが裏で検証を始めます
- 結果は `onsubmit` の**前**に hidden input へ入ります
- 未対応ブラウザでは空のまま送られるだけ。**従来のメール確認にそのまま戻れます**

</v-clicks>

</div>

<!--
https://github.com/WICG/email-verification （宣言的 API と hidden input を選んだ理由）
draft-02 §2.2 Session Binding（nonce は 128 bit 以上）
-->

---
layout: default
---

# Issuer は「ログイン中」とだけ伝えておく

<FlowStrip :current="2" />

<div class="cols">

<div>
<div class="where"><span class="i-lucide-server"/> Issuer（JS から）</div>

```js
navigator.login.setStatus('logged-in')
```

<div class="where mt-4"><span class="i-lucide-server"/> Issuer（HTTP レスポンスヘッダで）</div>

```http
Set-Login: logged-in
```

</div>

<v-clicks>

- FedCM の **Login Status API** をそのまま使います
- ブラウザは後の手順で、この状態を見て Issuer に問い合わせます
- 知らせるのは「ログインしている」ことだけで、アカウントの中身は教えません

</v-clicks>

</div>

---
layout: default
---

# どこに聞けばいいかは、DNS に書いてある

<FlowStrip :current="3" />

<div class="sub">Gmail の本物の値です（2026-09-28 取得）</div>

<div class="cols">

<div>
<div class="where"><span class="i-lucide-globe"/> $ dig TXT _email-verification.gmail.com</div>

```text
_email-verification.gmail.com TXT "iss=accounts.google.com"
```

<div class="where mt-4"><span class="i-lucide-server"/> accounts.google.com/.well-known/email-verification</div>

```json
{
  "issuer": "https://accounts.google.com",
  "issuance_endpoint": "https://accounts.google.com/gsi/...",
  "jwks_uri": "https://verifiablecredentials-pa.googleapis.com/...",
  "signing_alg_values_supported": ["EdDSA"]
}
```

</div>

<v-clicks>

- `@` の右側のドメインで TXT を引きます。レコードはちょうど 1 つでなければなりません。
- `iss=` の先が Issuer です。gmail.com → accounts.google.com のように、**別ドメインに委任**できます。
- DNS が偽装されない限り、ドメインの持ち主以外は Issuer を名乗れません
- 次にメタデータから、発行先と公開鍵の場所を取得します

</v-clicks>

</div>

<div v-click class="ask">draft-02 は <code>EdDSA</code> を禁止しています。本番と仕様は、まだずれています。</div>

<style>
.cols { --slidev-code-font-size: 11px; }
.cols > :first-child { flex: 0 0 33rem; }
</style>

<!--
draft-02 §3 Issuer Discovery / §3.3 Issuer Metadata / §10.3 Fully-Specified Algorithms
dig と curl で 2026-09-28 に取得した実データ
W3C 側は FedCM の well-known を使っており「単一ファイルに統一予定」と明記（最終形は未確定）
-->

---
layout: default
---

# 使い捨ての鍵で署名して、Cookie 付きで頼む

<FlowStrip :current="4" />

<div class="cols">

<div>
<div class="where"><span class="i-lucide-app-window"/> Browser → Issuer</div>

```http
POST /email-verification/issuance HTTP/1.1
Host: accounts.issuer.example
Cookie: session=...
Content-Type: application/json
Sec-Fetch-Dest: email-verification
Content-Digest: sha-256=:p8W2...:
Signature-Input: sig=(...);created=1692345600
Signature: sig=:MEQC...:
Signature-Key: sig=hwk;kty="OKP";
  crv="Ed25519";x="JrQL...";alg="Ed25519"

{"email":"user@example.com"}
```

</div>

<v-clicks>

- ブラウザは検証のたびに**新しい鍵ペア**を作ります
- `Cookie`：Issuer は普段のログインセッションで本人を確認します
- `Signature-Key`：公開鍵そのものを載せ、それで HTTP Message Signatures（RFC 9421）の署名をします
- `Sec-Fetch-Dest`：ブラウザしか付けられないヘッダ。ページの JS からは偽装できません。
- body は**メールアドレスだけ**。どの RP のためかは送りません。

</v-clicks>

</div>

<!--
draft-02 §2.4 / §4.1.5 Example Signed Request
Chrome 153 で request_token（JWT）形式からこの形式に変わった（破壊的変更）
https://developer.chrome.com/blog/email-verification-august-2026
-->

---
layout: default
---

# Issuer が返すのは「鍵に紐づいた確認トークン」

<FlowStrip :current="5" />

<div class="cols">

<div>
<div class="where"><span class="i-lucide-server"/> Issuer → Browser: EVT のヘッダとペイロード</div>

```json
{ "alg": "Ed25519", "kid": "2024-08-19",
  "typ": "evt+jwt" }
```

```json
{
  "iss": "https://issuer.example",
  "iat": 1724083200,
  "cnf": {
    "jwk": { "kty": "OKP", "crv": "Ed25519",
             "x": "JrQL...", "alg": "Ed25519" }
  },
  "email": "user@example.com",
  "email_verified": true
}
```

</div>

<v-clicks>

- EVT = Email Verification Token。形式は SD-JWT（鍵との紐づけ方まで決まった JWT の規格）を借りていて、末尾に `~` が付きます。
- `cnf.jwk` は、さっきブラウザが送った公開鍵です
- 「この鍵を持っている人が、このアドレスの持ち主」という意味になります
- **`aud` がありません**。どの RP に出すかを Issuer は知らないからです。

</v-clicks>

</div>

<!--
draft-02 §5.1 EVT
-->

---
layout: default
---

# ブラウザが「このサイト宛て」と一筆添える

<FlowStrip :current="6" />

<div class="cols">

<div>
<div class="where"><span class="i-lucide-app-window"/> Browser: KB-JWT のペイロード</div>

```json
{
  "aud": "https://rp.example",
  "nonce": "259c5eae-486d-4b0f...",
  "iat": 1724083260,
  "sd_hash": "X9yH0Ajrdm1Oij4t..."
}
```

<div class="where mt-4"><span class="i-lucide-app-window"/> hidden input に入る値</div>

```text
<EVT>~<KB-JWT>
```

</div>

<v-clicks>

- KB = Key Binding。EVT の `cnf.jwk` に対応する秘密鍵で署名します。
- `aud`：今いるページのオリジン。ページではなく、ブラウザが入れます。
- `nonce`：RP がフォームに埋めた値。使い回しを防ぎます。
- `sd_hash`：どの EVT とペアなのかを示すハッシュです

</v-clicks>

</div>

<!--
draft-02 §6 Key Binding
-->

---
layout: default
---

# RP は、全部自分で確かめる

<FlowStrip :current="7" />

<div class="cols">

<div>
<div class="where"><span class="i-lucide-server"/> RP サーバー</div>

<v-clicks>

1. `@` の右側で **自分でも** DNS を引き、`iss` と一致するか
2. Issuer の `jwks_uri` の鍵で、EVT の署名が正しいか
3. `email_verified` が `true` か、フォームの `email` と一致するか
4. `cnf.jwk` の鍵で、KB-JWT の署名が正しいか
5. `aud` が自分のオリジン、`nonce` がセッションの値か
6. `iat` が新しいか、`sd_hash` が EVT と一致するか

</v-clicks>

</div>

<div>

<div v-click class="note">
Issuer にアクセスするのは<b>公開鍵を取りに行くときだけ</b>です。キャッシュすれば、ユーザーごとの通信は発生しません。
</div>

</div>

</div>

<style>
.note { margin-top: 1.5rem; font-size: 0.9rem; color: #f8f8f2cc; }
</style>

<!--
draft-02 §5.3 EVT Verification / §6.5 KB-JWT Verification
-->
