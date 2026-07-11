import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { useTactixStore } from '../../store/useTactixStore'
import type { CameraMode } from '../../types/play'

const PRESETS: Record<Exclude<CameraMode, 'free'>, { pos: THREE.Vector3; target: THREE.Vector3 }> = {
  broadcast: { pos: new THREE.Vector3(0, 42, 58), target: new THREE.Vector3(10, 0, 0) },
  tactical: { pos: new THREE.Vector3(0, 82, 0.1), target: new THREE.Vector3(0, 0, 0) },
  sideline: { pos: new THREE.Vector3(-30, 7, 52), target: new THREE.Vector3(10, 1, 0) },
}

export function CameraRig() {
  const camRef = useRef<THREE.PerspectiveCamera>(null)
  const controlsRef = useRef<any>(null)
  const uiPhase = useTactixStore((s) => s.uiPhase)
  const cameraMode = useTactixStore((s) => s.cameraMode)
  const setUiPhase = useTactixStore((s) => s.setUiPhase)
  const enterProgress = useRef(0)

  useFrame(({ clock }, delta) => {
    const cam = camRef.current
    const controls = controlsRef.current
    if (!cam || !controls) return

    if (uiPhase === 'landing') {
      // Slow cinematic orbit around the pitch
      const t = clock.elapsedTime * 0.08
      const radius = 68
      cam.position.lerp(
        new THREE.Vector3(Math.sin(t) * radius, 34 + Math.sin(t * 0.5) * 6, Math.cos(t) * radius),
        0.02,
      )
      controls.target.lerp(new THREE.Vector3(0, 0, 0), 0.05)
      controls.update()
      return
    }

    if (uiPhase === 'entering') {
      // Fly into broadcast position
      enterProgress.current = Math.min(enterProgress.current + delta * 0.7, 1)
      const p = PRESETS.broadcast
      cam.position.lerp(p.pos, 0.04)
      controls.target.lerp(p.target, 0.06)
      controls.update()
      if (enterProgress.current >= 1 || cam.position.distanceTo(p.pos) < 2) {
        setUiPhase('app')
        enterProgress.current = 0
      }
      return
    }

    // App phase: ease toward preset unless free
    if (cameraMode !== 'free') {
      const p = PRESETS[cameraMode]
      cam.position.lerp(p.pos, 0.045)
      controls.target.lerp(p.target, 0.06)
      controls.update()
    }
  })

  return (
    <>
      <PerspectiveCamera ref={camRef} makeDefault fov={48} near={0.1} far={600} position={[60, 36, 60]} />
      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.06}
        enabled={uiPhase === 'app'}
        maxPolarAngle={Math.PI / 2.08}
        minDistance={12}
        maxDistance={140}
      />
    </>
  )
}
