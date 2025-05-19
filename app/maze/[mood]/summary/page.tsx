"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useMaze } from "@/context/maze-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Share2, Home, RefreshCw } from "lucide-react"
import JourneyVisualization from "@/components/journey-visualization"

export default function SummaryPage({ params }: { params: { mood: string } }) {
  const router = useRouter()
  const { currentMood, journey, puzzlesSolved, resetJourney, setCurrentMood } = useMaze()
  const [showAnimation, setShowAnimation] = useState(true)

  const mood = params.mood as "happy" | "calm" | "excited" | "anxious"

  useEffect(() => {
    // If currentMood is null (initial state) or different from the route mood
    if (currentMood === null) {
      // Just set the current mood without redirecting
      setCurrentMood(mood)
    } else if (currentMood !== mood) {
      // If the user somehow got to a summary with the wrong mood, redirect them
      router.push(`/maze/${mood}/start`)
    }

    // Hide animation after 3 seconds
    const timer = setTimeout(() => {
      setShowAnimation(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [currentMood, mood, router, setCurrentMood])

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

  const getMoodDescription = () => {
    switch (mood) {
      case "happy":
        return "Your journey through the happy path reveals your joyful spirit and creative energy. You approached challenges with optimism and found delight in the colorful puzzles."
      case "calm":
        return "Your tranquil journey shows your mindful approach to challenges. You navigated the puzzles with patience and thoughtfulness, finding harmony in each step."
      case "excited":
        return "Your energetic path demonstrates your enthusiasm and quick thinking. You tackled each puzzle with vigor and embraced the fast-paced challenges."
      case "anxious":
        return "Your grounding journey reveals your ability to find focus amidst uncertainty. You approached each puzzle methodically, finding clarity through concentration."
      default:
        return "Your journey through the Mood Maze has been completed."
    }
  }

  const handleStartOver = () => {
    resetJourney()
    router.push("/")
  }

  const handleTryDifferentMood = () => {
    resetJourney()
    router.push("/")
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
      {showAnimation && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <CelebrationEffect />
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1
            className={`text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${getGradient()} mb-4`}
          >
            Your Mood Journey
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">{getMoodDescription()}</p>
        </motion.div>

        <Card className="p-6 shadow-lg mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Journey Visualization</h2>
          <div className="h-64 md:h-80">
            <JourneyVisualization mood={mood} journey={journey} />
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="p-6 shadow-md">
            <h3 className="text-xl font-semibold mb-4">Journey Stats</h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>Mood Path:</span>
                <span className="font-medium capitalize">{mood}</span>
              </li>
              <li className="flex justify-between">
                <span>Puzzles Solved:</span>
                <span className="font-medium">{puzzlesSolved}</span>
              </li>
              <li className="flex justify-between">
                <span>Journey Steps:</span>
                <span className="font-medium">{journey.length}</span>
              </li>
            </ul>
          </Card>

          <Card className="p-6 shadow-md">
            <h3 className="text-xl font-semibold mb-4">Mood Analysis</h3>
            <p className="text-gray-700">
              Based on your journey, you seem to thrive in {mood} environments. Your problem-solving style is{" "}
              {mood === "happy"
                ? "creative and optimistic"
                : mood === "calm"
                  ? "methodical and patient"
                  : mood === "excited"
                    ? "energetic and spontaneous"
                    : "focused and analytical"}
              .
            </p>
          </Card>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Button
            onClick={handleStartOver}
            className="bg-white text-gray-800 border border-gray-300 hover:bg-gray-100"
            size="lg"
          >
            <Home className="mr-2 h-4 w-4" />
            Return Home
          </Button>

          <Button
            onClick={handleTryDifferentMood}
            className={`bg-gradient-to-r ${getGradient()} hover:opacity-90 text-white`}
            size="lg"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Different Mood
          </Button>

          <Button
            onClick={() => {
              // Share functionality would go here
              alert("Share functionality would be implemented here!")
            }}
            variant="outline"
            size="lg"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share Journey
          </Button>
        </div>
      </div>
    </div>
  )
}

// Simple celebration effect component
function CelebrationEffect() {
  return (
    <div className="w-full h-full relative overflow-hidden">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            width: Math.random() * 20 + 10,
            height: Math.random() * 20 + 10,
            borderRadius: Math.random() > 0.5 ? "50%" : "0%",
            backgroundColor: [
              "#FACC15", // yellow
              "#60A5FA", // blue
              "#EC4899", // pink
              "#4ADE80", // green
              "#F472B6", // light pink
            ][i % 5],
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          initial={{ scale: 0, rotate: 0, opacity: 1 }}
          animate={{
            scale: [0, 1, 0],
            rotate: [0, Math.random() * 360],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 2,
            ease: "easeOut",
            delay: Math.random() * 1,
          }}
        />
      ))}
    </div>
  )
}
