import React from 'react'
import { Menu } from 'lucide-react'
import './Sidebar.css'

export default function Sidebar({ conversations, selectedConversationId, onSelectConversation, isLoading }) {
  return (
    <aside className="sidebar open">
      <div className="sidebar-header">
        <h1 className="sidebar-title">AI Nemo</h1>
      </div>
      <div className="sidebar-list">
        {isLoading ? (
          <div className="sidebar-loading">Loading conversations...</div>
        ) : conversations.length === 0 ? (
          <div className="sidebar-empty">No conversations yet</div>
        ) : (
          conversations.map((conv) => (
            <button
              key={conv.conversation_id}
              className={`sidebar-item ${conv.conversation_id === selectedConversationId ? 'active' : ''}`}
              onClick={() => onSelectConversation(conv.conversation_id)}
            >
              <div className="sidebar-item-title">{conv.title || `Conversation ${conv.conversation_id.slice(0, 8)}`}</div>
              <div className="sidebar-item-date">{conv.date}</div>
            </button>
          ))
        )}
      </div>
    </aside>
  )
}
