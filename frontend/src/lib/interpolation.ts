import type { Keyframe } from '../types/play'

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

export function interpolateKeyframes(keyframes: Keyframe[], time: number): { x: number; z: number } {
  if (keyframes.length === 0) return { x: 0, z: 0 }
  if (time <= keyframes[0].t) return { x: keyframes[0].x, z: keyframes[0].z }
  const last = keyframes[keyframes.length - 1]
  if (time >= last.t) return { x: last.x, z: last.z }

  for (let i = 0; i < keyframes.length - 1; i++) {
    const a = keyframes[i]
    const b = keyframes[i + 1]
    if (time >= a.t && time <= b.t) {
      const span = b.t - a.t
      const t = span === 0 ? 0 : (time - a.t) / span
      const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
      return { x: lerp(a.x, b.x, ease), z: lerp(a.z, b.z, ease) }
    }
  }
  return { x: last.x, z: last.z }
}

export function randomRoomId(): string {
  return Math.random().toString(36).slice(2, 8)
}

export function randomName(): string {
  const names = ['Coach', 'Analyst', 'Tactician', 'Manager', 'Captain', 'Scout']
  return names[Math.floor(Math.random() * names.length)] + ' ' + Math.floor(Math.random() * 99)
}

export function randomColor(): string {
  const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b', '#22c55e']
  return colors[Math.floor(Math.random() * colors.length)]
}
