import { fileUploadService, type FileUploadResponse } from './fileUploadService';

interface AssistantResponse {
  response: string;
  threadId: string;
  requiredActions?: any[];
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'; // Next.js server port

class RonAIService {
  private currentThreadId: string | null = null;

  /**
   * Sends a message to Ron AI and gets a response
   */
  async initializeChat(): Promise<string> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/assistants/threads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to initialize chat');
      }

      const data = await response.json();
      this.currentThreadId = data.threadId;
      return data.threadId;
    } catch (error) {
      console.error('Error initializing chat:', {
        error,
        details: error instanceof Error ? error.message : 'Unknown error'
      });
      
      throw new Error(
        'Failed to initialize chat. Please ensure your OpenAI API key and Assistant ID are properly configured.'
      );
    }
  }

  async sendMessage(message: string, threadId?: string): Promise<AssistantResponse> {
    try {
      // Initialize chat if no thread exists
      if (!threadId && !this.currentThreadId) {
        await this.initializeChat();
      }

      const currentThreadId = threadId || this.currentThreadId;
      if (!currentThreadId) {
        throw new Error('No thread ID available');
      }

      const response = await fetch(`${BACKEND_URL}/api/assistants/threads/${currentThreadId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ content: message }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to communicate with Ron AI');
      }

      const data = await response.json();
      
      // Handle error responses
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Handle required actions
      if (data.requiredActions) {
        return {
          response: data.content,
          threadId: data.threadId,
          requiredActions: data.requiredActions
        };
      }
      
      // Validate response structure
      if (!data || (!data.response && !data.content)) {
        throw new Error('Invalid response format from server');
      }

      return {
        response: data.content || data.response,
        threadId: data.threadId
      };
    } catch (error) {
      console.error('Error sending message to Ron:', {
        error,
        threadId: this.currentThreadId,
        messageContent: message
      });
      
      // Format error message for better debugging
      const errorMessage = error instanceof Error
        ? error.message
        : 'Unknown error occurred while sending message';
      
      throw new Error(`Failed to communicate with Ron AI: ${errorMessage}`);
    }
  }

  /**
   * Uploads a file and creates a dedicated thread for it
   */
  async uploadFile(file: File): Promise<FileUploadResponse> {
    try {
      // First upload the file
      const uploadResponse = await fileUploadService.uploadFile(file);
      
      // Create a new thread for this file
      const threadId = await this.initializeChat();
      
      // Create a message in the thread about the file
      await this.sendMessage(`I've uploaded a file named ${file.name}. Please analyze it and provide insights.`, threadId);
      
      return {
        ...uploadResponse,
        threadId
      };
    } catch (error) {
      console.error('Error in file upload process:', error);
      throw error;
    }
  }

  /**
   * Formats a message with timestamp
   */
  formatMessage(sender: 'You' | 'Ron AI', message: string) {
    return {
      sender,
      message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }

  /**
   * Switches to a different thread
   */
  switchThread(threadId: string | null) {
    this.currentThreadId = threadId;
  }

  /**
   * Gets the current thread ID
   */
  getCurrentThreadId(): string | null {
    return this.currentThreadId;
  }

  /**
   * Retrieves content of an uploaded file for assistant purposes.
   */
  async getFileContent(fileId: string): Promise<string> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/assistant/files/${fileId}/content`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to retrieve file content');
      }
      return await response.text();
    } catch (error) {
      console.error('Error retrieving file content:', error);
      throw error;
    }
  }

  /**
   * Sends a message with file reference to Ron AI
   */
  async sendMessageWithFile(message: string, fileId: string, threadId?: string): Promise<AssistantResponse> {
    try {
      // Initialize chat if no thread exists
      const currentThreadId = threadId || await this.initializeChat();
      
      // Send message with file reference
      const response = await fetch(`${BACKEND_URL}/api/assistant/threads/${currentThreadId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          content: message,
          file_ids: [fileId]
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send message with file');
      }

      const data = await response.json();
      return {
        response: data.response,
        threadId: currentThreadId
      };
    } catch (error) {
      console.error('Error sending message with file:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const ronAIService = new RonAIService();

// Export helper function
export const formatMessage = ronAIService.formatMessage;
