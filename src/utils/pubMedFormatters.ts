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

// Direct pass-through formatter - no transformations
export const formatPubMedArticle = async (article: any): Promise<any> => {
  // Just return the raw article data without logging
  return article;
};

// Direct pass-through formatter - no transformations
export const formatPubMedResults = async (apiResponse: any): Promise<any> => {
  // Just return the raw response data without logging
  return apiResponse;
};
