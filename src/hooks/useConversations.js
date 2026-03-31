import { useState, useEffect } from 'react'
import { getConversations, getMessages, deleteConversation as apiDeleteConversation } from '../api/conversationService'

export function useConversations() {
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
    if (conv && !conv.messagesLoaded) {
      fetchMessages(selectedId)
    }
  }, [selectedId])

  const fetchConversations = async () => {
    setIsLoadingList(true)
    try {
      const convs = await getConversations()
      const initialised = convs.map((c) => ({ ...c, messages: c.messages || [], messagesLoaded: Array.isArray(c.messages) && c.messages.length > 0 }))
      setConversations(initialised)
      if (initialised.length > 0) setSelectedId(initialised[0].conversation_id)
    } catch (err) {
      console.error('Failed to fetch conversations:', err)
    } finally {
      setIsLoadingList(false)
    }
  }

  const fetchMessages = async (conversationId) => {
    setIsLoadingMessages(true)
    try {
      const messages = await getMessages(conversationId)
      setConversations((prev) =>
        prev.map((c) =>
          c.conversation_id === conversationId
            ? { ...c, messages, messagesLoaded: true }
            : c
        )
      )
    } catch (err) {
      console.error('Failed to fetch messages:', err)
    } finally {
      setIsLoadingMessages(false)
    }
  }

  const newConversation = () => {
    const tempId = `new_${Date.now()}`
    setConversations((prev) => [
      { conversation_id: tempId, title: null, created_at: new Date().toISOString(), messages: [], messagesLoaded: true, isTemp: true },
      ...prev,
    ])
    setSelectedId(tempId)
  }

  const addMessages = (conversationId, userMsg, botMsg, tempId) => {
    setConversations((prev) => {
      if (tempId) {
        return prev.map((c) =>
          c.conversation_id === tempId
            ? { ...c, conversation_id: conversationId, isTemp: false, messages: [userMsg, botMsg], messagesLoaded: true }
            : c
        )
      }
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

  const deleteConversation = async (conversationId) => {
    if (conversationId.startsWith('new_')) {
      setConversations((prev) => prev.filter((c) => c.conversation_id !== conversationId))
      if (selectedId === conversationId) {
        const remaining = conversations.filter((c) => c.conversation_id !== conversationId)
        setSelectedId(remaining.length > 0 ? remaining[0].conversation_id : null)
      }
      return
    }
    try {
      await apiDeleteConversation(conversationId)
      setConversations((prev) => {
        const remaining = prev.filter((c) => c.conversation_id !== conversationId)
        if (selectedId === conversationId) {
          setSelectedId(remaining.length > 0 ? remaining[0].conversation_id : null)
        }
        return remaining
      })
    } catch (err) {
      console.error('Failed to delete conversation:', err)
    }
  }

  const selectedConversation = conversations.find((c) => c.conversation_id === selectedId) || null

  return {
    conversations,
    selectedId,
    selectedConversation,
    isLoadingList,
    isLoadingMessages,
    setSelectedId,
    addMessages,
    newConversation,
    deleteConversation,
  }
}
