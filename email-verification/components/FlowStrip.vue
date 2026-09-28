<script setup lang="ts">
// セクション 02 の各スライド上部に置く「いまどの手順か」の目印
defineProps<{ current: number }>()

const steps = ['nonce', 'ログイン状態', 'Issuer 探し', '発行リクエスト', 'EVT', 'KB-JWT', 'RP の検証']
</script>

<template>
  <div class="strip">
    <div
      v-for="(label, i) in steps"
      :key="label"
      class="step"
      :class="{ done: i + 1 < current, now: i + 1 === current }"
    >
      <span class="n">{{ i + 1 }}</span>{{ label }}
    </div>
  </div>
</template>

<style scoped>
.strip {
  display: flex;
  gap: 0.3rem;
  margin-bottom: 0.9rem;
}
.step {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem 0.5rem;
  border-radius: 0.3rem;
  font-size: 0.62rem;
  color: #6272a4;
  background: #282a36;
  border: 1px solid #44475a;
}
.n {
  font-family: 'Fira Code', monospace;
  font-weight: 700;
}
.done {
  color: #50fa7b;
  border-color: #50fa7b55;
}
.now {
  color: #282a36;
  background: #50fa7b;
  border-color: #50fa7b;
  font-weight: 700;
}
</style>
