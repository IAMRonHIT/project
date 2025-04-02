// @ts-ignore - Vite provides env through import.meta
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export interface PubMedArticle {
  uid: string;
  title: string;
  authors: string[];
  pubdate: string;
  source: string;
  abstract?: string;
}

export interface PubMedSearchResult {
  total: number;
  articles: PubMedArticle[];
}

class PubMedService {
  private async fetchWithParams(action: string, params: Record<string, string>) {
    const queryParams = new URLSearchParams({
      action,
      ...params
    });

    const response = await fetch(`${BACKEND_URL}/api/pubmed?${queryParams}`);
    if (!response.ok) {
      throw new Error('Failed to fetch from PubMed API');
    }
    return response.json();
  }

  async searchArticles(query: string, maxResults: number = 20): Promise<PubMedSearchResult> {
    return this.fetchWithParams('search', {
      query,
      maxResults: maxResults.toString()
    });
  }

  async getArticleDetails(pmid: string) {
    return this.fetchWithParams('details', { pmid });
  }

  async getRelatedArticles(pmid: string, maxResults: number = 10) {
    return this.fetchWithParams('related', {
      pmid,
      maxResults: maxResults.toString()
    });
  }

  async getCitation(pmid: string) {
    return this.fetchWithParams('citation', { pmid });
  }
}

export default new PubMedService();
