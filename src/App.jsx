import React, { useState, useEffect } from 'react'
import ChatArea from './components/ChatArea'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export default function App() {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/conversations`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
      })

      if (!response.ok) throw new Error(`API Error: ${response.status}`)

      const data = await response.json()

      // Flatten all conversations' messages into a single list, sorted by created_at
      const allMessages = data.conversations
        .flatMap((conv) => conv.messages)
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))

      setMessages(allMessages)
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const addMessages = (userMsg, botMsg) => {
    setMessages((prev) => [...prev, userMsg, botMsg])
  }

  return (
    <div className="app-container">
      <ChatArea
        messages={messages}
        isLoading={isLoading}
        onMessagesAdded={addMessages}
      />
    </div>
  )
}
