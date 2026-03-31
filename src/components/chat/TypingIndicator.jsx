import React from 'react'

export default function TypingIndicator() {
  return (
    <div className="message-row bot-row">
      <div className="bot-avatar">N</div>
      <div className="bubble bot-bubble typing-bubble">
        <div className="typing-dots">
          <span /><span /><span />
        </div>
      </div>
    </div>
  )
}
