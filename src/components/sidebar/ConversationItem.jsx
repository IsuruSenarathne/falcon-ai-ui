import React from 'react'
import { Trash2 } from 'lucide-react'

const formatDate = (isoString) =>
  new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

export default function ConversationItem({ conversation, isActive, onSelect, onDelete }) {
  const preview = (conversation.messages || []).find((m) => m.role === 'user')?.content || 'No messages'

  const handleDelete = (e) => {
    e.stopPropagation()
    onDelete(conversation.conversation_id)
  }

  return (
    <button
      className={`sidebar-item ${isActive ? 'active' : ''}`}
      onClick={() => onSelect(conversation.conversation_id)}
    >
      <div className="sidebar-item-preview">{preview}</div>
      <div className="sidebar-item-footer">
        <div className="sidebar-item-date">{formatDate(conversation.created_at)}</div>
        <button className="sidebar-item-delete" onClick={handleDelete} title="Delete conversation">
          <Trash2 size={13} />
        </button>
      </div>
    </button>
  )
}
