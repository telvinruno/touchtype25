"use client"

import type React from "react"
import type { Exercise, Duration } from "./navbar"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RotateCcw, Trophy } from "lucide-react"

const EXERCISES: Record<Exercise, string[]> = {
  quotes: [
    "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the English alphabet, making it perfect for testing typing speed and accuracy.",
    "Technology has revolutionized the way we communicate and work. From smartphones to cloud computing, digital innovation continues to shape our world in unprecedented ways.",
    "Learning to type efficiently is an essential skill in today's digital age. Practice and consistency are the keys to improving your words per minute and accuracy.",
  ],
  common: [
    "The weather today is quite pleasant. I think we should go outside and enjoy the beautiful sunshine.",
    "Coffee is one of the most popular beverages in the world. Many people start their day with a hot cup of coffee.",
    "Reading books helps expand your knowledge and imagination. It is a wonderful way to spend your free time.",
  ],
  code: [
    "const calculateWPM = (words, time) => Math.round(words / time); function render() { return <div>Hello World</div>; }",
    "import React from 'react'; export function Component() { const [state, setState] = useState(0); return null; }",
    "const factorial = (n) => n <= 1 ? 1 : n * factorial(n - 1); const result = factorial(5);",
  ],
  technical: [
    "JavaScript is a versatile programming language used for both frontend and backend development. It powers interactive web applications.",
    "Machine learning algorithms process vast amounts of data to identify patterns and make predictions. They are transforming industries.",
    "Cloud computing provides scalable infrastructure and services. Organizations can reduce costs by using pay-as-you-go models.",
  ],
}

interface TypingTestProps {
  exercise: Exercise
  duration: Duration
  soundEnabled: boolean
}

