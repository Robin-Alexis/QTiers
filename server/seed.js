// Amorce manuelle de la base : `npm run seed` (n'insère que si la base est vide).
import { seedIfEmpty, countQuestions } from './db.js'

const inserted = seedIfEmpty()
if (inserted > 0) {
  console.log(`[QTiers] ${inserted} questions insérées.`)
} else {
  console.log(`[QTiers] Base déjà peuplée (${countQuestions()} questions), rien à faire.`)
}
process.exit(0)
