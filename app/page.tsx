'use client'

import { useEffect, useState } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

type Task = {
  id: number
  text: string
  completed: boolean
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')

  useEffect(() => {
    const stored = localStorage.getItem('tasks')
    if (stored) {
      setTasks(JSON.parse(stored))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  const addTask = () => {
    if (!input.trim()) return
    setTasks([...tasks, { id: Date.now(), text: input.trim(), completed: false }])
    setInput('')
    toast.success('Task added!')
  }

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id))
    toast.error('Task deleted')
  }

  const clearCompleted = () => {
    const remaining = tasks.filter(task => !task.completed)
    if (remaining.length === tasks.length) return
    setTasks(remaining)
    toast.success('Cleared completed tasks!')
  }

  const filteredTasks = tasks.filter(task =>
    filter === 'all' ? true : filter === 'active' ? !task.completed : task.completed
  )

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <Toaster position="top-right" />

      {/* Background image */}
      <img
        src="https://images.unsplash.com/photo-1508780709619-79562169bc64?auto=format&fit=crop&w=1950&q=80"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Task manager card */}
      <div className="relative z-10 bg-white bg-opacity-90 rounded-2xl shadow-2xl p-8 w-full max-w-xl backdrop-blur-sm">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src="https://avatars.githubusercontent.com/u/147439320?v=4"
            alt="Tiny Archives Logo"
            className="h-12 object-contain"
          />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">
          📝 Tiny Archives Task Manager
        </h1>

        {/* Input */}
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter a task..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={addTask}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 active:scale-95 transition"
          >
            Add
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-2 mb-4">
          {['all', 'active', 'completed'].map(type => (
            <button
              key={type}
              onClick={() => setFilter(type as 'all' | 'active' | 'completed')}
              className={`px-3 py-1 text-sm rounded-full font-medium capitalize ${filter === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Clear Completed Button */}
        {tasks.some(task => task.completed) && (
          <div className="flex justify-center mb-4">
            <button
              onClick={clearCompleted}
              className="text-sm px-4 py-1 rounded bg-red-100 text-red-600 hover:bg-red-200"
            >
              Clear Completed
            </button>
          </div>
        )}

        {/* Task List */}
        {filteredTasks.length === 0 ? (
          <p className="text-gray-500 text-center italic">No {filter} tasks found.</p>
        ) : (
          <ul className="space-y-3">
            <AnimatePresence>
              {filteredTasks.map(task => (
                <motion.li
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  layout
                  className="flex justify-between items-center bg-white px-4 py-3 rounded-lg border hover:shadow-md transition"
                >
                  <span
                    onClick={() => toggleTask(task.id)}
                    className={`flex-1 cursor-pointer select-none ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'
                      }`}
                  >
                    {task.text}
                  </span>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-red-500 font-semibold hover:text-red-700 ml-4"
                    title="Delete"
                  >
                    ✕
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </main>
  )
}
