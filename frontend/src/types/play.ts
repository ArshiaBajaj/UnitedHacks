export interface Keyframe {
  t: number
  x: number
  z: number
}

export interface PlayerTrack {
  id: string
  team: 'attack' | 'defense' | 'neutral'
  number: number
  role: string
  keyframes: Keyframe[]
}

export interface BallTrack {
  keyframes: Keyframe[]
}

export interface Play {
  id: string
  name: string
  description: string
  duration: number
  tags: string[]
  players: PlayerTrack[]
  ball: BallTrack
}

export interface Collaborator {
  sid: string
  name: string
  color: string
}

export type CameraMode = 'broadcast' | 'tactical' | 'sideline' | 'free'
export type AppMode = 'view' | 'edit'

export const TEAM_COLORS = {
  attack: '#2563eb',
  defense: '#dc2626',
  neutral: '#a3a3a3',
} as const

export const PITCH = { length: 105, width: 68, halfL: 52.5, halfW: 34 }

export const PROMPT_SUGGESTIONS = [
  'Run a counterattack with the winger cutting inside',
  'Near-post corner kick routine with far-post runner',
  'High press trap on the left side when their LB receives',
  'Build from the back through the CDM pivot',
  'Overlap run — fullback overlaps winger on the right',
]

export const FORMATIONS: Record<string, { x: number; z: number; team: 'attack' | 'defense'; number: number; role: string }[]> = {
  '4-3-3': [
    { x: 45, z: 0, team: 'attack', number: 1, role: 'GK' },
    { x: 35, z: -25, team: 'attack', number: 2, role: 'RB' },
    { x: 35, z: -8, team: 'attack', number: 4, role: 'CB' },
    { x: 35, z: 8, team: 'attack', number: 5, role: 'CB' },
    { x: 35, z: 25, team: 'attack', number: 3, role: 'LB' },
    { x: 20, z: -12, team: 'attack', number: 6, role: 'CM' },
    { x: 20, z: 0, team: 'attack', number: 8, role: 'CM' },
    { x: 20, z: 12, team: 'attack', number: 10, role: 'CM' },
    { x: 5, z: -22, team: 'attack', number: 7, role: 'LW' },
    { x: 5, z: 0, team: 'attack', number: 9, role: 'ST' },
    { x: 5, z: 22, team: 'attack', number: 11, role: 'RW' },
  ],
}
