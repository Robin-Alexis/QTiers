<template>
  <div class="accueil">
    <div class="faisceaux" aria-hidden="true">
      <span></span><span></span><span></span><span></span><span></span>
    </div>
    <div class="rubans" aria-hidden="true"></div>

    <div class="hero">
      <p class="ligne-haut"><span class="mot-argent">Question</span></p>
      <p class="ligne-milieu">pour un</p>
      <h1 class="ligne-bas"><span class="mot-script">Tiers</span></h1>

      <p class="slogan">Le grand quiz de culture générale</p>

      <div class="actions">
        <RouterLink to="/jouer" class="btn btn--or">Jouer</RouterLink>
        <RouterLink to="/admin" class="btn btn--ghost">Gérer les questions</RouterLink>
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

.faisceaux { position: absolute; inset: 0; z-index: 1; pointer-events: none; }
.faisceaux span {
  position: absolute;
  top: -30%;
  left: 50%;
  width: 34vw;
  height: 160%;
  transform-origin: top center;
  background: linear-gradient(180deg, rgba(140, 175, 255, 0.24), transparent 62%);
  filter: blur(14px);
  opacity: 0.7;
}
.faisceaux span:nth-child(1) { transform: translateX(-50%) rotate(-34deg); }
.faisceaux span:nth-child(2) { transform: translateX(-50%) rotate(-16deg); background: linear-gradient(180deg, rgba(126, 58, 242, 0.26), transparent 62%); }
.faisceaux span:nth-child(3) { transform: translateX(-50%) rotate(0deg); }
.faisceaux span:nth-child(4) { transform: translateX(-50%) rotate(16deg); background: linear-gradient(180deg, rgba(126, 58, 242, 0.26), transparent 62%); }
.faisceaux span:nth-child(5) { transform: translateX(-50%) rotate(34deg); }

.rubans {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background:
    radial-gradient(60% 40% at 20% 78%, rgba(47, 107, 255, 0.4), transparent 60%),
    radial-gradient(52% 36% at 82% 82%, rgba(126, 58, 242, 0.38), transparent 62%);
  filter: blur(6px);
}

.hero { position: relative; z-index: 2; text-align: center; }

.ligne-haut { margin: 0; }
.mot-argent { font-size: clamp(3.4rem, 13vw, 9rem); line-height: 0.9; }

.ligne-milieu {
  margin: -0.05em 0 -0.15em;
  font-family: var(--font-titre);
  font-weight: 300;
  text-transform: lowercase;
  letter-spacing: 4px;
  font-size: clamp(1.1rem, 4vw, 2.4rem);
  color: #eef3ff;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.ligne-bas { margin: 0; }
.mot-script { font-size: clamp(4.4rem, 20vw, 13rem); line-height: 0.9; }

.slogan {
  color: var(--texte-doux);
  font-family: var(--font-titre);
  font-weight: 300;
  letter-spacing: 3px;
  text-transform: uppercase;
  font-size: clamp(0.8rem, 2.2vw, 1.05rem);
  margin: 22px 0 36px;
}

.actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
.actions .btn { text-decoration: none; }
</style>
