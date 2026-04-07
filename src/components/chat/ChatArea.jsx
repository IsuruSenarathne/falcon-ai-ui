import React, { useState, useRef, useEffect } from 'react'
import MessageBubbleV2 from './MessageBubbleV2'
import MessageInput from './MessageInput'
import TypingIndicator from './TypingIndicator'
import { sendMessage, createConversation, searchConversation, createConversationWithSearch } from '../../api/conversationService'
import { useTheme } from '../../hooks/useTheme'
import './ChatArea.css'

export default function ChatArea({ conversation, isLoading, onMessagesAdded }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pendingQuestion, setPendingQuestion] = useState(null)
  const bottomRef = useRef(null)
  const { theme, toggleTheme } = useTheme()

  const messages = conversation?.messages || []

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, pendingQuestion])

  useEffect(() => {
    setPendingQuestion(null)
  }, [conversation?.conversation_id])

  const handleSend = async (question, queryType = 'default') => {
    setPendingQuestion(question)
    setIsSubmitting(true)
    try {
      const isTemp = conversation.isTemp
      const data = isTemp
        ? await createConversation(question, undefined, queryType)
        : await sendMessage(conversation.conversation_id, question, queryType)
      const now = new Date().toISOString()

      // Extract answer and reasoning from data.data structure
      const answer = data.data?.answer || data.answer || 'No response received'
      const reasoning = data.data?.reasoning || data.reasoning

      // Create message content with answer and reasoning if both exist
      const botContent = reasoning
        ? JSON.stringify({ answer, reasoning })
        : answer

      onMessagesAdded(
        data.conversation_id || conversation.conversation_id,
        { message_id: `user_${Date.now()}`, role: 'user', content: question, created_at: now },
        { message_id: data.message_id || `bot_${Date.now()}`, role: 'bot', content: botContent, created_at: now },
        isTemp ? conversation.conversation_id : null
      )
    } catch (err) {
      console.error('Failed to send message:', err)
      alert(`Error: ${err.message}`)
    } finally {
      setPendingQuestion(null)
      setIsSubmitting(false)
    }
  }

  const renderMessages = () => {
    if (isLoading) {
      return <div className="center-state"><div className="typing-dots"><span /><span /><span /></div></div>
    }
    if (!conversation) {
      return (
        <div className="center-state">
          <div className="empty-icon">💬</div>
          <h3>Start a conversation</h3>
          <p>Ask me anything</p>
        </div>
      )
    }
    if (messages.length === 0 && !pendingQuestion) {
      return (
        <div className="center-state">
          <div className="empty-icon">💬</div>
          <h3>No messages yet</h3>
          <p>Send your first message below</p>
        </div>
      )
    }
    return messages.map((msg, idx) => {
      let userMsgId = null
      let userQuestion = null

      if (msg.role === 'bot' && idx > 0) {
        const prevMsg = messages[idx - 1]
        if (prevMsg.role === 'user') {
          userMsgId = prevMsg.message_id
          userQuestion = prevMsg.content
        }
      }

      return (
        <MessageBubbleV2
          key={msg.message_id}
          message={msg}
          conversationId={conversation.conversation_id}
          userMsgId={userMsgId}
          userQuestion={userQuestion}
        />
      )
    })
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
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>

      <div className="messages-container">
        {renderMessages()}

        {pendingQuestion && (
          <>
            <MessageBubbleV2
              message={{ message_id: 'pending-user', role: 'user', content: pendingQuestion, created_at: new Date().toISOString() }}
            />
            <TypingIndicator />
          </>
        )}

        <div ref={bottomRef} />
      </div>

      <MessageInput onSend={handleSend} disabled={isSubmitting || !conversation} />
    </div>
  )
}
