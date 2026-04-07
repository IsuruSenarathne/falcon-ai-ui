import React, { useState } from 'react'
import { submitFeedback } from '../../api/conversationService'

const formatTime = (isoString) =>
  new Date(isoString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

export default function MessageBubbleV2({ message, conversationId, userMsgId, userQuestion }) {
  const isUser = message.role === 'user'
  const [showReasoning, setShowReasoning] = useState(false)
  const [feedback, setFeedback] = useState(null) // 'positive', 'negative', or null
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Try to parse structured format (answer + reasoning)
  let isStructured = false
  let answer = ''
  let reasoning = ''

  if (!isUser && typeof message.content === 'string') {
    try {
      let parsed = null

      // Try JSON parsing first
      try {
        parsed = JSON.parse(message.content)
      } catch {
        // Try to convert object notation to JSON by adding quotes around keys
        const jsonString = message.content.replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":')
        parsed = JSON.parse(jsonString)
      }

      if (parsed && typeof parsed === 'object' && parsed.answer && parsed.reasoning) {
        isStructured = true
        answer = parsed.answer
        reasoning = parsed.reasoning
      }
    } catch (e) {
      // Not structured format, treat as regular message
    }
  }

  const handleFeedback = async (isPositive) => {
    if (!conversationId || !userMsgId || !userQuestion) return

    setIsSubmitting(true)
    try {
      const botAnswer = isStructured ? answer : message.content
      await submitFeedback(conversationId, userMsgId, message.message_id, userQuestion, botAnswer, isPositive)
      setFeedback(isPositive ? 'positive' : 'negative')
    } catch (err) {
      console.error('Failed to submit feedback:', err)
      alert('Failed to submit feedback')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={`message-row ${isUser ? 'user-row' : 'bot-row'}`}>
      {!isUser && <div className="bot-avatar">N</div>}
      <div className={`bubble ${isUser ? 'user-bubble' : 'bot-bubble'}`}>
        {isStructured ? (
          <div className="structured-message">
            <div className="answer-section">
              <p>{answer}</p>
            </div>

            <button
              className="reasoning-toggle"
              onClick={() => setShowReasoning(!showReasoning)}
              aria-expanded={showReasoning}
            >
              {showReasoning ? '▼' : '▶'} Reasoning
            </button>

            {showReasoning && (
              <div className="reasoning-section">
                <p>{reasoning}</p>
              </div>
            )}
          </div>
        ) : (
          <>
            {isUser || (typeof message.content === 'string' && !/<[a-z][\s\S]*>/i.test(message.content)) ? (
              <p>{message.content}</p>
            ) : (
              <div className="html-content" dangerouslySetInnerHTML={{ __html: message.content }} />
            )}
          </>
        )}

        <span className="bubble-time">{formatTime(message.created_at)}</span>

        {!isUser && (
          <div className="feedback-buttons">
            <button
              className={`feedback-btn like-btn ${feedback === 'positive' ? 'active' : ''}`}
              onClick={() => handleFeedback(true)}
              disabled={isSubmitting || feedback !== null}
              title="This response was helpful"
              aria-label="Like this response"
            >
              👍
            </button>
            <button
              className={`feedback-btn dislike-btn ${feedback === 'negative' ? 'active' : ''}`}
              onClick={() => handleFeedback(false)}
              disabled={isSubmitting || feedback !== null}
              title="This response was not helpful"
              aria-label="Dislike this response"
            >
              👎
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
