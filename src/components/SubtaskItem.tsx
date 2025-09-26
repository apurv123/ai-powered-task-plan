// Smart Task Manager - https://github.com/spark-template/smart-task-manager
import React, { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Checkbox } from './ui/checkbox'
import { Trash, PencilSimple, Check, X } from '@phosphor-icons/react'

interface Subtask {
  id: string
  text: string
  completed: boolean
  createdAt: number
}

interface SubtaskItemProps {
  subtask: Subtask
  taskId: string
  onUpdate: (taskId: string, subtaskId: string, updates: Partial<Subtask>) => void
  onDelete: (taskId: string, subtaskId: string) => void
}

export function SubtaskItem({ subtask, taskId, onUpdate, onDelete }: SubtaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(subtask.text)

  const handleSaveEdit = () => {
    if (editText.trim() && editText !== subtask.text) {
      onUpdate(taskId, subtask.id, { text: editText.trim() })
    }
    setIsEditing(false)
    setEditText(subtask.text)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditText(subtask.text)
  }

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
      <Checkbox
        id={`subtask-${subtask.id}`}
        checked={subtask.completed}
        onCheckedChange={(checked) => 
          onUpdate(taskId, subtask.id, { completed: !!checked })
        }
        className="mt-0.5"
      />
      
      <div className="flex-1">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveEdit()
                if (e.key === 'Escape') handleCancelEdit()
              }}
              autoFocus
            />
            <Button
              size="sm"
              onClick={handleSaveEdit}
              disabled={!editText.trim()}
            >
              <Check size={14} />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancelEdit}
            >
              <X size={14} />
            </Button>
          </div>
        ) : (
          <div 
            className={`cursor-pointer hover:text-primary transition-colors ${
              subtask.completed ? 'line-through text-muted-foreground' : ''
            }`}
            onClick={() => setIsEditing(true)}
          >
            {subtask.text}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsEditing(true)}
          className="h-8 w-8 p-0"
        >
          <PencilSimple size={14} />
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={() => onDelete(taskId, subtask.id)}
          className="h-8 w-8 p-0 text-destructive hover:text-destructive-foreground hover:bg-destructive"
        >
          <Trash size={14} />
        </Button>
      </div>
    </div>
  )
}