export function TypingTest({ exercise, duration, soundEnabled }: TypingTestProps) {
  const [testText, setTestText] = useState("")
  const [userInput, setUserInput] = useState("")
  const [isActive, setIsActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(duration)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [testFinished, setTestFinished] = useState(false)
  const [mistypedIndices, setMistypedIndices] = useState<Set<number>>(new Set())
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    const exerciseTexts = EXERCISES[exercise]
    const randomText = exerciseTexts[Math.floor(Math.random() * exerciseTexts.length)]
    setTestText(randomText)
    setMistypedIndices(new Set())
    resetTest()
  }, [exercise, duration])

  // Timer effect
  useEffect(() => {
    if (!isActive || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1
        if (newTime <= 0) {
          finishTest()
          return 0 as Duration
        }
        return newTime as Duration
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isActive])

  // Calculate WPM and accuracy
  useEffect(() => {
    if (!isActive || userInput.length === 0) return

    // Calculate WPM
    const words = userInput.trim().split(/\s+/).length
    const minutesElapsed = (duration - timeLeft) / 60
    const calculatedWpm = Math.round(words / (minutesElapsed || 0.016))
    setWpm(calculatedWpm)

    // Calculate accuracy
    let correctChars = 0
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === testText[i]) {
        correctChars++
      }
    }
    const calculatedAccuracy = Math.round((correctChars / userInput.length) * 100)
    setAccuracy(calculatedAccuracy)
  }, [userInput, isActive, timeLeft, testText, duration])

  useEffect(() => {
    if (!isActive || !soundEnabled) return

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return

      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }

      const audioContext = audioContextRef.current
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = 800
      oscillator.type = "sine"

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.1)
    }

    window.addEventListener("keydown", handleKeydown)
    return () => window.removeEventListener("keydown", handleKeydown)
  }, [isActive, soundEnabled])

  const startTest = () => {
    setIsActive(true)
    setUserInput("")
    setTimeLeft(duration)
    setTestFinished(false)
    setWpm(0)
    setAccuracy(100)
    setMistypedIndices(new Set())
    inputRef.current?.focus()
  }

  const finishTest = () => {
    setIsActive(false)
    setTestFinished(true)
  }

  const resetTest = () => {
    const exerciseTexts = EXERCISES[exercise]
    const randomText = exerciseTexts[Math.floor(Math.random() * exerciseTexts.length)]
    setTestText(randomText)
    setUserInput("")
    setIsActive(false)
    setTimeLeft(duration)
    setWpm(0)
    setAccuracy(100)
    setTestFinished(false)
    setMistypedIndices(new Set())
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (testFinished) return

    const newInput = e.target.value
    const lastCharIndex = newInput.length - 1

    if (lastCharIndex >= 0 && newInput[lastCharIndex] !== testText[lastCharIndex]) {
      const newMistyped = new Set(mistypedIndices)
      newMistyped.add(lastCharIndex)
      setMistypedIndices(newMistyped)
      return // Don't update state if character is wrong
    }

    // Remove from mistyped set if corrected
    if (lastCharIndex >= 0 && newInput[lastCharIndex] === testText[lastCharIndex]) {
      const newMistyped = new Set(mistypedIndices)
      newMistyped.delete(lastCharIndex)
      setMistypedIndices(newMistyped)
    }

    setUserInput(newInput)

    // Auto-finish if user completes all text
    if (newInput.length === testText.length && isActive) {
      finishTest()
    }
  }

  return (
    <div className="w-3/4 h-screen">
      <Card className="p-8 space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Typing Speed Test</h1>
          <p className="text-muted-foreground mt-2">Test your typing speed and accuracy</p>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-sm text-muted-foreground">Words Per Minute</div>
            <div className="text-3xl font-bold text-primary mt-2">{wpm}</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-sm text-muted-foreground">Accuracy</div>
            <div
              className={`text-3xl font-bold mt-2 ${accuracy < 90 ? "text-destructive" : accuracy < 95 ? "text-yellow-500" : "text-green-500"}`}
            >
              {accuracy}%
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-sm text-muted-foreground">Time Left</div>
            <div className="text-3xl font-bold text-primary mt-2">{timeLeft}s</div>
          </div>
        </div>

        {/* Test Text Display */}
        <div className="bg-card border border-border rounded-lg p-6 min-h-[120px] space-y-3">
          <div className="text-sm font-medium text-muted-foreground">Text to type:</div>
          <div className="text-lg leading-relaxed font-mono">
            {testText.split("").map((char, idx) => {
              let charClass = "text-foreground"

              if (idx < userInput.length) {
                if (mistypedIndices.has(idx)) {
                  charClass = "text-white bg-red-600 font-semibold"
                } else if (userInput[idx] === char) {
                  charClass = "text-green-600 bg-green-50 dark:bg-green-950"
                }
              } else if (idx === userInput.length && isActive) {
                charClass = "text-foreground bg-primary/20 animate-pulse"
              }

              return (
                <span key={idx} className={charClass}>
                  {char}
                </span>
              )
            })}
          </div>
        </div>

        {/* Input Area */}
        <div className="space-y-2">
          <label htmlFor="typing-input" className="text-sm font-medium text-muted-foreground">
            {isActive ? "Keep typing..." : testFinished ? "Test Complete" : "Click start to begin"}
          </label>
          <textarea
            ref={inputRef}
            id="typing-input"
            value={userInput}
            onChange={handleInputChange}
            disabled={!isActive}
            placeholder="Start typing here..."
            className="w-full h-24 p-4 border border-border rounded-lg bg-card text-foreground placeholder-muted-foreground disabled:opacity-50 resize-none focus:outline-none focus:ring-2 focus:ring-primary font-mono"
          />
        </div>

        {/* Control Buttons */}
        <div className="flex gap-3">
          {!isActive && !testFinished && (
            <Button onClick={startTest} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
              Start Test
            </Button>
          )}
          <Button onClick={resetTest} variant="outline" className="gap-2 bg-transparent">
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>
      </Card>

      {testFinished && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md p-8 space-y-6 animate-in fade-in zoom-in">
            <div className="flex justify-center">
              <Trophy className="w-16 h-16 text-yellow-500" />
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Test Complete!</h2>
              <p className="text-muted-foreground">Great job! Here are your results:</p>
            </div>

            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-4 text-center">
                <div className="text-sm text-muted-foreground">Words Per Minute</div>
                <div className="text-4xl font-bold text-primary mt-2">{wpm}</div>
              </div>

              <div className="bg-card border border-border rounded-lg p-4 text-center">
                <div className="text-sm text-muted-foreground">Accuracy</div>
                <div
                  className={`text-4xl font-bold mt-2 ${accuracy < 90 ? "text-destructive" : accuracy < 95 ? "text-yellow-500" : "text-green-500"}`}
                >
                  {accuracy}%
                </div>
              </div>
            </div>

            <Button onClick={resetTest} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              Try Again
            </Button>
          </Card>
        </div>
      )}
    </div>
  )
}
