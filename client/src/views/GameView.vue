<template>
  <div class="container jeu">
    <header class="barre">
      <RouterLink to="/" class="btn btn--ghost btn--sm">Accueil</RouterLink>
      <span class="logo-mini">Question pour un Tiers</span>
      <button class="btn btn--ghost btn--sm" @click="basculerSon">{{ sonActif ? 'Son on' : 'Son off' }}</button>
    </header>

    <div v-if="etat === 'chargement'" class="centre panneau bloc">
      <p>Chargement des questions…</p>
    </div>

    <div v-else-if="etat === 'vide'" class="centre panneau bloc">
      <h2 class="titre-or">Aucune question</h2>
      <p>La base est vide. Ajoute des questions pour lancer une partie.</p>
      <RouterLink to="/admin" class="btn btn--or">Ajouter des questions</RouterLink>
    </div>

    <div v-else-if="etat === 'pret'" class="centre panneau bloc">
      <span class="badge">{{ questions.length }} questions · {{ DUREE }}s chacune</span>
      <h2 class="titre-or gros">Prêt&nbsp;?</h2>
      <p>Une bonne réponse rapporte d'autant plus de points que tu réponds vite. À toi de jouer&nbsp;!</p>
      <button class="btn btn--or" @click="demarrer">C'est parti</button>
    </div>

    <div v-else-if="etat === 'jeu'" class="plateau">
      <div class="hud">
        <div class="hud__gauche">
          <span class="badge">Question {{ index + 1 }} / {{ questions.length }}</span>
          <span class="badge badge--or">{{ questionCourante.categorie }}</span>
        </div>
        <div class="score">Score <strong>{{ score }}</strong></div>
      </div>

      <div class="scene">
        <CircleTimer :total="DUREE" :remaining="tempsRestant" />
        <div class="question panneau">{{ questionCourante.question }}</div>
      </div>

      <div class="reponses">
        <button
          v-for="(prop, i) in propositions"
          :key="i"
          class="reponse"
          :class="classeReponse(i)"
          :disabled="revele"
          @click="repondre(i)"
        >
          <span class="lettre">{{ LETTRES[i] }}</span>
          <span class="texte">{{ prop.text }}</span>
        </button>
      </div>
    </div>

    <div v-else-if="etat === 'resultat'" class="centre panneau bloc">
      <span class="badge">Terminé</span>
      <h2 class="titre-or gros">{{ mention }}</h2>
      <div class="score-final">{{ score }} <small>points</small></div>
      <p>{{ bonnes }} / {{ questions.length }} bonnes réponses</p>
      <div class="actions">
        <button class="btn btn--or" @click="rejouer">Rejouer</button>
        <RouterLink to="/" class="btn btn--ghost">Accueil</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import CircleTimer from '../components/CircleTimer.vue'
import { api } from '../api'
import { son } from '../sound'

const LETTRES = ['A', 'B', 'C', 'D']
const DUREE = 20
const NB_QUESTIONS = 10

const etat = ref('chargement')
const questions = ref([])
const index = ref(0)
const score = ref(0)
const bonnes = ref(0)
const tempsRestant = ref(DUREE)
const propositions = ref([])
const choix = ref(null)
const revele = ref(false)
const sonActif = ref(son.estActif())

let intervalId = null
let timeoutId = null
let dernierTic = DUREE

const questionCourante = computed(() => questions.value[index.value] || {})
const mention = computed(() => {
  const ratio = questions.value.length ? bonnes.value / questions.value.length : 0
  if (ratio === 1) return 'Champion des tiers !'
  if (ratio >= 0.7) return 'Excellent !'
  if (ratio >= 0.4) return 'Pas mal !'
  return 'Peut mieux faire…'
})

async function charger() {
  try {
    const data = await api.aleatoires(NB_QUESTIONS)
    questions.value = data
    etat.value = data.length ? 'pret' : 'vide'
  } catch (e) {
    etat.value = 'vide'
  }
}

function melanger(tableau) {
  const t = [...tableau]
  for (let i = t.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[t[i], t[j]] = [t[j], t[i]]
  }
  return t
}

function preparerPropositions(q) {
  propositions.value = melanger(q.reponses.map((text, i) => ({ text, correct: i === q.bonne })))
}

function demarrer() {
  index.value = 0
  score.value = 0
  bonnes.value = 0
  etat.value = 'jeu'
  lancerQuestion()
}

function lancerQuestion() {
  choix.value = null
  revele.value = false
  tempsRestant.value = DUREE
  dernierTic = DUREE
  preparerPropositions(questionCourante.value)
  arreterTimer()
  intervalId = setInterval(() => {
    tempsRestant.value = Math.max(0, tempsRestant.value - 0.1)
    const sec = Math.ceil(tempsRestant.value)
    if (sec !== dernierTic && sec <= 5 && sec > 0) {
      dernierTic = sec
      son.tic()
    }
    if (tempsRestant.value <= 0) repondre(null)
  }, 100)
}

