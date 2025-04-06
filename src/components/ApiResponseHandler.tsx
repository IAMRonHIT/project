import React from 'react';
import FDAResults from './FDAResults';
import PubMedResponseManager from './PubMedResponseManager';
import { NoteIntegration } from './Note';

interface ApiResponseHandlerProps {
  content: string;
}

// Helper function to check if content is PubMed tool response
const isPubMedResponse = (content: string): boolean => {
  try {
    // First check for obvious indicators
    if (content.includes('pubmed.ncbi.nlm.nih.gov') || 
        content.includes('PubMed search results') ||
        content.includes('PubMed API') ||
        content.includes('articles from PubMed')) {
      return true;
    }
    
    // Extract any JSON content from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return false;
    }

    const jsonStr = jsonMatch[0];
    
    // Try parsing the JSON to check for PubMed specific fields
    try {
      const data = JSON.parse(jsonStr);
      
      // Check for PubMed specific data structures
      if ((data.count !== undefined && data.articles) || 
          (data.pmid && data.abstract) ||
          (data.articles && Array.isArray(data.articles) && data.articles.length > 0 && data.articles[0].pmid) ||
          (data.totalResults && data.searchQuery) ||
          (data.results && data.results.pubmed)) {
        return true;
      }
    } catch (parseError) {
      // Silent fail on parse error, continue with regex checks
    }
    
    // THE DEFINITIVE WAY TO IDENTIFY PUBMED DATA:
    // 1. The presence of "count" at the beginning of the JSON 
    // 2. This "count" determines how many sections appear in the accordion
    const pubmedPattern = /^\s*\{\s*"count"\s*:/;
    if (pubmedPattern.test(jsonStr)) {
      return true;
    }
    
    // Look for PMID patterns in the JSON
    const pmidPattern = /"pmid"\s*:/;
    if (pmidPattern.test(jsonStr)) {
      return true;
    }
    
    return false;
  } catch (error) {
    return false;
  }
};

// Helper function to check if content is FDA tool response
const isFDAResponse = (content: string): boolean => {
  // NEVER identify as FDA if it's a PubMed response
  if (isPubMedResponse(content)) {
    return false;
  }
  
  // Rest of FDA detection logic
  try {
    // Check for section markers with the pattern ":[" followed by uppercase titles
    // This is a more reliable way to identify FDA responses
    const sectionPattern = /:[A-Z\s]+\[/;
    const hasSectionMarkers = sectionPattern.test(content);
    
    // Also check if this is a tool execution response with JSON
    if (content.includes('Tool Result:')) {
      // Extract the JSON part after "Tool Result:"
      const toolResultIndex = content.indexOf('Tool Result:');
      const jsonStart = content.indexOf('{', toolResultIndex);
      const jsonEnd = content.lastIndexOf('}') + 1;
      
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const jsonStr = content.substring(jsonStart, jsonEnd);
        
        try {
          const data = JSON.parse(jsonStr);

          // Check for common FDA API response patterns within the nested results
          const isFDA = (
            (data.meta?.disclaimer?.includes('openFDA')) ||
            (data.results?.results?.[0]?.openfda !== undefined) ||
            (data.results?.results?.[0]?.spl_product_data_elements !== undefined) ||
            (data.results?.results?.[0]?.device_name !== undefined) ||
            (data.results?.results?.[0]?.product_ndc !== undefined) ||
            (data.results?.results?.[0]?.recall_number !== undefined) ||
            // Look for section-like structure
            (data.results && Array.isArray(data.results) && data.results.some(r => 
              r.title && typeof r.title === 'string' && r.title.toUpperCase() === r.title
            ))
          );

          return isFDA || hasSectionMarkers;
        } catch (jsonError) {
          // If JSON parsing fails, fall back to section marker pattern
          return hasSectionMarkers;
        }
      }
    }
    
    // Even if there's no valid JSON, check for section markers
    return hasSectionMarkers;
  } catch (error) {
    return false;
  }
};

