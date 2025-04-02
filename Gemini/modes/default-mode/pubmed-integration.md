#  Integration

This document details the integration of PubMed APIs into the Ron AI platform through Gemini's function calling capabilities.
PubMed
## API Documentation

See the [E-utilities documentation](https://www.ncbi.nlm.nih.gov/books/NBK25500/#chapter2.Searching_a_Database) for details on searching the PubMed database.

## Features

1. Article Search
   - Title and abstract search
   - Author search
   - MeSH term search
   - Date range filtering

2. Citation Retrieval
   - Full citation data
   - DOI linking
   - PMC full text access
   - Citation counts

## TypeScript Implementation

### Tool Definitions

```typescript
export const pubmedToolDefinitions = {
  articleSearch: {
    type: 'function',
    function: {
      name: 'searchPubMed',
      description: 'Search PubMed for medical research articles',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Search terms'
          },
          filters: {
            type: 'object',
            properties: {
              dateRange: {
                type: 'object',
                properties: {
                  from: {
                    type: 'string',
                    description: 'Start date (YYYY-MM-DD)'
                  },
                  to: {
                    type: 'string',
                    description: 'End date (YYYY-MM-DD)'
                  }
                }
              },
              articleTypes: {
                type: 'array',
                items: {
                  type: 'string',
                  enum: [
                    'clinical_trial',
                    'meta_analysis',
                    'review',
                    'systematic_review',
                    'case_report',
                    'journal_article'
                  ]
                }
              },
              languages: {
                type: 'array',
                items: {
                  type: 'string',
                  enum: ['eng', 'fre', 'ger', 'spa', 'ita']
                }
              }
            }
          },
          sort: {
            type: 'string',
            enum: ['relevance', 'date', 'citations'],
            default: 'relevance'
          },
          maxResults: {
            type: 'number',
            description: 'Maximum number of results',
            default: 10
          }
        },
        required: ['query']
      }
    }
  },

  citationRetrieval: {
    type: 'function',
    function: {
      name: 'getCitation',
      description: 'Retrieve citation data for PubMed articles',
      parameters: {
        type: 'object',
        properties: {
          pmid: {
            type: 'string',
            description: 'PubMed ID'
          },
          format: {
            type: 'string',
            enum: ['summary', 'abstract', 'full'],
            default: 'summary',
            description: 'Citation format'
          },
          includeCitations: {
            type: 'boolean',
            description: 'Include citation count',
            default: false
          }
        },
        required: ['pmid']
      }
    }
  }
};
```

### PubMed Service Implementation

```typescript
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

export class PubMedService {
  private baseUrl = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';
  private apiKey: string;
  private xmlParser: XMLParser;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.xmlParser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_'
    });
  }

  async searchPubMed(params: {
    query: string;
    filters?: {
      dateRange?: {
        from?: string;
        to?: string;
      };
      articleTypes?: string[];
      languages?: string[];
    };
    sort?: 'relevance' | 'date' | 'citations';
    maxResults?: number;
  }): Promise<any> {
    // Build search query
    let searchQuery = params.query;
    
    if (params.filters) {
      if (params.filters.dateRange) {
        const { from, to } = params.filters.dateRange;
        if (from && to) {
          searchQuery += ` AND ("${from}"[Date - Publication] : "${to}"[Date - Publication])`;
        }
      }

      if (params.filters.articleTypes?.length) {
        const typeFilter = params.filters.articleTypes
          .map(type => `"${type}"[Publication Type]`)
          .join(' OR ');
        searchQuery += ` AND (${typeFilter})`;
      }

      if (params.filters.languages?.length) {
        const langFilter = params.filters.languages
          .map(lang => `"${lang}"[Language]`)
          .join(' OR ');
        searchQuery += ` AND (${langFilter})`;
      }
    }

    // Perform search
    const searchResponse = await this.makeRequest('esearch.fcgi', {
      db: 'pubmed',
      term: searchQuery,
      retmax: params.maxResults || 10,
      sort: this.mapSortOrder(params.sort),
      retmode: 'json'
    });

    // Get details for found articles
    if (searchResponse.esearchresult.idlist?.length) {
      return this.fetchArticleDetails(searchResponse.esearchresult.idlist);
    }

    return { count: 0, articles: [] };
  }

  async getCitation(params: {
    pmid: string;
    format?: 'summary' | 'abstract' | 'full';
    includeCitations?: boolean;
  }): Promise<any> {
    const response = await this.makeRequest('efetch.fcgi', {
      db: 'pubmed',
      id: params.pmid,
      rettype: this.mapFormat(params.format),
      retmode: 'xml'
    });

    const parsedResponse = this.xmlParser.parse(response);
    
    if (params.includeCitations) {
      const citations = await this.fetchCitationCount(params.pmid);
      return { ...this.formatCitation(parsedResponse), citations };
    }

    return this.formatCitation(parsedResponse);
  }

  private async makeRequest(endpoint: string, params: Record<string, any>): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/${endpoint}`, {
        params: {
          ...params,
          api_key: this.apiKey
        }
      });

      if (params.retmode === 'json') {
        return response.data;
      }
      return response.data;
    } catch (error) {
      throw new Error(`PubMed API Error: ${error.message}`);
    }
  }

  private async fetchArticleDetails(pmids: string[]): Promise<any> {
    const response = await this.makeRequest('efetch.fcgi', {
      db: 'pubmed',
      id: pmids.join(','),
      rettype: 'abstract',
      retmode: 'xml'
    });

    const parsedResponse = this.xmlParser.parse(response);
    return this.formatArticleSet(parsedResponse);
  }

  private async fetchCitationCount(pmid: string): Promise<number> {
    try {
      const response = await this.makeRequest('elink.fcgi', {
        db: 'pubmed',
        id: pmid,
        cmd: 'citedby',
        retmode: 'json'
      });

      return response.linksets?.[0]?.linksetdbs?.[0]?.links?.length || 0;
    } catch (error) {
      console.error('Error fetching citation count:', error);
      return 0;
    }
  }

  private mapSortOrder(sort?: string): string {
    const sortMap: Record<string, string> = {
      'relevance': 'relevance',
      'date': 'pub+date',
      'citations': 'cited'
    };
    return sortMap[sort || 'relevance'];
  }

  private mapFormat(format?: string): string {
    const formatMap: Record<string, string> = {
      'summary': 'uilist',
      'abstract': 'abstract',
      'full': 'xml'
    };
    return formatMap[format || 'summary'];
  }

  private formatArticleSet(data: any): any {
    // Implementation of XML to structured data conversion
    // This would handle the complex PubMed XML format
    return {
      count: data.PubmedArticleSet?.PubmedArticle?.length || 0,
      articles: Array.isArray(data.PubmedArticleSet?.PubmedArticle)
        ? data.PubmedArticleSet.PubmedArticle.map(this.formatArticle)
        : [this.formatArticle(data.PubmedArticleSet?.PubmedArticle)]
    };
  }

  private formatArticle(article: any): any {
    if (!article) return null;

    return {
      pmid: article.MedlineCitation?.PMID?.'#text',
      title: article.MedlineCitation?.Article?.ArticleTitle,
      abstract: article.MedlineCitation?.Article?.Abstract?.AbstractText,
      authors: this.formatAuthors(article.MedlineCitation?.Article?.AuthorList),
      journal: {
        title: article.MedlineCitation?.Article?.Journal?.Title,
        issue: article.MedlineCitation?.Article?.Journal?.JournalIssue?.Issue,
        volume: article.MedlineCitation?.Article?.Journal?.JournalIssue?.Volume,
        year: article.MedlineCitation?.Article?.Journal?.JournalIssue?.PubDate?.Year
      },
      doi: article.PubmedData?.ArticleIdList?.ArticleId?.find(
        (id: any) => id['@_IdType'] === 'doi'
      )?.['#text'],
      publicationDate: this.formatDate(article.MedlineCitation?.Article?.Journal?.JournalIssue?.PubDate)
    };
  }

  private formatAuthors(authorList: any): any[] {
    if (!authorList?.Author) return [];

    const authors = Array.isArray(authorList.Author)
      ? authorList.Author
      : [authorList.Author];

    return authors.map((author: any) => ({
      lastName: author.LastName,
      firstName: author.ForeName,
      initials: author.Initials,
      affiliation: author.AffiliationInfo?.Affiliation
    }));
  }

  private formatDate(pubDate: any): string {
    if (!pubDate) return '';

    const year = pubDate.Year || '';
    const month = pubDate.Month || '';
    const day = pubDate.Day || '';

    if (day && month && year) {
      return `${year}-${month}-${day}`;
    }
    if (month && year) {
      return `${year}-${month}`;
    }
    return year;
  }
}
```

### Integration with Gemini

```typescript
export class PubMedToolHandler {
  private pubmedService: PubMedService;

