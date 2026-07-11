import { create } from 'zustand'
import type { AppMode, CameraMode, Collaborator, Play } from '../types/play'
import { randomColor, randomName, randomRoomId } from '../lib/interpolation'

export type UiPhase = 'landing' | 'entering' | 'app'

export interface OverlayState {
  passes: boolean
  heatmap: boolean
  shape: boolean
  trails: boolean
  pressure: boolean
}

interface TactixState {
  play: Play | null
  aiSummary: string
  isGenerating: boolean
  thinkingStep: number
  isPlaying: boolean
  currentTime: number
  playbackSpeed: number
  cameraMode: CameraMode
  appMode: AppMode
  uiPhase: UiPhase
  overlays: OverlayState
  selectedPlayerId: string | null
  roomId: string
  userName: string
  userColor: string
  collaborators: Collaborator[]

  setPlay: (play: Play | null, summary?: string) => void
  setGenerating: (v: boolean) => void
  setThinkingStep: (n: number) => void
  setPlaying: (v: boolean) => void
  setCurrentTime: (t: number) => void
  setPlaybackSpeed: (s: number) => void
  setCameraMode: (m: CameraMode) => void
  setAppMode: (m: AppMode) => void
  setUiPhase: (p: UiPhase) => void
  toggleOverlay: (k: keyof OverlayState) => void
  setSelectedPlayer: (id: string | null) => void
  setCollaborators: (c: Collaborator[]) => void
  movePlayerAtStart: (playerId: string, x: number, z: number) => void
  initRoom: (roomId?: string) => void
}

export const useTactixStore = create<TactixState>((set, get) => ({
  play: null,
  aiSummary: '',
  isGenerating: false,
  thinkingStep: 0,
  isPlaying: false,
  currentTime: 0,
  playbackSpeed: 1,
  cameraMode: 'broadcast',
  appMode: 'view',
  uiPhase: 'landing',
  overlays: { passes: true, heatmap: false, shape: false, trails: true, pressure: false },
  selectedPlayerId: null,
  roomId: randomRoomId(),
  userName: randomName(),
  userColor: randomColor(),
  collaborators: [],

  setPlay: (play, summary = '') => set({ play, aiSummary: summary, currentTime: 0, isPlaying: false }),
  setGenerating: (isGenerating) => set({ isGenerating, thinkingStep: 0 }),
  setThinkingStep: (thinkingStep) => set({ thinkingStep }),
  setPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setPlaybackSpeed: (playbackSpeed) => set({ playbackSpeed }),
  setCameraMode: (cameraMode) => set({ cameraMode }),
  setAppMode: (appMode) => set({ appMode }),
  setUiPhase: (uiPhase) => set({ uiPhase }),
  toggleOverlay: (k) => set((s) => ({ overlays: { ...s.overlays, [k]: !s.overlays[k] } })),
  setSelectedPlayer: (selectedPlayerId) => set({ selectedPlayerId }),
  setCollaborators: (collaborators) => set({ collaborators }),

  movePlayerAtStart: (playerId, x, z) => {
    const { play } = get()
    if (!play) return
    const players = play.players.map((p) => {
      if (p.id !== playerId) return p
      const kfs = [...p.keyframes]
      const idx = kfs.findIndex((k) => k.t === 0)
      if (idx >= 0) kfs[idx] = { ...kfs[idx], x, z }
      else kfs.unshift({ t: 0, x, z })
      return { ...p, keyframes: kfs }
    })
    set({ play: { ...play, players } })
  },

  initRoom: (roomId) => {
    const params = new URLSearchParams(window.location.search)
    const fromUrl = params.get('room')
    set({ roomId: roomId || fromUrl || randomRoomId() })
    if (fromUrl) set({ uiPhase: 'app' })
  },
}))