function repondre(i) {
  if (revele.value) return
  arreterTimer()
  revele.value = true
  choix.value = i
  const bonneRep = i !== null && propositions.value[i]?.correct
  if (bonneRep) {
    bonnes.value++
    score.value += 100 + Math.round(tempsRestant.value) * 10
    son.bonne()
  } else {
    son.mauvaise()
  }
  timeoutId = setTimeout(suivant, 1700)
}

function suivant() {
  if (index.value + 1 >= questions.value.length) {
    etat.value = 'resultat'
    son.fin()
  } else {
    index.value++
    lancerQuestion()
  }
}

function classeReponse(i) {
  if (!revele.value) return ''
  if (propositions.value[i].correct) return 'reponse--bonne'
  if (i === choix.value) return 'reponse--mauvaise'
  return 'reponse--eteinte'
}

function rejouer() {
  charger().then(() => {
    if (etat.value === 'pret') demarrer()
  })
}

function basculerSon() {
  sonActif.value = !sonActif.value
  son.toggle(sonActif.value)
  if (sonActif.value) son.clic()
}

function arreterTimer() {
  if (intervalId) clearInterval(intervalId)
  intervalId = null
}

onMounted(charger)
onBeforeUnmount(() => {
  arreterTimer()
  if (timeoutId) clearTimeout(timeoutId)
})
</script>

<style scoped>
.jeu { min-height: 100vh; }
.barre { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 18px; }
.barre .btn { text-decoration: none; }
.logo-mini {
  font-family: var(--font-titre);
  text-transform: uppercase;
  letter-spacing: 3px;
  font-size: 1rem;
  color: var(--bleu-clair);
}

.centre { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 16px; }
.bloc { padding: 40px 28px; margin: 8vh auto 0; max-width: 560px; }
.bloc .btn { text-decoration: none; }
.gros { font-size: clamp(2.4rem, 8vw, 4rem); }

.hud { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 16px; }
.hud__gauche { display: flex; gap: 10px; flex-wrap: wrap; }
.score { font-family: var(--font-titre); text-transform: uppercase; letter-spacing: 1px; color: var(--texte-doux); }
.score strong { color: var(--or); font-size: 1.5rem; margin-left: 6px; }

.scene { display: flex; align-items: center; gap: 22px; margin-bottom: 26px; }
.question {
  flex: 1;
  padding: 26px 28px;
  font-family: var(--font-titre);
  font-weight: 500;
  font-size: clamp(1.3rem, 3.2vw, 2rem);
  line-height: 1.2;
}
@media (max-width: 620px) { .scene { flex-direction: column; } }

.reponses { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
@media (max-width: 620px) { .reponses { grid-template-columns: 1fr; } }

.reponse {
  display: flex;
  align-items: center;
  gap: 14px;
  text-align: left;
  padding: 16px 18px;
  border-radius: 12px;
  border: 1px solid var(--bord);
  background: rgba(8, 18, 54, 0.72);
  color: var(--blanc);
  font-size: 1.05rem;
  cursor: pointer;
  transition: transform 0.12s, box-shadow 0.2s, background 0.2s, border-color 0.2s;
}
.reponse:not(:disabled):hover { transform: translateY(-2px); border-color: var(--bleu-vif); box-shadow: var(--lueur-bleue); }
.reponse:disabled { cursor: default; }
.lettre {
  flex: none;
  width: 38px; height: 38px;
  display: grid; place-items: center;
  border-radius: 50%;
  font-family: var(--font-titre);
  font-weight: 600;
  font-size: 1.2rem;
  background: linear-gradient(180deg, var(--or-clair), var(--or));
  color: #2a1c02;
}
.reponse--bonne { border-color: var(--or); background: rgba(255, 207, 71, 0.18); box-shadow: 0 0 26px rgba(255, 207, 71, 0.4); }
.reponse--bonne .lettre { background: linear-gradient(180deg, #fff2c2, var(--or)); color: #2a1c02; }
.reponse--mauvaise { border-color: var(--rouge); background: rgba(255, 77, 85, 0.2); }
.reponse--mauvaise .lettre { background: linear-gradient(180deg, #ff9a9c, var(--rouge)); color: #fff; }
.reponse--eteinte { opacity: 0.45; }

.score-final { font-family: var(--font-titre); font-weight: 700; font-size: 4rem; color: var(--or); line-height: 1; }
.score-final small { font-size: 1.2rem; color: var(--texte-doux); }
.actions { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
</style>