// Helper function to extract FDA response
const extractFDAResponse = (content: string) => {
  try {
    // First try to extract based on section markers pattern
    const sectionPattern = /:([\w\s]+)\[([\s\S]*?)(?=:[\w\s]+\[|$)/g;
    const sections = [...content.matchAll(sectionPattern)];

    if (sections.length > 0) {
      const formattedSections = sections.map(match => ({
        title: match[1].trim(),
        content: match[2].trim()
      }));
      
      // Create an object that matches the expected FDAResultsProps structure
      return {
        type: 'drug' as const, // Ensure this is a literal type, not a string
        results: {
          // Include the raw sections for the formatters to process
          results: [
            // Generate a basic structure that our formatters can understand
            {
              sections: formattedSections
            }
          ],
          meta: {
            results: {
              total: formattedSections.length
            },
            disclaimer: 'Extracted from section markers'
          }
        }
      };
    }
    
    // If section pattern doesn't match, try extracting JSON
    const toolResultIndex = content.indexOf('Tool Result:');
    if (toolResultIndex === -1) {
      return null;
    }

    // Get the raw response text
    const responseText = content.substring(toolResultIndex + 'Tool Result:'.length).trim();

    // Find the JSON part
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return null;
    }

    const jsonStr = jsonMatch[0];
    
    const data = JSON.parse(jsonStr);

    // Determine the type based on the fields present
    const result = data.results?.[0];
    if (!result) {
      return null;
    }

    let type: 'drug' | 'device' | 'ndc' | 'recall';
    if (result.device_name || result.openfda?.product_type?.includes('DEVICE')) {
      type = 'device';
    } else if (result.product_ndc || result.packaging) {
      type = 'ndc';
    } else if (result.recall_number || result.reason_for_recall) {
      type = 'recall';
    } else {
      type = 'drug'; // Default to drug
    }

    // If sections were already formatted in the data
    if (data.sections && Array.isArray(data.sections)) {
      // We need to convert this to the expected structure
      return {
        type,
        results: {
          results: [{ sections: data.sections }],
          meta: data.meta
        }
      };
    }

    // Return in the format expected by FDAResults component
    return {
      type,
      results: data
    };
  } catch (error) {
    return null;
  }
};

// Helper function to extract PubMed response
const extractPubMedResponse = (content: string) => {
  try {
    // First, try directly parsing the content as JSON
    try {
      // If the content is already valid JSON, just parse it directly
      const data = JSON.parse(content);
      if (data && (data.count !== undefined || data.articles)) {
        // Process articles to mark full-text availability
        if (data.articles && Array.isArray(data.articles)) {
          data.articles = data.articles.map(article => ({
            ...article,
            hasFullText: determineFullTextAvailability(article),
            displayReady: true
          }));
          
          // Group articles by availability 
          data.articlesByAvailability = {
            fullText: data.articles.filter(a => a.hasFullText),
            abstractOnly: data.articles.filter(a => !a.hasFullText)
          };
          
          console.log(`PubMed response processed: ${data.articles.length} total, ${data.articlesByAvailability?.fullText?.length || 0} full-text articles`);
        }
        
        // Ensure data has a valid structure with count and articles
        return {
          count: data.count || (data.articles ? data.articles.length : 0),
          articles: data.articles || [],
          articlesByAvailability: data.articlesByAvailability || { fullText: [], abstractOnly: [] }
        };
      }
    } catch (directParseError) {
      // Not direct JSON, continue with extraction
    }
    
    // Next, try to extract JSON from the content with or without "Tool Result:" prefix
    // Look for the first occurrence of { and the last occurrence of }
    const jsonStart = content.indexOf('{');
    const jsonEnd = content.lastIndexOf('}') + 1;
    
    if (jsonStart !== -1 && jsonEnd > jsonStart) {
      const jsonStr = content.substring(jsonStart, jsonEnd);
      
      try {
        const data = JSON.parse(jsonStr);
        
        // Normalize the response structure to ensure it has count and articles
        let processedData;
        if (data) {
          if (data.articles) {
            processedData = {
              count: data.count !== undefined ? data.count : data.articles.length,
              articles: data.articles
            };
          } else if (data.results && data.results.articles) {
            processedData = {
              count: data.results.count || data.results.articles.length,
              articles: data.results.articles
            };
          } else if (data.pmid) {
            // Single article case
            processedData = {
              count: 1,
              articles: [data]
            };
          } else {
            processedData = data;
          }
          
          // Process articles to mark full-text availability
          if (processedData.articles && Array.isArray(processedData.articles)) {
            processedData.articles = processedData.articles.map(article => ({
              ...article,
              hasFullText: determineFullTextAvailability(article),
              displayReady: true
            }));
            
            // Group articles by availability 
            processedData.articlesByAvailability = {
              fullText: processedData.articles.filter(a => a.hasFullText),
              abstractOnly: processedData.articles.filter(a => !a.hasFullText)
            };
            
            console.log(`PubMed response processed: ${processedData.articles.length} total, ${processedData.articlesByAvailability?.fullText?.length || 0} full-text articles`);
          }
          
          return processedData;
        }
        return data;
      } catch (jsonError) {
        // Silent error handling
      }
    }
    
    // Fallback to the original method looking specifically for "Tool Result:"
    const toolResultIndex = content.indexOf('Tool Result:');
    if (toolResultIndex === -1) {
      return null;
    }

    // Get the raw response text
    const responseText = content.substring(toolResultIndex + 'Tool Result:'.length).trim();
    
    // Find the JSON part
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return null;
    }

    const jsonStr = jsonMatch[0];
    
    try {
      const data = JSON.parse(jsonStr);
      
      // Make sure we have a consistent structure
      let processedData;
      if (data) {
        if (data.articles) {
          processedData = {
            count: data.count !== undefined ? data.count : data.articles.length,
            articles: data.articles
          };
        } else if (data.results && data.results.articles) {
          processedData = {
            count: data.results.count || data.results.articles.length,
            articles: data.results.articles
          };
        } else if (data.pmid) {
          // Single article case
          processedData = {
            count: 1,
            articles: [data]
          };
        } else {
          processedData = data;
        }
        
        // Process articles to mark full-text availability
        if (processedData.articles && Array.isArray(processedData.articles)) {
          processedData.articles = processedData.articles.map(article => ({
            ...article,
            hasFullText: determineFullTextAvailability(article),
            displayReady: true
          }));
          
          // Group articles by availability 
          processedData.articlesByAvailability = {
            fullText: processedData.articles.filter(a => a.hasFullText),
            abstractOnly: processedData.articles.filter(a => !a.hasFullText)
          };
          
          console.log(`PubMed response processed: ${processedData.articles.length} total, ${processedData.articlesByAvailability?.fullText?.length || 0} full-text articles`);
        }
        
        return processedData;
      }
      
      return data;
    } catch (jsonError) {
      return null;
    }
  } catch (error) {
    console.error('Error extracting PubMed response:', error);
    return null;
  }
};

