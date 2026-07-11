import { useCallback, useEffect, useState } from 'react'
import type { AnalysisResult, PlayerProfile } from '../types'
import { levelFromXp } from '../types'

const STORAGE_KEY = 'pitchiq_profile'

const defaultProfile: PlayerProfile = {
  totalXp: 0,
  level: 1,
  analyses: [],
  badges: [],
}

function loadProfile(): PlayerProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as PlayerProfile
  } catch {
    /* ignore */
  }
  return { ...defaultProfile }
}

export function useProfile() {
  const [profile, setProfile] = useState<PlayerProfile>(loadProfile)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
  }, [profile])

  const addAnalysis = useCallback((result: AnalysisResult) => {
    setProfile((prev) => {
      const newXp = prev.totalXp + result.xp_earned
      const mergedBadges = [...new Set([...prev.badges, ...result.badges_unlocked])]
      return {
        totalXp: newXp,
        level: levelFromXp(newXp),
        analyses: [result, ...prev.analyses].slice(0, 20),
        badges: mergedBadges,
      }
    })
  }, [])

  const resetProfile = useCallback(() => {
    setProfile({ ...defaultProfile })
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return { profile, addAnalysis, resetProfile }
}
