// Smart Task Manager - https://github.com/spark-template/smart-task-manager
import React, { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { TaskManager } from './components/TaskManager'
import { SettingsPanel } from './components/SettingsPanel'
import { Button } from './components/ui/button'
import { Gear, Moon, Sun } from '@phosphor-icons/react'
import { Toaster } from './components/ui/sonner'
import { useTheme } from './hooks'

interface Task {
  id: string
  text: string
  completed: boolean
  subtasks: Subtask[]
  createdAt: number
}

interface Subtask {
  id: string
  text: string
  completed: boolean
  createdAt: number
}

export interface AppData {
  tasks: Task[]
  apiKey?: string
}

function App() {
  const [appData, setAppData] = useKV<AppData>('task-manager-data', { tasks: [] })
  const [showSettings, setShowSettings] = useState(false)
  const { theme, toggleTheme } = useTheme()

  if (!appData) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Smart Task Manager</h1>
            <p className="text-muted-foreground mt-1">Organize your work with AI-powered planning</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="flex items-center justify-center w-9 h-9 p-0"
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(true)}
              className="flex items-center justify-center w-9 h-9 p-0"
            >
              <Gear size={16} />
            </Button>
          </div>
        </header>

        <TaskManager 
          appData={appData} 
          setAppData={setAppData}
        />

        <SettingsPanel
          open={showSettings}
          onOpenChange={setShowSettings}
          appData={appData}
          setAppData={setAppData}
        />
      </div>
      
      <Toaster />
    </div>
  )
}

export default App
