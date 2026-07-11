import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts'
import type { CategoryScore } from '../types'

interface CategoryChartProps {
  categories: CategoryScore[]
}

export function CategoryChart({ categories }: CategoryChartProps) {
  const data = categories.map((c) => ({
    category: c.name.length > 12 ? c.name.slice(0, 10) + '…' : c.name,
    score: c.score,
    fullMark: 100,
  }))

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
          <PolarGrid stroke="rgba(255,255,255,0.1)" />
          <PolarAngleAxis
            dataKey="category"
            tick={{ fill: '#a8a29e', fontSize: 11 }}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#22c55e"
            fill="#22c55e"
            fillOpacity={0.25}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
