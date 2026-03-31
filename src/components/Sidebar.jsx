import React from 'react'
import './Sidebar.css'

export default function Sidebar({ conversations, selectedId, onSelect, isLoading }) {
  const formatDate = (isoString) =>
    new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  const getPreview = (conv) => {
    const first = (conv.messages || []).find((m) => m.role === 'user')
    return first?.content || 'No messages'
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">N</div>
        <h1 className="sidebar-title">AI Nemo</h1>
      </div>

      <div className="sidebar-section-label">Conversations</div>

      <div className="sidebar-list">
        {isLoading ? (
          <div className="sidebar-state">Loading…</div>
        ) : conversations.length === 0 ? (
          <div className="sidebar-state">No conversations yet</div>
        ) : (
          conversations.map((conv) => (
            <button
              key={conv.conversation_id}
              className={`sidebar-item ${conv.conversation_id === selectedId ? 'active' : ''}`}
              onClick={() => onSelect(conv.conversation_id)}
            >
              <div className="sidebar-item-preview">{getPreview(conv)}</div>
              <div className="sidebar-item-date">{formatDate(conv.created_at)}</div>
            </button>
          ))
        )}
      </div>
    </aside>
  )
}
