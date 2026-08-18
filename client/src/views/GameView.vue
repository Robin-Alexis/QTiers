<template>
  <div class="container jeu">
    <header class="barre">
      <RouterLink to="/" class="lien">← Accueil</RouterLink>
      <span class="marque">Question pour un Tiers</span>
      <button class="lien" @click="basculerSon">Son&nbsp;{{ sonActif ? 'activé' : 'coupé' }}</button>
    </header>

    <div v-if="etat === 'chargement'" class="bloc panneau">
      <p>Chargement des questions…</p>
    </div>

    <div v-else-if="etat === 'vide'" class="bloc panneau panneau--or">
      <h2 class="titre">Aucune question</h2>
      <p>La base est vide. Ajoute des questions pour lancer une partie.</p>
      <RouterLink to="/admin" class="btn btn--or">Ajouter des questions</RouterLink>
    </div>

    <div v-else-if="etat === 'pret'" class="bloc panneau panneau--or">
      <p class="sur">{{ questions.length }} questions · {{ DUREE }} secondes chacune</p>
      <h2 class="titre gros">Prêt&nbsp;?</h2>
      <p>Une bonne réponse rapporte d'autant plus de points que tu réponds vite. À toi de jouer&nbsp;!</p>
      <button class="btn btn--or" @click="demarrer">C'est parti</button>
    </div>

    <div v-else-if="etat === 'jeu'" class="plateau">
      <div class="hud">
        <div class="compteur">
          <span class="num">{{ String(index + 1).padStart(2, '0') }}</span>
          <span class="tot">/ {{ String(questions.length).padStart(2, '0') }}</span>
        </div>
        <div class="categorie">{{ questionCourante.categorie }}</div>
        <div class="score">Score <b>{{ score }}</b></div>
      </div>

      <div class="scene">
        <div class="question">{{ questionCourante.question }}</div>
        <CircleTimer :total="DUREE" :remaining="tempsRestant" />
      </div>

      <div class="reponses">
        <button
          v-for="(prop, i) in propositions"
          :key="i"
          class="option"
          :class="classeReponse(i)"
          :disabled="revele"
          @click="repondre(i)"
        >
          <span class="tuile">{{ LETTRES[i] }}</span>
          <span class="lib">{{ prop.text }}</span>
        </button>
      </div>
    </div>

    <div v-else-if="etat === 'resultat'" class="bloc panneau panneau--or">
      <p class="sur">Partie terminée</p>
      <h2 class="titre gros">{{ mention }}</h2>
      <div class="score-final">{{ score }} <small>points</small></div>
      <p>{{ bonnes }} / {{ questions.length }} bonnes réponses</p>
      <div class="actions">
        <button class="btn btn--or" @click="rejouer">Rejouer</button>
        <RouterLink to="/" class="btn btn--bleu">Accueil</RouterLink>
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

.barre { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 26px; }
.lien {
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font);
  font-size: 0.9rem;
  color: var(--sourd);
  text-decoration: none;
  padding: 0;
}
.lien:hover { color: var(--creme); }
.marque { font-family: var(--font); font-weight: 700; letter-spacing: 0.5px; color: var(--creme); }

.bloc { padding: 40px 34px; margin: 7vh auto 0; max-width: 560px; text-align: center; }
.bloc .btn { text-decoration: none; display: inline-block; margin-top: 8px; }
.bloc .actions { margin-top: 16px; }
.sur { color: var(--sourd); font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; font-size: 0.78rem; margin: 0 0 8px; }
.titre { font-weight: 700; font-size: 1.9rem; margin-bottom: 10px; color: var(--creme); }
.gros { font-size: clamp(2.2rem, 7vw, 3.4rem); }

.hud {
  display: flex;
  align-items: baseline;
  gap: 20px;
  border-bottom: 2px solid var(--bleu);
  padding-bottom: 12px;
  margin-bottom: 24px;
}
.compteur { display: flex; align-items: baseline; gap: 6px; }
.compteur .num { font-family: var(--font); font-weight: 700; font-size: 2rem; color: var(--or); line-height: 1; }
.compteur .tot { color: var(--sourd); font-weight: 700; }
.categorie { font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; font-size: 0.82rem; color: var(--creme); }
.score { margin-left: auto; text-transform: uppercase; letter-spacing: 1px; font-size: 0.8rem; font-weight: 700; color: var(--sourd); }
.score b { color: var(--or); font-size: 1.4rem; margin-left: 6px; }

.scene { display: flex; align-items: center; gap: 22px; margin-bottom: 26px; }
.question {
  flex: 1;
  background: var(--bleu-fonce);
  border-left: 6px solid var(--or);
  border-radius: 0 4px 4px 0;
  padding: 24px 26px;
  font-weight: 700;
  font-size: clamp(1.2rem, 3vw, 1.85rem);
  line-height: 1.25;
  color: var(--creme);
}
@media (max-width: 640px) { .scene { flex-direction: column-reverse; } }

.reponses { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
@media (max-width: 640px) { .reponses { grid-template-columns: 1fr; } }

.option {
  display: flex;
  align-items: stretch;
  text-align: left;
  padding: 0;
  border: none;
  border-radius: 4px;
  overflow: hidden;
  background: var(--bleu-fonce);
  color: var(--creme);
  cursor: pointer;
  transition: background 0.15s;
}
.option:not(:disabled):hover { background: var(--bleu); }
.option:not(:disabled):hover .tuile { background: var(--or); color: var(--encre); }
.option:disabled { cursor: default; }
.tuile {
  flex: none;
  width: 54px;
  display: grid;
  place-items: center;
  background: var(--bleu-vif);
  color: var(--or);
  font-family: var(--font);
  font-weight: 700;
  font-size: 1.5rem;
  transition: background 0.15s, color 0.15s;
}
.lib { padding: 15px 16px; font-size: 1.05rem; align-self: center; }

.option--bonne { background: var(--or); }
.option--bonne .tuile { background: var(--encre); color: var(--or); }
.option--bonne .lib { color: var(--encre); font-weight: 700; }
.option--mauvaise { background: var(--rouge); }
.option--mauvaise .tuile { background: var(--rouge-fonce); color: var(--blanc); }
.option--mauvaise .lib { color: var(--blanc); }
.option--eteinte { opacity: 0.4; }

.score-final { font-weight: 700; font-size: 4rem; color: var(--or); line-height: 1; margin: 6px 0; }
.score-final small { font-size: 1.1rem; color: var(--sourd); font-weight: 400; }
.actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
</style>
