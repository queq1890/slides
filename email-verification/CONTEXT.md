# CONTEXT

このディレクトリは、社内勉強会向けの発表「Email Verification Protocol」のスライドを置く場所である。
見た目と書き方は sun-choma（https://github.com/sun-choma）の FEBi のデッキに寄せている。
置き場所と運用は、このリポジトリの仕組み（モノレポ、一括デプロイ）に合わせた。

## 発表の前提（2026-09-28 の grilling で決定）

| 項目 | 決定 |
|---|---|
| タイトル | 📧 Email Verification Protocol |
| 聞き手 | 社内勉強会の Web エンジニア。JWT は知っているが、FedCM や SD-JWT はよく知らない前提 |
| 持ち時間 | 20 分、25 枚前後（実績はセクション扉を含めて 30 枚） |
| 言語 | 本文は日本語。仕様の用語（Issuer、RP、SD-JWT+KB など）は英語のまま。英語版は作らない |
| ゴール | 仕組みの理解が主。締めに、導入を判断する材料を 2 枚置く |
| スライドフレームワーク | Slidev + dracula テーマ |

### sun-choma の流儀から取り入れたもの

- `style.css` に共通クラス（`.section-num` `.section-sub` `.sub` `.where` `.ask` `.cols` `.asof`）を集め、セクション扉の色は `--accent` で差し替える
- mermaid は使わない。図は Vue コンポーネント（`FlowDiagram` と `FlowStrip`）と、手組みの HTML で描く
- プロトコルは、実際に流れる HTTP、DNS、JSON をコードブロックで見せ、右カラムの v-clicks で 1 行ずつ説明する
- 見出しは主張型の日本語、本文はです・ます調
- 発表者ノートは最小限にする。ただし、事実を載せたスライドには出典 URL をノートに残す（ファクトチェック用）

### sun-choma と意図的に変えたところ

- 「今日話すこと」は置く。sun-choma は置かないが、発表者が上書きした。位置は問題提起の導入のあと
- リポジトリは分けず、このモノレポの `email-verification/` に置く
- ライブデモは作らない。仕様がまだ変わるので、手間に見合わないと判断した

### 構成

1. 導入：6 桁コードの入力画面から、メール確認のつらさ 3 つ（離脱、フィッシング、メールプロバイダにどのサイトを使っているかが見えること）
2. 今日話すこと
3. 01 登場人物と全体像（4 者、シーケンス図、仕様が 2 つに分かれていること）
4. 02 フローを 1 手ずつ（nonce、ログイン状態、Issuer 探し、発行リクエスト、EVT、KB-JWT、RP の検証）
5. 03 何が守られて、何が守られないか
6. 04 周りの技術との関係（比較表、FedCM、OIDC、passkeys）
7. 締め：今使えるのか、RP がやること、参考リンク

- HTTP Message Signatures は深入りせず、発行リクエストの 1 枚にまとめた
- 確かめきれなかった情報は「2026-09 時点」「議論中」と明記して載せる
- 名寄せを防げるのは、Issuer がプライベートアドレスに対応している場合だけ。導入のつらさには入れず、締めでも条件付きで書く（2026-09-28 のレビューで修正）
- 見出しは sun-choma に合わせて主張型のままにする。japanese-tech-writing の「見出しをセリフにしない」とはぶつかるが、grilling の決定を優先した

## 裏取り済みの事実（2026-09-28 時点）

### 仕様

- IETF 側は `draft-hardt-email-verification-02`（2026-08-25）。個人ドラフトで、WG には採択されていない。IETF 126 の DISPATCH で、どこで標準化するかが議論された
- W3C 側は WICG の "Email Verification API"（CG-DRAFT）。著者はどちらも Sam Goto（Google）と Dick Hardt（Hellō）
- 分割のきっかけは W3C TAG のフィードバック
- 出典：https://datatracker.ietf.org/doc/draft-hardt-email-verification/ 、https://wicg.github.io/email-verification/ 、https://github.com/WICG/email-verification

### 実装

- Chrome はデスクトップ版の 150〜153 で Origin Trial（2026-07-08 開始）。Gmail がローンチ Issuer
- Chrome 153 で、発行リクエストが `request_token` JWT から HTTP Message Signatures に変わった（破壊的変更）
- Edge も Origin Trial を提供している。Hellō は試験実装（draft-02 の Implementation Status による）
- Mozilla は "Defer"。WebKit は正式なシグナルなし。W3C TAG の early review は "Ambivalent"
- 出典：https://developer.chrome.com/blog/email-verification-protocol-origin-trial 、https://developer.chrome.com/blog/email-verification-august-2026 、https://github.com/w3ctag/design-reviews/issues/1169

### Gmail の実データ（2026-09-28 に dig と curl で取得）

- `_email-verification.gmail.com TXT "iss=accounts.google.com"`
- `https://accounts.google.com/.well-known/email-verification` の `signing_alg_values_supported` は `["EdDSA"]`
- draft-02 は `EdDSA` を禁止し、`Ed25519` のような fully-specified な識別子を求めている（§10.3）。本番と仕様がずれている例として、スライドで使った

### セキュリティとプライバシー

- EVT に `aud` はなく、発行リクエストの body はメールアドレスだけ。Issuer はどの RP で使われたかを知らない（§9.4）。ただし検証の時刻は Issuer に見える（§9.2）
- 保証するのは Issuer にログインしていることまでで、受信できることは保証しない。README は「この点で OTP より弱い」と書いている
- ブラウザ側だけの DNS 偽装は RP の照合で防げる。RP 側の DNS 偽装は残存リスクで、RP は DNSSEC を検証すべき（SHOULD、§10.4）
- RP は、トークンが返ってきたかどうかで、ユーザーが Issuer にログインしているかを推測できる（§9.5）
- 「73% のサイトがメール確認までアカウントを作らせない」は README の調査の数字

## 確かめきれていないこと

- Origin Trial が Chrome 153 より後まで延長されたか
- IETF 126 DISPATCH の正式な結論
- well-known ファイル名の最終形（W3C 側は FedCM の well-known を使っており、統一予定とだけ書かれている）
- `navigator.credentials.get()` 形式の API が今も有効か（スライドでは扱っていない）

## 用語

- **RP**：メールアドレスを確認したいサイト。W3C 側では Verifier とも呼ぶ
- **Issuer**：メールドメインから DNS で委任を受け、トークンに署名するサーバー
- **EVT**：Email Verification Token。SD-JWT 形式で、ブラウザの公開鍵（`cnf.jwk`）に紐づく
- **KB-JWT**：Key Binding JWT。ブラウザが `aud` と `nonce` を入れて署名し、`<EVT>~<KB-JWT>` として RP に渡す
- **EVP**：この発表では、IETF と W3C の両方の仕様をまとめてこう呼ぶ
