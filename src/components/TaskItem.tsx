// Smart Task Manager - https://github.com/spark-template/smart-task-manager
import React, { useState } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Checkbox } from './ui/checkbox'
import { SubtaskItem } from './SubtaskItem'
import { 
  Trash, 
  Plus, 
  MagicWand, 
  PencilSimple,
  Check,
  X
} from '@phosphor-icons/react'
import { toast } from 'sonner'

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

interface TaskItemProps {
  task: Task
  onUpdate: (taskId: string, updates: Partial<Task>) => void
  onDelete: (taskId: string) => void
  onAddSubtask: (taskId: string, subtaskText: string) => void
  onUpdateSubtask: (taskId: string, subtaskId: string, updates: Partial<Subtask>) => void
  onDeleteSubtask: (taskId: string, subtaskId: string) => void
  onGenerateSubtasks: (taskId: string, taskText: string) => Promise<void>
  hasApiKey: boolean
}

export function TaskItem({
  task,
  onUpdate,
  onDelete,
  onAddSubtask,
  onUpdateSubtask,
  onDeleteSubtask,
  onGenerateSubtasks,
  hasApiKey
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(task.text)
  const [isAddingSubtask, setIsAddingSubtask] = useState(false)
  const [newSubtaskText, setNewSubtaskText] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleSaveEdit = () => {
    if (editText.trim() && editText !== task.text) {
      onUpdate(task.id, { text: editText.trim() })
    }
    setIsEditing(false)
    setEditText(task.text)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditText(task.text)
  }

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault()
    if (newSubtaskText.trim()) {
      onAddSubtask(task.id, newSubtaskText.trim())
      setNewSubtaskText('')
      setIsAddingSubtask(false)
    }
  }

  const handleGenerateSubtasks = async () => {
    if (!hasApiKey) {
      toast.error('OpenAI API key not configured. Please add it in Settings.')
      return
    }

    setIsGenerating(true)
    try {
      await onGenerateSubtasks(task.id, task.text)
      toast.success('AI subtasks generated successfully!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to generate subtasks')
    } finally {
      setIsGenerating(false)
    }
  }

  const completedSubtasks = task.subtasks.filter(s => s.completed).length
  const totalSubtasks = task.subtasks.length
  const hasSubtasks = totalSubtasks > 0

  return (
    <Card className={`p-6 transition-all duration-200 ${task.completed ? 'opacity-75' : ''}`}>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Checkbox
            id={`task-${task.id}`}
            checked={task.completed}
            onCheckedChange={(checked) => 
              onUpdate(task.id, { completed: !!checked })
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
                  <Check size={16} />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancelEdit}
                >
                  <X size={16} />
                </Button>
              </div>
            ) : (
              <div 
                className={`text-lg font-medium cursor-pointer hover:text-primary transition-colors ${
                  task.completed ? 'line-through text-muted-foreground' : ''
                }`}
                onClick={() => setIsEditing(true)}
              >
                {task.text}
              </div>
            )}
            
            {hasSubtasks && (
              <div className="text-sm text-muted-foreground mt-1">
                {completedSubtasks}/{totalSubtasks} subtasks completed
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsAddingSubtask(true)}
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              Add Subtask
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={handleGenerateSubtasks}
              disabled={isGenerating || !hasApiKey}
              className="flex items-center gap-2 bg-accent/10 hover:bg-accent/20 border-accent/50"
            >
              <MagicWand size={16} className={isGenerating ? 'animate-spin' : ''} />
              {isGenerating ? 'Planning...' : 'PlanForMe'}
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditing(true)}
            >
              <PencilSimple size={16} />
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(task.id)}
              className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
            >
              <Trash size={16} />
            </Button>
          </div>
        </div>

        {isAddingSubtask && (
          <form onSubmit={handleAddSubtask} className="ml-8 flex gap-2">
            <Input
              value={newSubtaskText}
              onChange={(e) => setNewSubtaskText(e.target.value)}
              placeholder="Add a subtask..."
              className="flex-1"
              autoFocus
            />
            <Button 
              type="submit" 
              size="sm"
              disabled={!newSubtaskText.trim()}
            >
              Add
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                setIsAddingSubtask(false)
                setNewSubtaskText('')
              }}
            >
              Cancel
            </Button>
          </form>
        )}

        {hasSubtasks && (
          <div className="ml-8 space-y-2">
            {task.subtasks.map(subtask => (
              <SubtaskItem
                key={subtask.id}
                subtask={subtask}
                taskId={task.id}
                onUpdate={onUpdateSubtask}
                onDelete={onDeleteSubtask}
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}