import type { Play } from '../types/play'
import { interpolateKeyframes } from './interpolation'

/** Convex hull (gift wrapping) over 2D points. Returns hull vertices in order. */
export function convexHull(points: { x: number; z: number }[]): { x: number; z: number }[] {
  if (points.length < 3) return points
  const pts = [...points]
  let leftmost = 0
  for (let i = 1; i < pts.length; i++) {
    if (pts[i].x < pts[leftmost].x) leftmost = i
  }
  const hull: { x: number; z: number }[] = []
  let p = leftmost
  do {
    hull.push(pts[p])
    let q = (p + 1) % pts.length
    for (let i = 0; i < pts.length; i++) {
      const cross =
        (pts[q].x - pts[p].x) * (pts[i].z - pts[p].z) -
        (pts[q].z - pts[p].z) * (pts[i].x - pts[p].x)
      if (cross < 0) q = i
    }
    p = q
  } while (p !== leftmost && hull.length < pts.length + 1)
  return hull
}

export interface LiveMetrics {
  possession: number
  xg: number
  sprintSpeed: number
  winProb: number
  compactness: number
}

/** Derive plausible live metrics from play state at a given time. */
export function computeMetrics(play: Play | null, time: number): LiveMetrics {
  if (!play) {
    return { possession: 58, xg: 1.8, sprintSpeed: 29.4, winProb: 64, compactness: 42 }
  }
  const ball = interpolateKeyframes(play.ball.keyframes, time)
  // Ball in opponent half boosts possession-flavoured metrics
  const advance = (ball.x + 52.5) / 105 // 0..1 toward opponent goal
  const attackers = play.players.filter((p) => p.team === 'attack')
  const positions = attackers.map((p) => interpolateKeyframes(p.keyframes, time))

  let spread = 0
  if (positions.length > 1) {
    const cx = positions.reduce((s, p) => s + p.x, 0) / positions.length
    const cz = positions.reduce((s, p) => s + p.z, 0) / positions.length
    spread =
      positions.reduce((s, p) => s + Math.hypot(p.x - cx, p.z - cz), 0) / positions.length
  }

  return {
    possession: Math.round(48 + advance * 24),
    xg: Math.round((0.4 + advance * 2.6) * 10) / 10,
    sprintSpeed: Math.round((24 + advance * 10) * 10) / 10,
    winProb: Math.round(52 + advance * 30),
    compactness: Math.round(spread * 10) / 10,
  }
}
