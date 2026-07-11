import { Stars } from '@react-three/drei'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Floodlight({ position, delay }: { position: [number, number, number]; delay: number }) {
  const lightRef = useRef<THREE.PointLight>(null)

  useFrame(({ clock }) => {
    if (lightRef.current) {
      // Subtle breathing so the stadium feels alive
      lightRef.current.intensity = 130 + Math.sin(clock.elapsedTime * 0.7 + delay) * 18
    }
  })

  return (
    <group position={position}>
      <pointLight ref={lightRef} intensity={130} distance={150} color="#fff3e0" castShadow shadow-mapSize={[1024, 1024]} />
      <mesh position={[0, -6, 0]}>
        <cylinderGeometry args={[0.25, 0.45, 12, 8]} />
        <meshStandardMaterial color="#15151f" metalness={0.85} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[2.4, 0.5, 1.8]} />
        <meshStandardMaterial color="#22222e" emissive="#ffedd5" emissiveIntensity={1.6} />
      </mesh>
    </group>
  )
}

export function Stadium() {
  return (
    <group>
      <fog attach="fog" args={['#07070e', 90, 260]} />
      <color attach="background" args={['#07070e']} />
      <Stars radius={220} depth={90} count={4000} factor={3.2} saturation={0} fade speed={0.4} />

      <Floodlight position={[-42, 32, -46]} delay={0} />
      <Floodlight position={[42, 32, -46]} delay={1.4} />
      <Floodlight position={[-42, 32, 46]} delay={2.8} />
      <Floodlight position={[42, 32, 46]} delay={4.2} />

      {/* Tiered stands */}
      {[-1, 1].map((side) => (
        <group key={`s${side}`}>
          {[0, 1, 2].map((tier) => (
            <mesh
              key={tier}
              position={[0, 4 + tier * 5, side * (42 + tier * 4)]}
              rotation={[side * 0.35, 0, 0]}
              receiveShadow
            >
              <boxGeometry args={[116, 5.5, 7]} />
              <meshStandardMaterial color={tier % 2 === 0 ? '#0f1220' : '#131629'} roughness={0.95} />
            </mesh>
          ))}
        </group>
      ))}
      {[-1, 1].map((side) => (
        <group key={`e${side}`}>
          {[0, 1].map((tier) => (
            <mesh
              key={tier}
              position={[side * (60 + tier * 4), 4 + tier * 5, 0]}
              rotation={[0, 0, side * 0.35]}
              receiveShadow
            >
              <boxGeometry args={[7, 5.5, 84]} />
              <meshStandardMaterial color={tier % 2 === 0 ? '#0f1220' : '#131629'} roughness={0.95} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Crowd glow strips */}
      {[-1, 1].map((side) => (
        <mesh key={`g${side}`} position={[0, 9, side * 44]} rotation={[side * 0.35, 0, 0]}>
          <planeGeometry args={[112, 12]} />
          <meshBasicMaterial color="#1a1f3d" transparent opacity={0.6} />
        </mesh>
      ))}

      <ambientLight intensity={0.22} />
      <hemisphereLight intensity={0.28} color="#b8c8ff" groundColor="#0a2818" />
      <directionalLight
        position={[35, 55, 25]}
        intensity={0.55}
        color="#cfe0ff"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-70}
        shadow-camera-right={70}
        shadow-camera-top={70}
        shadow-camera-bottom={-70}
      />
    </group>
  )
}
