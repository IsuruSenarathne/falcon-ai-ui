import Sidebar from './components/sidebar/Sidebar'
import ChatArea from './components/chat/ChatArea'
import { useConversations } from './hooks/useConversations'
import './App.css'

export default function App() {
  const {
    conversations,
    selectedId,
    selectedConversation,
    isLoadingList,
    isLoadingMessages,
    setSelectedId,
    addMessages,
  } = useConversations()

  return (
    <div className="app-container">
      <Sidebar
        conversations={conversations}
        selectedId={selectedId}
        onSelect={setSelectedId}
        isLoading={isLoadingList}
      />
      <ChatArea
        conversation={selectedConversation}
        isLoading={isLoadingMessages}
        onMessagesAdded={addMessages}
      />
    </div>
  )
}
