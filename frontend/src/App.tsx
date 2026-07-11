import { AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { TactixCanvas } from './components/three/TactixCanvas'
import { AIPanel } from './components/ui/AIPanel'
import { Hero } from './components/ui/Hero'
import { Sidebar } from './components/ui/Sidebar'
import { Timeline } from './components/ui/Timeline'
import { TopNav } from './components/ui/TopNav'
import { generatePlay } from './lib/api'
import { joinRoom } from './lib/collab'
import { useTactixStore } from './store/useTactixStore'

function App() {
  const uiPhase = useTactixStore((s) => s.uiPhase)
  const initRoom = useTactixStore((s) => s.initRoom)
  const roomId = useTactixStore((s) => s.roomId)
  const userName = useTactixStore((s) => s.userName)
  const userColor = useTactixStore((s) => s.userColor)
  const play = useTactixStore((s) => s.play)
  const setPlay = useTactixStore((s) => s.setPlay)
  const setCollaborators = useTactixStore((s) => s.setCollaborators)
  const setPlaying = useTactixStore((s) => s.setPlaying)
  const setCurrentTime = useTactixStore((s) => s.setCurrentTime)

  useEffect(() => {
    initRoom()
  }, [initRoom])

  // Preload the hero demo play so the landing field is alive
  useEffect(() => {
    if (play) return
    generatePlay('counterattack winger cuts inside', true)
      .then((res) => setPlay(res.play, res.ai_summary))
      .catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    joinRoom(roomId, userName, userColor, {
      onState: (state) => {
        if (state.play) setPlay(state.play)
        setCollaborators(state.collaborators)
      },
      onPlayUpdated: (p) => setPlay(p),
      onPlaybackSync: (isPlaying, time) => {
        if (useTactixStore.getState().uiPhase !== 'app') return
        setPlaying(isPlaying)
        setCurrentTime(time)
      },
      onCursor: () => {},
    })
  }, [roomId, userName, userColor, setPlay, setCollaborators, setPlaying, setCurrentTime])

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#07070e]">
      <TactixCanvas />

      <AnimatePresence>{uiPhase === 'landing' && <Hero key="hero" />}</AnimatePresence>

      {uiPhase === 'app' && (
        <>
          <TopNav />
          <Sidebar />
          <AIPanel />
          <Timeline />
        </>
      )}
    </div>
  )
}

export default App
