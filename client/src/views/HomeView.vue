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

    <a class="sponsor" href="https://noknok.dev/recette/" target="_blank" rel="noopener">
      <span class="sponsor__label">Sponsorisé par PAGR</span>
      <img class="sponsor__logo" :src="logoAgrial" alt="Agrial" />
    </a>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import logoAgrial from '../images/Logo_cooperative_Agrial.jpg'
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

.sponsor {
  position: absolute;
  right: 22px;
  bottom: 22px;
  z-index: 3;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background: #ffffff;
  border-radius: 6px;
  padding: 9px 14px;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.3);
  text-decoration: none;
  transition: transform 0.12s, box-shadow 0.2s;
}
.sponsor:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(0, 0, 0, 0.38); }
.sponsor__label {
  font-family: var(--font);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  font-size: 0.6rem;
  line-height: 1.3;
  color: #5a6472;
  max-width: 78px;
}
.sponsor__logo { display: block; width: 62px; height: auto; }
@media (max-width: 620px) {
  .sponsor { right: 14px; bottom: 14px; gap: 9px; padding: 7px 11px; }
  .sponsor__logo { width: 50px; }
}
</style>
