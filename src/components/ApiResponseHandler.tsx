import React from 'react';
import FDAResults from './FDAResults';
import PubMedResults from './PubMedResults';

interface ApiResponseHandlerProps {
  content: string;
}

// Helper function to check if content is FDA tool response
const isFDAResponse = (content: string): boolean => {
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
        console.log('Extracted JSON string:', jsonStr);
        
        try {
          const data = JSON.parse(jsonStr);
          console.log('Parsed FDA data:', data);

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

          console.log('Is FDA response based on JSON structure:', isFDA);
          return isFDA || hasSectionMarkers;
        } catch (jsonError) {
          // If JSON parsing fails, fall back to section marker pattern
          console.error('Error parsing JSON, falling back to section pattern check:', jsonError);
          return hasSectionMarkers;
        }
      }
    }
    
    // Even if there's no valid JSON, check for section markers
    return hasSectionMarkers;
  } catch (error) {
    console.error('Error checking FDA response:', error);
    console.error('Content that caused error:', content);
    return false;
  }
};

// Helper function to check if content is PubMed tool response
const isPubMedResponse = (content: string): boolean => {
  try {
    // Check if this is a tool execution response
    if (!content.includes('Tool Result:')) {
      return false;
    }
    
    // Extract the JSON part after "Tool Result:"
    const toolResultIndex = content.indexOf('Tool Result:');
    const jsonStart = content.indexOf('{', toolResultIndex);
    const jsonEnd = content.lastIndexOf('}') + 1;
    
    if (jsonStart === -1 || jsonEnd === -1) {
      return false;
    }
    
    const jsonStr = content.substring(jsonStart, jsonEnd);
    console.log('Extracted JSON string for PubMed check:', jsonStr);
    
    try {
      const data = JSON.parse(jsonStr);
      console.log('Parsed PubMed data:', data);

      // Check for common PubMed API response patterns
      const isPubMed = (
        // Look for PubMed-specific fields
        (data.articles && Array.isArray(data.articles)) ||
        (data.pmid !== undefined) ||
        // Check for specific PubMed response format
        (data.count !== undefined && data.articles !== undefined) ||
        // Check for array of authors which is common in PubMed responses
        (Array.isArray(data.authors)) ||
        // Check for abstract which is common in PubMed responses
        (typeof data.abstract === 'string' || Array.isArray(data.abstract))
      );

      console.log('Is PubMed response:', isPubMed);
      return isPubMed;
    } catch (jsonError) {
      console.error('Error parsing PubMed JSON:', jsonError);
      return false;
    }
  } catch (error) {
    console.error('Error checking PubMed response:', error);
    console.error('Content that caused error:', content);
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
      console.log('Found sections using pattern match:', sections.length);
      
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
      console.error('No Tool Result found');
      return null;
    }

    // Get the raw response text
    const responseText = content.substring(toolResultIndex + 'Tool Result:'.length).trim();
    console.log('Raw response text:', responseText);

    // Find the JSON part
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('No JSON found in response');
      return null;
    }

    const jsonStr = jsonMatch[0];
    console.log('Extracted JSON:', jsonStr);
    
    const data = JSON.parse(jsonStr);
    console.log('Parsed data:', data);

    // Determine the type based on the fields present
    const result = data.results?.[0];
    if (!result) {
      console.error('No results found in data');
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

    console.log('Determined type:', type);

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
    console.error('Error extracting FDA response:', error);
    return null;
  }
};

// Helper function to extract PubMed response
const extractPubMedResponse = (content: string) => {
  try {
    // Extract the JSON part after "Tool Result:"
    const toolResultIndex = content.indexOf('Tool Result:');
    if (toolResultIndex === -1) {
      console.error('No Tool Result found');
      return null;
    }

    // Get the raw response text
    const responseText = content.substring(toolResultIndex + 'Tool Result:'.length).trim();
    console.log('Raw PubMed response text:', responseText);

    // Find the JSON part
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('No JSON found in PubMed response');
      return null;
    }

    const jsonStr = jsonMatch[0];
    console.log('Extracted PubMed JSON:', jsonStr);
    
    const data = JSON.parse(jsonStr);
    console.log('Parsed PubMed data:', data);

    // Return in the format expected by PubMedResults component
    return {
      type: 'pubmed' as const,
      results: data
    };
  } catch (error) {
    console.error('Error extracting PubMed response:', error);
    return null;
  }
};

const ApiResponseHandler: React.FC<ApiResponseHandlerProps> = ({ content }) => {
  try {
    // Check if the content contains any JSON blocks
    const jsonRegex = /\{[\s\S]*?\}/g;
    const matches = content.match(jsonRegex);

    if (matches) {
      for (const match of matches) {
        try {
          // Check for FDA response first
          const isFDA = isFDAResponse(match);
          console.log('Is FDA response:', isFDA);

          if (isFDA) {
            const response = extractFDAResponse(match);
            console.log('Extracted FDA response:', response);

            if (response) {
              return (
                <div className="w-full max-w-4xl mx-auto my-4 border border-gray-700 rounded-lg">
                  <FDAResults results={response} />
                </div>
              );
            } else {
              console.log('FDA extraction returned null');
            }
          }

          // If not FDA, check for PubMed response
          const isPubMed = isPubMedResponse(match);
          console.log('Is PubMed response:', isPubMed);

          if (isPubMed) {
            const response = extractPubMedResponse(match);
            console.log('Extracted PubMed response:', response);

            if (response) {
              return (
                <div className="w-full max-w-4xl mx-auto my-4 border border-gray-700 rounded-lg">
                  <PubMedResults results={response} />
                </div>
              );
            } else {
              console.log('PubMed extraction returned null');
            }
          }
        } catch (error) {
          console.error('Error processing potential API response:', error);
          console.error('Problematic JSON:', match);
        }
      }
    }
    
    // If no API response was detected or extracted, return null
    return null;
  } catch (error) {
    console.error('Error in ApiResponseHandler:', error);
    return null;
  }
};

export default ApiResponseHandler;
