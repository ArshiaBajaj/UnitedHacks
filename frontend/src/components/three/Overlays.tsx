import { Line } from '@react-three/drei'
import { useMemo } from 'react'
import * as THREE from 'three'
import { convexHull } from '../../lib/metrics'
import { interpolateKeyframes } from '../../lib/interpolation'
import type { Play } from '../../types/play'
import { TEAM_COLORS } from '../../types/play'

/** Radial gradient texture shared by heatmap/pressure sprites. */
function useRadialTexture(color: string) {
  return useMemo(() => {
    const size = 128
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')!
    const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    grad.addColorStop(0, color)
    grad.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, size, size)
    const tex = new THREE.CanvasTexture(canvas)
    tex.needsUpdate = true
    return tex
  }, [color])
}

export function Heatmap({ play, time }: { play: Play; time: number }) {
  const tex = useRadialTexture('rgba(59,130,246,0.5)')
  const attackers = play.players.filter((p) => p.team === 'attack')

  return (
    <group>
      {attackers.map((p) => {
        const pos = interpolateKeyframes(p.keyframes, time)
        return (
          <mesh key={p.id} position={[pos.x, 0.04, pos.z]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[14, 14]} />
            <meshBasicMaterial map={tex} transparent depthWrite={false} blending={THREE.AdditiveBlending} opacity={0.55} />
          </mesh>
        )
      })}
    </group>
  )
}

export function PressureZones({ play, time }: { play: Play; time: number }) {
  const tex = useRadialTexture('rgba(239,68,68,0.5)')
  const defenders = play.players.filter((p) => p.team === 'defense')

  return (
    <group>
      {defenders.map((p) => {
        const pos = interpolateKeyframes(p.keyframes, time)
        return (
          <mesh key={p.id} position={[pos.x, 0.045, pos.z]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[11, 11]} />
            <meshBasicMaterial map={tex} transparent depthWrite={false} blending={THREE.AdditiveBlending} opacity={0.5} />
          </mesh>
        )
      })}
    </group>
  )
}

export function TeamShape({ play, time }: { play: Play; time: number }) {
  const attackers = play.players.filter((p) => p.team === 'attack')
  const positions = attackers.map((p) => interpolateKeyframes(p.keyframes, time))
  const hull = convexHull(positions)

  const points = useMemo(() => {
    if (hull.length < 3) return null
    const pts = hull.map((h) => [h.x, 0.06, h.z] as [number, number, number])
    pts.push(pts[0])
    return pts
  }, [hull])

  const shapeGeo = useMemo(() => {
    if (hull.length < 3) return null
    const shape = new THREE.Shape()
    shape.moveTo(hull[0].x, hull[0].z)
    for (let i = 1; i < hull.length; i++) shape.lineTo(hull[i].x, hull[i].z)
    shape.closePath()
    return new THREE.ShapeGeometry(shape)
  }, [hull])

  if (!points || !shapeGeo) return null

  return (
    <group>
      <Line points={points} color={TEAM_COLORS.attack} lineWidth={2} transparent opacity={0.7} />
      <mesh geometry={shapeGeo} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <meshBasicMaterial color={TEAM_COLORS.attack} transparent opacity={0.08} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  )
}

export function PassLanes({ play }: { play: Play }) {
  const segments = useMemo(() => {
    const kfs = play.ball.keyframes
    const lines: { start: [number, number, number]; end: [number, number, number] }[] = []
    for (let i = 0; i < kfs.length - 1; i++) {
      const a = kfs[i]
      const b = kfs[i + 1]
      if (Math.hypot(b.x - a.x, b.z - a.z) > 8) {
        lines.push({ start: [a.x, 0.1, a.z], end: [b.x, 0.1, b.z] })
      }
    }
    return lines
  }, [play])

  return (
    <group>
      {segments.map((seg, i) => (
        <Line
          key={i}
          points={[seg.start, seg.end]}
          color="#a78bfa"
          lineWidth={2.4}
          transparent
          opacity={0.6}
          dashed
          dashSize={1.8}
          gapSize={1}
        />
      ))}
    </group>
  )
}
