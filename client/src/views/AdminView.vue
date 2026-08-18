<template>
  <div class="container admin">
    <header class="barre">
      <RouterLink to="/" class="btn btn--ghost btn--sm">Accueil</RouterLink>
      <span class="logo-mini">Gestion des questions</span>
      <RouterLink to="/jouer" class="btn btn--ghost btn--sm">Jouer</RouterLink>
    </header>

    <div class="grille">
      <section class="panneau form">
        <h2 class="titre-or">{{ form.id ? 'Modifier' : 'Nouvelle question' }}</h2>

        <div class="ligne">
          <div class="col">
            <label for="cat">Catégorie</label>
            <input id="cat" v-model="form.categorie" class="champ" list="cats" placeholder="Ex : Agriculture" />
            <datalist id="cats">
              <option v-for="c in categories" :key="c" :value="c" />
            </datalist>
          </div>
          <div class="col col--court">
            <label for="diff">Difficulté</label>
            <select id="diff" v-model="form.difficulte" class="champ">
              <option value="facile">Facile</option>
              <option value="moyen">Moyen</option>
              <option value="difficile">Difficile</option>
            </select>
          </div>
        </div>

        <label for="q">Question</label>
        <textarea id="q" v-model="form.question" class="champ" rows="2" placeholder="Énoncé de la question"></textarea>

        <label>Réponses <small>(coche la bonne)</small></label>
        <div v-for="(rep, i) in form.reponses" :key="i" class="rep-ligne">
          <input type="radio" :value="i" v-model="form.bonne" :id="'b' + i" class="radio" />
          <span class="tuile" :class="{ ok: form.bonne === i }">{{ LETTRES[i] }}</span>
          <input v-model="form.reponses[i]" class="champ" :placeholder="'Réponse ' + LETTRES[i]" />
        </div>

        <p v-if="erreur" class="erreur">{{ erreur }}</p>
        <p v-if="succes" class="succes">{{ succes }}</p>

        <div class="actions">
          <button class="btn btn--or" :disabled="enCours" @click="enregistrer">
            {{ form.id ? 'Enregistrer' : 'Ajouter' }}
          </button>
          <button v-if="form.id" class="btn btn--bleu" @click="reinitialiser">Annuler</button>
        </div>
      </section>

      <section class="liste">
        <div class="liste-tete">
          <h2 class="titre">Questions</h2>
          <span class="total">{{ questions.length }}</span>
        </div>

        <p v-if="chargement" class="muted">Chargement…</p>
        <p v-else-if="!questions.length" class="muted">Aucune question pour le moment.</p>

        <article v-for="q in questions" :key="q.id" class="carte panneau">
          <div class="carte-tete">
            <span class="cat">{{ q.categorie }}</span>
            <span class="muted diff">{{ q.difficulte }}</span>
          </div>
          <p class="q-texte">{{ q.question }}</p>
          <ul class="q-reps">
            <li v-for="(r, i) in q.reponses" :key="i" :class="{ bonne: i === q.bonne }">
              <b>{{ LETTRES[i] }}.</b> {{ r }}
            </li>
          </ul>
          <div class="carte-actions">
            <button class="btn btn--bleu btn--sm" @click="editer(q)">Modifier</button>
            <button class="btn btn--danger btn--sm" @click="supprimer(q)">Supprimer</button>
          </div>
        </article>
      </section>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { api } from '../api'

const LETTRES = ['A', 'B', 'C', 'D']

const questions = ref([])
const categories = ref([])
const chargement = ref(true)
const enCours = ref(false)
const erreur = ref('')
const succes = ref('')

const formVide = () => ({ id: null, categorie: '', question: '', reponses: ['', '', '', ''], bonne: 0, difficulte: 'moyen' })
const form = reactive(formVide())

async function charger() {
  chargement.value = true
  try {
    questions.value = await api.liste()
    categories.value = await api.categories()
  } finally {
    chargement.value = false
  }
}

function reinitialiser() {
  Object.assign(form, formVide())
  erreur.value = ''
  succes.value = ''
}

