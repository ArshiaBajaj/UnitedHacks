import { useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { useTactixStore } from '../../store/useTactixStore'
import { interpolateKeyframes } from '../../lib/interpolation'
import { broadcastPlay, broadcastPlayback } from '../../lib/collab'
import { Ball } from './Ball'
import { CameraRig } from './CameraRig'
import { Effects } from './Effects'
import { Heatmap, PassLanes, PressureZones, TeamShape } from './Overlays'
import { Pitch } from './Pitch'
import { Player } from './Player'
import { Stadium } from './Stadium'

export function Scene3D() {
  const play = useTactixStore((s) => s.play)
  const isPlaying = useTactixStore((s) => s.isPlaying)
  const currentTime = useTactixStore((s) => s.currentTime)
  const playbackSpeed = useTactixStore((s) => s.playbackSpeed)
  const setCurrentTime = useTactixStore((s) => s.setCurrentTime)
  const setPlaying = useTactixStore((s) => s.setPlaying)
  const uiPhase = useTactixStore((s) => s.uiPhase)
  const overlays = useTactixStore((s) => s.overlays)
  const selectedPlayerId = useTactixStore((s) => s.selectedPlayerId)
  const roomId = useTactixStore((s) => s.roomId)

  const lastBroadcast = useRef(0)

  useFrame((_, delta) => {
    if (!play) return

    // Landing mode: loop the demo play forever
    if (uiPhase === 'landing') {
      const next = (currentTime + delta * 0.85) % play.duration
      setCurrentTime(next)
      return
    }

    if (isPlaying) {
      const next = Math.min(currentTime + delta * playbackSpeed, play.duration)
      setCurrentTime(next)
      if (next >= play.duration) setPlaying(false)

      const now = Date.now()
      if (now - lastBroadcast.current > 250) {
        broadcastPlayback(roomId, true, next)
        lastBroadcast.current = now
      }
    }
  })

  // Broadcast edits (debounced)
  const playJson = play ? JSON.stringify(play) : null
  useEffect(() => {
    if (!playJson || uiPhase !== 'app') return
    const t = setTimeout(() => broadcastPlay(roomId, JSON.parse(playJson)), 800)
    return () => clearTimeout(t)
  }, [playJson, roomId, uiPhase])

  const ballPos = play ? interpolateKeyframes(play.ball.keyframes, currentTime) : { x: 0, z: 0 }

  return (
    <>
      <Stadium />
      <Pitch />
      <CameraRig />
      <Effects />

      {play && overlays.heatmap && <Heatmap play={play} time={currentTime} />}
      {play && overlays.pressure && <PressureZones play={play} time={currentTime} />}
      {play && overlays.shape && <TeamShape play={play} time={currentTime} />}
      {play && overlays.passes && <PassLanes play={play} />}

      {play?.players.map((p) => {
        const pos = interpolateKeyframes(p.keyframes, currentTime)
        return (
          <Player
            key={p.id}
            id={p.id}
            team={p.team}
            number={p.number}
            role={p.role}
            x={pos.x}
            z={pos.z}
            isSelected={selectedPlayerId === p.id}
            showTrail={overlays.trails && (isPlaying || uiPhase === 'landing')}
          />
        )
      })}

      {play && <Ball x={ballPos.x} z={ballPos.z} play={play} time={currentTime} />}
    </>
  )
}
