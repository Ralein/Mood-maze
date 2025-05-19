"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface JourneyVisualizationProps {
  mood: string
  journey: string[]
}

export default function JourneyVisualization({ mood, journey }: JourneyVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set colors based on mood
    let gradientColors
    switch (mood) {
      case "happy":
        gradientColors = ["#FACC15", "#F97316"]
        break
      case "calm":
        gradientColors = ["#60A5FA", "#22D3EE"]
        break
      case "excited":
        gradientColors = ["#EC4899", "#8B5CF6"]
        break
      case "anxious":
        gradientColors = ["#4ADE80", "#14B8A6"]
        break
      default:
        gradientColors = ["#8B5CF6", "#3B82F6"]
    }

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, gradientColors[0])
    gradient.addColorStop(1, gradientColors[1])

    // Ensure we have at least 2 points for the journey
    const journeyPoints = journey.length > 1 ? journey.length : 2

    // Draw journey path
    const points = Array.from({ length: journeyPoints }).map((_, index) => {
      const x = (index / (journeyPoints - 1)) * (canvas.width - 100) + 50

      // Create a wavy path based on the journey
      const amplitude = 40
      const frequency = 0.1
      const y = canvas.height / 2 + amplitude * Math.sin(frequency * index * Math.PI) + (Math.random() * 20 - 10) // Add some randomness

      return { x, y }
    })

    // Draw path
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)

    for (let i = 1; i < points.length; i++) {
      // Use bezier curves for smoother path
      const xc = (points[i].x + points[i - 1].x) / 2
      const yc = (points[i].y + points[i - 1].y) / 2
      ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc)
    }

    // If there are points, complete the path to the last point
    if (points.length > 1) {
      ctx.quadraticCurveTo(
        points[points.length - 2].x,
        points[points.length - 2].y,
        points[points.length - 1].x,
        points[points.length - 1].y,
      )
    }

    ctx.strokeStyle = gradient
    ctx.lineWidth = 6
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.stroke()

    // Draw nodes at each journey point
    points.forEach((point) => {
      ctx.beginPath()
      ctx.arc(point.x, point.y, 8, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()

      // Add a white border
      ctx.strokeStyle = "white"
      ctx.lineWidth = 2
      ctx.stroke()
    })
  }, [mood, journey])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className="w-full h-full relative"
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </motion.div>
  )
}
