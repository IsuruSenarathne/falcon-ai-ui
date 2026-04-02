import React, { useRef, useState, useEffect } from 'react'
import { Send, ChevronDown } from 'lucide-react'

const QUERY_TYPES = [
  { value: 'default', label: 'Default' },
  { value: 'web_search', label: 'Web Search' },
  { value: 'datasource', label: 'Datasource' },
]

export default function MessageInput({ onSend, disabled }) {
  const [input, setInput] = useState('')
  const [queryType, setQueryType] = useState('default')
  const [showTypeDropdown, setShowTypeDropdown] = useState(false)
  const textareaRef = useRef(null)
  const selectorRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target)) {
        setShowTypeDropdown(false)
      }
    }

    if (showTypeDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showTypeDropdown])

  const submit = () => {
    if (input.trim() === '') return
    onSend(input.trim(), queryType)
    setInput('')
    setQueryType('default')
    setShowTypeDropdown(false)
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  const handleKeyDown = (e) => {
    if (e.key === '@') {
      e.preventDefault()
      setShowTypeDropdown(true)
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    } else if (e.key === 'Escape' && showTypeDropdown) {
      setShowTypeDropdown(false)
    }
  }

  const handleChange = (e) => {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px'
  }

  const handleSelectType = (type) => {
    setQueryType(type)
    setShowTypeDropdown(false)
  }

  return (
    <div className="input-area">
      <div className="input-wrapper">
        <div className="query-type-selector" ref={selectorRef}>
          <button
            className="type-button"
            onClick={() => setShowTypeDropdown(!showTypeDropdown)}
            disabled={disabled}
            title="Press @ to select query type"
          >
            <span className="type-label">@{queryType}</span>
            <ChevronDown size={16} />
          </button>
          {showTypeDropdown && (
            <div className="type-dropdown">
              {QUERY_TYPES.map((type) => (
                <button
                  key={type.value}
                  className={`type-option ${queryType === type.value ? 'active' : ''}`}
                  onClick={() => handleSelectType(type.value)}
                >
                  {type.label}
                </button>
              ))}
            </div>
          )}
        </div>
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
      <p className="input-hint">Press @ to select query type · Enter to send · Shift+Enter for new line</p>
    </div>
  )
}
