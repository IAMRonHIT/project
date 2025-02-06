import React, { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { Message } from '../types';

interface ChatInterfaceProps {
  selectedCaseId?: string;
}

export function ChatInterface({ selectedCaseId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize chat when case is selected
  useEffect(() => {
    if (selectedCaseId) {
      setMessages([
        {
          id: '1',
          content: `I'm here to help you with case #${selectedCaseId}. What would you like to know?`,
          sender: 'ai',
          timestamp: new Date().toISOString()
        }
      ]);
    } else {
      setMessages([]);
    }
  }, [selectedCaseId]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);

    try {
      const response = await fetch('http://localhost:3001/api/ron', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: userMessage.content }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: 'ai',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'I apologize, but I encountered an error processing your request.',
        sender: 'ai',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`
                max-w-[80%] p-4 rounded-lg
                ${message.sender === 'user'
                  ? 'bg-ron-teal-400/20 text-white'
                  : 'bg-black/50 border border-ron-teal-400/20 text-gray-300'
                }
              `}
            >
              <p>{message.content}</p>
              <span className="text-xs text-gray-400 mt-2 block">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-ron-teal-400/20">
        <div className="flex space-x-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isProcessing && handleSendMessage()}
            placeholder={selectedCaseId ? 'Type your message...' : 'Select a case to begin...'}
            disabled={!selectedCaseId || isProcessing}
            className={`
              flex-1 px-4 py-2 bg-black/50 border rounded-lg
              text-white placeholder-gray-400 
              transition-colors duration-200
              ${!selectedCaseId || isProcessing
                ? 'border-gray-800 bg-black/30 text-gray-600 cursor-not-allowed' 
                : 'border-ron-teal-400/20 focus:outline-none focus:border-ron-teal-400/40'
              }
            `}
          />
          
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || !selectedCaseId || isProcessing}
            className={`
              p-2 rounded-lg transition-colors
              ${inputValue.trim() && selectedCaseId && !isProcessing
                ? 'bg-ron-teal-400/20 text-white hover:bg-ron-teal-400/30'
                : 'bg-gray-800/50 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            <MessageSquare className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}