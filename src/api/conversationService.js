const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const headers = { 'Content-Type': 'application/json' }

export async function getConversations() {
  const res = await fetch(`${API_BASE_URL}/conversations`, { headers, mode: 'cors' })
  if (!res.ok) throw new Error(`API Error: ${res.status}`)
  const data = await res.json()
  return data.conversations || []
}

export async function getMessages(conversationId) {
  const res = await fetch(`${API_BASE_URL}/conversations/${conversationId}/messages`, {
    headers,
    mode: 'cors',
  })
  if (!res.ok) throw new Error(`API Error: ${res.status}`)
  const data = await res.json()
  return data.messages || []
}

export async function createConversation(question, userId) {
  const body = { question }
  if (userId) body.user_id = userId
  const res = await fetch(`${API_BASE_URL}/conversations`, {
    method: 'POST',
    headers,
    mode: 'cors',
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`API Error: ${res.status}`)
  return res.json()
}

export async function deleteConversation(conversationId) {
  const res = await fetch(`${API_BASE_URL}/conversations/${conversationId}`, {
    method: 'DELETE',
    headers,
    mode: 'cors',
  })
  if (!res.ok) throw new Error(`API Error: ${res.status}`)
}

export async function sendMessage(conversationId, question) {
  const res = await fetch(`${API_BASE_URL}/conversations/${conversationId}/messages`, {
    method: 'POST',
    headers,
    mode: 'cors',
    body: JSON.stringify({ question }),
  })
  if (!res.ok) throw new Error(`API Error: ${res.status}`)
  return res.json()
}
