import { motion } from 'framer-motion'
import { Clock, Folder, Layers, Share2, Shapes, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { fetchDemos } from '../../lib/api'
import { useTactixStore } from '../../store/useTactixStore'
import type { Play } from '../../types/play'

const NAV = [
  { icon: Folder, label: 'Projects' },
  { icon: Clock, label: 'Recent Plays' },
  { icon: Users, label: 'Teams' },
  { icon: Share2, label: 'Shared Boards' },
]

export function Sidebar() {
  const [demos, setDemos] = useState<Play[]>([])
  const [active, setActive] = useState('Recent Plays')
  const setPlay = useTactixStore((s) => s.setPlay)
  const playId = useTactixStore((s) => s.play?.id)

  useEffect(() => {
    fetchDemos().then(setDemos).catch(() => {})
  }, [])

  return (
    <motion.aside
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 90, damping: 18, delay: 0.15 }}
      className="absolute left-4 top-20 bottom-28 w-60 z-30 glass-deep rounded-3xl flex flex-col overflow-hidden"
    >
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <Shapes className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-black tracking-tight">
            Tactix<span className="text-gradient">3D</span>
          </span>
        </div>

        <nav className="space-y-0.5">
          {NAV.map(({ icon: Icon, label }) => (
            <button
              key={label}
              onClick={() => setActive(label)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-all ${
                active === label
                  ? 'bg-white/10 text-white shadow-inner'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mx-5 border-t border-white/8" />

      <div className="flex-1 overflow-y-auto px-3 py-3">
        <p className="px-2 text-[10px] uppercase tracking-[0.16em] text-zinc-600 font-bold mb-2">
          Play Library
        </p>
        <div className="space-y-1.5">
          {demos.map((d, i) => (
            <motion.button
              key={d.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              onClick={() => setPlay(d, d.description)}
              className={`w-full text-left rounded-xl p-3 transition-all border ${
                playId === d.id
                  ? 'glass-violet border-violet-500/40'
                  : 'border-transparent hover:bg-white/5 hover:border-white/10'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Layers className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                <span className="text-[13px] font-bold truncate">{d.name}</span>
              </div>
              <p className="text-[11px] text-zinc-500 line-clamp-2 leading-snug">{d.description}</p>
              <div className="flex gap-1 mt-1.5">
                {d.tags.slice(0, 2).map((t) => (
                  <span key={t} className="text-[9px] bg-white/6 px-1.5 py-0.5 rounded-full text-zinc-500 font-medium">
                    {t.trim()}
                  </span>
                ))}
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.aside>
  )
}
