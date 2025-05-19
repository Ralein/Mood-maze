"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { RefreshCw, Check } from "lucide-react"

interface PatternPuzzleProps {
  difficulty: "easy" | "medium" | "hard"
  onSolve: () => void
}

export default function PatternPuzzle({ difficulty, onSolve }: PatternPuzzleProps) {
  const [targetPattern, setTargetPattern] = useState<boolean[]>([])
  const [userPattern, setUserPattern] = useState<boolean[]>([])
  const [showTarget, setShowTarget] = useState(true)
  const [isCorrect, setIsCorrect] = useState(false)
  const [attempts, setAttempts] = useState(0)

  // Set grid size based on difficulty
  const getGridSize = () => {
    switch (difficulty) {
      case "easy":
        return 3 // 3x3 grid
      case "medium":
        return 4 // 4x4 grid
      case "hard":
        return 5 // 5x5 grid
      default:
        return 3
    }
  }

  const gridSize = getGridSize()
  const totalCells = gridSize * gridSize

  useEffect(() => {
    generateNewPattern()
  }, [difficulty])

  const generateNewPattern = () => {
    // Reset state
    setIsCorrect(false)
    setAttempts(0)

    // Generate random pattern
    const newPattern = Array(totalCells)
      .fill(false)
      .map(() => Math.random() > 0.6)
    setTargetPattern(newPattern)

    // Initialize user pattern as all inactive
    setUserPattern(Array(totalCells).fill(false))

    // Show target pattern for a few seconds
    setShowTarget(true)
    setTimeout(
      () => {
        setShowTarget(false)
      },
      difficulty === "easy" ? 3000 : difficulty === "medium" ? 2500 : 2000,
    )
  }

  const toggleCell = (index: number) => {
    if (showTarget) return

    const newPattern = [...userPattern]
    newPattern[index] = !newPattern[index]
    setUserPattern(newPattern)
  }

  const checkPattern = () => {
    const correct = targetPattern.every((cell, index) => cell === userPattern[index])
    setIsCorrect(correct)
    setAttempts(attempts + 1)

    if (correct) {
      setTimeout(() => {
        onSolve()
      }, 1000)
    } else {
      // Show target briefly on incorrect attempt
      setShowTarget(true)
      setTimeout(() => {
        setShowTarget(false)
      }, 1500)
    }
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Pattern Memory Puzzle</h2>
      <p className="text-gray-600 mb-6">Memorize the pattern, then recreate it when it disappears.</p>

      {/* Status indicator */}
      <div className="mb-6 flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${showTarget ? "bg-yellow-500" : "bg-green-500"}`}></div>
        <p className="text-sm font-medium">{showTarget ? "Memorize the pattern..." : "Recreate the pattern!"}</p>
      </div>

      {/* Pattern grid */}
      <div
        className="grid gap-2 mb-8"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          width: "100%",
          maxWidth: "300px",
        }}
      >
        {(showTarget ? targetPattern : userPattern).map((active, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: showTarget ? 1 : 1.05 }}
            whileTap={{ scale: showTarget ? 1 : 0.95 }}
            onClick={() => toggleCell(index)}
            className={`aspect-square rounded-md cursor-pointer border-2 ${
              active
                ? "bg-gradient-to-br from-violet-500 to-purple-700 border-violet-300"
                : "bg-gray-100 border-gray-300"
            }`}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        <Button
          onClick={checkPattern}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90 text-white"
          disabled={showTarget}
        >
          <Check className="mr-2 h-4 w-4" />
          Check Pattern
        </Button>

        <Button onClick={generateNewPattern} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          New Pattern
        </Button>
      </div>

      {/* Feedback */}
      {attempts > 0 && !showTarget && (
        <div className={`mt-6 p-4 rounded-lg ${isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {isCorrect
            ? "Perfect! You remembered the pattern correctly!"
            : "Not quite right. Try again after reviewing the pattern."}
        </div>
      )}
    </div>
  )
}
