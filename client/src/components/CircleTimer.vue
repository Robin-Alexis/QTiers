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
.timer { position: relative; width: 110px; height: 110px; }
svg { transform: rotate(-90deg); width: 100%; height: 100%; }
.piste { fill: none; stroke: rgba(255, 255, 255, 0.10); stroke-width: 8; }
.jauge {
  fill: none;
  stroke: var(--vert);
  stroke-width: 8;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.2s linear, stroke 0.3s ease;
  filter: drop-shadow(0 0 6px rgba(120, 190, 32, 0.6));
}
.timer.critique .jauge { stroke: var(--rouge); filter: drop-shadow(0 0 8px rgba(229, 72, 77, 0.7)); }
.valeur {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-family: var(--font-titre);
  font-size: 2.1rem;
  color: #fff;
}
.timer.critique .valeur { color: #ffb3b3; animation: pulse 0.6s infinite; }
@keyframes pulse { 50% { transform: scale(1.14); } }
</style>