function editer(q) {
  Object.assign(form, { id: q.id, categorie: q.categorie, question: q.question, reponses: [...q.reponses], bonne: q.bonne, difficulte: q.difficulte })
  erreur.value = ''
  succes.value = ''
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function valider() {
  if (!form.question.trim()) return 'La question est obligatoire.'
  if (form.reponses.some((r) => !r.trim())) return 'Les 4 réponses doivent être renseignées.'
  return ''
}

async function enregistrer() {
  erreur.value = ''
  succes.value = ''
  const v = valider()
  if (v) { erreur.value = v; return }

  enCours.value = true
  try {
    const payload = {
      categorie: form.categorie.trim() || 'Général',
      question: form.question.trim(),
      reponses: form.reponses.map((r) => r.trim()),
      bonne: form.bonne,
      difficulte: form.difficulte
    }
    if (form.id) {
      await api.modifier(form.id, payload)
      succes.value = 'Question modifiée'
    } else {
      await api.creer(payload)
      succes.value = 'Question ajoutée'
    }
    reinitialiser()
    await charger()
  } catch (e) {
    erreur.value = e.message
  } finally {
    enCours.value = false
  }
}

async function supprimer(q) {
  if (!confirm(`Supprimer cette question ?\n\n« ${q.question} »`)) return
  try {
    await api.supprimer(q.id)
    if (form.id === q.id) reinitialiser()
    await charger()
  } catch (e) {
    erreur.value = e.message
  }
}

onMounted(charger)
</script>

<style scoped>
.admin { min-height: 100vh; }
.barre { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 26px; }
.barre .btn { text-decoration: none; }
.logo-mini { font-family: var(--font); font-weight: 700; letter-spacing: 0.5px; color: var(--creme); }

.grille { display: grid; grid-template-columns: minmax(320px, 400px) 1fr; gap: 22px; align-items: start; }
@media (max-width: 860px) { .grille { grid-template-columns: 1fr; } }

.form { padding: 22px; position: sticky; top: 16px; display: flex; flex-direction: column; gap: 10px; }
.form h2 { margin-bottom: 6px; font-weight: 700; font-size: 1.3rem; color: var(--creme); }
.ligne { display: flex; gap: 12px; }
.col { flex: 1; display: flex; flex-direction: column; gap: 4px; }
.col--court { flex: 0 0 130px; }
textarea.champ { resize: vertical; font-family: var(--font); }

.rep-ligne { display: flex; align-items: center; gap: 10px; }
.radio { accent-color: var(--or); width: 18px; height: 18px; flex: none; }
.tuile {
  flex: none; width: 30px; height: 30px; display: grid; place-items: center;
  border-radius: 3px; font-family: var(--font); font-weight: 700; background: var(--bleu-vif); color: var(--creme);
}
.tuile.ok { background: var(--or); color: var(--encre); }

.actions { display: flex; gap: 12px; margin-top: 6px; }
.erreur { color: #ffb3b3; margin: 2px 0; }
.succes { color: var(--or); font-weight: 700; margin: 2px 0; }

.liste-tete { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.liste-tete .titre { font-weight: 700; font-size: 1.3rem; color: var(--creme); }
.total { font-weight: 700; color: var(--encre); background: var(--or); border-radius: 3px; padding: 1px 10px; font-size: 0.9rem; }
.muted { color: var(--sourd); }
.carte { padding: 16px 18px; margin-bottom: 12px; }
.carte-tete { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.cat { font-weight: 700; text-transform: uppercase; letter-spacing: 1px; font-size: 0.76rem; color: var(--or); }
.diff { text-transform: capitalize; font-size: 0.82rem; }
.q-texte { font-weight: 700; font-size: 1.1rem; margin: 0 0 10px; color: var(--creme); }
.q-reps { list-style: none; padding: 0; margin: 0 0 12px; display: grid; grid-template-columns: 1fr 1fr; gap: 4px 14px; }
.q-reps li { color: var(--sourd); font-size: 0.92rem; }
.q-reps li b { color: var(--creme); }
.q-reps li.bonne { color: var(--or); font-weight: 700; }
.q-reps li.bonne b { color: var(--or); }
@media (max-width: 520px) { .q-reps { grid-template-columns: 1fr; } }
.carte-actions { display: flex; gap: 10px; }
</style>
