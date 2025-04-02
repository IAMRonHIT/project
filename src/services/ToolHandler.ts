import { FDAToolHandler, fdaToolDefinitions } from '../tools/FDAToolHandler';
import { MapsToolHandler, mapsToolDefinitions } from '../tools/MapsToolHandler';
import { NPIToolHandler, npiToolDefinitions } from '../tools/NPIToolHandler';
import {
  PubMedToolHandler,
  articleSearchTool,
  citationRetrievalTool,
  fullTextRetrievalTool
} from '../tools/PubMedToolHandler'; // Import individual PubMed tools

interface ToolHandlerConfig {
  FDA_API_KEY: string;
  GOOGLE_MAPS_API_KEY: string;
  PUBMED_API_KEY: string;
}

export class ToolHandler {
  private fdaHandler: FDAToolHandler;
  private mapsHandler: MapsToolHandler;
  private npiHandler: NPIToolHandler;
  private pubmedHandler: PubMedToolHandler;
  constructor(config: ToolHandlerConfig) {
    this.fdaHandler = new FDAToolHandler;
    this.mapsHandler = new MapsToolHandler({ apiKey: config.GOOGLE_MAPS_API_KEY });
    this.npiHandler = new NPIToolHandler(); // Correct: Removed argument as constructor expects none
    this.pubmedHandler = new PubMedToolHandler({ apiKey: config.PUBMED_API_KEY }); // Correct: Restored argument
  }

  async handleToolCall(toolCall: any): Promise<any> {
    const { name } = toolCall.function;
    const [namespace] = name.split('.');

    try {
      switch (namespace) {
        case 'searchDrugLabel':
        case 'searchDeviceLabel':
        case 'searchNDC':
        case 'searchRecalls':
          return this.fdaHandler.handleToolCall(toolCall);

        case 'searchHealthcareFacilities':
        case 'calculateDistances':
          return this.mapsHandler.handleToolCall(toolCall);

        case 'searchProviders':
        case 'searchFacilities':
          return this.npiHandler.handleToolCall(toolCall);

        case 'searchPubMed':
        case 'getCitation':
        case 'getFullTextBioC': // Add new tool case
          return this.pubmedHandler.handleToolCall(toolCall);

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      console.error(`Error executing tool ${name}:`, error);
      throw error;
    }
  }

  getToolDefinitions() {
    return {
      ...fdaToolDefinitions,
      ...mapsToolDefinitions,
      ...npiToolDefinitions,
      // Include individual PubMed tools instead of spreading the old object
      articleSearch: articleSearchTool,
      citationRetrieval: citationRetrievalTool,
      fullTextRetrieval: fullTextRetrievalTool
    };
  }
}

// Export a function to create the tool handler
export function createToolHandler(config: ToolHandlerConfig): ToolHandler {
  return new ToolHandler(config);
}
