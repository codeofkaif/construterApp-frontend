import { useState, useCallback } from 'react'

export function useLocalStorage<T>(key: string, defaultValue: T): [T, (val: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? (JSON.parse(stored) as T) : defaultValue
    } catch {
      return defaultValue
    }
  })

  const setValue = useCallback((val: T | ((prev: T) => T)) => {
    setState((prev) => {
      const next = typeof val === 'function' ? (val as (prev: T) => T)(prev) : val
      try {
        localStorage.setItem(key, JSON.stringify(next))
      } catch {}
      return next
    })
  }, [key])

  return [state, setValue]
}
