import React from 'react'

const formatTime = (isoString) =>
  new Date(isoString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user'
  return (
    <div className={`message-row ${isUser ? 'user-row' : 'bot-row'}`}>
      {!isUser && <div className="bot-avatar">N</div>}
      <div className={`bubble ${isUser ? 'user-bubble' : 'bot-bubble'}`}>
        <p>{message.content}</p>
        <span className="bubble-time">{formatTime(message.created_at)}</span>
      </div>
    </div>
  )
}
