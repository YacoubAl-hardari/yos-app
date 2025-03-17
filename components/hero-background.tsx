"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

export function HeroBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    // const isDark = theme === "dark"

    // Clear previous elements
    container.innerHTML = ""

    // Function to create animated lines with moving dots
    const createLine = (x: number, y: number, width: number, height: number, rotation: number, delay: number) => {
      const line = document.createElement("div")
      line.className = "line"
      line.style.width = `${width}px`
      line.style.height = `${height}px`
      line.style.left = `${x}px`
      line.style.top = `${y}px`
      line.style.transform = `rotate(${rotation}deg)`
      line.style.opacity = "0"
      line.style.animation = `fadeIn 1s ease-out ${delay}s forwards`

      // Create moving dot for the line
      const dot = document.createElement("div")
      dot.className = "dot"
      dot.style.width = "4px"
      dot.style.height = "4px"
      dot.style.position = "absolute"
      dot.style.top = "0"
      dot.style.left = "0"
      dot.style.animation = `moveAlongLine ${Math.random() * 5 + 8}s linear infinite`
      dot.style.animationDelay = `${Math.random() * 5}s`

      line.appendChild(dot)
      container.appendChild(line)
    }

    // Function to create animated floating dots
    const createDot = (x: number, y: number, size: number, animationDuration: number, delay: number) => {
      const dot = document.createElement("div")
      dot.className = "dot"
      dot.style.width = `${size}px`
      dot.style.height = `${size}px`
      dot.style.left = `${x}px`
      dot.style.top = `${y}px`
      dot.style.opacity = "0"
      dot.style.animation = `
        fadeIn 1s ease-out ${delay}s forwards, 
        float ${animationDuration}s ease-in-out infinite, 
        pulse-slow ${animationDuration * 0.75}s ease-in-out infinite
      `

      container.appendChild(dot)
    }

    // Get container dimensions
    const width = container.offsetWidth
    const height = container.offsetHeight

    // Create random lines
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const lineWidth = Math.random() * 150 + 50
      const rotation = Math.random() * 360
      const delay = Math.random() * 2

      createLine(x, y, lineWidth, 1, rotation, delay)
    }

    // Create random dots
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const size = Math.random() * 3 + 2
      const animationDuration = Math.random() * 4 + 3
      const delay = Math.random() * 3

      createDot(x, y, size, animationDuration, delay)
    }

    createLine(width * 0.1, height * 0.2, width * 0.8, 2, 0, 0.5)  
    createLine(width * 0.1, height * 0.5, width * 0.8, 2, 0, 0.7)   
    createLine(width * 0.1, height * 0.8, width * 0.8, 2, 0, 0.9) 
    createLine(width * 0.2, height * 0.2, width * 0.4, 1, 45, 1.2)  
    createLine(width * 0.6, height * 0.6, width * 0.4, 1, -45, 1.5)

    // Cleanup function
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ""
      }
    }
  }, [theme])

  return <div ref={containerRef} className="hero-animated-bg" />
}
