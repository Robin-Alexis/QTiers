// Petits effets sonores synthétisés (WebAudio) — pas de fichiers à embarquer.
// L'ambiance "plateau" sans dépendance externe.
let ctx = null
let active = true

function audio() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (AC) ctx = new AC()
  }
  return ctx
}

function bip(freq, duree = 0.12, type = 'sine', gain = 0.06) {
  if (!active) return
  const ac = audio()
  if (!ac) return
  if (ac.state === 'suspended') ac.resume()
  const osc = ac.createOscillator()
  const g = ac.createGain()
  osc.type = type
  osc.frequency.value = freq
  g.gain.setValueAtTime(gain, ac.currentTime)
  g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + duree)
  osc.connect(g).connect(ac.destination)
  osc.start()
  osc.stop(ac.currentTime + duree)
}

export const son = {
  toggle(v) { active = v },
  estActif: () => active,
  tic: () => bip(880, 0.05, 'square', 0.03),
  bonne() {
    bip(660, 0.12, 'sine', 0.07)
    setTimeout(() => bip(990, 0.18, 'sine', 0.07), 90)
  },
  mauvaise() { bip(160, 0.35, 'sawtooth', 0.06) },
  fin() {
    ;[523, 659, 784, 1047].forEach((f, i) => setTimeout(() => bip(f, 0.22, 'triangle', 0.07), i * 130))
  },
  clic: () => bip(440, 0.05, 'sine', 0.04)
}
