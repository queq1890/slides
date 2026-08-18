# slides

LT 用のスライドとデモ置き場。**1 ディレクトリ = 1 LT** で、各ディレクトリは独立した pnpm workspace として自己完結する（lockfile も各ディレクトリに持つ）。

公開先: https://queq1890.github.io/slides/

## 収録トーク

| ディレクトリ | タイトル | スライド |
| --- | --- | --- |
| [`generative-ui/`](./generative-ui) | Generative UI（Slidev + Next.js デモ） | [🔗](https://queq1890.github.io/slides/generative-ui/) |

## 新しい LT を追加する

1. ルート直下にディレクトリを掘る（例: `my-new-talk/`）
2. その中に Slidev プロジェクトを自己完結で作る（`package.json` / `pnpm-lock.yaml` / 必要なら demo 用の pnpm workspace）
3. `package.json` の build スクリプトに base path を指定する:

   ```json
   "build": "slidev build --base /slides/my-new-talk/"
   ```

4. ルートの [`index.html`](./index.html) とこの README の一覧にリンクを追加する
5. `main` にマージすると [`deploy.yml`](./.github/workflows/deploy.yml) が `package.json` を持つ全ディレクトリを検出してビルドし、`https://queq1890.github.io/slides/<dir>/` に配信する

## デプロイの仕組み

- ルートの GitHub Actions が `*/package.json` を持つディレクトリを走査し、各ディレクトリで `pnpm install` → `pnpm build` を実行
- 各ディレクトリの `dist/` を `_site/<dir>/` に集約し、ルートの `index.html` と合わせて GitHub Pages にデプロイ
- LLM の API キーを使うデモ類はローカル実行のみ（Pages には含まれない）
