import React, { useRef } from 'react'
import { Send } from 'lucide-react'

export default function MessageInput({ onSend, disabled }) {
  const [input, setInput] = React.useState('')
  const textareaRef = useRef(null)

  const submit = () => {
    if (input.trim() === '') return
    onSend(input.trim())
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  const handleChange = (e) => {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px'
  }

  return (
    <div className="input-area">
      <div className="input-wrapper">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Message AI Nemo…"
          rows={1}
          disabled={disabled}
        />
        <button onClick={submit} disabled={input.trim() === '' || disabled} className="send-btn">
          <Send size={18} />
        </button>
      </div>
      <p className="input-hint">Enter to send · Shift+Enter for new line</p>
    </div>
  )
}
