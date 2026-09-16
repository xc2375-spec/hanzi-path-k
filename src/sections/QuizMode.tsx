import { useState } from 'react'
import type { CharItem, Script } from '../pages/Home'

interface Props {
  pool: CharItem[]
  fallback: CharItem[]
  studiedCount: number
  script: Script
  onDone: (correct: number, total: number) => void
}

interface Q { target: CharItem; options: string[]; kind: 'pinyin' | 'gloss' }

const QUIZ_N = 10

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function QuizMode({ pool, fallback, studiedCount, script, onDone }: Props) {
  const source = pool.length >= 8 ? pool : fallback
  const [questions, setQuestions] = useState<Q[] | null>(null)
  const [step, setStep] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [correct, setCorrect] = useState(0)

  const start = () => {
    const targets = shuffle(source).slice(0, QUIZ_N)
    const qs: Q[] = targets.map(t => {
      const kind: 'pinyin' | 'gloss' = Math.random() < 0.5 ? 'pinyin' : 'gloss'
      const others = shuffle(source.filter(c => c.char !== t.char)).slice(0, 3)
      const opts = shuffle([t, ...others].map(c => kind === 'pinyin' ? c.pinyin : (c.gloss || c.pinyin)))
      return { target: t, options: opts, kind }
    })
    setQuestions(qs); setStep(0); setPicked(null); setCorrect(0)
  }

  const q = questions?.[step]

  const choose = (opt: string) => {
    if (picked || !q) return
    setPicked(opt)
    const key = q.kind === 'pinyin' ? q.target.pinyin : (q.target.gloss || q.target.pinyin)
    if (opt === key) setCorrect(c => c + 1)
  }

  const next = () => {
    if (!questions) return
    if (step + 1 >= questions.length) {
      onDone(correct, questions.length)
      setQuestions(null)
    } else {
      setStep(s => s + 1); setPicked(null)
    }
  }

  if (!questions) {
    return (
      <div className="card-enter mx-auto max-w-md text-center">
        <div className="rice-grid border-2 border-[var(--ink)] py-14 px-6">
          <div className="font-kai text-3xl">Quiz</div>
          <p className="mt-3 text-sm text-[var(--ink-3)] leading-6">
            10 questions per round: see a character, pick the correct pinyin or English meaning.<br />
            Questions are drawn from the characters you have marked as learned.
          </p>
          {pool.length < 8 && (
            <p className="mt-3 text-xs text-[var(--cinnabar)]">
              You have learned {studiedCount} character(s) — fewer than 8, so this round draws from the first 20 characters of the sequence.
            </p>
          )}
          <button onClick={start}
            className="mt-6 px-10 py-3 bg-[var(--cinnabar)] text-white font-semibold hover:opacity-90">
            Start quiz
          </button>
        </div>
      </div>
    )
  }

  const answerKey = q!.kind === 'pinyin' ? q!.target.pinyin : (q!.target.gloss || q!.target.pinyin)
  const big = script === 'simp' ? q!.target.char : q!.target.charT

  return (
    <div className="card-enter mx-auto max-w-md">
      <div className="flex justify-between text-sm text-[var(--ink-3)] mb-3">
        <span>Question {step + 1} / {questions.length}</span>
        <span>{q!.kind === 'pinyin' ? 'Pick the correct pinyin' : 'Pick the correct meaning'}</span>
      </div>

      <div className="rice-grid border-2 border-[var(--ink)] py-10 flex items-center justify-center">
        <span className="char-display text-8xl">{big}</span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2">
        {q!.options.map(opt => {
          const isKey = opt === answerKey
          const isPicked = opt === picked
          let cls = 'border-[var(--line)] bg-[var(--paper-2)] hover:border-[var(--ink-3)]'
          if (picked) {
            if (isKey) cls = 'border-[var(--sage)] bg-[var(--sage)]/15 text-[var(--ink)]'
            else if (isPicked) cls = 'border-[var(--cinnabar)] bg-[var(--cinnabar)]/10 text-[var(--cinnabar)]'
            else cls = 'border-[var(--line)] opacity-50'
          }
          return (
            <button key={opt} onClick={() => choose(opt)} disabled={!!picked}
              className={`border px-4 py-3 text-left transition-colors ${cls}`}>
              {opt}
            </button>
          )
        })}
      </div>

      {picked && (
        <div className="mt-4 flex items-center justify-between">
          <span className={`text-sm font-semibold ${picked === answerKey ? 'text-[var(--sage)]' : 'text-[var(--cinnabar)]'}`}>
            {picked === answerKey ? '✓ Correct' : `✗ Answer: ${answerKey}`}
          </span>
          <button onClick={next} className="px-6 py-2 bg-[var(--ink)] text-[var(--paper)] text-sm">
            {step + 1 >= questions.length ? 'See results' : 'Next →'}
          </button>
        </div>
      )}
    </div>
  )
}
