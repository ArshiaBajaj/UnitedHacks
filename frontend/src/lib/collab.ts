import { io, Socket } from 'socket.io-client'
import type { Collaborator, Play } from '../types/play'

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8000'

let socket: Socket | null = null

export function getSocket(): Socket {
  if (!socket) {
    socket = io(WS_URL, { transports: ['websocket', 'polling'], autoConnect: true })
  }
  return socket
}

export function joinRoom(
  roomId: string,
  name: string,
  color: string,
  callbacks: {
    onState: (data: RoomState) => void
    onPlayUpdated: (play: Play, from: string) => void
    onPlaybackSync: (isPlaying: boolean, time: number) => void
    onCursor: (data: { sid: string; x: number; y: number; name: string }) => void
  },
) {
  const s = getSocket()

  s.off('room_state')
  s.off('play_updated')
  s.off('playback_sync')
  s.off('cursor_update')

  s.on('room_state', callbacks.onState)
  s.on('play_updated', (d) => callbacks.onPlayUpdated(d.play, d.from))
  s.on('playback_sync', (d) => callbacks.onPlaybackSync(d.is_playing, d.current_time))
  s.on('cursor_update', callbacks.onCursor)

  s.emit('join_room', { room_id: roomId, name, color })
}

export function broadcastPlay(roomId: string, play: Play) {
  getSocket().emit('update_play', { room_id: roomId, play })
}

export function broadcastPlayback(roomId: string, isPlaying: boolean, currentTime: number) {
  getSocket().emit('sync_playback', { room_id: roomId, is_playing: isPlaying, current_time: currentTime })
}

export function sendCursor(roomId: string, x: number, y: number, name: string) {
  getSocket().emit('cursor_move', { room_id: roomId, x, y, name })
}

export interface RoomState {
  room_id: string
  play: Play | null
  collaborators: Collaborator[]
  is_playing: boolean
  current_time: number
}

export function getShareUrl(roomId: string): string {
  const base = window.location.origin + window.location.pathname
  return `${base}?room=${roomId}`
}
