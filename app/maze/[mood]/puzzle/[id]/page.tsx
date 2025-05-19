"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useMaze } from "@/context/maze-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import ColorPuzzle from "@/components/puzzles/color-puzzle"
import MemoryPuzzle from "@/components/puzzles/memory-puzzle"
import TimingPuzzle from "@/components/puzzles/timing-puzzle"
import PatternPuzzle from "@/components/puzzles/pattern-puzzle"

export default function PuzzlePage({ params }: { params: { mood: string; id: string } }) {
  const router = useRouter()
  const { currentMood, addToJourney, incrementPuzzlesSolved, setCurrentMood } = useMaze()
  const [solved, setSolved] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const mood = params.mood as "happy" | "calm" | "excited" | "anxious"
  const puzzleId = Number.parseInt(params.id)
  const totalPuzzles = 3 // Total puzzles per mood path

  useEffect(() => {
    // If currentMood is null (initial state) or different from the route mood
    if (currentMood === null) {
      // Just set the current mood without redirecting
      setCurrentMood(mood)
    } else if (currentMood !== mood) {
      // If the user somehow got to a puzzle with the wrong mood, redirect them
      router.push(`/maze/${mood}/start`)
    }
  }, [currentMood, mood, router, setCurrentMood])

  const handlePuzzleSolved = () => {
    setSolved(true)
    setShowConfetti(true)
    incrementPuzzlesSolved()
    addToJourney(`Solved ${mood} puzzle ${puzzleId}`)

    // Hide confetti after 3 seconds
    setTimeout(() => {
      setShowConfetti(false)
    }, 3000)
  }

  const handleContinue = () => {
    if (puzzleId < totalPuzzles) {
      // Go to next puzzle
      router.push(`/maze/${mood}/puzzle/${puzzleId + 1}`)
    } else {
      // Go to summary page
      router.push(`/maze/${mood}/summary`)
    }
  }

  const renderPuzzle = () => {
    // Different puzzle types based on mood and puzzle ID
    if (mood === "happy") {
      return puzzleId === 1 ? (
        <ColorPuzzle difficulty="easy" onSolve={handlePuzzleSolved} />
      ) : puzzleId === 2 ? (
        <MemoryPuzzle difficulty="medium" onSolve={handlePuzzleSolved} />
      ) : (
        <PatternPuzzle difficulty="hard" onSolve={handlePuzzleSolved} />
      )
    } else if (mood === "calm") {
      return puzzleId === 1 ? (
        <PatternPuzzle difficulty="easy" onSolve={handlePuzzleSolved} />
      ) : puzzleId === 2 ? (
        <ColorPuzzle difficulty="medium" onSolve={handlePuzzleSolved} />
      ) : (
        <MemoryPuzzle difficulty="hard" onSolve={handlePuzzleSolved} />
      )
    } else if (mood === "excited") {
      return puzzleId === 1 ? (
        <TimingPuzzle difficulty="easy" onSolve={handlePuzzleSolved} />
      ) : puzzleId === 2 ? (
        <PatternPuzzle difficulty="medium" onSolve={handlePuzzleSolved} />
      ) : (
        <ColorPuzzle difficulty="hard" onSolve={handlePuzzleSolved} />
      )
    } else {
      return puzzleId === 1 ? (
        <MemoryPuzzle difficulty="easy" onSolve={handlePuzzleSolved} />
      ) : puzzleId === 2 ? (
        <TimingPuzzle difficulty="medium" onSolve={handlePuzzleSolved} />
      ) : (
        <PatternPuzzle difficulty="hard" onSolve={handlePuzzleSolved} />
      )
    }
  }

  const getGradient = () => {
    switch (mood) {
      case "happy":
        return "from-yellow-400 to-orange-500"
      case "calm":
        return "from-blue-400 to-cyan-500"
      case "excited":
        return "from-pink-500 to-purple-600"
      case "anxious":
        return "from-green-400 to-teal-500"
      default:
        return "from-purple-600 to-blue-500"
    }
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${
        mood === "happy"
          ? "from-happy-50"
          : mood === "calm"
            ? "from-calm-50"
            : mood === "excited"
              ? "from-excited-50"
              : "from-anxious-50"
      } to-white p-4`}
    >
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <ConfettiEffect />
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1
            className={`text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${getGradient()} mb-2`}
          >
            {mood.charAt(0).toUpperCase() + mood.slice(1)} Path - Puzzle {puzzleId}
          </h1>
          <div className="flex items-center gap-4">
            <Progress value={(puzzleId / totalPuzzles) * 100} className="h-2" />
            <span className="text-sm text-gray-600">
              {puzzleId}/{totalPuzzles}
            </span>
          </div>
        </div>

        <Card className="p-6 shadow-lg mb-8">{renderPuzzle()}</Card>

        {solved && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <h2 className="text-2xl font-bold mb-4">Puzzle Solved!</h2>
            <Button
              onClick={handleContinue}
              className={`bg-gradient-to-r ${getGradient()} hover:opacity-90 text-white px-6 py-2`}
            >
              {puzzleId < totalPuzzles ? "Next Puzzle" : "See Your Journey"}
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

// Simple confetti effect component
function ConfettiEffect() {
  return (
    <div className="w-full h-full relative overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full"
          style={{
            backgroundColor: [
              "#FACC15", // yellow
              "#60A5FA", // blue
              "#EC4899", // pink
              "#4ADE80", // green
              "#F472B6", // light pink
              "#34D399", // emerald
              "#A78BFA", // purple
            ][i % 7],
            top: `${Math.random() * -10}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: ["0vh", "100vh"],
            x: [0, Math.random() * 100 - 50],
            rotate: [0, Math.random() * 360],
          }}
          transition={{
            duration: Math.random() * 2 + 1,
            ease: "easeOut",
            delay: Math.random() * 0.5,
          }}
        />
      ))}
    </div>
  )
}
