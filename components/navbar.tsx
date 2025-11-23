"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Zap, ChevronDown, Volume2, Palette } from "lucide-react"

export type Exercise = "quotes" | "common" | "code" | "technical"
export type Duration = 30 | 60 | 120
export type Theme = "light" | "dark"

interface NavbarProps {
  selectedExercise: Exercise
  selectedDuration: Duration
  soundEnabled: boolean
  theme: Theme
  onExerciseChange: (exercise: Exercise) => void
  onDurationChange: (duration: Duration) => void
  onSoundToggle: (enabled: boolean) => void
  onThemeChange: (theme: Theme) => void
}

const exercises = {
  quotes: "Quotes",
  common: "Common Phrases",
  code: "Code",
  technical: "Technical",
}

const durations = [30, 60, 120] as const
const themes = ["light", "dark"] as const

export function Navbar({
  selectedExercise,
  selectedDuration,
  soundEnabled,
  theme,
  onExerciseChange,
  onDurationChange,
  onSoundToggle,
  onThemeChange,
}: NavbarProps) {
  const [exerciseOpen, setExerciseOpen] = useState(false)
  const [durationOpen, setDurationOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">Road to 300wpm</h1>

        <div className="flex items-center gap-8">
          {/* Exercise Dropdown */}
          <div className="relative">
            <Button onClick={() => setExerciseOpen(!exerciseOpen)} variant="outline" className="gap-2 bg-transparent">
              {exercises[selectedExercise]}
              <ChevronDown className="w-4 h-4" />
            </Button>
            {exerciseOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-10">
                {Object.entries(exercises).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => {
                      onExerciseChange(key as Exercise)
                      setExerciseOpen(false)
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-accent hover:text-white ${
                      selectedExercise === key ? "bg-primary/10 text-primary font-semibold" : ""
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Duration Dropdown with Speed Icon */}
          <div className="relative">
            <Button onClick={() => setDurationOpen(!durationOpen)} variant="outline" className="gap-2 bg-transparent">
              <Zap className="w-4 h-4" />
              {selectedDuration}s
              <ChevronDown className="w-4 h-4" />
            </Button>
            {durationOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-card border border-border rounded-lg shadow-lg z-10">
                {durations.map((duration) => (
                  <button
                    key={duration}
                    onClick={() => {
                      onDurationChange(duration)
                      setDurationOpen(false)
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-accent hover:text-white ${
                      selectedDuration === duration ? "bg-primary/10 text-primary font-semibold" : ""
                    }`}
                  >
                    {duration} seconds
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Settings Dropdown */}
          <div className="relative">
            <Button onClick={() => setSettingsOpen(!settingsOpen)} variant="outline" className="gap-2 bg-transparent">
              <Palette className="w-4 h-4" />
              <ChevronDown className="w-4 h-4" />
            </Button>
            {settingsOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg z-10 p-3">
                {/* Sound Control */}
                <div className="px-3 py-2 border-b border-border mb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4" />
                      <span className="text-sm font-medium">Sound</span>
                    </div>
                    <button
                      onClick={() => onSoundToggle(!soundEnabled)}
                      className={`relative w-10 h-6 rounded-full transition-colors ${
                        soundEnabled ? "bg-primary" : "bg-muted"
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                          soundEnabled ? "translate-x-5" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Theme Control */}
                <div className="px-3 py-2">
                  <div className="text-sm font-medium mb-2">Theme</div>
                  <div className="grid grid-cols-2 gap-2">
                    {themes.map((t) => (
                      <button
                        key={t}
                        onClick={() => {
                          onThemeChange(t)
                          setSettingsOpen(false)
                        }}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-white capitalize ${
                          theme === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
