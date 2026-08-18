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

    <div class="sponsor">
      <p class="sponsor__label">Sponsorisé par PAGR</p>
      <svg class="sponsor__logo" viewBox="0 0 340 210" role="img" aria-label="Agrial">
        <path
          fill="#ee9a26"
          d="M150 122 L172 104 L176 108 L182 96 L186 100 L192 88 L196 92 L201 80 L205 84 L208 70 L211 58 L213 46 L214 34 L215 46 L217 58 L219 70 L222 68 L225 78 L229 76 L233 88 L238 86 L243 97 L249 95 L254 106 L261 104 L266 113 L275 111 L282 118 L288 122 Z"
        />
        <path
          fill="#1a7a3e"
          d="M25 152 C90 150 130 150 165 146 C205 141 250 135 315 140 L315 149 C250 144 205 150 165 155 C130 159 90 159 25 161 Z"
        />
        <text
          x="170" y="196" text-anchor="middle"
          font-family="'Times New Roman', Georgia, serif"
          font-size="52" font-weight="700" letter-spacing="2" fill="#176e39"
        >AGRIAL</text>
      </svg>
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

.sponsor {
  position: absolute;
  right: 22px;
  bottom: 22px;
  z-index: 3;
  background: #ffffff;
  border-radius: 6px;
  padding: 12px 18px 10px;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.3);
  text-align: center;
}
.sponsor__label {
  margin: 0 0 6px;
  font-family: var(--font);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.62rem;
  color: #5a6472;
}
.sponsor__logo { display: block; width: 138px; height: auto; }
@media (max-width: 620px) {
  .sponsor { right: 14px; bottom: 14px; padding: 9px 13px 7px; }
  .sponsor__logo { width: 104px; }
}
</style>
