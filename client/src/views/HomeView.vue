<template>
  <div class="accueil">
    <div class="hero">
      <p class="l1"><span class="mot-argent">Questions</span></p>
      <p class="l2"><span class="mot-argent">pour un</span></p>
      <h1 class="l3"><span class="mot-script">Tiers</span></h1>

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

.hero { position: relative; z-index: 2; text-align: center; }

.l1 { margin: 0; }
.l1 .mot-argent { font-size: clamp(3.2rem, 12vw, 8.5rem); line-height: 0.9; }

.l2 { margin: -0.02em 0 -0.1em; }
.l2 .mot-argent { font-size: clamp(1.3rem, 4.6vw, 2.7rem); line-height: 1; }

.l3 { margin: 0; }
.l3 .mot-script {
  font-size: clamp(5rem, 23vw, 15rem);
  line-height: 0.9;
  transform: rotate(-6deg) translate(9%, -3%);
}

.actions { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; margin-top: 30px; }
.actions .btn { text-decoration: none; }
</style>
