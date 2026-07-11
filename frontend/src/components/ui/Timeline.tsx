import { motion } from 'framer-motion'
import { Camera, Pause, Play, RotateCcw } from 'lucide-react'
import { broadcastPlayback } from '../../lib/collab'
import { useTactixStore } from '../../store/useTactixStore'
import type { CameraMode } from '../../types/play'

const SPEEDS = [0.5, 1, 2]
const CAMERAS: { id: CameraMode; label: string }[] = [
  { id: 'broadcast', label: 'Broadcast' },
  { id: 'tactical', label: 'Tactical' },
  { id: 'sideline', label: 'Sideline' },
  { id: 'free', label: 'Free' },
]

export function Timeline() {
  const play = useTactixStore((s) => s.play)
  const currentTime = useTactixStore((s) => s.currentTime)
  const isPlaying = useTactixStore((s) => s.isPlaying)
  const playbackSpeed = useTactixStore((s) => s.playbackSpeed)
  const cameraMode = useTactixStore((s) => s.cameraMode)
  const setCurrentTime = useTactixStore((s) => s.setCurrentTime)
  const setPlaying = useTactixStore((s) => s.setPlaying)
  const setPlaybackSpeed = useTactixStore((s) => s.setPlaybackSpeed)
  const setCameraMode = useTactixStore((s) => s.setCameraMode)
  const roomId = useTactixStore((s) => s.roomId)

  if (!play) return null

  const pct = (currentTime / play.duration) * 100

  const togglePlay = () => {
    const next = !isPlaying
    if (!next || currentTime < play.duration) {
      setPlaying(next)
    } else {
      setCurrentTime(0)
      setPlaying(true)
    }
    broadcastPlayback(roomId, next, currentTime)
  }

  const reset = () => {
    setCurrentTime(0)
    setPlaying(false)
    broadcastPlayback(roomId, false, 0)
  }

  return (
    <motion.div
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 90, damping: 18, delay: 0.35 }}
      className="absolute bottom-4 left-4 right-4 z-30 glass-deep rounded-3xl px-5 py-3.5 flex items-center gap-4"
    >
      {/* Transport */}
      <div className="flex items-center gap-2">
        <button onClick={reset} className="p-2 hover:bg-white/10 rounded-xl transition-colors" title="Replay">
          <RotateCcw className="w-4 h-4 text-zinc-400" />
        </button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={togglePlay}
          className="btn-primary p-3 rounded-2xl"
        >
          {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white pl-0.5" />}
        </motion.button>
      </div>

      {/* Scrubber */}
      <div className="flex-1">
        <input
          type="range"
          min={0}
          max={play.duration}
          step={0.05}
          value={currentTime}
          onChange={(e) => {
            const t = parseFloat(e.target.value)
            setCurrentTime(t)
            setPlaying(false)
            broadcastPlayback(roomId, false, t)
          }}
          className="w-full h-1.5 rounded-full cursor-pointer"
          style={{
            background: `linear-gradient(to right, #8b5cf6 ${pct}%, rgba(255,255,255,0.08) ${pct}%)`,
          }}
        />
        <div className="flex justify-between mt-0.5 text-[10px] text-zinc-600 tabular-nums font-medium">
          <span>{currentTime.toFixed(1)}s</span>
          <span>{play.duration.toFixed(1)}s</span>
        </div>
      </div>

      {/* Speed */}
      <div className="flex items-center gap-0.5 glass rounded-xl p-1">
        {SPEEDS.map((s) => (
          <button
            key={s}
            onClick={() => setPlaybackSpeed(s)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold tabular-nums transition-all ${
              playbackSpeed === s ? 'bg-violet-600 text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {s}×
          </button>
        ))}
      </div>

      {/* Cameras */}
      <div className="flex items-center gap-0.5 glass rounded-xl p-1">
        <Camera className="w-3.5 h-3.5 text-zinc-600 mx-1.5" />
        {CAMERAS.map((c) => (
          <button
            key={c.id}
            onClick={() => setCameraMode(c.id)}
            className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all ${
              cameraMode === c.id ? 'bg-violet-600 text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
    </motion.div>
  )
}
