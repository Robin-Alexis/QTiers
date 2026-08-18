import express from 'express'
import cors from 'cors'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  seedIfEmpty, listQuestions, randomQuestions, getQuestion,
  createQuestion, updateQuestion, deleteQuestion, listCategories, countQuestions
} from './db.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PORT = process.env.PORT || 3000
const app = express()
app.use(cors())
app.use(express.json())

// Amorce la base au démarrage si elle est vide.
const seeded = seedIfEmpty()
if (seeded > 0) console.log(`[QTiers] Base amorcée avec ${seeded} questions.`)

// --- Validation d'une question ---
function validerQuestion(body) {
  const erreurs = []
  if (!body || typeof body.question !== 'string' || !body.question.trim()) {
    erreurs.push('La question est obligatoire.')
  }
  if (!Array.isArray(body?.reponses) || body.reponses.length !== 4) {
    erreurs.push('Il faut exactement 4 réponses.')
  } else if (body.reponses.some((r) => typeof r !== 'string' || !r.trim())) {
    erreurs.push('Les 4 réponses doivent être renseignées.')
  }
  const bonne = Number(body?.bonne)
  if (!Number.isInteger(bonne) || bonne < 0 || bonne > 3) {
    erreurs.push('La bonne réponse doit être un index entre 0 et 3.')
  }
  return erreurs
}

function normaliser(body) {
  return {
    categorie: body.categorie,
    question: body.question,
    reponses: body.reponses.map((r) => r.trim()),
    bonne: Number(body.bonne),
    difficulte: body.difficulte
  }
}

const router = express.Router()

router.get('/health', (req, res) => res.json({ status: 'ok', questions: countQuestions() }))

router.get('/questions', (req, res) => res.json(listQuestions()))

router.get('/questions/aleatoires', (req, res) => {
  const n = Math.min(Math.max(parseInt(req.query.n, 10) || 10, 1), 50)
  res.json(randomQuestions(n))
})

router.get('/categories', (req, res) => res.json(listCategories()))

router.get('/questions/:id', (req, res) => {
  const q = getQuestion(Number(req.params.id))
  if (!q) return res.status(404).json({ erreur: 'Question introuvable.' })
  res.json(q)
})

router.post('/questions', (req, res) => {
  const erreurs = validerQuestion(req.body)
  if (erreurs.length) return res.status(400).json({ erreurs })
  res.status(201).json(createQuestion(normaliser(req.body)))
})

router.put('/questions/:id', (req, res) => {
  const id = Number(req.params.id)
  if (!getQuestion(id)) return res.status(404).json({ erreur: 'Question introuvable.' })
  const erreurs = validerQuestion(req.body)
  if (erreurs.length) return res.status(400).json({ erreurs })
  res.json(updateQuestion(id, normaliser(req.body)))
})

router.delete('/questions/:id', (req, res) => {
  const ok = deleteQuestion(Number(req.params.id))
  if (!ok) return res.status(404).json({ erreur: 'Question introuvable.' })
  res.status(204).end()
})

app.use('/api', router)

// --- Sert le front buildé (client/dist) en production, avec fallback SPA ---
const distDir = join(__dirname, '..', 'client', 'dist')
if (existsSync(join(distDir, 'index.html'))) {
  app.use(express.static(distDir))
  app.get(/^(?!\/api).*/, (req, res) => res.sendFile(join(distDir, 'index.html')))
} else {
  app.get('/', (req, res) =>
    res.type('text').send('QTiers API en ligne. Lance le client (npm run dev) ou build le front (npm run build).')
  )
}

app.listen(PORT, () => console.log(`[QTiers] Serveur démarré sur http://localhost:${PORT}`))
