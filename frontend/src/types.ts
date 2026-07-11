export type SkillType = 'shot' | 'pass' | 'dribble' | 'first_touch'

export interface CategoryScore {
  name: string
  score: number
  feedback: string
}

export interface Drill {
  name: string
  duration: string
  description: string
  reps: string
}

export interface AnalysisResult {
  overall_score: number
  skill_type: SkillType
  headline: string
  summary: string
  categories: CategoryScore[]
  fixes: string[]
  drills: Drill[]
  xp_earned: number
  badges_unlocked: string[]
  pro_comparison: string
}

export interface PlayerProfile {
  totalXp: number
  level: number
  analyses: AnalysisResult[]
  badges: string[]
}

export const SKILL_OPTIONS: { id: SkillType; label: string; icon: string; desc: string }[] = [
  { id: 'shot', label: 'Shooting', icon: '⚽', desc: 'Power, accuracy & follow-through' },
  { id: 'pass', label: 'Passing', icon: '🎯', desc: 'Weight, vision & body shape' },
  { id: 'dribble', label: 'Dribbling', icon: '💨', desc: 'Control, feints & pace change' },
  { id: 'first_touch', label: 'First Touch', icon: '👟', desc: 'Cushioning & direction' },
]

export const BADGE_ICONS: Record<string, string> = {
  'Clean Technique': '✨',
  'Power Player': '💪',
  'Future Pro': '🌟',
  'World Cup Ready': '🏆',
  'Golden Touch': '🥇',
  'Sharp Shooter': '🎯',
}

export function xpForLevel(level: number): number {
  return level * 200
}

export function levelFromXp(xp: number): number {
  let level = 1
  let needed = 200
  let remaining = xp
  while (remaining >= needed) {
    remaining -= needed
    level++
    needed = level * 200
  }
  return level
}
