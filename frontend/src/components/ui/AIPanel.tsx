import { AnimatePresence, motion } from 'framer-motion'
import { Brain, Layers, Send, Sparkles, Wand2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { generatePlay } from '../../lib/api'
import { computeMetrics } from '../../lib/metrics'
import { useTactixStore } from '../../store/useTactixStore'
import type { OverlayState } from '../../store/useTactixStore'
import { PROMPT_SUGGESTIONS } from '../../types/play'

const THINKING_STEPS = [
  'Parsing tactical intent…',
  'Selecting formation shape…',
  'Choreographing player runs…',
  'Synchronizing ball movement…',
  'Rendering 3D simulation…',
]

const OVERLAY_TOGGLES: { key: keyof OverlayState; label: string }[] = [
  { key: 'passes', label: 'Passing Lanes' },
  { key: 'trails', label: 'Running Trails' },
  { key: 'heatmap', label: 'Heatmap' },
  { key: 'shape', label: 'Team Shape' },
  { key: 'pressure', label: 'Pressure Zones' },
]

export function AIPanel() {
  const [prompt, setPrompt] = useState('')
  const isGenerating = useTactixStore((s) => s.isGenerating)
  const thinkingStep = useTactixStore((s) => s.thinkingStep)
  const setThinkingStep = useTactixStore((s) => s.setThinkingStep)
  const aiSummary = useTactixStore((s) => s.aiSummary)
  const play = useTactixStore((s) => s.play)
  const currentTime = useTactixStore((s) => s.currentTime)
  const setPlay = useTactixStore((s) => s.setPlay)
  const setGenerating = useTactixStore((s) => s.setGenerating)
  const overlays = useTactixStore((s) => s.overlays)
  const toggleOverlay = useTactixStore((s) => s.toggleOverlay)

  useEffect(() => {
    if (!isGenerating) return
    const iv = setInterval(() => {
      setThinkingStep(Math.min(useTactixStore.getState().thinkingStep + 1, THINKING_STEPS.length - 1))
    }, 550)
    return () => clearInterval(iv)
  }, [isGenerating, setThinkingStep])

  const metrics = computeMetrics(play, currentTime)

  const handleGenerate = async (text?: string, demo = false) => {
    const p = text || prompt
    if (!p.trim() || isGenerating) return
    setGenerating(true)
    try {
      const res = await generatePlay(p, demo)
      // Let the thinking animation breathe before revealing
      await new Promise((r) => setTimeout(r, 1200))
      setPlay(res.play, res.ai_summary)
      setPrompt('')
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Generation failed')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <motion.aside
      initial={{ x: 80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 90, damping: 18, delay: 0.25 }}
      className="absolute right-4 top-20 bottom-28 w-[300px] z-30 glass-deep rounded-3xl flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/8 bg-gradient-to-r from-violet-500/10 to-indigo-500/5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <Wand2 className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-sm leading-tight">AI Assistant</h2>
            <p className="text-[10px] text-zinc-500">Natural language → 3D tactics</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Input */}
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder='"Generate a high press against a 4-3-3"'
            className="w-full h-24 bg-black/40 border border-white/10 rounded-2xl p-3.5 text-[13px] text-white placeholder:text-zinc-600 resize-none focus:outline-none focus:border-violet-500/60 focus:shadow-[0_0_24px_-8px_rgba(139,92,246,0.5)] transition-all"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleGenerate()
              }
            }}
          />
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => handleGenerate()}
          disabled={isGenerating || !prompt.trim()}
          className="btn-primary w-full flex items-center justify-center gap-2 text-white font-bold py-3 rounded-2xl text-sm disabled:opacity-40 disabled:pointer-events-none"
        >
          <Send className="w-4 h-4" />
          Generate Play
        </motion.button>

        {/* Thinking state */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="glass-violet rounded-2xl p-4 overflow-hidden"
            >
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-4 h-4 text-violet-300 animate-pulse" />
                <span className="text-xs font-bold text-violet-200">AI Reasoning</span>
              </div>
              <div className="space-y-2">
                {THINKING_STEPS.map((step, i) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: i <= thinkingStep ? 1 : 0.25, x: 0 }}
                    className="flex items-center gap-2 text-[11px]"
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        i < thinkingStep ? 'bg-emerald-400' : i === thinkingStep ? 'bg-violet-400 pulse-dot' : 'bg-zinc-700'
                      }`}
                    />
                    <span className={i === thinkingStep ? 'shimmer-text font-medium' : 'text-zinc-400'}>
                      {step}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result card */}
        <AnimatePresence>
          {aiSummary && play && !isGenerating && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 140, damping: 16 }}
              className="glass-violet rounded-2xl p-4"
            >
              <div className="flex items-center gap-1.5 text-violet-300 text-xs font-bold mb-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {play.name}
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">{aiSummary}</p>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="bg-black/30 rounded-xl px-3 py-2">
                  <p className="text-[9px] uppercase tracking-wider text-zinc-600 font-bold">Win Prob</p>
                  <p className="text-sm font-black text-emerald-400 tabular-nums">{metrics.winProb}%</p>
                </div>
                <div className="bg-black/30 rounded-xl px-3 py-2">
                  <p className="text-[9px] uppercase tracking-wider text-zinc-600 font-bold">xG Impact</p>
                  <p className="text-sm font-black text-sky-400 tabular-nums">+{metrics.xg}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick prompts */}
        {!isGenerating && (
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-600 font-bold mb-2">
              Quick Prompts
            </p>
            <div className="space-y-1.5">
              {PROMPT_SUGGESTIONS.slice(0, 4).map((s) => (
                <button
                  key={s}
                  onClick={() => handleGenerate(s, true)}
                  className="w-full text-left text-[11px] glass hover:border-violet-500/40 hover:bg-white/8 px-3 py-2 rounded-xl text-zinc-400 hover:text-white transition-all truncate"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Overlay toggles */}
        <div>
          <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-600 font-bold mb-2 flex items-center gap-1.5">
            <Layers className="w-3 h-3" />
            Tactical Overlays
          </p>
          <div className="space-y-1">
            {OVERLAY_TOGGLES.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => toggleOverlay(key)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/5 transition-colors group"
              >
                <span className="text-[12px] text-zinc-400 group-hover:text-zinc-200 font-medium">{label}</span>
                <span
                  className={`w-8 h-[18px] rounded-full relative transition-colors ${
                    overlays[key] ? 'bg-violet-600' : 'bg-zinc-800'
                  }`}
                >
                  <span
                    className={`absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white transition-all shadow ${
                      overlays[key] ? 'left-[16px]' : 'left-[2px]'
                    }`}
                  />
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.aside>
  )
}
