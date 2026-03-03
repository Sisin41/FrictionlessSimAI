/**
 * usePlayback.ts
 * Drives tick advancement when play is active.
 * At 1x speed: advance 1 tick per second.
 */

import { useEffect, useRef } from 'react'
import { useSimStore } from '../store/simStore'

export function usePlayback() {
  const isPlaying = useSimStore(s => s.isPlaying)
  const playSpeed = useSimStore(s => s.playSpeed)
  const currentTick = useSimStore(s => s.currentTick)
  const maxTick = useSimStore(s => s.maxTick)
  const setTick = useSimStore(s => s.setTick)
  const setPlaying = useSimStore(s => s.setPlaying)
  const accumRef = useRef(0)

  useEffect(() => {
    if (!isPlaying) {
      accumRef.current = 0
      return
    }

    let lastTime = performance.now()
    let raf: number

    function frame(now: number) {
      const dt = (now - lastTime) / 1000
      lastTime = now

      accumRef.current += dt * playSpeed

      if (accumRef.current >= 1) {
        const steps = Math.floor(accumRef.current)
        accumRef.current -= steps
        const newTick = currentTick + steps

        if (newTick >= maxTick) {
          setTick(maxTick)
          setPlaying(false)
          return
        }
        setTick(newTick)
      }

      raf = requestAnimationFrame(frame)
    }

    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [isPlaying, playSpeed, currentTick, maxTick, setTick, setPlaying])
}
