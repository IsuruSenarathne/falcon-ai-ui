import React from 'react'

const formatTime = (isoString) =>
  new Date(isoString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user'
  return (
    <div className={`message-row ${isUser ? 'user-row' : 'bot-row'}`}>
      {!isUser && <div className="bot-avatar">N</div>}
      <div className={`bubble ${isUser ? 'user-bubble' : 'bot-bubble'}`}>
        {isUser || typeof message.content === 'string' && !/<[a-z][\s\S]*>/i.test(message.content)
          ? <p>{message.content}</p>
          : <div className="html-content" dangerouslySetInnerHTML={{ __html: message.content }} />}
        <span className="bubble-time">{formatTime(message.created_at)}</span>
      </div>
    </div>
  )
}
