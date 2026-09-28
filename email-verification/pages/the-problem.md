---
layout: default
---

# 確認コードを送信しました

<div class="mock">
  <div class="mock-title">メールアドレスの確認</div>
  <div class="mock-text">user@gmail.com に届いた 6 桁のコードを入力してください</div>
  <div class="otp">
    <span>_</span><span>_</span><span>_</span><span>_</span><span>_</span><span>_</span>
  </div>
  <div class="mock-foot">届かない場合は迷惑メールフォルダを確認してください ・ <u>再送する</u></div>
</div>

<div v-click class="ask">ここで、何回タブを切り替えましたか？</div>

<style>
.mock {
  margin: 1.5rem auto 0; width: 30rem;
  background: #282a36; border: 1px solid #44475a; border-radius: 0.8rem;
  padding: 1.4rem 1.6rem;
}
.mock-title { font-weight: 700; font-size: 1.05rem; }
.mock-text { font-size: 0.85rem; color: #f8f8f2cc; margin-top: 0.4rem; }
.otp { display: flex; gap: 0.5rem; margin: 1.2rem 0; }
.otp span {
  flex: 1; text-align: center; padding: 0.5rem 0;
  border: 1px solid #6272a4; border-radius: 0.4rem;
  font-family: 'Fira Code', monospace; color: #6272a4;
}
.mock-foot { font-size: 0.7rem; color: #6272a4; }
.ask { text-align: center; margin-top: 2.5rem; font-size: 1.4rem; }
</style>

---
layout: default
---

# メール確認は、3 つの意味でつらい

<div class="sub">OTP でもマジックリンクでも同じです</div>

<v-clicks>

- **離脱する**：メールアプリへ移動し、届くのを待ち、迷惑メールフォルダを探す。調査対象サイトの **73%** は、このステップが終わるまでアカウントを作らせません。
- **フィッシングに弱い**：偽サイトが「コードを入力してください」と言えば、ユーザーは本物のコードを渡してしまいます。攻撃者はそれを**リアルタイムに中継**できます。
- **プライバシーが漏れる**：同じアドレスを使い回すので、サイトをまたいで名寄せされます

</v-clicks>

<div v-click class="ask">でもブラウザは、あなたが Gmail にログインしていることをもう知っています。</div>

<!--
73%: WICG/email-verification README（Chrome チームによる上位サイトの調査）
https://github.com/WICG/email-verification
-->
