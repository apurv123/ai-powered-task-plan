// Smart Task Manager - https://github.com/spark-template/smart-task-manager
import React, { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Plus } from '@phosphor-icons/react'

interface AddTaskFormProps {
  onAddTask: (text: string) => void
}

export function AddTaskForm({ onAddTask }: AddTaskFormProps) {
  const [text, setText] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim()) {
      onAddTask(text.trim())
      setText('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <Input
        id="new-task"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a new task..."
        className="flex-1"
        autoFocus
      />
      <Button 
        type="submit" 
        disabled={!text.trim()}
        className="flex items-center gap-2"
      >
        <Plus size={16} />
        Add Task
      </Button>
    </form>
  )
}