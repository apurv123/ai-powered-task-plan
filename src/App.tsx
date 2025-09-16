import React, { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { TaskManager } from './components/TaskManager'
import { SettingsPanel } from './components/SettingsPanel'
import { Button } from './components/ui/button'
import { Gear } from '@phosphor-icons/react'
import { Toaster } from './components/ui/sonner'

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
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-2"
          >
            <Gear size={16} />
            Settings
          </Button>
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
