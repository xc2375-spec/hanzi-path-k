import { useState } from 'react'
import type { CharItem, Script } from '../pages/Home'

interface Props {
  all: CharItem[]
  studied: Set<number>
  current: CharItem
  script: Script
  onMaster: (seq: number) => void
}

const MORPHEME_EN: Record<string, string> = {
  '自由語素': 'free morpheme',
  '黏著語素': 'bound morpheme',
}

export default function LearnMode({ all, studied, current, script, onMaster }: Props) {
  const [item, setItem] = useState<CharItem>(current)
  const [flipped, setFlipped] = useState(false)

  const idx = all.findIndex(c => c.seq === item.seq)
  const go = (d: number) => {
    const ni = Math.min(all.length - 1, Math.max(0, idx + d))
    setItem(all[ni]); setFlipped(false)
  }

  const mastered = studied.has(item.seq)
  const big = script === 'simp' ? item.char : item.charT
  const comp = script === 'simp' ? item.comp : item.compT

  return (
    <div className="card-enter">
      {/* Flashcard */}
      <div className="mx-auto max-w-md cursor-pointer select-none" style={{ perspective: '1200px' }}
        onClick={() => setFlipped(f => !f)}>
        <div className={`flip-inner relative aspect-square ${flipped ? 'flipped' : ''}`}>
          {/* Front: character on rice grid */}
          <div className="face absolute inset-0 rice-grid border-2 border-[var(--ink)] flex items-center justify-center">
            <span className="char-display text-[11rem] leading-none text-[var(--ink)]">{big}</span>
            <span className="absolute top-3 left-3 text-xs text-[var(--ink-3)]">No. {item.seq}</span>
            <span className="absolute top-3 right-3 text-xs text-[var(--ink-3)]">HSK {item.level}</span>
            {mastered && <span className="absolute bottom-3 right-3 text-xs text-[var(--sage)] font-semibold">Learned ✓</span>}
            <span className="absolute bottom-3 left-3 text-xs text-[var(--ink-3)]">Tap to flip</span>
          </div>
          {/* Back: details */}
          <div className="face face-back absolute inset-0 bg-[var(--paper-2)] border-2 border-[var(--ink)] p-6 flex flex-col justify-center gap-3 overflow-auto">
            <div className="text-3xl font-semibold">{item.pinyin}</div>
            <div className="text-lg text-[var(--ink-3)]">{item.gloss || '—'}</div>
            <div className="mt-2 text-sm leading-7">
              <div><span className="text-[var(--ink-3)]">Components: </span><span className="font-kai text-lg">{comp}</span></div>
              <div><span className="text-[var(--ink-3)]">Strokes: </span>{item.strokes} · {MORPHEME_EN[item.morpheme] ?? item.morpheme}</div>
            </div>
            {item.words.length > 0 && (
              <div className="mt-1">
                <div className="text-sm text-[var(--ink-3)] mb-1">Words unlocked by this character:</div>
                <div className="flex flex-wrap gap-2">
                  {item.words.map((w, i) => (
                    <span key={i} className="border border-[var(--line)] px-2 py-1 text-sm bg-[var(--paper)]" title={w.g}>
                      <span className="font-kai">{script === 'simp' ? w.w : w.wt}</span>
                      {w.g && <span className="ml-1 text-xs text-[var(--ink-3)]">{w.g}</span>}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-6 flex items-center justify-center gap-3">
        <button onClick={() => go(-1)} disabled={idx <= 0}
          className="px-5 py-2 border border-[var(--ink)] text-sm disabled:opacity-30 hover:bg-[var(--paper-2)]">← Prev</button>
        {!mastered ? (
          <button onClick={() => { onMaster(item.seq); go(1) }}
            className="px-8 py-2 bg-[var(--cinnabar)] text-white text-sm font-semibold hover:opacity-90">
            Got it — next →
          </button>
        ) : (
          <button onClick={() => go(1)} disabled={idx >= all.length - 1}
            className="px-8 py-2 bg-[var(--ink)] text-[var(--paper)] text-sm disabled:opacity-30">Next →</button>
        )}
      </div>

      {/* Progress bar */}
      <div className="mt-6 mx-auto max-w-md">
        <div className="h-1.5 bg-[var(--line)]">
          <div className="h-full bg-[var(--cinnabar)] transition-all" style={{ width: `${(100 * idx) / (all.length - 1)}%` }} />
        </div>
        <div className="mt-1 flex justify-between text-xs text-[var(--ink-3)]">
          <span>Position {item.seq} / {all.length}</span>
          <button className="underline hover:text-[var(--ink)]" onClick={() => { setItem(current); setFlipped(false) }}>
            Jump to next unlearned
          </button>
        </div>
      </div>
    </div>
  )
}
