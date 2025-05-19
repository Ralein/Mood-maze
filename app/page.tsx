"use client"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-8"
      >
        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 mb-4">
          Mood Maze
        </h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
          A journey through puzzles that adapt to your emotional state. Your choices shape the path ahead.
        </p>
      </motion.div>

      <div className="w-full max-w-3xl">
        {/* Animated bubbles */}
        <div className="relative h-64 md:h-80 mb-12">
          <div className="w-full h-full flex items-center justify-center">
            <div className="grid grid-cols-4 gap-4">
              {[...Array(16)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{
                    scale: [0.8, 1.2, 0.8],
                    opacity: [0.5, 1, 0.5],
                    backgroundColor: [
                      "rgb(253, 224, 71)", // yellow
                      "rgb(96, 165, 250)", // blue
                      "rgb(236, 72, 153)", // pink
                      "rgb(74, 222, 128)", // green
                      "rgb(253, 224, 71)", // back to yellow
                    ],
                  }}
                  transition={{
                    duration: 3 + (i % 3),
                    repeat: Number.POSITIVE_INFINITY,
                    delay: (i * 0.2) % 2,
                  }}
                  className="aspect-square rounded-full"
                />
              ))}
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <MoodCard
            title="Happy"
            color="from-yellow-400 to-orange-500"
            description="Bright puzzles that spark joy and creativity"
            path="/maze/happy/start"
          />
          <MoodCard
            title="Calm"
            color="from-blue-400 to-cyan-500"
            description="Soothing challenges that encourage mindfulness"
            path="/maze/calm/start"
          />
          <MoodCard
            title="Excited"
            color="from-pink-500 to-purple-600"
            description="Energetic puzzles that test your reflexes"
            path="/maze/excited/start"
          />
          <MoodCard
            title="Anxious"
            color="from-green-400 to-teal-500"
            description="Grounding puzzles that help you focus"
            path="/maze/anxious/start"
          />
        </motion.div>
      </div>
    </div>
  )
}

function MoodCard({
  title,
  color,
  description,
  path,
}: {
  title: string
  color: string
  description: string
  path: string
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={`bg-white rounded-xl shadow-xl overflow-hidden`}
    >
      <Link href={path} className="block h-full">
        <div className={`h-2 bg-gradient-to-r ${color}`}></div>
        <div className="p-6">
          <h3 className="text-2xl font-bold mb-2">{title}</h3>
          <p className="text-gray-600 mb-4">{description}</p>
          <div className="flex justify-end">
            <div className={`bg-gradient-to-r ${color} p-2 rounded-full text-white`}>
              <ArrowRight size={20} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
