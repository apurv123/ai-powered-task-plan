import React, { useState } from 'react'
import { AppData } from '../App'
import { TaskItem } from './TaskItem'
import { AddTaskForm } from './AddTaskForm'
import { Card } from './ui/card'

interface TaskManagerProps {
  appData: AppData
  setAppData: (updater: (prev: AppData) => AppData) => void
}

export function TaskManager({ appData, setAppData }: TaskManagerProps) {
  const addTask = (text: string) => {
    const newTask = {
      id: Date.now().toString(),
      text,
      completed: false,
      subtasks: [],
      createdAt: Date.now()
    }
    
    setAppData(prev => ({
      ...prev,
      tasks: [...prev.tasks, newTask]
    }))
  }

  const updateTask = (taskId: string, updates: Partial<any>) => {
    setAppData(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => {
        if (task.id === taskId) {
          const updatedTask = { ...task, ...updates }
          
          // If the completed status is being changed, update all subtasks accordingly
          if ('completed' in updates && updates.completed !== task.completed) {
            updatedTask.subtasks = task.subtasks.map(subtask => ({
              ...subtask,
              completed: updates.completed
            }))
          }
          
          return updatedTask
        }
        return task
      })
    }))
  }

  const deleteTask = (taskId: string) => {
    setAppData(prev => ({
      ...prev,
      tasks: prev.tasks.filter(task => task.id !== taskId)
    }))
  }

  const addSubtask = (taskId: string, subtaskText: string) => {
    const newSubtask = {
      id: Date.now().toString(),
      text: subtaskText,
      completed: false,
      createdAt: Date.now()
    }
    
    setAppData(prev => ({
      ...prev,
      tasks: prev.tasks.map(task =>
        task.id === taskId 
          ? { ...task, subtasks: [...task.subtasks, newSubtask] }
          : task
      )
    }))
  }

  const updateSubtask = (taskId: string, subtaskId: string, updates: Partial<any>) => {
    setAppData(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => {
        if (task.id === taskId) {
          const updatedSubtasks = task.subtasks.map(subtask =>
            subtask.id === subtaskId ? { ...subtask, ...updates } : subtask
          )
          
          // If a subtask completion status is being changed
          if ('completed' in updates) {
            // If any subtask is marked incomplete, mark parent as incomplete
            if (!updates.completed) {
              return {
                ...task,
                subtasks: updatedSubtasks,
                completed: false
              }
            }
            // If all subtasks are now complete, mark parent as complete
            else if (updatedSubtasks.every(subtask => subtask.completed)) {
              return {
                ...task,
                subtasks: updatedSubtasks,
                completed: true
              }
            }
          }
          
          return {
            ...task,
            subtasks: updatedSubtasks
          }
        }
        return task
      })
    }))
  }

  const deleteSubtask = (taskId: string, subtaskId: string) => {
    setAppData(prev => ({
      ...prev,
      tasks: prev.tasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.filter(subtask => subtask.id !== subtaskId)
            }
          : task
      )
    }))
  }

  const generateSubtasks = async (taskId: string, taskText: string) => {
    if (!appData.apiKey) {
      throw new Error('OpenAI API key not configured. Please add it in Settings.')
    }

    const prompt = (window as any).spark.llmPrompt`You are a helpful task planning assistant. Break down this task into 3-5 specific, actionable subtasks that will help the user complete it effectively.

Task: ${taskText}

Return the result as a JSON object with a single property called "subtasks" that contains an array of subtask objects. Each subtask should have a "text" property with a clear, actionable description.

Example format:
{
  "subtasks": [
    {"text": "Research available options online"},
    {"text": "Compare prices and features"},
    {"text": "Make final decision and purchase"}
  ]
}

Keep subtasks concise, specific, and actionable. Focus on logical sequential steps.`

    try {
      const response = await (window as any).spark.llm(prompt, 'gpt-4o-mini', true)
      const result = JSON.parse(response)
      
      if (result.subtasks && Array.isArray(result.subtasks)) {
        const newSubtasks = result.subtasks.map((subtask: any, index: number) => ({
          id: (Date.now() + index).toString(),
          text: subtask.text,
          completed: false,
          createdAt: Date.now() + index
        }))
        
        setAppData(prev => ({
          ...prev,
          tasks: prev.tasks.map(task =>
            task.id === taskId
              ? { ...task, subtasks: [...task.subtasks, ...newSubtasks] }
              : task
          )
        }))
      }
    } catch (error) {
      throw new Error(`Failed to generate subtasks: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <AddTaskForm onAddTask={addTask} />
      </Card>

      {appData.tasks.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="text-muted-foreground">
            <p className="text-lg font-medium mb-2">No tasks yet</p>
            <p>Add your first task above to get started with smart planning!</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {appData.tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onUpdate={updateTask}
              onDelete={deleteTask}
              onAddSubtask={addSubtask}
              onUpdateSubtask={updateSubtask}
              onDeleteSubtask={deleteSubtask}
              onGenerateSubtasks={generateSubtasks}
              hasApiKey={!!appData.apiKey}
            />
          ))}
        </div>
      )}
    </div>
  )
}