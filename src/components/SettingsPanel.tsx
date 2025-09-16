import React, { useState } from 'react'
import { AppData } from '../App'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Separator } from './ui/separator'
import { CheckCircle, XCircle, TestTube } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface SettingsPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  appData: AppData
  setAppData: (updater: (prev: AppData) => AppData) => void
}

export function SettingsPanel({ open, onOpenChange, appData, setAppData }: SettingsPanelProps) {
  const [apiKey, setApiKey] = useState(appData.apiKey || '')
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSaveApiKey = () => {
    setAppData(prev => ({
      ...prev,
      apiKey: apiKey.trim() || undefined
    }))
    toast.success('API key saved successfully!')
  }

  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      toast.error('Please enter an API key first')
      return
    }

    setIsTestingConnection(true)
    setConnectionStatus('idle')

    try {
      const testPrompt = (window as any).spark.llmPrompt`Test connection - respond with just the word "success"`
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey.trim()}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'user', content: 'Test connection - respond with just the word "success"' }
          ],
          max_tokens: 10
        })
      })

      if (response.ok) {
        setConnectionStatus('success')
        toast.success('Connection test successful!')
      } else {
        const error = await response.json()
        setConnectionStatus('error')
        toast.error(`Connection failed: ${error.error?.message || 'Unknown error'}`)
      }
    } catch (error) {
      setConnectionStatus('error')
      toast.error('Connection test failed. Please check your API key.')
    } finally {
      setIsTestingConnection(false)
    }
  }

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all tasks? This cannot be undone.')) {
      setAppData(prev => ({ ...prev, tasks: [] }))
      toast.success('All tasks cleared')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="api-key" className="text-sm font-medium">
                OpenAI API Key
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Required for AI-powered task planning features
              </p>
            </div>
            
            <div className="space-y-3">
              <Input
                id="api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="font-mono text-sm"
              />
              
              <div className="flex gap-2">
                <Button
                  onClick={handleSaveApiKey}
                  disabled={apiKey === (appData.apiKey || '')}
                  className="flex-1"
                >
                  Save API Key
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleTestConnection}
                  disabled={!apiKey.trim() || isTestingConnection}
                  className="flex items-center gap-2"
                >
                  <TestTube size={16} className={isTestingConnection ? 'animate-spin' : ''} />
                  {isTestingConnection ? 'Testing...' : 'Test'}
                </Button>
              </div>
              
              {connectionStatus !== 'idle' && (
                <div className={`flex items-center gap-2 text-sm ${
                  connectionStatus === 'success' ? 'text-success' : 'text-destructive'
                }`}>
                  {connectionStatus === 'success' ? (
                    <CheckCircle size={16} />
                  ) : (
                    <XCircle size={16} />
                  )}
                  {connectionStatus === 'success' 
                    ? 'Connection successful!' 
                    : 'Connection failed'
                  }
                </div>
              )}
            </div>
            
            <div className="text-xs text-muted-foreground">
              <p>Your API key is stored locally and never transmitted to our servers.</p>
              <p>Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">OpenAI Platform</a></p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Data Management</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Manage your stored tasks and data
              </p>
            </div>
            
            <Button
              variant="destructive"
              onClick={handleClearData}
              className="w-full"
            >
              Clear All Tasks
            </Button>
            
            <div className="text-xs text-muted-foreground">
              <p>Tasks: {appData.tasks.length}</p>
              <p>Total subtasks: {appData.tasks.reduce((sum, task) => sum + task.subtasks.length, 0)}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}