<template>
  <div class="accueil">
    <div class="sol" aria-hidden="true"></div>

    <div class="hero">
      <p class="l1"><span class="mot-argent">Question</span></p>
      <p class="l2">pour un</p>
      <h1 class="l3"><span class="mot-script">Tiers</span></h1>

      <div class="regle" aria-hidden="true"></div>
      <p class="tagline">Culture générale · Agriculture · Agrial</p>

      <div class="actions">
        <RouterLink to="/jouer" class="btn btn--or">Jouer</RouterLink>
        <RouterLink to="/admin" class="btn btn--bleu">Gérer les questions</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.accueil {
  position: relative;
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  overflow: hidden;
}

.sol {
  position: absolute;
  left: 50%;
  bottom: -46vh;
  width: 180vw;
  height: 82vh;
  transform: translateX(-50%);
  border-radius: 50%;
  background: #0f2468;
  z-index: 1;
}

.hero { position: relative; z-index: 2; text-align: center; }

.l1 { margin: 0; }
.mot-argent { font-size: clamp(3.2rem, 12vw, 8.5rem); line-height: 0.9; }

.l2 {
  margin: -0.05em 0 -0.12em;
  font-family: var(--font);
  font-weight: 400;
  letter-spacing: 2px;
  font-size: clamp(1rem, 3.6vw, 2rem);
  color: var(--blanc);
}

.l3 { margin: 0; }
.mot-script { font-size: clamp(4rem, 18vw, 12rem); line-height: 0.9; }

.regle {
  width: 190px;
  height: 3px;
  background: var(--or);
  margin: 26px auto 16px;
}

.tagline {
  color: var(--sourd);
  font-family: var(--font);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: clamp(0.72rem, 2vw, 0.9rem);
  margin: 0 0 34px;
}

.actions { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
.actions .btn { text-decoration: none; }
</style>
