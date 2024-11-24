import React from 'react'

export function MessageBubble({ message }) {
  const isOwnMessage = message.sender === 'You'

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-3/4 p-3 rounded-lg ${
        isOwnMessage ? 'bg-ron-primary text-white' : 'bg-ron-dark-base text-white'
      }`}>
        <p className="text-sm">{message.content}</p>
        <span className="text-xs text-ron-text-muted mt-1 block">{message.timestamp}</span>
      </div>
    </div>
  )
}

