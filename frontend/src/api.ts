import type { AnalysisResult, SkillType } from './types'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

export async function analyzeVideo(
  file: File,
  skill: SkillType,
  demo = false,
): Promise<AnalysisResult> {
  const form = new FormData()
  form.append('video', file)
  form.append('skill', skill)
  form.append('demo', String(demo))

  const res = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    body: form,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(typeof err.detail === 'string' ? err.detail : 'Analysis failed')
  }

  return res.json()
}

export async function fetchDemo(skill: SkillType): Promise<AnalysisResult> {
  const res = await fetch(`${API_BASE}/demo/${skill}`)
  if (!res.ok) throw new Error('Failed to load demo')
  return res.json()
}

export async function checkHealth(): Promise<{ status: string; gemini_configured: boolean }> {
  const res = await fetch(`${API_BASE}/health`)
  return res.json()
}
