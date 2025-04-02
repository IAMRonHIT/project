import { marked } from 'marked';

interface FormattedPubMedResult {
  type: 'pubmed';
  sections: Array<{
    title: string;
    content: string;
  }>;
  meta?: {
    totalResults?: number;
    searchQuery?: string;
  };
}

const formatMarkdownList = (items: string[]): string => {
  return items.map(item => `- ${item}`).join('\n');
};

const formatMarkdownSection = (content: any): string => {
  if (Array.isArray(content)) {
    return formatMarkdownList(content);
  }
  return content?.toString() || '';
};

const renderMarkdown = async (content: string): Promise<string> => {
  return marked(content, {
    breaks: true,
    gfm: true
  });
};

// Helper to format author names consistently
const formatAuthor = (author: any): string => {
  if (!author) return 'Unknown';
  
  const lastName = author.lastName || '';
  const firstName = author.firstName || '';
  const initials = author.initials || '';
  
  if (lastName && firstName) {
    return `${lastName} ${firstName}`;
  } else if (lastName && initials) {
    return `${lastName} ${initials}`;
  } else if (lastName) {
    return lastName;
  }
  
  return 'Unknown';
};

// Helper to format abstract text that might be an array or a string
const formatAbstract = (abstract: any): string => {
  if (!abstract) return 'No abstract available';
  
  if (Array.isArray(abstract)) {
    return abstract.join('\n\n');
  }
  
  return abstract.toString();
};

// Format a single article result from PubMed
export const formatPubMedArticle = async (article: any): Promise<FormattedPubMedResult> => {
  const sections: Array<{title: string; content: string}> = [];
  
  // Basic citation information
  const authors = Array.isArray(article.authors) 
    ? article.authors.map(formatAuthor).join(', ')
    : 'Unknown';
  
  const journal = article.journal || {};
  const year = journal.year || '';
  const volume = journal.volume ? `${journal.volume}` : '';
  const issue = journal.issue ? `(${journal.issue})` : '';
  
  const citation = `${authors}. ${article.title || 'Untitled'}. ${journal.title || ''} ${year}${volume ? '; ' + volume : ''}${issue}.`;
  
  // Add citation section
  sections.push({
    title: '📝 Citation',
    content: await renderMarkdown(citation)
  });
  
  // Add abstract if available
  if (article.abstract) {
    sections.push({
      title: '📄 Abstract',
      content: await renderMarkdown(formatAbstract(article.abstract))
    });
  }
  
  // Add publication date if available
  if (article.publicationDate) {
    sections.push({
      title: '📅 Publication Date',
      content: await renderMarkdown(`**Published:** ${article.publicationDate}`)
    });
  }
  
  // Add authors section with affiliations if available
  if (Array.isArray(article.authors) && article.authors.length > 0) {
    const authorDetails = article.authors.map((author: any) => {
      let authorText = formatAuthor(author);
      if (author.affiliation) {
        authorText += `\n  *${author.affiliation}*`;
      }
      return authorText;
    });
    
    sections.push({
      title: '👥 Authors',
      content: await renderMarkdown(formatMarkdownList(authorDetails))
    });
  }
  
  // Add PMID if available
  if (article.pmid) {
    sections.push({
      title: '🔍 Identifier',
      content: await renderMarkdown(`**PMID:** ${article.pmid}\n\n[View on PubMed](https://pubmed.ncbi.nlm.nih.gov/${article.pmid}/)`)
    });
  }
  
  return {
    type: 'pubmed',
    sections,
    meta: {
      totalResults: 1,
      searchQuery: article.title
    }
  };
};

// Format a collection of PubMed search results
export const formatPubMedResults = async (apiResponse: any): Promise<FormattedPubMedResult> => {
  if (!apiResponse.articles || !apiResponse.articles.length) {
    return {
      type: 'pubmed',
      sections: [{
        title: 'No Results',
        content: 'No articles found matching your search criteria.'
      }],
      meta: {
        totalResults: 0,
        searchQuery: apiResponse.query || 'Unknown search'
      }
    };
  }
  
  // Format the search results summary
  const summaryContent = await renderMarkdown(`**Found ${apiResponse.count} results.**\n\nShowing top ${apiResponse.articles.length} articles.`);
  
  // Create a summary section
  const sections: Array<{title: string; content: string}> = [{
    title: '🔍 Search Results',
    content: summaryContent
  }];
  
  // Add a section for each article with basic details
  for (let i = 0; i < apiResponse.articles.length; i++) {
    const article = apiResponse.articles[i];
    
    // Create a brief summary of each article
    const articleSummary = `
### ${i + 1}. ${article.title || 'Untitled'}

**Authors:** ${Array.isArray(article.authors) ? article.authors.map(formatAuthor).join(', ') : 'Unknown'}

**Journal:** ${article.journal?.title || 'Not specified'}${article.journal?.year ? ` (${article.journal.year})` : ''}

${article.abstract ? '**Abstract:** ' + article.abstract.substring(0, 200) + (article.abstract.length > 200 ? '...' : '') : 'No abstract available'}

**PMID:** ${article.pmid || 'Not available'}
`;
    
    sections.push({
      title: `Article ${i + 1}`,
      content: await renderMarkdown(articleSummary)
    });
  }
  
  return {
    type: 'pubmed',
    sections,
    meta: {
      totalResults: apiResponse.count,
      searchQuery: apiResponse.query || 'Unknown search'
    }
  };
};
