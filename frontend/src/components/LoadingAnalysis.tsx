import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

const STEPS = [
  'Extracting frames from clip…',
  'Analyzing body mechanics…',
  'Scoring technique categories…',
  'Generating drill plan…',
  'Calculating XP & badges…',
]

interface LoadingAnalysisProps {
  step: number
}

export function LoadingAnalysis({ step }: LoadingAnalysisProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
      <div className="relative w-48 h-48 mb-8">
        <div className="absolute inset-0 rounded-full border-2 border-grass/20 animate-pulse-glow" />
        <div className="absolute inset-4 rounded-full border border-grass/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-grass animate-spin" />
        </div>
        <motion.div
          className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-grass-bright to-transparent animate-scan"
          initial={{ top: '0%' }}
        />
      </div>

      <h2 className="text-2xl font-bold mb-2">Analyzing Your Technique</h2>
      <p className="text-stone-400 text-sm mb-8">PitchIQ AI Coach is reviewing your clip</p>

      <div className="w-full max-w-md space-y-3">
        {STEPS.map((label, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: i <= step ? 1 : 0.3, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`flex items-center gap-3 text-sm ${
              i <= step ? 'text-grass-bright' : 'text-stone-600'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                i < step ? 'bg-grass' : i === step ? 'bg-grass-bright animate-pulse' : 'bg-stone-700'
              }`}
            />
            {label}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
