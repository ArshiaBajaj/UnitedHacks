import { Trail } from '@react-three/drei'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Play } from '../../types/play'

interface BallProps {
  x: number
  z: number
  play: Play
  time: number
}

/** Height arc: lift the ball during long-distance ball keyframe segments (passes/crosses). */
function ballHeight(play: Play, time: number): number {
  const kfs = play.ball.keyframes
  for (let i = 0; i < kfs.length - 1; i++) {
    const a = kfs[i]
    const b = kfs[i + 1]
    if (time >= a.t && time <= b.t) {
      const dist = Math.hypot(b.x - a.x, b.z - a.z)
      if (dist < 10) return 0.22
      const t = (time - a.t) / Math.max(b.t - a.t, 0.001)
      const peak = Math.min(dist * 0.14, 4.2)
      return 0.22 + Math.sin(t * Math.PI) * peak
    }
  }
  return 0.22
}

export function Ball({ x, z, play, time }: BallProps) {
  const ref = useRef<THREE.Mesh>(null)
  const spin = useRef(0)

  const y = ballHeight(play, time)

  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.position.lerp(new THREE.Vector3(x, y, z), Math.min(delta * 16, 1))
    spin.current += delta * 6
    ref.current.rotation.x = spin.current
    ref.current.rotation.z = spin.current * 0.6
  })

  return (
    <group>
      <Trail width={1.1} length={4} color="#c4b5fd" attenuation={(t) => t * t}>
        <mesh ref={ref} position={[x, y, z]} castShadow>
          <sphereGeometry args={[0.24, 28, 28]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.35} roughness={0.25} />
        </mesh>
      </Trail>
      {/* Ground marker */}
      <mesh position={[x, 0.02, z]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.28, 0.42, 24]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.25} />
      </mesh>
    </group>
  )
}
