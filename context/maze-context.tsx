"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

// Fix the type for MoodType to include null
type MoodType = "happy" | "calm" | "excited" | "anxious" | null

interface MazeContextType {
  currentMood: MoodType
  setCurrentMood: (mood: MoodType) => void
  journey: string[]
  addToJourney: (step: string) => void
  puzzlesSolved: number
  incrementPuzzlesSolved: () => void
  resetJourney: () => void
}

// Ensure the context is properly initialized with default values
const MazeContext = createContext<MazeContextType>({
  currentMood: null,
  setCurrentMood: () => {},
  journey: [],
  addToJourney: () => {},
  puzzlesSolved: 0,
  incrementPuzzlesSolved: () => {},
  resetJourney: () => {},
})

export function MazeProvider({ children }: { children: ReactNode }) {
  const [currentMood, setCurrentMood] = useState<MoodType>(null)
  const [journey, setJourney] = useState<string[]>([])
  const [puzzlesSolved, setPuzzlesSolved] = useState(0)

  const addToJourney = (step: string) => {
    setJourney((prev) => [...prev, step])
  }

  const incrementPuzzlesSolved = () => {
    setPuzzlesSolved((prev) => prev + 1)
  }

  const resetJourney = () => {
    setCurrentMood(null)
    setJourney([])
    setPuzzlesSolved(0)
  }

  return (
    <MazeContext.Provider
      value={{
        currentMood,
        setCurrentMood,
        journey,
        addToJourney,
        puzzlesSolved,
        incrementPuzzlesSolved,
        resetJourney,
      }}
    >
      {children}
    </MazeContext.Provider>
  )
}

export function useMaze() {
  const context = useContext(MazeContext)
  if (context === undefined) {
    throw new Error("useMaze must be used within a MazeProvider")
  }
  return context
}
