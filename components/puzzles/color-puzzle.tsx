"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Shuffle } from "lucide-react"

interface ColorPuzzleProps {
  difficulty: "easy" | "medium" | "hard"
  onSolve: () => void
}

export default function ColorPuzzle({ difficulty, onSolve }: ColorPuzzleProps) {
  const [colors, setColors] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [targetPattern, setTargetPattern] = useState<string[]>([])
  const [isCorrect, setIsCorrect] = useState(false)

  // Set number of colors based on difficulty
  const getGridSize = () => {
    switch (difficulty) {
      case "easy":
        return 4
      case "medium":
        return 6
      case "hard":
        return 9
      default:
        return 4
    }
  }

  const gridSize = getGridSize()

  // Generate color palette
  const colorPalette = [
    "#EF4444", // red
    "#F97316", // orange
    "#FACC15", // yellow
    "#4ADE80", // green
    "#22D3EE", // cyan
    "#60A5FA", // blue
    "#8B5CF6", // purple
    "#EC4899", // pink
    "#F472B6", // light pink
  ]

  useEffect(() => {
    initializePuzzle()
  }, [difficulty])

  const initializePuzzle = () => {
    // Reset state
    setIsCorrect(false)
    setSelectedColors([])

    // Shuffle and pick colors based on difficulty
    const shuffledColors = [...colorPalette].sort(() => Math.random() - 0.5).slice(0, gridSize)
    setColors(shuffledColors)

    // Create target pattern (shuffled version of colors)
    const pattern = [...shuffledColors].sort(() => Math.random() - 0.5)
    setTargetPattern(pattern)
  }

  const handleColorSelect = (color: string) => {
    if (selectedColors.length < targetPattern.length) {
      const newSelectedColors = [...selectedColors, color]
      setSelectedColors(newSelectedColors)

      // Check if puzzle is solved after selecting the last color
      if (newSelectedColors.length === targetPattern.length) {
        const correct = newSelectedColors.every((c, i) => c === targetPattern[i])
        setIsCorrect(correct)

        if (correct) {
          setTimeout(() => {
            onSolve()
          }, 1000)
        }
      }
    }
  }

  const handleReset = () => {
    setSelectedColors([])
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Color Pattern Puzzle</h2>
      <p className="text-gray-600 mb-6">Recreate the pattern below by selecting colors in the correct order.</p>

      {/* Target pattern */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-2">Target Pattern:</h3>
        <div className="flex gap-2 justify-center">
          {targetPattern.map((color, index) => (
            <div
              key={`target-${index}`}
              className="w-10 h-10 rounded-full border-2 border-gray-200"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* User selection */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-2">Your Selection:</h3>
        <div className="flex gap-2 justify-center">
          {Array.from({ length: targetPattern.length }).map((_, index) => (
            <div
              key={`selection-${index}`}
              className="w-10 h-10 rounded-full border-2 border-gray-300"
              style={{
                backgroundColor: index < selectedColors.length ? selectedColors[index] : "transparent",
                transition: "background-color 0.3s ease",
              }}
            />
          ))}
        </div>
      </div>

      {/* Color palette */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Available Colors:</h3>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
          {colors.map((color, index) => (
            <motion.div
              key={`color-${index}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 rounded-full cursor-pointer border-2 border-gray-200 shadow-sm"
              style={{ backgroundColor: color }}
              onClick={() => handleColorSelect(color)}
            />
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        <Button onClick={handleReset} variant="outline">
          Reset Selection
        </Button>

        <Button onClick={initializePuzzle} variant="outline">
          <Shuffle className="mr-2 h-4 w-4" />
          New Pattern
        </Button>
      </div>

      {/* Feedback */}
      {selectedColors.length === targetPattern.length && (
        <div className={`mt-6 p-4 rounded-lg ${isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {isCorrect ? "Correct! Well done!" : "Not quite right. Try again!"}
        </div>
      )}
    </div>
  )
}
