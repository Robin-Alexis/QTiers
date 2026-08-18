const BASE = '/api'

async function req(url, options = {}) {
  const res = await fetch(BASE + url, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  })
  if (res.status === 204) return null
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const message = data?.erreurs?.join(' ') || data?.erreur || `Erreur ${res.status}`
    throw new Error(message)
  }
  return data
}

export const api = {
  aleatoires: (n = 10) => req(`/questions/aleatoires?n=${n}`),
  liste: () => req('/questions'),
  categories: () => req('/categories'),
  creer: (q) => req('/questions', { method: 'POST', body: JSON.stringify(q) }),
  modifier: (id, q) => req(`/questions/${id}`, { method: 'PUT', body: JSON.stringify(q) }),
  supprimer: (id) => req(`/questions/${id}`, { method: 'DELETE' })
}
