import React from 'react'
import { Brain } from 'lucide-react'

export function AIInsight({ content }) {
  return (
    <div className="flex items-start bg-ron-primary/10 p-4 rounded-lg mb-4">
      <Brain className="h-5 w-5 text-ron-primary mr-3 mt-1" />
      <div>
        <h4 className="text-sm font-semibold text-ron-primary mb-1">AI Insight</h4>
        <p className="text-sm text-white">{content}</p>
      </div>
    </div>
  )
}

