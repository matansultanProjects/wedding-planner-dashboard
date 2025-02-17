"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import type { Task } from "@/lib/types"
import { getFromLocalStorage, saveToLocalStorage } from "@/lib/storage"
import { PlusCircle, Edit, Trash } from "lucide-react"

export function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState({ title: "", description: "", dueDate: "", category: "" })

  useEffect(() => {
    const storedData = getFromLocalStorage()
    setTasks(storedData.tasks)
  }, [])

  const addTask = () => {
    if (newTask.title) {
      const task: Task = {
        id: Date.now().toString(),
        ...newTask,
        completed: false,
      }
      const updatedTasks = [...tasks, task]
      setTasks(updatedTasks)
      saveToLocalStorage({ tasks: updatedTasks })
      setNewTask({ title: "", description: "", dueDate: "", category: "" })
    }
  }

  const toggleTaskCompletion = (id: string) => {
    const updatedTasks = tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
    setTasks(updatedTasks)
    saveToLocalStorage({ tasks: updatedTasks })
  }

  const deleteTask = (id: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== id)
    setTasks(updatedTasks)
    saveToLocalStorage({ tasks: updatedTasks })
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>ניהול משימות</CardTitle>
          <CardDescription>עקוב אחר המשימות לקראת החתונה</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="כותרת המשימה"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
              <Input
                placeholder="תיאור"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
              <Input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              />
              <Input
                placeholder="קטגוריה"
                value={newTask.category}
                onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
              />
              <Button onClick={addTask}>
                <PlusCircle className="ml-2 h-4 w-4" />
                הוסף משימה
              </Button>
            </div>
            <div className="space-y-2">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    <Checkbox checked={task.completed} onCheckedChange={() => toggleTaskCompletion(task.id)} />
                    <span className={task.completed ? "line-through" : ""}>
                      {task.title} - {task.description} ({task.dueDate}) [{task.category}]
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