  constructor(apiKey: string) {
    this.pubmedService = new PubMedService(apiKey);
  }

  async handleToolCall(toolCall: ToolCall): Promise<any> {
    const { name, arguments: args } = toolCall.function;
    const parsedArgs = JSON.parse(args);

    switch (name) {
      case 'searchPubMed':
        return this.pubmedService.searchPubMed(parsedArgs);
      case 'getCitation':
        return this.pubmedService.getCitation(parsedArgs);
      default:
        throw new Error(`Unknown PubMed tool: ${name}`);
    }
  }
}
```

## Usage Example

```typescript
// Initialize the PubMed tool handler
const pubmedHandler = new PubMedToolHandler(process.env.PUBMED_API_KEY!);

// In your Gemini service
const response = await this.client.chat.completions.create({
  model: 'gemini-2.0-flash',
  messages: [{ 
    role: 'user', 
    content: 'Find recent clinical trials about COVID-19 vaccines' 
  }],
  tools: Object.values(pubmedToolDefinitions),
  tool_choice: 'auto'
});

if (response.choices[0].message.tool_calls) {
  for (const toolCall of response.choices[0].message.tool_calls) {
    const result = await pubmedHandler.handleToolCall(toolCall);
    // Process and format the PubMed data
  }
}
```

## Response Processing

```typescript
interface PubMedArticle {
  pmid: string;
  title: string;
  abstract?: string;
  authors: Array<{
    lastName: string;
    firstName: string;
    initials: string;
    affiliation?: string;
  }>;
  journal: {
    title: string;
    issue?: string;
    volume?: string;
    year?: string;
  };
  doi?: string;
  publicationDate: string;
}

