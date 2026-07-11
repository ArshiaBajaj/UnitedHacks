import type { Play } from '../types/play'

const API = import.meta.env.VITE_API_URL || '/api'

export interface GenerateResponse {
  play: Play
  ai_summary: string
}

export async function generatePlay(prompt: string, demo = false): Promise<GenerateResponse> {
  const res = await fetch(`${API}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, demo }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(typeof err.detail === 'string' ? err.detail : 'Generation failed')
  }
  return res.json()
}

export async function fetchDemos(): Promise<Play[]> {
  const res = await fetch(`${API}/demos`)
  if (!res.ok) throw new Error('Failed to load demos')
  return res.json()
}
