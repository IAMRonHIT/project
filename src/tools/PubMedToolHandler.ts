import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

interface PubMedToolConfig {
  apiKey: string;
}

interface ArticleSearchParams {
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
}

interface CitationParams {
  pmid: string;
  format?: 'summary' | 'abstract' | 'full';
  includeCitations?: boolean;
}

interface FullTextParams {
  pmcid: string;
}

export class PubMedToolHandler {
  private eutilsBaseUrl = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';
  private biocBaseUrl = 'https://www.ncbi.nlm.nih.gov/research/bionlp/RESTful/pmcoa.cgi';
  private apiKey: string;
  private xmlParser: XMLParser;

  constructor(config: PubMedToolConfig) {
    this.apiKey = config.apiKey;
    this.xmlParser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_'
    });
  }

  async handleToolCall(toolCall: any): Promise<any> {
    const { name, arguments: args } = toolCall.function;
    const parsedArgs = JSON.parse(args);

    switch (name) {
      case 'searchPubMed':
        return this.searchPubMed(parsedArgs);
      case 'getCitation':
        return this.getCitation(parsedArgs);
      case 'getFullTextBioC':
        return this.getFullTextBioC(parsedArgs);
      default:
        throw new Error(`Unknown PubMed tool: ${name}`);
    }
  }

  async searchPubMed(params: ArticleSearchParams): Promise<any> {
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

  async getCitation(params: CitationParams): Promise<any> {
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

  async getFullTextBioC(params: FullTextParams): Promise<string> {
    if (!params.pmcid || !params.pmcid.toUpperCase().startsWith('PMC')) {
      throw new Error('Invalid PMCID provided. Must start with "PMC".');
    }
    const responseXml = await this.makeBioCRequest(`/BioC_xml/${params.pmcid}/unicode`);
    const parsedResponse = this.xmlParser.parse(responseXml);
    return this.formatBioCToMarkdown(parsedResponse);
  }

  private async makeRequest(endpoint: string, params: Record<string, any>): Promise<any> {
    try {
      const response = await axios.get(`${this.eutilsBaseUrl}/${endpoint}`, {
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
      throw new Error(`PubMed API Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async makeBioCRequest(path: string): Promise<string> {
    try {
      // BioC API doesn't typically use API keys directly in the URL
      const response = await axios.get(`${this.biocBaseUrl}${path}`);
      return response.data; // Expecting XML string
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new Error(`BioC API Error: Article not found or not available in Open Access Subset for PMCID.`);
      }
      throw new Error(`BioC API Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
    return {
      count: data.PubmedArticleSet?.PubmedArticle?.length || 0,
      articles: Array.isArray(data.PubmedArticleSet?.PubmedArticle)
        ? data.PubmedArticleSet.PubmedArticle.map(this.formatArticle)
        : [this.formatArticle(data.PubmedArticleSet?.PubmedArticle)]
    };
  }

  private formatArticle = (article: any): any => {
    if (!article) return null;

    return {
      pmid: article.MedlineCitation?.PMID?.['#text'],
      title: article.MedlineCitation?.Article?.ArticleTitle,
      abstract: this.formatAbstract(article.MedlineCitation?.Article?.Abstract?.AbstractText),
      authors: this.formatAuthors(article.MedlineCitation?.Article?.AuthorList),
      journal: {
        title: article.MedlineCitation?.Article?.Journal?.Title,
        issue: article.MedlineCitation?.Article?.Journal?.JournalIssue?.Issue,
        volume: article.MedlineCitation?.Article?.Journal?.JournalIssue?.Volume,
        year: article.MedlineCitation?.Article?.Journal?.JournalIssue?.PubDate?.Year
      },
      doi: this.extractDoi(article.PubmedData?.ArticleIdList?.ArticleId),
      publicationDate: this.formatDate(article.MedlineCitation?.Article?.Journal?.JournalIssue?.PubDate)
    };
  }

  private formatAuthors = (authorList: any): any[] => {
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

  private formatAbstract(abstractText: any): any[] {
    if (!abstractText) return [];

    // Handle single abstract text without sections
    if (typeof abstractText === 'string') {
      return [{ '#text': abstractText }];
    }

    // Handle array of abstract texts
    if (Array.isArray(abstractText)) {
      return abstractText.map(section => ({
        '#text': section['#text'],
        '@_Label': section['@_Label']
      }));
    }

    // Handle single abstract text with label
    return [{
      '#text': abstractText['#text'],
      '@_Label': abstractText['@_Label']
    }];
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

  private formatCitation(data: any): any {
    const article = data.PubmedArticleSet?.PubmedArticle;
    if (!article) return null;

    return this.formatArticle(article);
  }

  // Helper function to safely extract DOI
  private extractDoi(articleIdData: any): string | undefined {
    if (!articleIdData) {
      return undefined;
    }
    if (Array.isArray(articleIdData)) {
      // If it's an array, find the DOI
      return articleIdData.find((id: any) => id['@_IdType'] === 'doi')?.['#text'];
    } else if (typeof articleIdData === 'object' && articleIdData['@_IdType'] === 'doi') {
      // If it's a single object, check if it's the DOI
      return articleIdData['#text'];
    }
    // Otherwise, DOI not found
    return undefined;
  }

  // Helper to format BioC XML object to Markdown
  private formatBioCToMarkdown(biocData: any): string {
    const collection = biocData?.collection;
    if (!collection?.document) {
      return 'Error: Could not parse BioC document structure.';
    }

    const doc = collection.document;
    const metadata = new Map<string, string>();
    const passages = Array.isArray(doc.passage) ? doc.passage : [doc.passage];

    // Extract metadata from infons
    const docInfons = Array.isArray(doc.infon) ? doc.infon : [doc.infon];
    docInfons.forEach((infon: any) => {
      if (infon && infon['@_key']) {
        metadata.set(infon['@_key'], infon['#text']);
      }
    });

    // Extract specific metadata fields
    const title = metadata.get('title') || metadata.get('dc:title') || 'No Title Found';
    const authors = metadata.get('authors') || 'No Authors Found';
    const journal = metadata.get('journal') || metadata.get('journal-title') || 'No Journal Found';
    const year = metadata.get('year') || metadata.get('pub_date') || '';
    const volume = metadata.get('volume') || '';
    const issue = metadata.get('issue') || '';
    const pages = metadata.get('pages') || '';
    const doi = metadata.get('doi') || '';
    const pmcid = metadata.get('pmcid') || doc.id || 'Unknown PMCID';

    let markdown = `# ${title}\n\n`;
    markdown += `**Authors:** ${authors}\n`;
    markdown += `**Journal:** ${journal}`;
    if (year) markdown += `, ${year}`;
    if (volume) markdown += `; ${volume}`;
    if (issue) markdown += `(${issue})`;
    if (pages) markdown += `:${pages}`;
    markdown += `\n`;
    if (doi) markdown += `**DOI:** [${doi}](https://doi.org/${doi})\n`;
    markdown += `**PMCID:** ${pmcid}\n\n`;
    markdown += `---\n\n`;

    // Process passages (sections)
    let abstractText = '';
    const sections: { [key: string]: string[] } = {};

    passages.forEach((passage: any) => {
      if (!passage) return;
      const passageInfons = Array.isArray(passage.infon) ? passage.infon : [passage.infon];
      let sectionTitle = 'Unknown Section';
      let sectionType = 'unknown';

      passageInfons.forEach((infon: any) => {
        if (infon && infon['@_key'] === 'type') {
          sectionType = infon['#text']?.toLowerCase();
        }
        if (infon && infon['@_key'] === 'section_title') {
          sectionTitle = infon['#text'];
        }
      });

      const passageText = (passage.text || '').trim();
      const passageOffset = passage.offset; // Keep track if needed later

      if (sectionType === 'abstract') {
        abstractText += passageText + '\n\n';
      } else if (passageText) {
        if (!sections[sectionTitle]) {
          sections[sectionTitle] = [];
        }
        sections[sectionTitle].push(passageText);
      }
    });

    if (abstractText) {
      markdown += `## Abstract\n\n${abstractText.trim()}\n\n---\n\n`;
    }

    // Order sections commonly found
    const sectionOrder = ['Introduction', 'Methods', 'Results', 'Discussion', 'Conclusion', 'Acknowledgments', 'References'];
    const processedTitles = new Set<string>();

    sectionOrder.forEach(title => {
      if (sections[title]) {
        markdown += `## ${title}\n\n${sections[title].join('\n\n').trim()}\n\n---\n\n`;
        processedTitles.add(title);
      }
    });

    // Add remaining sections
    Object.keys(sections).forEach(title => {
      if (!processedTitles.has(title) && title !== 'Unknown Section') {
         markdown += `## ${title}\n\n${sections[title].join('\n\n').trim()}\n\n---\n\n`;
         processedTitles.add(title);
      }
    });

     // Add any 'Unknown Section' content last
     if (sections['Unknown Section']) {
        markdown += `## Other Content\n\n${sections['Unknown Section'].join('\n\n').trim()}\n\n---\n\n`;
     }

    // Placeholder for Figures/Tables/References if needed - BioC structure varies
    // markdown += `## Figures & Tables\n\n[Content extraction depends on specific BioC structure]\n\n---\n\n`;
    // markdown += `## References\n\n[Content extraction depends on specific BioC structure]\n\n`;


    return markdown.trim();
  }
}

// Export individual tool definitions

export const articleSearchTool = {
  type: 'function' as const,
  function: { // Corrected structure: function is a direct property
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
  // Removed extra closing brace here
};

export const citationRetrievalTool = {
  type: 'function' as const,
  function: { // Corrected structure
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
  // Removed extra closing brace here
};

export const fullTextRetrievalTool = {
  type: 'function' as const,
  function: { // Corrected structure
    name: 'getFullTextBioC',
    description: 'Retrieve the full text of an article from PubMed Central Open Access Subset using its PMCID in BioC format, returned as Markdown.',
      parameters: {
        type: 'object',
        properties: {
          pmcid: {
            type: 'string',
            description: 'PubMed Central ID (e.g., PMC1234567)'
          }
        },
        required: ['pmcid']
      }
    }
  // Removed extra closing brace here
};
