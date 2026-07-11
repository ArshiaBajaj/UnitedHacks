import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { Scene3D } from './Scene3D'

export function TactixCanvas() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      className="absolute inset-0"
      style={{ background: '#07070e' }}
    >
      <Suspense fallback={null}>
        <Scene3D />
      </Suspense>
    </Canvas>
  )
}
