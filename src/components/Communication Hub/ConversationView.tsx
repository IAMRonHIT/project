import React, { useState, useEffect, useRef } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Paperclip, Mic } from 'lucide-react'
import { MessageBubble } from './MessageBubble'
import { AIInsight } from './AIInsight'
import { useToast } from "@/components/ui/use-toast"

export function ConversationView({ conversation }) {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [isRecording, setIsRecording] = useState(false)
  const scrollAreaRef = useRef(null)
  const { toast } = useToast()

  useEffect(() => {
    // Simulating fetching messages from an API
    const fetchMessages = async () => {
      // In a real application, this would be an API call
      const mockMessages = [
        { id: 1, sender: conversation.name, content: 'Hello, I have a question about my recent claim.', timestamp: '10:30 AM' },
        { id: 2, sender: 'You', content: 'Of course, I'd be happy to help. Can you provide me with your claim number?', timestamp: '10:31 AM' },
        { id: 3, sender: conversation.name, content: 'Yes, it's CLM123456789.', timestamp: '10:32 AM' },
      ]
      setMessages(mockMessages)
    }

    fetchMessages()
  }, [conversation])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: 'You',
        content: message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages([...messages, newMessage])
      setMessage('')

      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          id: messages.length + 2,
          sender: 'AI Assistant',
          content: 'I'm analyzing your message and will provide a response shortly.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
        setMessages(prev => [...prev, aiResponse])
      }, 1000)
    }
  }

  const handleAttachment = () => {
    toast({
      title: "Attachment feature",
      description: "This feature is not yet implemented.",
    })
  }

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording)
    toast({
      title: isRecording ? "Voice recording stopped" : "Voice recording started",
      description: "This feature is simulated and not fully implemented.",
    })
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-ron-divider">
        <h2 className="text-lg font-semibold">{conversation.name}</h2>
      </div>
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        <AIInsight content="Based on the claim number provided, I've retrieved the following information: This claim was submitted on 05/15/2023 for a total amount of $1,250. It's currently under review by our claims department." />
      </ScrollArea>
      <div className="p-4 border-t border-ron-divider">
        <div className="flex items-center">
          <Input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-ron-dark-base text-white"
          />
          <Button variant="ghost" size="icon" className="ml-2" onClick={handleAttachment}>
            <Paperclip className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="ml-2" onClick={handleVoiceRecord}>
            <Mic className={`h-5 w-5 ${isRecording ? 'text-ron-primary' : ''}`} />
          </Button>
          <Button onClick={handleSend} className="ml-2">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

