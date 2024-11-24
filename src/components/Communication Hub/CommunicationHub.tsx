'use client'

import React, { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Phone, Mail, Video, FileText, Brain } from 'lucide-react'
import { ConversationList } from './ConversationList'
import { ConversationView } from './ConversationView'
import { KnowledgeBase } from './KnowledgeBase'
import { PhoneCall } from './PhoneCall'
import { EmailView } from './EmailView'
import { TelehealthSession } from './TelehealthSession'
import { DocumentManager } from './DocumentManager'

export function CommunicationHub() {
  const [activeConversation, setActiveConversation] = useState(null)
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    // Simulating real-time notifications
    const notificationInterval = setInterval(() => {
      setNotifications(prev => [
        ...prev,
        { id: Date.now(), message: 'New update available', type: 'info' }
      ])
    }, 30000)

    return () => clearInterval(notificationInterval)
  }, [])

  return (
    <div className="h-full flex flex-col bg-ron-dark-navy text-white">
      <Tabs defaultValue="chat" className="w-full h-full">
        <TabsList className="grid w-full grid-cols-6 bg-ron-dark-navy border-b border-ron-divider">
          <TabsTrigger value="chat" className="data-[state=active]:bg-ron-primary/20">
            <MessageSquare className="w-5 h-5 mr-2" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="phone" className="data-[state=active]:bg-ron-primary/20">
            <Phone className="w-5 h-5 mr-2" />
            Phone
          </TabsTrigger>
          <TabsTrigger value="email" className="data-[state=active]:bg-ron-primary/20">
            <Mail className="w-5 h-5 mr-2" />
            Email
          </TabsTrigger>
          <TabsTrigger value="telehealth" className="data-[state=active]:bg-ron-primary/20">
            <Video className="w-5 h-5 mr-2" />
            Telehealth
          </TabsTrigger>
          <TabsTrigger value="documents" className="data-[state=active]:bg-ron-primary/20">
            <FileText className="w-5 h-5 mr-2" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="knowledge" className="data-[state=active]:bg-ron-primary/20">
            <Brain className="w-5 h-5 mr-2" />
            Knowledge
          </TabsTrigger>
        </TabsList>
        <div className="flex-1 flex overflow-hidden">
          <ConversationList 
            onSelectConversation={setActiveConversation}
            className="w-1/4 border-r border-ron-divider"
            notifications={notifications}
          />
          <TabsContent value="chat" className="flex-1 m-0">
            {activeConversation ? (
              <ConversationView conversation={activeConversation} />
            ) : (
              <div className="h-full flex items-center justify-center text-ron-text-muted">
                Select a conversation to start chatting
              </div>
            )}
          </TabsContent>
          <TabsContent value="phone" className="flex-1 m-0">
            <PhoneCall />
          </TabsContent>
          <TabsContent value="email" className="flex-1 m-0">
            <EmailView />
          </TabsContent>
          <TabsContent value="telehealth" className="flex-1 m-0">
            <TelehealthSession />
          </TabsContent>
          <TabsContent value="documents" className="flex-1 m-0">
            <DocumentManager />
          </TabsContent>
          <TabsContent value="knowledge" className="flex-1 m-0">
            <KnowledgeBase />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

