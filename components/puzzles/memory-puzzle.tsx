"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

interface MemoryPuzzleProps {
  difficulty: "easy" | "medium" | "hard"
  onSolve: () => void
}

interface MemoryCard {
  id: number
  value: string
  flipped: boolean
  matched: boolean
}

export default function MemoryPuzzle({ difficulty, onSolve }: MemoryPuzzleProps) {
  const [cards, setCards] = useState<MemoryCard[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matchedPairs, setMatchedPairs] = useState<number>(0)
  const [moves, setMoves] = useState<number>(0)
  const [gameStarted, setGameStarted] = useState<boolean>(false)

  // Set grid size based on difficulty
  const getGridSize = () => {
    switch (difficulty) {
      case "easy":
        return { pairs: 4, cols: 4 } // 4x2 grid
      case "medium":
        return { pairs: 6, cols: 4 } // 4x3 grid
      case "hard":
        return { pairs: 8, cols: 4 } // 4x4 grid
      default:
        return { pairs: 4, cols: 4 }
    }
  }

  const { pairs, cols } = getGridSize()

  // Emoji set for card values
  const emojis = ["🍎", "🍌", "🍒", "🍓", "🍊", "🍋", "🍍", "🥝", "🥥", "🍇", "🍉", "🍐"]

  useEffect(() => {
    initializeGame()
  }, [difficulty])

  const initializeGame = () => {
    // Reset state
    setFlippedCards([])
    setMatchedPairs(0)
    setMoves(0)
    setGameStarted(false)

    // Create and shuffle cards
    const selectedEmojis = emojis.slice(0, pairs)
    let newCards: MemoryCard[] = []

    selectedEmojis.forEach((emoji, index) => {
      // Create pair of cards with same value
      newCards.push({ id: index * 2, value: emoji, flipped: false, matched: false })
      newCards.push({ id: index * 2 + 1, value: emoji, flipped: false, matched: false })
    })

    // Shuffle cards
    newCards = newCards.sort(() => Math.random() - 0.5)

    setCards(newCards)
  }

  const handleCardClick = (id: number) => {
    // Start game on first card click
    if (!gameStarted) {
      setGameStarted(true)
    }

    // Ignore click if card is already flipped or matched
    const clickedCard = cards.find((card) => card.id === id)
    if (!clickedCard || clickedCard.flipped || clickedCard.matched) {
      return
    }

    // Ignore if already two cards flipped
    if (flippedCards.length === 2) {
      return
    }

    // Flip the card
    const newCards = cards.map((card) => (card.id === id ? { ...card, flipped: true } : card))
    setCards(newCards)

    // Add to flipped cards
    const newFlippedCards = [...flippedCards, id]
    setFlippedCards(newFlippedCards)

    // Check for match if two cards flipped
    if (newFlippedCards.length === 2) {
      setMoves(moves + 1)

      const firstCard = cards.find((card) => card.id === newFlippedCards[0])
      const secondCard = cards.find((card) => card.id === newFlippedCards[1])

      if (firstCard?.value === secondCard?.value) {
        // Match found
        setTimeout(() => {
          const matchedCards = cards.map((card) =>
            card.id === newFlippedCards[0] || card.id === newFlippedCards[1] ? { ...card, matched: true } : card,
          )
          setCards(matchedCards)
          setFlippedCards([])
          setMatchedPairs(matchedPairs + 1)

          // Check if all pairs matched
          if (matchedPairs + 1 === pairs) {
            onSolve()
          }
        }, 500)
      } else {
        // No match, flip cards back
        setTimeout(() => {
          const resetCards = cards.map((card) =>
            card.id === newFlippedCards[0] || card.id === newFlippedCards[1] ? { ...card, flipped: false } : card,
          )
          setCards(resetCards)
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Memory Match Puzzle</h2>
      <p className="text-gray-600 mb-6">Find all matching pairs of cards to complete the puzzle.</p>

      {/* Game stats */}
      <div className="flex justify-between w-full max-w-md mb-6">
        <div className="text-center">
          <p className="text-sm text-gray-500">Pairs</p>
          <p className="text-xl font-bold">
            {matchedPairs}/{pairs}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Moves</p>
          <p className="text-xl font-bold">{moves}</p>
        </div>
        <Button onClick={initializeGame} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Restart
        </Button>
      </div>

      {/* Card grid */}
      <div
        className="grid gap-4 mb-6"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          width: "100%",
          maxWidth: "500px",
        }}
      >
        {cards.map((card) => (
          <motion.div
            key={card.id}
            whileHover={{ scale: card.matched ? 1 : 1.05 }}
            whileTap={{ scale: card.matched ? 1 : 0.95 }}
            onClick={() => handleCardClick(card.id)}
            className={`aspect-square flex items-center justify-center rounded-lg cursor-pointer ${
              card.matched ? "opacity-50" : ""
            }`}
          >
            <div
              className={`w-full h-full rounded-lg flex items-center justify-center text-3xl shadow-md ${
                card.flipped ? "bg-white" : "bg-gradient-to-br from-purple-500 to-indigo-600 text-white"
              }`}
            >
              {card.flipped ? card.value : "?"}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Game completion message */}
      {matchedPairs === pairs && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg">Puzzle solved in {moves} moves!</div>
      )}
    </div>
  )
}
