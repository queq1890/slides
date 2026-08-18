"use client";

import { useMemo, useRef, useState } from "react";
import { createSpecStreamCompiler, type Spec } from "@json-render/core";
import { JSONUIProvider, Renderer } from "@json-render/react";
import { registry } from "@/lib/registry";
import { SAMPLE_SPEC } from "@/lib/sample-spec";

// /api/generate のストリームを読み、Patch が適用されて spec が育つたびに
// 途中経過の Spec を yield する。React の状態には一切触れない純粋な生成処理。
async function* streamSpec(
  prompt: string,
  signal: AbortSignal,
): AsyncGenerator<Spec> {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
    signal,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const reader = res.body?.getReader();
  if (!reader) throw new Error("レスポンスボディが空です");

  const decoder = new TextDecoder();
  // 最初の patch (root 設定) 適用直後は elements が存在せず
  // Renderer の spec.elements[spec.root] で落ちるため、初期値で elements を用意する
  const compiler = createSpecStreamCompiler<Spec>({ elements: {} });

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const { result } = compiler.push(decoder.decode(value, { stream: true }));
      if (result) yield result;
    }
  } finally {
    // 呼び出し側が途中で break / throw してもストリームを確実に閉じる
    reader.cancel().catch(() => {});
  }
  yield compiler.getResult();
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [spec, setSpec] = useState<Spec | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // 進行中のストリーミングを打ち切るためのコントローラ。
  // これがないと「サンプル表示」や再生成の直後に、古いストリームの
  // setSpec が新しい表示を上書きしてしまう。
  const abortRef = useRef<AbortController | null>(null);

  // LLM が spec に含めた state ({"$state": "/..."} バインディングの参照先) を
  // Provider の state ストアへ反映する。compiler は state を in-place で更新する
  // ことがあるため、spec が更新されるたびに新しい参照を渡して同期を確実にする。
  const initialState = useMemo(() => ({ ...(spec?.state ?? {}) }), [spec]);

  async function generate() {
    // 直前の生成を打ち切り、この生成を「現在の生成」として登録する
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const { signal } = controller;

    setLoading(true);
    setError(null);
    setSpec(null);
    try {
      for await (const partial of streamSpec(prompt, signal)) {
        if (signal.aborted) break;
        setSpec(partial);
      }
    } catch (e) {
      // abort 由来の例外は意図した打ち切りなので、エラー表示しない
      if (!signal.aborted) {
        setError(e instanceof Error ? e.message : String(e));
      }
    } finally {
      // 新しい生成が始まっていたら、loading の管理はそちらへ移っている
      if (abortRef.current === controller) {
        setLoading(false);
      }
    }
  }

  function showSample() {
    abortRef.current?.abort();
    abortRef.current = null;
    setLoading(false);
    setError(null);
    setSpec(SAMPLE_SPEC);
  }

  return (
    <main>
      <h1>Generative UI Demo</h1>
      <p>カタログ(Card / Stat / Table / Button)の範囲で UI が生成されます。</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          generate();
        }}
      >
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="例: 今月のチームの KPI ダッシュボードを作って"
        />
        <button type="submit" disabled={loading}>
          {loading ? "生成中…" : "生成"}
        </button>
        <button type="button" className="secondary" onClick={showSample}>
          サンプル表示
        </button>
      </form>
      {error && <p className="error">生成に失敗しました: {error}</p>}
      <section className="result">
        {spec != null && (
          <JSONUIProvider registry={registry} initialState={initialState}>
            <Renderer spec={spec} registry={registry} loading={loading} />
          </JSONUIProvider>
        )}
      </section>
    </main>
  );
}
