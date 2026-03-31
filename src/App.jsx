import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import ChatArea from './components/ChatArea'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export default function App() {
  const [conversations, setConversations] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [isLoadingList, setIsLoadingList] = useState(true)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)

  useEffect(() => {
    fetchConversations()
  }, [])

  useEffect(() => {
    if (!selectedId) return
    const conv = conversations.find((c) => c.conversation_id === selectedId)
    // Only fetch if messages haven't been loaded yet
    if (conv && !conv.messagesLoaded) {
      fetchMessages(selectedId)
    }
  }, [selectedId])

  const fetchConversations = async () => {
    setIsLoadingList(true)
    try {
      const response = await fetch(`${API_BASE_URL}/conversations`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
      })
      if (!response.ok) throw new Error(`API Error: ${response.status}`)
      const data = await response.json()
      const convs = (data.conversations || []).map((c) => ({ ...c, messages: [], messagesLoaded: false }))
      setConversations(convs)
      if (convs.length > 0) setSelectedId(convs[0].conversation_id)
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setIsLoadingList(false)
    }
  }

  const fetchMessages = async (conversationId) => {
    setIsLoadingMessages(true)
    try {
      const response = await fetch(`${API_BASE_URL}/conversations/${conversationId}/messages`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
      })
      if (!response.ok) throw new Error(`API Error: ${response.status}`)
      const data = await response.json()
      setConversations((prev) =>
        prev.map((c) =>
          c.conversation_id === conversationId
            ? { ...c, messages: data.messages || [], messagesLoaded: true }
            : c
        )
      )
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setIsLoadingMessages(false)
    }
  }

  const handleSelect = (id) => {
    setSelectedId(id)
  }

  const handleMessagesAdded = (conversationId, userMsg, botMsg) => {
    setConversations((prev) => {
      const exists = prev.find((c) => c.conversation_id === conversationId)
      if (exists) {
        return prev.map((c) =>
          c.conversation_id === conversationId
            ? { ...c, messages: [...(c.messages || []), userMsg, botMsg] }
            : c
        )
      }
      return [
        { conversation_id: conversationId, title: null, created_at: userMsg.created_at, messages: [userMsg, botMsg], messagesLoaded: true },
        ...prev,
      ]
    })
    setSelectedId(conversationId)
  }

  const selectedConversation = conversations.find((c) => c.conversation_id === selectedId) || null

  return (
    <div className="app-container">
      <Sidebar
        conversations={conversations}
        selectedId={selectedId}
        onSelect={handleSelect}
        isLoading={isLoadingList}
      />
      <ChatArea
        conversation={selectedConversation}
        isLoading={isLoadingMessages}
        onMessagesAdded={handleMessagesAdded}
      />
    </div>
  )
}
