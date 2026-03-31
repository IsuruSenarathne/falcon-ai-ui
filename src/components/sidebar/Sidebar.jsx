import React from 'react'
import { Plus } from 'lucide-react'
import ConversationItem from './ConversationItem'
import './Sidebar.css'

export default function Sidebar({ conversations, selectedId, onSelect, onNew, isLoading }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">N</div>
        <h1 className="sidebar-title">AI Nemo</h1>
        <button className="new-chat-btn" onClick={onNew} title="New conversation">
          <Plus size={16} />
        </button>
      </div>

      <div className="sidebar-section-label">Conversations</div>

      <div className="sidebar-list">
        {isLoading ? (
          <div className="sidebar-state">Loading…</div>
        ) : conversations.length === 0 ? (
          <div className="sidebar-state">No conversations yet</div>
        ) : (
          conversations.map((conv) => (
            <ConversationItem
              key={conv.conversation_id}
              conversation={conv}
              isActive={conv.conversation_id === selectedId}
              onSelect={onSelect}
            />
          ))
        )}
      </div>
    </aside>
  )
}
