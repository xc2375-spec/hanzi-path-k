import type { CharItem, Script } from '../pages/Home'
import type { Progress } from '../lib/store'

interface Props {
  progress: Progress
  all: CharItem[]
  studied: Set<number>
  script: Script
  onReset: () => void
}

export default function ProgressView({ progress, all, studied, script, onReset }: Props) {
  const rate = progress.quizTotal > 0 ? Math.round(100 * progress.quizCorrect / progress.quizTotal) : 0
  const bandOf = (seq: number) => (seq <= 50 ? 0 : seq <= 200 ? 1 : 2)
  const bandNames = [
    script === 'simp' ? 'Stage A (1–50) · 交际奠基' : 'Stage A (1–50) · 交際奠基',
    script === 'simp' ? 'Stage B (51–200) · 词汇扩张' : 'Stage B (51–200) · 詞彙擴張',
    script === 'simp' ? 'Stage C (201–500) · 自主识字' : 'Stage C (201–500) · 自主識字',
  ]
  const bandCounts = [0, 1, 2].map(bi => all.filter(c => bandOf(c.seq) === bi && studied.has(c.seq)).length)
  const bandTotals = [50, 150, 300]

  return (
    <div className="card-enter space-y-8">
      <div className="grid grid-cols-3 gap-3">
        {[
          ['Characters learned', `${progress.studied.length}`, `of ${all.length}`],
          ['Quiz accuracy', `${rate}%`, `${progress.quizTotal} answers`],
          ['Quiz rounds', `${progress.history.length}`, '10 questions each'],
        ].map(([label, v, sub]) => (
          <div key={label} className="border border-[var(--line)] bg-[var(--paper-2)] p-4">
            <div className="text-xs text-[var(--ink-3)]">{label}</div>
            <div className="mt-1 text-3xl font-semibold">{v}</div>
            <div className="mt-1 text-xs text-[var(--ink-3)]">{sub}</div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="font-kai text-xl mb-3">Progress by stage</h2>
        <div className="space-y-3">
          {bandNames.map((name, i) => (
            <div key={name}>
              <div className="flex justify-between text-sm mb-1">
                <span>{name}</span>
                <span className="text-[var(--ink-3)]">{bandCounts[i]} / {bandTotals[i]}</span>
              </div>
              <div className="h-2 bg-[var(--line)]">
                <div className="h-full bg-[var(--sage)] transition-all"
                  style={{ width: `${(100 * bandCounts[i]) / bandTotals[i]}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {progress.history.length > 0 && (
        <div>
          <h2 className="font-kai text-xl mb-3">Recent quizzes</h2>
          <div className="border border-[var(--line)] divide-y divide-[var(--line)]">
            {progress.history.slice(-8).reverse().map((h, i) => (
              <div key={i} className="flex justify-between px-4 py-2 text-sm bg-[var(--paper-2)]">
                <span>{h.date}</span>
                <span>{h.correct} / {h.total} correct</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="pt-2 text-center">
        <button onClick={() => { if (confirm('Reset all progress? This cannot be undone.')) onReset() }}
          className="text-xs text-[var(--ink-3)] underline hover:text-[var(--cinnabar)]">
          Reset all progress
        </button>
      </div>
    </div>
  )
}
