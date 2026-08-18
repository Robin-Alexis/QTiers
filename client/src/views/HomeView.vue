<template>
  <div class="accueil">
    <div class="anneaux" aria-hidden="true">
      <span></span><span></span><span></span><span></span>
    </div>

    <div class="hero">
      <p class="surtitre titre-plateau">Question&nbsp;pour&nbsp;un</p>
      <h1 class="titre titre-plateau">TIERS</h1>
      <p class="slogan">Le grand quiz — aux couleurs d'Agrial 🌱</p>

      <div class="actions">
        <RouterLink to="/jouer" class="btn btn--or">▶ Jouer</RouterLink>
        <RouterLink to="/admin" class="btn btn--ghost">Gérer les questions</RouterLink>
      </div>

      <p class="note">
        Prêt à devenir le champion des tiers&nbsp;? Réponds vite, marque un maximum de points.
      </p>
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
.surtitre { font-size: clamp(1.2rem, 4vw, 2.2rem); font-weight: 500; letter-spacing: 6px; margin-bottom: -0.2em; }
.titre {
  font-size: clamp(4.5rem, 20vw, 12rem);
  letter-spacing: 6px;
  line-height: 0.9;
}
.slogan { color: var(--texte-doux); font-size: clamp(0.95rem, 2.5vw, 1.2rem); margin: 14px 0 34px; letter-spacing: 1px; }
.actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
.actions .btn { text-decoration: none; }
.note { color: var(--texte-doux); font-size: 0.9rem; margin-top: 34px; max-width: 440px; margin-left: auto; margin-right: auto; }

/* Anneaux concentriques lumineux façon plateau TV */
.anneaux { position: absolute; inset: 0; display: grid; place-items: center; z-index: 1; }
.anneaux span {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(120, 190, 32, 0.16);
  box-shadow: 0 0 60px rgba(120, 190, 32, 0.06) inset;
  animation: respire 7s ease-in-out infinite;
}
.anneaux span:nth-child(1) { width: 340px; height: 340px; }
.anneaux span:nth-child(2) { width: 560px; height: 560px; animation-delay: 0.6s; border-color: rgba(237, 200, 115, 0.12); }
.anneaux span:nth-child(3) { width: 800px; height: 800px; animation-delay: 1.2s; }
.anneaux span:nth-child(4) { width: 1080px; height: 1080px; animation-delay: 1.8s; border-color: rgba(46, 158, 91, 0.12); }
@keyframes respire { 0%, 100% { transform: scale(1); opacity: 0.7; } 50% { transform: scale(1.04); opacity: 1; } }
</style>
