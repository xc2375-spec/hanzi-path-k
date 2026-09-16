// Learning progress persistence (localStorage — this browser only)
export interface Progress {
  studied: number[]        // seq numbers marked as learned
  quizTotal: number
  quizCorrect: number
  history: { date: string; correct: number; total: number }[]
}

const KEY = 'hanzi-path-progress-v1'

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return { studied: [], quizTotal: 0, quizCorrect: 0, history: [] }
}

export function saveProgress(p: Progress) {
  localStorage.setItem(KEY, JSON.stringify(p))
}
