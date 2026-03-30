import React, { useState, useEffect } from 'react'
import { Send } from 'lucide-react'
import './ChatArea.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export default function ChatArea({ conversationId, onToggleSidebar }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Reset messages when conversation changes
  useEffect(() => {
    setMessages([])
    setInput('')
  }, [conversationId])

  const handleSendMessage = async () => {
    if (input.trim() === '') return

    const userQuestion = input.trim()
    const newUserMessage = {
      id: messages.length + 1,
      role: 'user',
      content: userQuestion,
    }

    const updatedMessages = [...messages, newUserMessage]
    setMessages(updatedMessages)
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({ question: userQuestion }),
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const data = await response.json()
      const assistantMessage = {
        id: updatedMessages.length + 1,
        role: 'assistant',
        content: data.answer || data.response || 'No response received',
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error calling API:', error)
      const errorMessage = {
        id: updatedMessages.length + 1,
        role: 'assistant',
        content: `Error: ${error.message}. Make sure the API server is running at ${API_BASE_URL}`,
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="chat-area">
      <div className="chat-header">
        <button className="mobile-menu-btn" onClick={onToggleSidebar}>
          ☰
        </button>
        <h2>Conversation {conversationId}</h2>
      </div>

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-state">
            <h3>Start a new conversation</h3>
            <p>Ask me anything or start typing below</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.role}`}>
              <div className="message-avatar">
                {msg.role === 'user' ? '👤' : '🤖'}
              </div>
              <div className="message-content">
                <p>{msg.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="input-area">
        <div className="input-container">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message AI Nemo... (Shift+Enter for new line)"
            rows="1"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={input.trim() === '' || isLoading}
            className="send-btn"
          >
            {isLoading ? <span className="loading-spinner">⏳</span> : <Send size={20} />}
          </button>
        </div>
      </div>
    </div>
  )
}
