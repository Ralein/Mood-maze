"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Play, Pause, RefreshCw } from "lucide-react"

interface TimingPuzzleProps {
  difficulty: "easy" | "medium" | "hard"
  onSolve: () => void
}

export default function TimingPuzzle({ difficulty, onSolve }: TimingPuzzleProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [time, setTime] = useState(0)
  const [targetTime, setTargetTime] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [solved, setSolved] = useState(false)
  const [accuracy, setAccuracy] = useState(0)

  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Set difficulty parameters
  const getDifficultyParams = () => {
    switch (difficulty) {
      case "easy":
        return { targetMin: 5, targetMax: 10, tolerance: 0.2 }
      case "medium":
        return { targetMin: 8, targetMax: 15, tolerance: 0.15 }
      case "hard":
        return { targetMin: 12, targetMax: 20, tolerance: 0.1 }
      default:
        return { targetMin: 5, targetMax: 10, tolerance: 0.2 }
    }
  }

  const { targetMin, targetMax, tolerance } = getDifficultyParams()

  useEffect(() => {
    generateNewTarget()
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [difficulty])

  const generateNewTarget = () => {
    // Generate random target time between min and max seconds
    const newTarget = Math.floor(Math.random() * (targetMax - targetMin + 1)) + targetMin
    setTargetTime(newTarget)
    resetTimer()
    setFeedback("")
    setSolved(false)
  }

  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    setIsRunning(false)
    setTime(0)
  }

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true)
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 0.1)
      }, 100)
    }
  }

  const stopTimer = () => {
    if (isRunning) {
      setIsRunning(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }

      // Calculate accuracy
      const timeDiff = Math.abs(time - targetTime)
      const accuracyPercentage = Math.max(0, 100 - (timeDiff / targetTime) * 100)
      setAccuracy(Math.round(accuracyPercentage))

      // Check if within tolerance
      const isCorrect = timeDiff <= targetTime * tolerance

      setAttempts(attempts + 1)

      if (isCorrect) {
        setFeedback("Perfect timing! You nailed it!")
        setSolved(true)
        onSolve()
      } else if (time < targetTime) {
        setFeedback("Too early! Try again.")
      } else {
        setFeedback("Too late! Try again.")
      }
    }
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Timing Challenge</h2>
      <p className="text-gray-600 mb-6">Stop the timer as close as possible to the target time.</p>

      {/* Target time */}
      <div className="mb-6 text-center">
        <h3 className="text-lg font-medium mb-2">Target Time:</h3>
        <div className="text-4xl font-bold">{targetTime.toFixed(1)}s</div>
      </div>

      {/* Timer display */}
      <div className="mb-8 text-center">
        <h3 className="text-lg font-medium mb-2">Current Time:</h3>
        <div className="text-5xl font-bold mb-4">{time.toFixed(1)}s</div>
        <Progress value={(time / targetTime) * 100} className="h-3 w-64 mb-2" />
      </div>

      {/* Controls */}
      <div className="flex gap-4 mb-6">
        {!isRunning ? (
          <Button
            onClick={startTimer}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 text-white"
            size="lg"
            disabled={solved}
          >
            <Play className="mr-2 h-5 w-5" />
            Start
          </Button>
        ) : (
          <Button
            onClick={stopTimer}
            className="bg-gradient-to-r from-red-500 to-rose-600 hover:opacity-90 text-white"
            size="lg"
          >
            <Pause className="mr-2 h-5 w-5" />
            Stop
          </Button>
        )}

        <Button onClick={generateNewTarget} variant="outline" size="lg">
          <RefreshCw className="mr-2 h-5 w-5" />
          New Target
        </Button>
      </div>

      {/* Feedback */}
      {feedback && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg text-center ${
            solved ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
          }`}
        >
          <p className="font-medium mb-1">{feedback}</p>
          {attempts > 0 && (
            <p className="text-sm">
              Accuracy: {accuracy}% | Attempts: {attempts}
            </p>
          )}
        </motion.div>
      )}
    </div>
  )
}
