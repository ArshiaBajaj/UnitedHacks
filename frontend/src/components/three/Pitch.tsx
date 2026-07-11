import { Line as DreiLine } from '@react-three/drei'
import { PITCH } from '../../types/play'

const { halfL, halfW } = PITCH

function FieldLine({ points, y = 0.03 }: { points: [number, number][]; y?: number }) {
  const pts = points.map(([x, z]) => [x, y, z] as [number, number, number])
  return <DreiLine points={pts} color="#e8f5ec" lineWidth={1.4} transparent opacity={0.9} />
}

function Rect({ x, z, w, d, y = 0.03 }: { x: number; z: number; w: number; d: number; y?: number }) {
  const hw = w / 2
  const hd = d / 2
  return (
    <FieldLine
      points={[
        [x - hw, z - hd],
        [x + hw, z - hd],
        [x + hw, z + hd],
        [x - hw, z + hd],
        [x - hw, z - hd],
      ]}
      y={y}
    />
  )
}

function CircleLine({ x, z, r, y = 0.03, segments = 64 }: { x: number; z: number; r: number; y?: number; segments?: number }) {
  const pts: [number, number][] = []
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2
    pts.push([x + Math.cos(a) * r, z + Math.sin(a) * r])
  }
  return <FieldLine points={pts} y={y} />
}

export function Pitch() {
  return (
    <group>
      {/* Grass base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[105, 68, 1, 1]} />
        <meshStandardMaterial color="#14532d" roughness={0.92} metalness={0.02} />
      </mesh>

      {/* Mowing stripes */}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[-47.25 + i * 10.5, 0.006, 0]} receiveShadow>
          <planeGeometry args={[5.25, 68]} />
          <meshStandardMaterial color="#166534" transparent opacity={i % 2 === 0 ? 0.55 : 0.15} roughness={0.9} />
        </mesh>
      ))}

      {/* Surrounding apron */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <planeGeometry args={[136, 96]} />
        <meshStandardMaterial color="#0b2818" roughness={1} />
      </mesh>

      {/* Markings */}
      <Rect x={0} z={0} w={105} d={68} />
      <FieldLine points={[[0, -halfW], [0, halfW]]} />
      <CircleLine x={0} z={0} r={9.15} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.032, 0]}>
        <circleGeometry args={[0.35, 16]} />
        <meshBasicMaterial color="#e8f5ec" />
      </mesh>

      <Rect x={-halfL + 8.25} z={0} w={16.5} d={40.32} />
      <Rect x={halfL - 8.25} z={0} w={16.5} d={40.32} />
      <Rect x={-halfL + 2.75} z={0} w={5.5} d={18.32} />
      <Rect x={halfL - 2.75} z={0} w={5.5} d={18.32} />

      {/* Penalty spots */}
      {[-halfL + 11, halfL - 11].map((x) => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.032, 0]}>
          <circleGeometry args={[0.3, 12]} />
          <meshBasicMaterial color="#e8f5ec" />
        </mesh>
      ))}

      {/* Goals — glowing frames catch the bloom */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * halfL, 0, 0]}>
          {/* Posts */}
          {[-3.66, 3.66].map((z) => (
            <mesh key={z} position={[side * 0.8, 1.22, z]} castShadow>
              <cylinderGeometry args={[0.07, 0.07, 2.44, 12]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.9} />
            </mesh>
          ))}
          {/* Crossbar */}
          <mesh position={[side * 0.8, 2.44, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.07, 7.32, 12]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.9} />
          </mesh>
          {/* Net hint */}
          <mesh position={[side * 1.6, 1.1, 0]}>
            <boxGeometry args={[1.6, 2.2, 7.3]} />
            <meshStandardMaterial color="#ffffff" wireframe transparent opacity={0.08} />
          </mesh>
        </group>
      ))}
    </group>
  )
}
