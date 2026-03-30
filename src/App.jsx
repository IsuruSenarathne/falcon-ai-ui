import React, { useState, useEffect } from 'react'
import ChatArea from './components/ChatArea'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export default function App() {
  const [conversations, setConversations] = useState([])
  const [isLoadingConversations, setIsLoadingConversations] = useState(true)

  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    setIsLoadingConversations(true)
    try {
      const response = await fetch(`${API_BASE_URL}/conversations`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
      })

      if (!response.ok) throw new Error(`API Error: ${response.status}`)

      const data = await response.json()
      const formattedConversations = data.conversations.map((conv) => ({
        id: conv.id,
        conversation_id: conv.conversation_id,
        question: conv.question,
        answer: conv.answer,
        date: new Date(conv.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        created_at: conv.created_at,
      }))

      setConversations(formattedConversations)
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setIsLoadingConversations(false)
    }
  }

  const addConversation = (newConversation) => {
    setConversations((prev) => [...prev, newConversation])
  }

  return (
    <div className="app-container">
      <ChatArea
        conversations={conversations}
        isLoading={isLoadingConversations}
        onConversationCreated={addConversation}
      />
    </div>
  )
}
