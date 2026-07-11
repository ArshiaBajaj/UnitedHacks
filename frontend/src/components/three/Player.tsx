import { Html, Trail } from '@react-three/drei'
import { useRef, useState } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { useTactixStore } from '../../store/useTactixStore'
import { TEAM_COLORS } from '../../types/play'

interface PlayerProps {
  id: string
  team: 'attack' | 'defense' | 'neutral'
  number: number
  role: string
  x: number
  z: number
  isSelected: boolean
  showTrail: boolean
}

export function Player({ id, team, number, role, x, z, isSelected, showTrail }: PlayerProps) {
  const ref = useRef<THREE.Group>(null)
  const bodyRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const appMode = useTactixStore((s) => s.appMode)
  const setSelected = useTactixStore((s) => s.setSelectedPlayer)
  const movePlayer = useTactixStore((s) => s.movePlayerAtStart)
  const isPlaying = useTactixStore((s) => s.isPlaying)

  const color = TEAM_COLORS[team]
  const dragging = useRef(false)
  const dragPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0))
  const intersection = useRef(new THREE.Vector3())
  const prevPos = useRef(new THREE.Vector3(x, 0, z))

  useFrame((_, delta) => {
    const g = ref.current
    if (!g) return
    if (!dragging.current) {
      g.position.lerp(new THREE.Vector3(x, 0, z), Math.min(delta * 14, 1))
    }
    // Lean into movement direction
    const vel = g.position.clone().sub(prevPos.current)
    prevPos.current.copy(g.position)
    if (bodyRef.current) {
      const speed = vel.length()
      const targetTilt = Math.min(speed * 1.6, 0.28)
      bodyRef.current.rotation.z = THREE.MathUtils.lerp(bodyRef.current.rotation.z, vel.x > 0.001 ? -targetTilt : vel.x < -0.001 ? targetTilt : 0, 0.15)
      bodyRef.current.rotation.x = THREE.MathUtils.lerp(bodyRef.current.rotation.x, vel.z > 0.001 ? targetTilt : vel.z < -0.001 ? -targetTilt : 0, 0.15)
    }
  })

  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (appMode !== 'edit' || isPlaying) return
    e.stopPropagation()
    dragging.current = true
    setSelected(id)
  }

  const onPointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!dragging.current) return
    e.ray.intersectPlane(dragPlane.current, intersection.current)
    const nx = Math.max(-50, Math.min(50, intersection.current.x))
    const nz = Math.max(-32, Math.min(32, intersection.current.z))
    if (ref.current) ref.current.position.set(nx, 0, nz)
  }

  const onPointerUp = () => {
    if (!dragging.current) return
    dragging.current = false
    if (ref.current) movePlayer(id, ref.current.position.x, ref.current.position.z)
  }

  const body = (
    <mesh ref={bodyRef} position={[0, 0.88, 0]} castShadow>
      <capsuleGeometry args={[0.36, 0.95, 4, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={isSelected ? 0.55 : hovered ? 0.35 : 0.16}
        roughness={0.35}
        metalness={0.35}
      />
    </mesh>
  )

  return (
    <group
      ref={ref}
      position={[x, 0, z]}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {(isSelected || hovered) && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
          <ringGeometry args={[0.85, 1.15, 40]} />
          <meshBasicMaterial color={isSelected ? '#fbbf24' : '#ffffff'} transparent opacity={0.75} />
        </mesh>
      )}

      {/* Soft contact shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <circleGeometry args={[0.72, 24]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.4} />
      </mesh>

      {showTrail ? (
        <Trail width={1.6} length={5} color={new THREE.Color(color).multiplyScalar(0.6)} attenuation={(t) => t * t}>
          {body}
        </Trail>
      ) : (
        body
      )}

      <Html center position={[0, 2.0, 0]} style={{ pointerEvents: 'none' }} distanceFactor={40}>
        <div
          style={{
            fontWeight: 900,
            fontSize: 15,
            color: '#fff',
            textShadow: '0 2px 10px rgba(0,0,0,0.9)',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {number}
        </div>
      </Html>

      {isSelected && (
        <Html position={[0, 2.6, 0]} center style={{ pointerEvents: 'none' }}>
          <div
            style={{
              background: 'rgba(8,8,16,0.85)',
              color: '#fff',
              fontSize: 11,
              padding: '3px 10px',
              borderRadius: 999,
              whiteSpace: 'nowrap',
              border: '1px solid rgba(255,255,255,0.18)',
              backdropFilter: 'blur(8px)',
            }}
          >
            {role}
          </div>
        </Html>
      )}
    </group>
  )
}
