import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, ExternalLink, Maximize2, Minimize2, Download, FileText } from 'lucide-react';

/**
 * PubMedResponseManager displays PubMed API data in an accordion format.
 * It handles different types of data structures:
 * 1. Direct API response with articles array (from E-utilities)
 * 2. Formatted data with sections from the formatters
 */

// Minimal PubMed interfaces
interface PubMedArticle {
  pmid: number | string;
  title: string;
  abstract: any;
  authors?: any[];
  journal?: any;
  doi?: string;
  publicationDate?: string;
  isOpenAccess?: boolean;
  pdfUrl?: string;
  hasFullText?: boolean;
  fullTextUrl?: string;
  isPubMedCentral?: boolean;
  pmcid?: string;
}

interface PubMedData {
  count: number;
  articles: PubMedArticle[];
}

interface PubMedResponseManagerProps {
  data: PubMedData;
}

// Helper to create PubMed URL from PMID
const getPubMedUrl = (pmid: string | number) => {
  return `http://pubmed.ncbi.nlm.nih.gov/${pmid}/`;
};

// Helper to create DOI URL
const getDoiUrl = (doi: string) => {
  if (doi.startsWith('http')) {
    // Make sure to remove 's' from https
    return doi.replace('https://', 'http://');
  }
  return `http://doi.org/${doi}`;
};

// Helper to create PDF URL for open access articles with multiple sources
const getPdfUrl = (article: PubMedArticle) => {
  // If the article already has a pdfUrl, use it (ensuring it's HTTP)
  if (article.pdfUrl) {
    return article.pdfUrl.replace('https://', 'http://');
  }
  
  // PMCID is the most reliable source for full text PDFs
  if (article.pmcid) {
    return `https://www.ncbi.nlm.nih.gov/pmc/articles/${article.pmcid}/pdf/`;
  }
  
  // Try to generate a PMC URL for potential open access article via PMID
  if (article.pmid) {
    return `https://www.ncbi.nlm.nih.gov/pmc/articles/pmid/${article.pmid}/pdf/`;
  }
  
  // DOI-based URLs can work for many scientific publications
  if (article.doi) {
    // Try multiple possible sources for DOI resolution
    if (article.doi.includes('10.1371')) {
      // PLOS journals
      return `https://journals.plos.org/plosone/article/file?id=${article.doi.split('/').pop()}&type=printable`;
    } else if (article.doi.includes('10.3389')) {
      // Frontiers journals
      return `https://www.frontiersin.org/articles/${article.doi.replace('doi.org/', '')}/pdf`;
    } else if (article.doi.includes('10.1186')) {
      // BMC journals
      return `https://bmcmedicine.biomedcentral.com/counter/pdf/${article.doi}`;
    } else {
      // General DOI-based URL as a fallback
      return `https://sci-hub.se/${article.doi}`;
    }
  }
  
  // No PDF URL available
  return null;
};

// Helper to get PubMed article URL through our wrapper (for highlighting support)
const getHighlightablePmcUrl = (pmcid: string) => {
  const url = `/pubmed-wrapper.html?pmcid=${pmcid}`;
  console.log(`Using highlightable URL for PMC article: ${url}`);
  return url;
};

// Helper to check if an article is likely open access or embeddable
const isLikelyOpenAccess = (article: PubMedArticle) => {
  // Use explicit flag if available
  if (article.isOpenAccess !== undefined) {
    return article.isOpenAccess;
  }
  
  // Check journal name for open access indicators
  const journalTitle = article.journal?.title?.toLowerCase() || '';
  if (
    journalTitle.includes('open access') || 
    journalTitle.includes('plos') || 
    journalTitle.includes('bmc') ||
    journalTitle.includes('peerj') ||
    journalTitle.includes('frontiers') ||
    journalTitle.includes('nature') ||
    journalTitle.includes('science') ||
    journalTitle.includes('journal') ||
    journalTitle.includes('advances') ||
    journalTitle.includes('medicine')
  ) {
    return true;
  }
  
  // Check for PMC ID as an indicator of potential open access
  if (article.journal && article.journal.pmc) {
    return true;
  }
  
  // Check if article has identifiers that typically indicate availability
  if (article.pmcid || (article.doi && article.doi.length > 5)) {
    return true;
  }
  
  // Check publication year - older articles are more likely to be available
  const pubYear = article.publicationDate ? 
    parseInt(String(article.publicationDate).substring(0, 4)) : null;
  if (pubYear && pubYear < 2019) {
    return true;
  }
  
  return false;
};