function formatArticleResponse(article: PubMedArticle): string {
  const authors = article.authors
    .map(a => `${a.lastName} ${a.initials}`)
    .join(', ');

  return `
    Title: ${article.title}
    Authors: ${authors}
    Journal: ${article.journal.title} ${article.journal.year}; ${article.journal.volume}(${article.journal.issue})
    DOI: ${article.doi || 'Not available'}
    PMID: ${article.pmid}
    ${article.abstract ? `\nAbstract: ${article.abstract}` : ''}
  `;
}
```

## Error Handling

1. API Rate Limits
```typescript
const rateLimiter = new RateLimiter({
  maxRequests: 3,
  perSecond: 1
});

async function makeRequest(url: string): Promise<any> {
  await rateLimiter.waitForToken();
  return axios.get(url);
}
```

2. Response Validation
```typescript
function validatePubMedResponse(response: any): boolean {
  return (
    response &&
    response.PubmedArticleSet &&
    response.PubmedArticleSet.PubmedArticle
  );
}
```

3. Error Recovery
```typescript
async function searchWithRetry(
  params: any,
  maxRetries = 3
): Promise<any> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await pubmedService.searchPubMed(params);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await delay(Math.pow(2, i) * 1000);
    }
  }
}
```

## Best Practices

1. Cache Management
   - Cache frequent searches
   - Store article metadata
   - Update citation counts periodically

2. Query Optimization
   - Use MeSH terms when possible
   - Implement smart query building
   - Handle complex boolean logic

3. Response Processing
   - Extract key information
   - Format for readability
   - Handle missing data gracefully

4. Error Handling
   - Implement retry logic
   - Handle API timeouts
   - Validate responses

5. Performance
   - Batch article retrievals
   - Minimize API calls
   - Use efficient XML parsing

## Security Considerations

1. API Key Management
   - Secure storage
   - Usage monitoring
   - Regular rotation

2. Data Handling
   - Validate input data
   - Sanitize queries
   - Handle sensitive information

3. Error Reporting
   - Sanitize error messages
   - Log appropriately
   - Monitor for issues