// Helper function to determine if an article has full text available
const determineFullTextAvailability = (article: any): boolean => {
  if (!article) return false;
  
  // Explicit flags if they exist
  if (article.hasFullText === true) return true;
  if (article.fullTextUrl) return true;
  if (article.isPubMedCentral === true) return true;
  
  // Check for PubMed Central ID
  if (article.pmcid && article.pmcid !== '') return true;
  
  // Check for full-text URL patterns in any field
  if (article.fullTextLink || 
      article.pdfLink || 
      (article.links && article.links.some((link: any) => 
        link && (
          (link.url && (
            link.url.includes('pdf') || 
            link.url.includes('full') || 
            link.url.includes('pmc')
          )) || 
          (link.type && (
            link.type.toLowerCase().includes('full') || 
            link.type.toLowerCase().includes('pdf')
          ))
        )
      ))
  ) {
    return true;
  }
  
  // Check if article is open access
  if (article.isOpenAccess === true) return true;
  
  // Check if journal title indicates open access
  if (article.journal && article.journal.title) {
    const journalTitle = article.journal.title.toLowerCase();
    if (
      journalTitle.includes('open access') || 
      journalTitle.includes('plos') || 
      journalTitle.includes('bmc') ||
      journalTitle.includes('peerj') ||
      journalTitle.includes('frontiers') ||
      journalTitle.includes('mdpi')
    ) {
      return true;
    }
  }
  
  // Check DOI patterns that often indicate full text availability
  if (article.doi) {
    const doi = article.doi.toLowerCase();
    if (
      doi.includes('plos') ||
      doi.includes('frontiers') ||
      doi.includes('peerj') ||
      doi.includes('mdpi') ||
      doi.includes('hindawi') ||
      doi.includes('nature.com/articles') ||
      doi.includes('bmj.com/content') ||
      doi.includes('biomedcentral') ||
      doi.includes('10.1371/journal') // PLOS pattern
    ) {
      return true;
    }
  }
  
  return false;
};

const ApiResponseHandler: React.FC<ApiResponseHandlerProps> = ({ content }) => {
  try {
    // FIRST check if PubMed - extremely simple detection
    if (isPubMedResponse(content)) {
      const response = extractPubMedResponse(content);
      if (response) {
        // DIRECTLY render PubMedResponseManager without going through PubMedResults
        return (
          <div className="w-full max-w-4xl mx-auto my-4 border border-gray-700 rounded-lg relative">
            <PubMedResponseManager data={response} />
            <NoteIntegration 
              entityType="CareJourney"
              buttonPosition="top-right"
              initialContent={`PubMed Results:\n${JSON.stringify(response, null, 2).substring(0, 200)}...\n\n`}
            />
          </div>
        );
      }
    }
    
    // Only if not PubMed, check for FDA
    if (isFDAResponse(content)) {
      const response = extractFDAResponse(content);
      if (response) {
        return (
          <div className="w-full max-w-4xl mx-auto my-4 border border-gray-700 rounded-lg relative">
            <FDAResults results={response} />
            <NoteIntegration 
              entityType="CarePlan"
              buttonPosition="top-right"
              initialContent={`FDA Results:\n${JSON.stringify(response, null, 2).substring(0, 200)}...\n\n`}
            />
          </div>
        );
      }
    }
    
    return null;
  } catch (error) {
    return null;
  }
};

export default ApiResponseHandler;
