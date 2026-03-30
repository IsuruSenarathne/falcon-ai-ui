import React from 'react'
import { Plus, Menu } from 'lucide-react'
import './Sidebar.css'

export default function Sidebar({
  conversations,
  activeConversation,
  onSelectConversation,
  onNewChat,
  sidebarOpen,
  onToggleSidebar,
}) {
  return (
    <>
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h1 className="sidebar-title">AI Nemo</h1>
          <button className="new-chat-btn" onClick={onNewChat} title="New Chat">
            <Plus size={20} />
          </button>
        </div>

        <nav className="conversations-list">
          <div className="conversations-label">Conversations</div>
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={`conversation-item ${activeConversation === conv.id ? 'active' : ''}`}
              onClick={() => onSelectConversation(conv.id)}
            >
              <div className="conversation-title">{conv.title}</div>
              <div className="conversation-date">{conv.date}</div>
            </div>
          ))}
        </nav>
      </aside>

      <button className="sidebar-toggle" onClick={onToggleSidebar}>
        <Menu size={20} />
      </button>
    </>
  )
}
