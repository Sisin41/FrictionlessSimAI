/**
 * usePlayback.ts
 * Drives tick advancement when play is active.
 * At 1x speed: advance 1 tick per second.
 * Emits interpolation (0-1) between ticks for smooth animation.
 */

import { useEffect, useRef } from 'react'
import { useSimStore } from '../store/simStore'

export function usePlayback() {
  const isPlaying = useSimStore(s => s.isPlaying)
  const playSpeed = useSimStore(s => s.playSpeed)
  const maxTick = useSimStore(s => s.maxTick)
  const setTick = useSimStore(s => s.setTick)
  const setPlaying = useSimStore(s => s.setPlaying)
  const setInterpolation = useSimStore(s => s.setInterpolation)
  const accumRef = useRef(0)
  const lastTimeRef = useRef(0)
  // Read currentTick via ref to avoid re-registering the effect on every tick change
  const tickRef = useRef(useSimStore.getState().currentTick)
  useEffect(() => {
    const unsub = useSimStore.subscribe((s) => { tickRef.current = s.currentTick })
    return unsub
  }, [])

  useEffect(() => {
    if (!isPlaying) {
      accumRef.current = 0
      return
    }

    lastTimeRef.current = performance.now()
    let raf: number

    function frame(now: number) {
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1)
      lastTimeRef.current = now

      accumRef.current += dt * playSpeed

      if (accumRef.current >= 1) {
        accumRef.current = 0
        const next = tickRef.current + 1

        if (next > maxTick) {
          setTick(maxTick)
          setPlaying(false)
          return
        }
        setTick(next)
      } else {
        setInterpolation(accumRef.current)
      }

      raf = requestAnimationFrame(frame)
    }

    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [isPlaying, playSpeed, maxTick, setTick, setPlaying, setInterpolation])
}
