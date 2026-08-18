"use client";

import { defineRegistry } from "@json-render/react";
import { catalog } from "./catalog";

// LLM 出力の props は {"$state": "/path"} 参照で任意の型になり得るため、
// セル値を安全に表示用テキストへ変換する
function toCellText(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

// カタログの各コンポーネントに対応する React 実装。
// レンダラーが渡す emit / on を配線し、要素の on.press(setState 等の
// ビルトインアクション)がカタログ経由で実行されるようにする。
export const { registry } = defineRegistry(catalog, {
  components: {
    Card: ({ props, children, on }) => {
      const press = on("press");
      return (
        <div className="card" onClick={press.bound ? press.emit : undefined}>
          <h3>{props.title}</h3>
          {children}
        </div>
      );
    },
    Stat: ({ props, children, on }) => {
      const press = on("press");
      return (
        <div className="stat" onClick={press.bound ? press.emit : undefined}>
          <span className="stat-label">{props.label}</span>
          <span className="stat-value">{props.value}</span>
          {children}
        </div>
      );
    },
    // ストリーミング中の未着 props や {"$state"} 参照で配列以外が届いても
    // 落ちないよう、配列ガードとテキスト変換を挟む
    Table: ({ props, children }) => (
      <>
        <table>
          <thead>
            <tr>
              {(Array.isArray(props.headers) ? props.headers : []).map((h, j) => (
                <th key={j}>{toCellText(h)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(Array.isArray(props.rows) ? props.rows : []).map((row, i) => (
              <tr key={i}>
                {(Array.isArray(row) ? row : []).map((cell, j) => (
                  <td key={j}>{toCellText(cell)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {children}
      </>
    ),
    Button: ({ props, children, emit }) => (
      <>
        <button type="button" onClick={() => emit("press")}>
          {props.label}
        </button>
        {children}
      </>
    ),
  },
});
