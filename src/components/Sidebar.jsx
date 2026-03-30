import React from 'react'
import { Menu } from 'lucide-react'
import './Sidebar.css'

export default function Sidebar({ sidebarOpen, onToggleSidebar }) {
  return (
    <>
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h1 className="sidebar-title">AI Nemo</h1>
        </div>
      </aside>

      <button className="sidebar-toggle" onClick={onToggleSidebar}>
        <Menu size={20} />
      </button>
    </>
  )
}
