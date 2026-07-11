import { motion } from 'framer-motion'
import { Bell, Check, Eye, Link2, Pencil, Search, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { getShareUrl } from '../../lib/collab'
import { useTactixStore } from '../../store/useTactixStore'

export function TopNav() {
  const play = useTactixStore((s) => s.play)
  const appMode = useTactixStore((s) => s.appMode)
  const setAppMode = useTactixStore((s) => s.setAppMode)
  const roomId = useTactixStore((s) => s.roomId)
  const collaborators = useTactixStore((s) => s.collaborators)
  const userName = useTactixStore((s) => s.userName)
  const userColor = useTactixStore((s) => s.userColor)
  const [copied, setCopied] = useState(false)

  const copyLink = () => {
    navigator.clipboard.writeText(getShareUrl(roomId))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const avatars = [
    { sid: 'self', name: userName, color: userColor },
    ...collaborators.filter((c) => c.name !== userName),
  ]

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 90, damping: 18 }}
      className="absolute top-4 left-4 right-4 z-30 flex items-center gap-3"
    >
      {/* Search */}
      <div className="glass-deep rounded-2xl flex items-center gap-2 px-4 py-2.5 flex-1 max-w-xs ml-64">
        <Search className="w-4 h-4 text-zinc-500" />
        <input
          placeholder="Search plays, formations…"
          className="bg-transparent text-[13px] outline-none placeholder:text-zinc-600 w-full"
        />
      </div>

      <div className="flex-1" />

      {play && (
        <div className="glass-deep rounded-2xl px-4 py-2.5 text-[13px] font-semibold text-zinc-300 hidden lg:block">
          {play.name}
        </div>
      )}

      {/* AI status */}
      <div className="glass-deep rounded-2xl px-3.5 py-2.5 flex items-center gap-2 text-xs font-semibold text-zinc-400">
        <Sparkles className="w-3.5 h-3.5 text-violet-400" />
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
        AI Ready
      </div>

      {/* Collaborator avatars */}
      <div className="glass-deep rounded-2xl px-3 py-2 flex items-center">
        <div className="flex -space-x-2">
          {avatars.slice(0, 4).map((c) => (
            <div
              key={c.sid}
              className="w-7 h-7 rounded-full border-2 border-[#101018] flex items-center justify-center text-[10px] font-black text-white"
              style={{ backgroundColor: c.color }}
              title={c.name}
            >
              {c.name[0]}
            </div>
          ))}
        </div>
        <span className="text-[11px] text-zinc-500 ml-2 font-medium">{avatars.length} live</span>
      </div>

      <button className="glass-deep rounded-2xl p-2.5 hover:bg-white/10 transition-colors relative">
        <Bell className="w-4 h-4 text-zinc-400" />
        <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-violet-500" />
      </button>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setAppMode(appMode === 'edit' ? 'view' : 'edit')}
        className={`glass-deep rounded-2xl px-4 py-2.5 flex items-center gap-2 text-[13px] font-semibold transition-all ${
          appMode === 'edit' ? 'text-amber-300 border-amber-400/40' : 'text-zinc-300'
        }`}
      >
        {appMode === 'edit' ? <Pencil className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        {appMode === 'edit' ? 'Editing' : 'Viewing'}
      </motion.button>

      <motion.button whileTap={{ scale: 0.95 }} onClick={copyLink} className="btn-primary rounded-2xl px-5 py-2.5 flex items-center gap-2 text-[13px] font-bold text-white">
        {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
        {copied ? 'Copied!' : 'Share'}
      </motion.button>
    </motion.header>
  )
}
