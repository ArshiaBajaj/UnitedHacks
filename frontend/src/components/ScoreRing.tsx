import { motion } from 'framer-motion'

interface ScoreRingProps {
  score: number
  size?: number
}

function scoreColor(score: number): string {
  if (score >= 80) return '#4ade80'
  if (score >= 60) return '#22c55e'
  if (score >= 40) return '#fbbf24'
  return '#f87171'
}

function scoreLabel(score: number): string {
  if (score >= 85) return 'Elite'
  if (score >= 70) return 'Strong'
  if (score >= 55) return 'Developing'
  return 'Building'
}

export function ScoreRing({ score, size = 180 }: ScoreRingProps) {
  const stroke = 10
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = scoreColor(score)

  return (
    <div className="relative score-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-5xl font-black tabular-nums"
          style={{ color }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {score}
        </motion.span>
        <span className="text-xs uppercase tracking-widest text-stone-400 mt-1">
          {scoreLabel(score)}
        </span>
      </div>
    </div>
  )
}
