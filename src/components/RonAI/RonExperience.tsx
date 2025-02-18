import React, { useState, useRef } from 'react';
import { streamAssistantMessage } from './../../services/ronAIService';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'function';
  content: string;
  name?: string;  // Only used if role is 'function' (for function name)
}

const RonExperience: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    // Optionally, an initial system prompt can be included here
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/assistants/threads/${threadId}/messages/stream`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) throw new Error('Failed to send message');

      // Clear input and reset state
      setInputValue('');
      if (inputRef.current) {
        inputRef.current.style.height = 'auto';
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response stream available');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Process the streaming response
        const text = new TextDecoder().decode(value);
        const messages = text.split('\n\n');
        
        for (const message of messages) {
          if (message.startsWith('data: ')) {
            try {
              const data = JSON.parse(message.slice(6));
              // Handle different message types
              switch (data.type) {
                case 'textDelta':
                  // Update UI with new text
                  break;
                case 'error':
                  console.error('Stream error:', data.error);
                  break;
                case 'end':
                  setIsLoading(false);
                  break;
              }
            } catch (e) {
              console.error('Failed to parse message:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    setInputValue(textarea.value);
    
    // Auto-resize textarea
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            {/* You can style system/user/assistant messages differently via classes */}
            <div className="message-role">{msg.role}:</div>
            <div className="message-content">
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
        <div className="relative flex items-end space-x-2">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 resize-none overflow-hidden rounded-lg border border-gray-300 p-3 pr-12 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] max-h-[200px]"
            rows={1}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className={`rounded-lg px-4 py-2 font-medium text-white transition-colors
              ${isLoading || !inputValue.trim() 
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
              }`}
          >
            {isLoading ? (
              <span className="flex items-center space-x-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Sending</span>
              </span>
            ) : (
              'Send'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RonExperience;
