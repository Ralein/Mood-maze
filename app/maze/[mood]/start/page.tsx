"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useMaze } from "@/context/maze-context"
import { Button } from "@/components/ui/button"

export default function StartPage({ params }: { params: { mood: string } }) {
  const router = useRouter()
  const { setCurrentMood, addToJourney, resetJourney, currentMood } = useMaze()
  const mood = params.mood as "happy" | "calm" | "excited" | "anxious"

  useEffect(() => {
    // Only reset journey if we're coming from a different mood or starting fresh
    if (currentMood !== mood) {
      // Reset journey when starting a new maze
      resetJourney()

      // Set the current mood based on the route
      setCurrentMood(mood)
      addToJourney(`Started ${mood} journey`)
    }
  }, [mood, currentMood, setCurrentMood, addToJourney, resetJourney])

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

  const getDescription = () => {
    switch (mood) {
      case "happy":
        return "You've chosen the path of joy! Solve colorful puzzles that celebrate creativity and positivity."
      case "calm":
        return "Welcome to the tranquil path. These puzzles will help you find your center through mindful challenges."
      case "excited":
        return "Energy flows through this path! Get ready for fast-paced puzzles that will keep your adrenaline pumping."
      case "anxious":
        return "This grounding path offers puzzles designed to help you focus and find clarity through the fog."
      default:
        return "Begin your journey through the Mood Maze."
    }
  }

  const handleContinue = () => {
    router.push(`/maze/${mood}/puzzle/1`)
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
      } to-white flex flex-col items-center justify-center p-4`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-8 max-w-3xl"
      >
        <h1
          className={`text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${getGradient()} mb-4`}
        >
          {mood.charAt(0).toUpperCase() + mood.slice(1)} Path
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-8">{getDescription()}</p>

        <div className="w-full max-w-md mx-auto h-64 mb-8">
          {/* Replace Lottie with animated SVG */}
          <AnimatedMoodIcon mood={mood} />
        </div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={handleContinue}
            className={`bg-gradient-to-r ${getGradient()} hover:opacity-90 text-white px-8 py-6 text-lg rounded-full`}
          >
            Begin Your Journey
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}

// Simple animated SVG component to replace Lottie
function AnimatedMoodIcon({ mood }: { mood: string }) {
  const getColor = () => {
    switch (mood) {
      case "happy":
        return "#F59E0B" // Yellow
      case "calm":
        return "#3B82F6" // Blue
      case "excited":
        return "#EC4899" // Pink
      case "anxious":
        return "#10B981" // Green
      default:
        return "#8B5CF6" // Purple
    }
  }

  return (
    <motion.div
      className="w-full h-full flex items-center justify-center"
      initial={{ scale: 0.9 }}
      animate={{ scale: [0.9, 1.1, 0.9] }}
      transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
    >
      {mood === "happy" && (
        <svg viewBox="0 0 200 200" className="w-48 h-48">
          <motion.circle
            cx="100"
            cy="100"
            r="80"
            fill={getColor()}
            initial={{ opacity: 0.7 }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          />
          <circle cx="70" cy="80" r="10" fill="#000" />
          <circle cx="130" cy="80" r="10" fill="#000" />
          <motion.path
            d="M 60 120 Q 100 150 140 120"
            stroke="#000"
            strokeWidth="8"
            strokeLinecap="round"
            fill="transparent"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </svg>
      )}

      {mood === "calm" && (
        <svg viewBox="0 0 200 200" className="w-48 h-48">
          <motion.circle
            cx="100"
            cy="100"
            r="80"
            fill={getColor()}
            initial={{ opacity: 0.7 }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
          />
          <motion.path
            d="M 40 100 Q 70 80 100 100 Q 130 120 160 100"
            stroke="white"
            strokeWidth="8"
            strokeLinecap="round"
            fill="transparent"
            initial={{ y: -5 }}
            animate={{ y: 5 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", ease: "easeInOut" }}
          />
          <motion.path
            d="M 40 130 Q 70 110 100 130 Q 130 150 160 130"
            stroke="white"
            strokeWidth="8"
            strokeLinecap="round"
            fill="transparent"
            initial={{ y: 5 }}
            animate={{ y: -5 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", ease: "easeInOut" }}
          />
        </svg>
      )}

      {mood === "excited" && (
        <svg viewBox="0 0 200 200" className="w-48 h-48">
          <motion.circle
            cx="100"
            cy="100"
            r="80"
            fill={getColor()}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
          />
          <motion.path
            d="M 70 70 L 90 90 L 70 110"
            stroke="white"
            strokeWidth="8"
            strokeLinecap="round"
            fill="transparent"
          />
          <motion.path
            d="M 130 70 L 110 90 L 130 110"
            stroke="white"
            strokeWidth="8"
            strokeLinecap="round"
            fill="transparent"
          />
          <motion.path
            d="M 70 140 Q 100 160 130 140"
            stroke="white"
            strokeWidth="8"
            strokeLinecap="round"
            fill="transparent"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        </svg>
      )}

      {mood === "anxious" && (
        <svg viewBox="0 0 200 200" className="w-48 h-48">
          <motion.circle
            cx="100"
            cy="100"
            r="80"
            fill={getColor()}
            initial={{ opacity: 0.7 }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          />
          <motion.circle
            cx="70"
            cy="80"
            r="10"
            fill="white"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          />
          <motion.circle
            cx="130"
            cy="80"
            r="10"
            fill="white"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", delay: 0.3 }}
          />
          <motion.path
            d="M 70 130 Q 100 110 130 130"
            stroke="white"
            strokeWidth="8"
            strokeLinecap="round"
            fill="transparent"
            animate={{ d: ["M 70 130 Q 100 110 130 130", "M 70 130 Q 100 120 130 130"] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          />
        </svg>
      )}
    </motion.div>
  )
}
