import React from 'react'

const formatDate = (isoString) =>
  new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

export default function ConversationItem({ conversation, isActive, onSelect }) {
  const preview = (conversation.messages || []).find((m) => m.role === 'user')?.content || 'No messages'
  return (
    <button
      className={`sidebar-item ${isActive ? 'active' : ''}`}
      onClick={() => onSelect(conversation.conversation_id)}
    >
      <div className="sidebar-item-preview">{preview}</div>
      <div className="sidebar-item-date">{formatDate(conversation.created_at)}</div>
    </button>
  )
}
