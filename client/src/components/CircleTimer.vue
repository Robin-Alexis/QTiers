<template>
  <div class="timer" :class="{ critique }">
    <svg viewBox="0 0 120 120">
      <circle class="piste" cx="60" cy="60" r="52" />
      <circle
        class="jauge"
        cx="60" cy="60" r="52"
        :stroke-dasharray="circonference"
        :stroke-dashoffset="offset"
      />
    </svg>
    <div class="valeur">{{ Math.max(0, Math.ceil(remaining)) }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  total: { type: Number, required: true },
  remaining: { type: Number, required: true }
})

const RAYON = 52
const circonference = 2 * Math.PI * RAYON
const offset = computed(() => circonference * (1 - Math.max(0, props.remaining) / props.total))
const critique = computed(() => props.remaining <= 5)
</script>

<style scoped>
.timer { position: relative; width: 96px; height: 96px; flex: none; }
svg { transform: rotate(-90deg); width: 100%; height: 100%; }
.piste { fill: none; stroke: var(--bleu); stroke-width: 9; }
.jauge {
  fill: none;
  stroke: var(--or);
  stroke-width: 9;
  stroke-linecap: butt;
  transition: stroke-dashoffset 0.2s linear, stroke 0.2s ease;
}
.timer.critique .jauge { stroke: var(--rouge); }
.valeur {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-family: var(--font);
  font-weight: 700;
  font-size: 2rem;
  color: var(--creme);
}
.timer.critique .valeur { color: var(--rouge); }
</style>
