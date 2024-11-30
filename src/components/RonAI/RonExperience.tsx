import React, { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';

const RonAIExperience: React.FC = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'Ron AI',
      time: '10:00 AM',
      message: 'Hello, how can I assist you today?',
    },
  ]);
  const [input, setInput] = useState('');

  const macroPrompts = [
    'Show me the latest clinical guidelines.',
    'Schedule a meeting with Dr. Smith.',
    'What are the pending approvals?',
    'Generate a summary of John Doe’s case.',
  ];

  const handleSend = (message?: string) => {
    const content = message || input;
    if (content.trim() !== '') {
      const newMessage = {
        sender: 'You',
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        message: content,
      };
      setMessages([...messages, newMessage]);

      // Simulate Ron AI response
      setTimeout(() => {
        const ronResponse = {
          sender: 'Ron AI',
          time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          message: 'Here is the information you requested.',
        };
        setMessages((prevMessages) => [...prevMessages, ronResponse]);
      }, 1000);

      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-dark-navy to-black text-white">
      <div className="flex-1 p-6 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-6 animate-fade-in ${
              msg.sender === 'You' ? 'text-right' : ''
            }`}
          >
            <div className="inline-block max-w-xl">
              <div
                className={`px-6 py-4 rounded-2xl ${
                  msg.sender === 'You'
                    ? 'bg-gradient-to-r from-neon-pink to-neon-purple shadow-neon-pink'
                    : 'bg-glass-white backdrop-blur-xs border border-white border-opacity-20 shadow-lg'
                }`}
              >
                <p className="text-sm">{msg.message}</p>
              </div>
              <div className="mt-2 text-xs text-gray-400">
                {msg.sender} • {msg.time}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Shortcut Macro Prompts */}
      <div className="px-6 py-4 bg-dark-navy border-t border-gray-800">
        <div className="flex flex-wrap gap-2">
          {macroPrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => handleSend(prompt)}
              className="px-4 py-2 bg-gradient-to-r from-neon-blue to-neon-green text-sm rounded-full shadow-md hover:scale-105 transform transition focus:outline-none focus:ring-2 focus:ring-neon-blue"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Field */}
      <div className="p-4 bg-dark-navy border-t border-gray-800">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 p-4 bg-glass-white backdrop-blur-xs rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-blue"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
          />
          <button
            onClick={() => handleSend()}
            className="ml-4 p-4 bg-gradient-to-r from-neon-pink to-neon-purple rounded-full shadow-neon-pink hover:scale-105 transform transition focus:outline-none focus:ring-2 focus:ring-neon-pink"
          >
            <FaPaperPlane className="text-white text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RonAIExperience;
