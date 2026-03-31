import React, { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import './ChatArea.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export default function ChatArea({ conversation, isLoading, onMessagesAdded }) {
  const [input, setInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pendingQuestion, setPendingQuestion] = useState(null)
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)

  const messages = conversation?.messages || []

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, pendingQuestion])

  // Clear pending state when conversation switches
  useEffect(() => {
    setPendingQuestion(null)
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }, [conversation?.conversation_id])

  const handleSendMessage = async () => {
    if (input.trim() === '') return

    const userQuestion = input.trim()
    setInput('')
    setPendingQuestion(userQuestion)
    setIsSubmitting(true)
    if (textareaRef.current) textareaRef.current.style.height = 'auto'

    try {
      const convId = conversation?.conversation_id
      const response = await fetch(`${API_BASE_URL}/conversations/${convId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
        body: JSON.stringify({ question: userQuestion }),
      })

      if (!response.ok) throw new Error(`API Error: ${response.status}`)

      const data = await response.json()
      const now = new Date().toISOString()

      onMessagesAdded(
        data.conversation_id || convId,
        { message_id: `user_${Date.now()}`, role: 'user', content: userQuestion, created_at: now },
        { message_id: data.message_id || `bot_${Date.now()}`, role: 'bot', content: data.answer || data.response || 'No response received', created_at: now }
      )
    } catch (error) {
      console.error('Error calling API:', error)
      alert(`Error: ${error.message}. Make sure the API server is running at ${API_BASE_URL}`)
    } finally {
      setPendingQuestion(null)
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

  const formatTime = (isoString) =>
    new Date(isoString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

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
        ) : !conversation ? (
          <div className="center-state">
            <div className="empty-icon">💬</div>
            <h3>Start a conversation</h3>
            <p>Ask me anything</p>
          </div>
        ) : messages.length === 0 && !pendingQuestion ? (
          <div className="center-state">
            <div className="empty-icon">💬</div>
            <h3>No messages yet</h3>
            <p>Send your first message below</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.message_id} className={`message-row ${msg.role === 'user' ? 'user-row' : 'bot-row'}`}>
              {msg.role === 'bot' && <div className="bot-avatar">N</div>}
              <div className={`bubble ${msg.role === 'user' ? 'user-bubble' : 'bot-bubble'}`}>
                <p>{msg.content}</p>
                <span className="bubble-time">{formatTime(msg.created_at)}</span>
              </div>
            </div>
          ))
        )}

        {pendingQuestion && (
          <>
            <div className="message-row user-row">
              <div className="bubble user-bubble">
                <p>{pendingQuestion}</p>
                <span className="bubble-time">
                  {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
            <div className="message-row bot-row">
              <div className="bot-avatar">N</div>
              <div className="bubble bot-bubble typing-bubble">
                <div className="typing-dots"><span /><span /><span /></div>
              </div>
            </div>
          </>
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
