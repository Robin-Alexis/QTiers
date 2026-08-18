import Database from 'better-sqlite3'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { SEED_QUESTIONS } from './seed-data.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Chemin de la base : configurable via QTIERS_DB, sinon fichier local au serveur.
const DB_PATH = process.env.QTIERS_DB || join(__dirname, 'qtiers.db')

const db = new Database(DB_PATH)
db.pragma('journal_mode = WAL')

db.exec(`
  CREATE TABLE IF NOT EXISTS questions (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    categorie     TEXT    NOT NULL DEFAULT 'Général',
    question      TEXT    NOT NULL,
    reponse_a     TEXT    NOT NULL,
    reponse_b     TEXT    NOT NULL,
    reponse_c     TEXT    NOT NULL,
    reponse_d     TEXT    NOT NULL,
    bonne_reponse INTEGER NOT NULL CHECK (bonne_reponse BETWEEN 0 AND 3),
    difficulte    TEXT    NOT NULL DEFAULT 'moyen',
    created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
  );
`)

/**
 * Insère les questions de démonstration si la table est vide.
 * @returns {number} nombre de questions insérées
 */
export function seedIfEmpty() {
  const { total } = db.prepare('SELECT COUNT(*) AS total FROM questions').get()
  if (total > 0) return 0

  const insert = db.prepare(`
    INSERT INTO questions (categorie, question, reponse_a, reponse_b, reponse_c, reponse_d, bonne_reponse, difficulte)
    VALUES (@categorie, @question, @a, @b, @c, @d, @bonne, @difficulte)
  `)
  const insertMany = db.transaction((questions) => {
    for (const q of questions) {
      insert.run({
        categorie: q.categorie,
        question: q.question,
        a: q.reponses[0],
        b: q.reponses[1],
        c: q.reponses[2],
        d: q.reponses[3],
        bonne: q.bonne,
        difficulte: q.difficulte
      })
    }
  })
  insertMany(SEED_QUESTIONS)
  return SEED_QUESTIONS.length
}

// --- Helpers de mapping ---
function rowToQuestion(row) {
  if (!row) return null
  return {
    id: row.id,
    categorie: row.categorie,
    question: row.question,
    reponses: [row.reponse_a, row.reponse_b, row.reponse_c, row.reponse_d],
    bonne: row.bonne_reponse,
    difficulte: row.difficulte,
    createdAt: row.created_at
  }
}

// --- CRUD ---
export function listQuestions() {
  return db.prepare('SELECT * FROM questions ORDER BY id DESC').all().map(rowToQuestion)
}

export function randomQuestions(n = 10) {
  return db.prepare('SELECT * FROM questions ORDER BY RANDOM() LIMIT ?').all(n).map(rowToQuestion)
}

export function getQuestion(id) {
  return rowToQuestion(db.prepare('SELECT * FROM questions WHERE id = ?').get(id))
}

export function createQuestion(q) {
  const info = db.prepare(`
    INSERT INTO questions (categorie, question, reponse_a, reponse_b, reponse_c, reponse_d, bonne_reponse, difficulte)
    VALUES (@categorie, @question, @a, @b, @c, @d, @bonne, @difficulte)
  `).run({
    categorie: q.categorie?.trim() || 'Général',
    question: q.question.trim(),
    a: q.reponses[0], b: q.reponses[1], c: q.reponses[2], d: q.reponses[3],
    bonne: q.bonne,
    difficulte: q.difficulte || 'moyen'
  })
  return getQuestion(info.lastInsertRowid)
}

export function updateQuestion(id, q) {
  db.prepare(`
    UPDATE questions
    SET categorie = @categorie, question = @question,
        reponse_a = @a, reponse_b = @b, reponse_c = @c, reponse_d = @d,
        bonne_reponse = @bonne, difficulte = @difficulte
    WHERE id = @id
  `).run({
    id,
    categorie: q.categorie?.trim() || 'Général',
    question: q.question.trim(),
    a: q.reponses[0], b: q.reponses[1], c: q.reponses[2], d: q.reponses[3],
    bonne: q.bonne,
    difficulte: q.difficulte || 'moyen'
  })
  return getQuestion(id)
}

export function deleteQuestion(id) {
  return db.prepare('DELETE FROM questions WHERE id = ?').run(id).changes > 0
}

export function listCategories() {
  return db.prepare('SELECT DISTINCT categorie FROM questions ORDER BY categorie').all().map((r) => r.categorie)
}

export function countQuestions() {
  return db.prepare('SELECT COUNT(*) AS total FROM questions').get().total
}

export default db
