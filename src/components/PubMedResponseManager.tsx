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

// Helper to create PDF URL for open access articles
const getPdfUrl = (article: PubMedArticle) => {
  // If the article already has a pdfUrl, use it (ensuring it's HTTP)
  if (article.pdfUrl) {
    return article.pdfUrl.replace('https://', 'http://');
  }
  
  // Try to generate a PMC URL for potential open access article
  if (article.pmid) {
    return `http://www.ncbi.nlm.nih.gov/pmc/articles/pmid/${article.pmid}/pdf/`;
  }
  
  // Fallback to DOI-based URL if available
  if (article.doi) {
    return `http://sci-hub.se/${article.doi}`;
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

// Helper to check if an article is likely open access
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
    journalTitle.includes('frontiers')
  ) {
    return true;
  }
  
  // Check for PMC ID as an indicator of potential open access
  if (article.journal && article.journal.pmc) {
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
  
  // Keep embeddedPdfs state for PDF view toggle
  const [embeddedPdfs, setEmbeddedPdfs] = useState<Set<string | number>>(new Set());
  
  // Track PDF download states
  const [downloadStatus, setDownloadStatus] = useState<Record<string | number, 'idle' | 'loading' | 'success' | 'error'>>({});

  // Track iframe load errors
  const [iframeErrors, setIframeErrors] = useState<Record<string | number, boolean>>({});
  
  // Handle iframe load errors
  const handleIframeError = (articleId: string | number, isPdf: boolean = false) => {
    setIframeErrors(prev => ({ ...prev, [`${articleId}-${isPdf ? 'pdf' : 'article'}`]: true }));
  };
  
  // Reset iframe error when toggling
  const resetIframeError = (articleId: string | number, isPdf: boolean = false) => {
    setIframeErrors(prev => ({ ...prev, [`${articleId}-${isPdf ? 'pdf' : 'article'}`]: false }));
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
        // Also close PDF view if article is collapsed
        setEmbeddedPdfs(prevPdfs => {
          const nextPdfs = new Set(prevPdfs);
          nextPdfs.delete(pmid);
          return nextPdfs;
        });
        // Reset iframe errors
        resetIframeError(pmid);
        resetIframeError(pmid, true);
      } else {
        next.add(pmid);
      }
      return next;
    });
  };
  
  // Toggle PDF view
  const togglePdfView = (pmid: string | number, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    setEmbeddedPdfs(prev => {
      const next = new Set(prev);
      if (next.has(pmid)) {
        next.delete(pmid);
        // Reset PDF iframe error
        resetIframeError(pmid, true);
      } else {
        next.add(pmid);
      }
      return next;
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
                <div className="p-4 pt-0 bg-gray-800/30">
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
                        {/* View PDF Button */}
                        <button
                          onClick={(e) => togglePdfView(articleId, e)}
                          className={`inline-flex items-center gap-2 px-4 py-2 
                            text-white rounded-md transition-colors shadow-lg hover:shadow-xl
                            ${embeddedPdfs.has(articleId) 
                              ? 'bg-green-800 hover:bg-green-900' 
                              : 'bg-green-600 hover:bg-green-700'}`}
                        >
                          {embeddedPdfs.has(articleId) 
                            ? <><Minimize2 size={16} /> Hide PDF</>
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
                  
                  {/* Conditionally show Embedded Article View based on full text availability */}
                  {(article.hasFullText === true || article.doi || article.isOpenAccess || (article.pmcid && article.pmcid !== '')) ? (
                    <div className="mb-4 border border-blue-500/30 rounded-lg overflow-hidden h-[500px] bg-white">
                      {iframeErrors[`${articleId}-article`] ? (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800">
                          <div className="text-red-400 mb-2">Failed to load article</div>
                          <p className="text-sm text-gray-400 mb-4">The article source refused to connect or cannot be embedded.</p>
                          <a 
                            href={article.doi 
                              ? getDoiUrl(article.doi) 
                              : article.pmcid 
                                ? `https://www.ncbi.nlm.nih.gov/pmc/articles/${article.pmcid}/`
                                : getPubMedUrl(article.pmid)
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                          >
                            Open in New Tab
                          </a>
                        </div>
                      ) : (
                        <iframe 
                          src={article.doi 
                            ? getDoiUrl(article.doi) 
                            : article.pmcid 
                              ? getHighlightablePmcUrl(article.pmcid) // Use highlightable wrapper for PMC articles
                              : getPubMedUrl(article.pmid)
                          }
                          className="w-full h-full"
                          title={`Embedded article: ${article.title}`}
                          allowFullScreen
                          onError={() => handleIframeError(articleId)}
                          data-source={article.pmcid ? `PubMed PMC${article.pmcid}` : article.doi ? 'DOI' : 'PubMed'}
                        ></iframe>
                      )}
                    </div>
                  ) : (
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
                  
                  {/* Embedded PDF View - Toggle state */}
                  {embeddedPdfs.has(articleId) && pdfUrl && (
                    <div className="mb-4 border border-blue-500/30 rounded-lg overflow-hidden h-[600px] bg-white">
                      {iframeErrors[`${articleId}-pdf`] ? (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800">
                          <div className="text-red-400 mb-2">Failed to load PDF</div>
                          <p className="text-sm text-gray-400 mb-4">The PDF source refused to connect or cannot be embedded.</p>
                          <a 
                            href={pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                          >
                            Open PDF in New Tab
                          </a>
                        </div>
                      ) : (
                        <iframe 
                          src={pdfUrl}
                          className="w-full h-full"
                          title={`PDF for article: ${article.title}`}
                          allowFullScreen
                          onError={() => handleIframeError(articleId, true)}
                        ></iframe>
                      )}
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
