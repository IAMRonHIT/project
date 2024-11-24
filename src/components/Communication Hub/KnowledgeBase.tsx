import React, { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AIInsight } from './AIInsight'
import { Button } from "@/components/ui/button"

export function KnowledgeBase() {
  const [query, setQuery] = useState('')
  const [articles, setArticles] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Simulating fetching initial articles
    setArticles([
      { id: 1, title: 'Understanding Claim Processing', content: 'This article explains the steps involved in processing a healthcare claim, from submission to payment.' },
      { id: 2, title: 'Common Reasons for Claim Denials', content: 'Learn about the most frequent reasons why claims are denied and how to avoid these issues.' },
    ])
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulating API call for searching articles
    setTimeout(() => {
      const searchResults = [
        { id: 3, title: 'How to Appeal a Denied Claim', content: 'A step-by-step guide on the process of appealing a denied healthcare claim.' },
        { id: 4, title: 'Understanding Your EOB', content: 'Learn how to read and interpret your Explanation of Benefits (EOB) statement.' },
      ]
      setArticles(prev => [...prev, ...searchResults])
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="h-full flex flex-col p-4">
      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex items-center">
          <Input
            type="search"
            placeholder="Search knowledge base or ask a question..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-ron-dark-base text-white flex-grow"
          />
          <Button type="submit" className="ml-2" disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </form>
      <ScrollArea
className="flex-1">
        <AIInsight content="Based on your recent interactions, you might find these articles helpful:" />
        <div className="space-y-4">
          {articles.map((article) => (
            <article key={article.id} className="bg-ron-dark-base p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
              <p className="text-sm text-ron-text-muted">{article.content}</p>
              <Button variant="link" className="mt-2 p-0">Read more</Button>
            </article>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

