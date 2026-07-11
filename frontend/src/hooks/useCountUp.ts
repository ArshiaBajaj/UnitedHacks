import { useEffect, useRef, useState } from 'react'

/** Smoothly animates a number toward its target value. */
export function useCountUp(target: number, durationMs = 800): number {
  const [value, setValue] = useState(target)
  const fromRef = useRef(target)
  const rafRef = useRef(0)

  useEffect(() => {
    const from = fromRef.current
    const start = performance.now()
    cancelAnimationFrame(rafRef.current)

    const tick = (now: number) => {
      const t = Math.min((now - start) / durationMs, 1)
      const ease = 1 - Math.pow(1 - t, 3)
      const v = from + (target - from) * ease
      setValue(v)
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
      else fromRef.current = target
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, durationMs])

  return value
}
