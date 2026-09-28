<script setup lang="ts">
// 全体像のシーケンス図。クリックごとに 1 メッセージずつ現れる（スライド側で clicks を指定する）
import { useSlideContext } from '@slidev/client'

const { $clicks } = useSlideContext()

const lanes = [
  { id: 'rp', label: 'RP', color: '#ff79c6' },
  { id: 'browser', label: 'Browser', color: '#50fa7b' },
  { id: 'issuer', label: 'Issuer', color: '#8be9fd' },
  { id: 'dns', label: 'DNS', color: '#ffb86c' },
] as const

type Lane = (typeof lanes)[number]['id']
type Msg = { from: Lane; to: Lane; label: string; note?: string }

const idx = (l: Lane) => lanes.findIndex((x) => x.id === l)

const messages: Msg[] = [
  { from: 'rp', to: 'browser', label: 'フォーム + nonce' },
  { from: 'browser', to: 'dns', label: '_email-verification.<domain> の TXT', note: 'Issuer 探し' },
  { from: 'browser', to: 'issuer', label: 'GET /.well-known/email-verification' },
  { from: 'browser', to: 'issuer', label: 'POST 発行リクエスト', note: 'Cookie + 使い捨て鍵の署名' },
  { from: 'issuer', to: 'browser', label: 'EVT（SD-JWT）', note: 'RP の情報は入らない' },
  { from: 'browser', to: 'browser', label: 'KB-JWT を作って連結', note: 'aud = RP のオリジン' },
  { from: 'browser', to: 'rp', label: 'EVT~KB-JWT（フォーム送信）' },
  { from: 'rp', to: 'dns', label: '自分でも TXT を引く', note: 'iss と照合' },
  { from: 'rp', to: 'issuer', label: 'JWKS（公開鍵）を取得', note: '誰の検証かは伝わらない' },
]

function arrowStyle(m: Msg) {
  const a = idx(m.from)
  const b = idx(m.to)
  const w = 100 / lanes.length
  return {
    left: `${(Math.min(a, b) + 0.5) * w}%`,
    width: `${Math.abs(b - a) * w}%`,
  }
}
</script>

<template>
  <div class="flow">
    <div class="heads">
      <div v-for="l in lanes" :key="l.id" class="head" :style="{ color: l.color, borderColor: l.color }">
        {{ l.label }}
      </div>
    </div>
    <div class="body">
      <div class="lifelines">
        <div v-for="l in lanes" :key="l.id" class="lifeline" />
      </div>
      <div
        v-for="(m, i) in messages"
        :key="i"
        class="row"
        :class="{ shown: $clicks > i }"
      >
        <template v-if="m.from === m.to">
          <div class="self" :style="{ left: `${(idx(m.from) + 0.5) * 25}%` }">
            <span class="n">{{ i + 1 }}</span>{{ m.label }}<span v-if="m.note" class="note">{{ m.note }}</span>
          </div>
        </template>
        <template v-else>
          <div class="arrow" :class="{ rev: idx(m.to) < idx(m.from) }" :style="arrowStyle(m)">
            <span class="label">
              <span class="n">{{ i + 1 }}</span>{{ m.label }}<span v-if="m.note" class="note">{{ m.note }}</span>
            </span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.flow {
  font-size: 0.72rem;
}
.heads {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}
.head {
  justify-self: center;
  padding: 0.15rem 0.9rem;
  border: 1px solid;
  border-radius: 0.3rem;
  font-weight: 700;
  font-family: 'Fira Code', monospace;
}
.body {
  position: relative;
  padding: 0.3rem 0;
}
.lifelines {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}
.lifeline {
  justify-self: center;
  width: 0;
  border-left: 1px dashed #44475a;
}
.row {
  position: relative;
  height: 2.05rem;
  opacity: 0;
  transition: opacity 0.3s;
}
.row.shown {
  opacity: 1;
}
.arrow {
  position: absolute;
  bottom: 0.35rem;
  height: 0;
  border-top: 2px solid #f8f8f2;
}
.arrow::after {
  content: '';
  position: absolute;
  right: -2px;
  top: -6px;
  border: 5px solid transparent;
  border-left: 8px solid #f8f8f2;
}
.arrow.rev::after {
  right: auto;
  left: -2px;
  border-left: 5px solid transparent;
  border-right: 8px solid #f8f8f2;
}
.label {
  position: absolute;
  bottom: 0.1rem;
  left: 0;
  right: 0;
  text-align: center;
  white-space: nowrap;
}
.self {
  position: absolute;
  top: 0.2rem;
  transform: translateX(-50%);
  white-space: nowrap;
  background: #282a36;
  border: 1px solid #50fa7b;
  border-radius: 0.3rem;
  padding: 0.1rem 0.5rem;
}
.n {
  font-family: 'Fira Code', monospace;
  color: #6272a4;
  margin-right: 0.35rem;
}
.note {
  color: #6272a4;
  margin-left: 0.5rem;
}
</style>
