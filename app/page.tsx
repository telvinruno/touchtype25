"use client"

import React from "react"

import { useState } from "react"
import { TypingTest } from "@/components/typing-test"
import { Navbar, type Exercise, type Duration, type Theme } from "@/components/navbar"

export default function Home() {
  const [selectedExercise, setSelectedExercise] = useState<Exercise>("quotes")
  const [selectedDuration, setSelectedDuration] = useState<Duration>(60)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [theme, setTheme] = useState<Theme>("dark")

  React.useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [theme])

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        selectedExercise={selectedExercise}
        selectedDuration={selectedDuration}
        soundEnabled={soundEnabled}
        theme={theme}
        onExerciseChange={setSelectedExercise}
        onDurationChange={setSelectedDuration}
        onSoundToggle={setSoundEnabled}
        onThemeChange={setTheme}
      />
      <main className="flex items-center justify-center p-4 py-8">
        <TypingTest exercise={selectedExercise} duration={selectedDuration} soundEnabled={soundEnabled} />
      </main>
    </div>
  )
}
