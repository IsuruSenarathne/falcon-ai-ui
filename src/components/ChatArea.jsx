import React, { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import './ChatArea.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export default function ChatArea({ conversations, isLoading, onConversationCreated }) {
  const [input, setInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversations, isSubmitting])

  const handleSendMessage = async () => {
    if (input.trim() === '') return

    const userQuestion = input.trim()
    setInput('')
    setIsSubmitting(true)
    if (textareaRef.current) textareaRef.current.style.height = 'auto'

    try {
      const response = await fetch(`${API_BASE_URL}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
        body: JSON.stringify({ question: userQuestion }),
      })

      if (!response.ok) throw new Error(`API Error: ${response.status}`)

      const data = await response.json()
      const newConversation = {
        id: Math.random(),
        conversation_id: data.conversation_id || `conv_${Date.now()}`,
        question: userQuestion,
        answer: data.answer || data.response || 'No response received',
        date: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        created_at: new Date().toISOString(),
      }

      onConversationCreated(newConversation)
    } catch (error) {
      console.error('Error calling API:', error)
      alert(`Error: ${error.message}. Make sure the API server is running at ${API_BASE_URL}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleInput = (e) => {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px'
  }

  return (
    <div className="chat-area">
      <div className="chat-header">
        <div className="header-brand">
          <div className="header-avatar">N</div>
          <div>
            <h2>AI Nemo</h2>
            <span className="header-status">Online</span>
          </div>
        </div>
      </div>

      <div className="messages-container">
        {isLoading ? (
          <div className="center-state">
            <div className="typing-dots"><span /><span /><span /></div>
          </div>
        ) : conversations.length === 0 ? (
          <div className="center-state">
            <div className="empty-icon">💬</div>
            <h3>Start a conversation</h3>
            <p>Ask me anything</p>
          </div>
        ) : (
          conversations.map((conv) => (
            <div key={conv.conversation_id} className="message-pair">
              <div className="message-row user-row">
                <div className="bubble user-bubble">
                  <p>{conv.question}</p>
                  <span className="bubble-time">{conv.date}</span>
                </div>
              </div>
              <div className="message-row bot-row">
                <div className="bot-avatar">N</div>
                <div className="bubble bot-bubble">
                  <p>{conv.answer}</p>
                </div>
              </div>
            </div>
          ))
        )}

        {isSubmitting && (
          <div className="message-row bot-row">
            <div className="bot-avatar">N</div>
            <div className="bubble bot-bubble typing-bubble">
              <div className="typing-dots"><span /><span /><span /></div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="input-area">
        <div className="input-wrapper">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Message AI Nemo…"
            rows={1}
            disabled={isSubmitting}
          />
          <button
            onClick={handleSendMessage}
            disabled={input.trim() === '' || isSubmitting}
            className="send-btn"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="input-hint">Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  )
}
