// API キーなしで Renderer の動作を確認するためのサンプル spec。
// ライブデモが失敗したときの保険にも使う。
export const SAMPLE_SPEC = {
  root: "dashboard",
  elements: {
    dashboard: {
      type: "Card",
      props: { title: "今月のチーム KPI" },
      children: ["stat-deploys", "stat-review", "stat-bugs", "member-table", "report-button"],
    },
    "stat-deploys": {
      type: "Stat",
      props: { label: "デプロイ回数", value: "42" },
    },
    "stat-review": {
      type: "Stat",
      props: { label: "レビュー時間(中央値)", value: "3.5h" },
    },
    "stat-bugs": {
      type: "Stat",
      props: { label: "バグ再発率", value: "1.2%" },
    },
    "member-table": {
      type: "Table",
      props: {
        headers: ["メンバー", "担当", "進捗"],
        rows: [
          ["佐藤", "チェックアウト改善", "80%"],
          ["鈴木", "デザインシステム", "60%"],
          ["高橋", "パフォーマンス改善", "45%"],
        ],
      },
    },
    "report-button": {
      type: "Button",
      props: { label: "週次レポートを開く" },
    },
  },
};
