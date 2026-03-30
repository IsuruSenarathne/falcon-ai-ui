import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import ChatArea from './components/ChatArea'
import './App.css'

export default function App() {
  const [conversations, setConversations] = useState([
    { id: 1, title: 'Getting Started with React', date: 'Today' },
    { id: 2, title: 'Understanding Hooks', date: 'Yesterday' },
    { id: 3, title: 'CSS Grid Basics', date: 'Mar 28' },
  ])

  const [activeConversation, setActiveConversation] = useState(1)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleNewChat = () => {
    const newId = Math.max(...conversations.map(c => c.id), 0) + 1
    setConversations([
      { id: newId, title: 'New Conversation', date: 'Now' },
      ...conversations,
    ])
    setActiveConversation(newId)
  }

  return (
    <div className="app-container">
      <Sidebar
        conversations={conversations}
        activeConversation={activeConversation}
        onSelectConversation={setActiveConversation}
        onNewChat={handleNewChat}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={setSidebarOpen}
      />
      <ChatArea
        conversationId={activeConversation}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
    </div>
  )
}