const PubMedResponseManager: React.FC<PubMedResponseManagerProps> = ({ data }) => {
  // Get articles and count, ALWAYS using count as the definitive number
  const articles = data?.articles || [];
  const count = data?.count || 0; // Use count as defined in the response
  
  // Ensure we display exactly 'count' articles in the accordion
  const displayArticles = count > 0 
    ? articles.slice(0, count) // If count is positive, show that many articles
    : articles; // Fallback to all articles if count is invalid
  
  // Track expanded article PMIDs
  const [expandedPmids, setExpandedPmids] = useState<Set<string | number>>(new Set());
  
  // Keep track of the current view type (article, pdf, or null) for each article
  const [currentView, setCurrentView] = useState<Record<string | number, 'article' | 'pdf' | null>>({});
  
  // Track PDF download states
  const [downloadStatus, setDownloadStatus] = useState<Record<string | number, 'idle' | 'loading' | 'success' | 'error'>>({});

  // Track iframe load errors and retry attempts
  const [iframeLoadError, setIframeLoadError] = useState<Record<string | number, boolean>>({});
  const [iframeRetryCount, setIframeRetryCount] = useState<Record<string | number, number>>({});
  const [alternateSourceIndex, setAlternateSourceIndex] = useState<Record<string | number, number>>({});
  
  // Handle iframe load errors with fallback sources
  const handleIframeError = (articleId: string | number, article: PubMedArticle) => {
    // Mark this iframe as having an error
    setIframeLoadError(prev => ({ ...prev, [articleId]: true }));
    
    // Increment retry counter for this article
    setIframeRetryCount(prev => {
      const currentCount = prev[articleId] || 0;
      return { ...prev, [articleId]: currentCount + 1 };
    });
    
    // If we haven't exceeded max retries, try an alternate source
    if ((iframeRetryCount[articleId] || 0) < 3) {
      setAlternateSourceIndex(prev => {
        const currentIndex = prev[articleId] || 0;
        return { ...prev, [articleId]: currentIndex + 1 };
      });
      
      // Reset the error state so we can try again with a new source
      setTimeout(() => {
        setIframeLoadError(prev => ({ ...prev, [articleId]: false }));
      }, 500);
    }
  };
  
  // Reset iframe error and retry counters
  const resetIframeError = (articleId: string | number) => {
    setIframeLoadError(prev => ({ ...prev, [articleId]: false }));
    setIframeRetryCount(prev => ({ ...prev, [articleId]: 0 }));
    setAlternateSourceIndex(prev => ({ ...prev, [articleId]: 0 }));
  };
  
  // Get appropriate article URL with fallbacks based on retry count
  const getArticleUrl = (article: PubMedArticle, sourceIndex: number = 0): string => {
    const sources = [
      // Primary source based on identifiers
      article.doi ? getDoiUrl(article.doi) :
        article.pmcid ? `https://www.ncbi.nlm.nih.gov/pmc/articles/${article.pmcid}/` :
          getPubMedUrl(article.pmid),
      
      // First fallback - direct PubMed URL
      getPubMedUrl(article.pmid),
      
      // Second fallback - try PMC if available
      article.pmcid ? `https://www.ncbi.nlm.nih.gov/pmc/articles/${article.pmcid}/` : null,
      
      // Third fallback - try direct DOI resolver
      article.doi ? `https://doi.org/${article.doi}` : null,
      
      // Fourth fallback - try Unpaywall if DOI available
      article.doi ? `https://api.unpaywall.org/v2/${article.doi}?email=user@example.com` : null,
    ].filter(Boolean) as string[]; // Remove null entries and cast to string[]
    
    // Use the source at the current index, or the first source if index is out of bounds
    return sources[sourceIndex % sources.length] || sources[0];
  };
  
  // Helper function to ensure iframe src is always string | undefined (never null)
  const getIframeSrc = (article: PubMedArticle, viewType: 'article' | 'pdf' | null, pdfUrl: string | null, sourceIndex: number = 0): string | undefined => {
    if (viewType === 'pdf') {
      // For PDF view, use the PDF URL or undefined if null
      return pdfUrl || undefined;
    } else if (viewType === 'article') {
      // For article view, use our article URL getter which guarantees a string
      return getArticleUrl(article, sourceIndex);
    }
    // Default case
    return undefined;
  };

  // No articles case
  if (!displayArticles || displayArticles.length === 0) {
    return <div className="p-4 bg-gray-800 text-white rounded">No PubMed articles found</div>;
  }

  // Toggle article expansion
  const toggleArticle = (pmid: string | number) => {
    setExpandedPmids(prev => {
      const next = new Set(prev);
      if (next.has(pmid)) {
        next.delete(pmid);
        setCurrentView(prev => ({ ...prev, [pmid]: null })); // Collapse view
        resetIframeError(pmid);
      } else {
        next.add(pmid);
        // Always attempt to display the article content when expanded
        const articleData = displayArticles.find(a => (a.pmid || articles.indexOf(a)) === pmid);
        
        // Attempt to show article view in more cases - virtually any article can potentially be embedded
        if (articleData) {
          // Check if this article is potentially embeddable using our enhanced detection function
          const potentiallyEmbeddable = isLikelyOpenAccess(articleData);
          
          // If the article has any properties that indicate it might be embeddable, try to show it
          if (potentiallyEmbeddable || 
              articleData.hasFullText === true || 
              articleData.doi || 
              articleData.isOpenAccess || 
              (articleData.pmcid && articleData.pmcid !== '') ||
              articleData.pmid) {
            
            // Default to article view for almost all cases
            setCurrentView(prev => ({ ...prev, [pmid]: 'article' as 'article' }));
          } else {
            // Only fall back to null (abstract only) if we have absolutely no way to try embedding
            setCurrentView(prev => ({ ...prev, [pmid]: null }));
          }
        } else {
          setCurrentView(prev => ({ ...prev, [pmid]: null }));
        }
        resetIframeError(pmid);
      }
      return next;
    });
  };
  
  // Toggle between PDF and Article view in the single iframe
  const toggleContentView = (pmid: string | number, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    setCurrentView((prev: Record<string | number, 'article' | 'pdf' | null>): Record<string | number, 'article' | 'pdf' | null> => {
      const currentPmidView = prev[pmid];
      resetIframeError(pmid);

      if (currentPmidView === 'pdf') {
        return { ...prev, [pmid]: 'article' as 'article' };
      } else {
        // This covers 'article' or initially null/undefined for this pmid
        return { ...prev, [pmid]: 'pdf' as 'pdf' };
      }
    });
  };
  
  // Handle downloading PDF
  const handleDownloadPdf = async (article: PubMedArticle, pmid: string | number, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    const pdfUrl = getPdfUrl(article);
    if (!pdfUrl) return;
    
    setDownloadStatus(prev => ({ ...prev, [pmid]: 'loading' as const }));
    
    try {
      // Create an anchor and trigger download
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.setAttribute('download', `pubmed-article-${pmid}.pdf`);
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setDownloadStatus(prev => ({ ...prev, [pmid]: 'success' as const }));
      
      // Reset success status after 3 seconds
      setTimeout(() => {
        setDownloadStatus(prev => ({ ...prev, [pmid]: 'idle' as const }));
      }, 3000);
    } catch (error) {
      setDownloadStatus(prev => ({ ...prev, [pmid]: 'error' as const }));
      
      // Reset error status after 3 seconds
      setTimeout(() => {
        setDownloadStatus(prev => ({ ...prev, [pmid]: 'idle' as const }));
      }, 3000);
    }
  };

  return (
    <div className="bg-gray-900 text-white rounded-lg overflow-hidden border border-blue-500/30">
      {/* Header */}
      <div className="bg-blue-900/50 p-4 border-b border-blue-500/30 relative">
        {/* Decorative elements similar to FDA accordion but with blue theme */}
        <div className="absolute left-0 top-0 w-1/3 h-0.5 bg-gradient-to-r from-blue-500/80 to-transparent"></div>
        <div className="absolute right-0 bottom-0 w-1/4 h-0.5 bg-gradient-to-l from-blue-400/80 to-transparent"></div>
        
        <h2 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-blue-500/10 border border-blue-500/20 shadow-[0_0_5px_rgba(59,130,246,0.5)]">
            <BookOpen className="w-4 h-4 text-blue-400" />
          </div>
          PubMed Articles
          <span className="ml-2 text-sm text-blue-300/80">{count} results</span>
        </h2>
      </div>

      {/* Articles List */}
      <div className="divide-y divide-blue-500/20">
        {displayArticles.map((article, index) => {
          const articleId = article.pmid || index;
          const isOpenAccess = isLikelyOpenAccess(article);
          const pdfUrl = getPdfUrl(article);
          
          return (
            <div key={index} className="transition-colors hover:bg-gray-800/50">
              {/* Article Header */}
              <button
                onClick={() => toggleArticle(articleId)}
                className="w-full text-left p-4 flex justify-between items-center"
              >
                <div className="pr-4">
                  <h3 className="font-medium text-blue-200">{article.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    PMID: {article.pmid || 'N/A'} 
                    {isOpenAccess && <span className="ml-2 text-green-400">• Open Access</span>}
                  </p>
                </div>
                {expandedPmids.has(articleId) ? (
                  <ChevronUp className="flex-shrink-0 h-5 w-5 text-blue-400" />
                ) : (
                  <ChevronDown className="flex-shrink-0 h-5 w-5 text-blue-400" />
                )}
              </button>
              
              {/* Article Details */}
              {expandedPmids.has(articleId) && (
                <div className="p-4 pt-0"> {/* Removed bg-gray-800/30 */}
                  {/* Article Actions */}
                  <div className="mb-4 flex items-center flex-wrap gap-3">
                    {/* External Link Button */}
                    <a 
                      href={article.doi ? getDoiUrl(article.doi) : getPubMedUrl(article.pmid)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 
                        text-white rounded-md transition-colors shadow-lg hover:shadow-xl"
                    >
                      <ExternalLink size={16} />
                      Get Full Article
                    </a>
                    
                    {/* PDF Buttons - Only show for potential open access articles */}
                    {pdfUrl && (
                      <>
                        {/* Toggle Content View (PDF/Article) Button */}
                        <button
                          onClick={(e) => toggleContentView(articleId, e)}
                          className={`inline-flex items-center gap-2 px-4 py-2 
                            text-white rounded-md transition-colors shadow-lg hover:shadow-xl
                            ${currentView[articleId] === 'pdf' 
                              ? 'bg-indigo-600 hover:bg-indigo-700' // Style for "View Article"
                              : 'bg-green-600 hover:bg-green-700'}`} // Style for "View PDF"
                        >
                          {currentView[articleId] === 'pdf' 
                            ? <><BookOpen size={16} /> View Article</>
                            : <><FileText size={16} /> View PDF</>
                          }
                        </button>
                        
                        {/* Download PDF Button */}
                        <button
                          onClick={(e) => handleDownloadPdf(article, articleId, e)}
                          disabled={downloadStatus[articleId] === 'loading'}
                          className={`inline-flex items-center gap-2 px-4 py-2 
                            text-white rounded-md transition-colors shadow-lg hover:shadow-xl
                            ${downloadStatus[articleId] === 'loading' 
                              ? 'bg-gray-600 cursor-wait' 
                              : downloadStatus[articleId] === 'success'
                                ? 'bg-green-700'
                                : downloadStatus[articleId] === 'error'
                                  ? 'bg-red-700'
                                  : 'bg-green-600 hover:bg-green-700'}`}
                        >
                          <Download size={16} />
                          {downloadStatus[articleId] === 'loading' 
                            ? 'Downloading...' 
                            : downloadStatus[articleId] === 'success'
                              ? 'Downloaded!'
                              : downloadStatus[articleId] === 'error'
                                ? 'Error'
                                : 'Download PDF'}
                        </button>
                      </>
                    )}
                    
                    <span className="text-xs text-blue-300">
                      PMID: <span className="font-medium">{article.pmid || 'N/A'}</span> {article.doi ? '• Via DOI' : '• Via PubMed'}
                    </span>
                  </div>

                  {/* Single Iframe for Article or PDF View */}
                  {currentView[articleId] && (
                    <div className="mb-4 border border-blue-500/30 rounded-lg overflow-hidden h-[600px] bg-white">
                      {iframeLoadError[articleId] ? (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800">
                          <div className="text-red-400 mb-2">
                            Failed to load {currentView[articleId] === 'pdf' ? 'PDF' : 'article'}
                          </div>
                          <p className="text-sm text-gray-400 mb-4">
                            The {currentView[articleId] === 'pdf' ? 'PDF' : 'article'} source refused to connect or cannot be embedded.
                          </p>
                          <a 
                            href={
                              currentView[articleId] === 'pdf' 
                                ? (pdfUrl || undefined) // Convert null to undefined
                                : article.doi 
                                  ? getDoiUrl(article.doi) 
                                  : article.pmcid 
                                    ? `https://www.ncbi.nlm.nih.gov/pmc/articles/${article.pmcid}/`
                                    : getPubMedUrl(article.pmid)
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`px-4 py-2 text-white rounded-md ${
                              currentView[articleId] === 'pdf' 
                                ? 'bg-green-600 hover:bg-green-700' 
                                : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                          >
                            Open {currentView[articleId] === 'pdf' ? 'PDF' : 'Article'} in New Tab
                          </a>
                        </div>
                      ) : (
                        <iframe 
                          src={getIframeSrc(article, currentView[articleId], pdfUrl, alternateSourceIndex[articleId] || 0)}
                          className="w-full h-full"
                          title={`${currentView[articleId] === 'pdf' ? 'PDF' : 'Article'}: ${article.title}`}
                          allowFullScreen
                          onError={() => handleIframeError(articleId, article)}
                          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                          referrerPolicy="no-referrer"
                          key={`${articleId}-${currentView[articleId]}-${alternateSourceIndex[articleId] || 0}`} // Force re-render on src or alternate source change
                        ></iframe>
                      )}
                    </div>
                  )}

                  {/* Show message if no viewable content (neither article nor PDF can be shown in iframe) */}
                  {!currentView[articleId] && (article.hasFullText !== true && !article.doi && !article.isOpenAccess && (!article.pmcid || article.pmcid === '')) && (
                     <div className="mb-4 p-4 border border-blue-500/30 rounded-lg bg-gray-800/80">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-blue-300">
                          <FileText size={16} />
                          <span className="font-medium">Abstract Only</span>
                        </div>
                        <a 
                          href={getPubMedUrl(article.pmid)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          View on PubMed <ExternalLink size={12} />
                        </a>
                      </div>
                      <p className="mt-2 text-sm text-gray-400">
                        Full text is not available for embedding. Only the abstract is available for this article.
                      </p>
                    </div>
                  )}
                  
                  {/* Abstract */}
                  <div className="mb-3">
                    <h4 className="text-sm font-semibold text-blue-300 mb-1">Abstract</h4>
                    <div className="text-sm text-gray-300">
                      {Array.isArray(article.abstract) ? (
                        article.abstract.map((section, i) => (
                          <div key={i} className="mb-2">
                            {section['@_Label'] && (
                              <h5 className="text-sm font-semibold text-blue-300 mb-1">{section['@_Label']}</h5>
                            )}
                            <p>{section['#text']}</p>
                          </div>
                        ))
                      ) : (
                        <p>{typeof article.abstract === 'string' ? article.abstract : 'No abstract available'}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Authors */}
                  {article.authors && article.authors.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-sm font-semibold text-blue-300 mb-1">Authors</h4>
                      <p className="text-sm text-gray-300">
                        {article.authors.map((author, idx) => (
                          <span key={idx}>
                            {author.lastName || ''}, {author.firstName || author.initials || ''}
                            {idx < (article.authors?.length || 0) - 1 ? '; ' : ''}
                          </span>
                        ))}
                      </p>
                    </div>
                  )}
                  
                  {/* Journal Info */}
                  {article.journal && (
                    <div className="mb-3">
                      <h4 className="text-sm font-semibold text-blue-300 mb-1">Journal</h4>
                      <p className="text-sm text-gray-300">
                        {article.journal.title || 'Unknown Journal'}
                        {article.journal.year ? `, ${article.journal.year}` : ''}
                        {article.journal.volume ? `, Volume ${article.journal.volume}` : ''}
                        {article.journal.issue ? `, Issue ${article.journal.issue}` : ''}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PubMedResponseManager;
