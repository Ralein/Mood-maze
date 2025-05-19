import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { MazeProvider } from "@/context/maze-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Mood Maze - An Interactive Puzzle Adventure",
  description: "A choose-your-own-adventure style maze where your mood shapes the journey",

}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MazeProvider>{children}</MazeProvider>
      </body>
    </html>
  )
}
