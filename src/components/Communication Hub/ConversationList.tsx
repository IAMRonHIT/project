import React, { useState, useEffect } from 'react'
import { Search, Bell } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ConversationItem } from './ConversationItem'
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function ConversationList({ onSelectConversation, className, notifications }) {
  const [conversations, setConversations] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    // Simulating fetching conversations from an API
    const fetchConversations = async () => {
      // In a real application, this would be an API call
      const mockConversations = [
        { id: 1, name: 'John Doe', lastMessage: 'Thanks for your help!', timestamp: '10:30 AM', unread: 2 },
        { id: 2, name: 'Jane Smith', lastMessage: 'When is my next appointment?', timestamp: 'Yesterday', unread: 0 },
        { id: 3, name: 'Alice Johnson', lastMessage: 'I have a question about my prescription.', timestamp: '2 days ago', unread: 1 },
      ]
      setConversations(mockConversations)
    }

    fetchConversations()
  }, [])

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="p-4 flex items-center justify-between">
        <Input
          type="search"
          placeholder="Search conversations..."
          className="bg-ron-dark-base text-white flex-grow mr-2"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Notifications</h4>
                <p className="text-sm text-muted-foreground">
                  You have {notifications.length} new notifications
                </p>
              </div>
              <div className="grid gap-2">
                {notifications.map((notification) => (
                  <div key={notification.id} className="flex items-center">
                    <div className="flex-1">{notification.message}</div>
                    <Button variant="ghost">Dismiss</Button>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <ScrollArea className="flex-1">
        {filteredConversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            onClick={() => onSelectConversation(conversation)}
          />
        ))}
      </ScrollArea>
    </div>
  )
}

