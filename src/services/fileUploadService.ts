/**
 * Service for handling file uploads to OpenAI using their Files API
 * Supports files up to 512MB as per OpenAI's documentation
 */

export interface UploadProgress {
  status: 'uploading' | 'complete' | 'error';
  totalBytes: number;
  uploadedBytes: number;
  error?: string;
}

export interface UploadOptions {
  onProgress?: (progress: UploadProgress) => void;
}

export interface FileUploadResponse {
  fileId: string;
  threadId: string;
  fileName: string;
  analysis?: string;  // Initial file analysis from the assistant
}

class FileUploadService {
  /**
   * Handles the file upload process with progress tracking
   */
  async uploadFile(file: File, options?: UploadOptions): Promise<FileUploadResponse> {
    try {
      // Initial progress update
      options?.onProgress?.({
        status: 'uploading',
        totalBytes: file.size,
        uploadedBytes: 0
      });

      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('purpose', 'assistants');

      console.log('Starting file upload...', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      });

      // Upload file
      const response = await fetch('/api/assistant/files', {
        method: 'POST',
        body: formData
      });

      console.log('Upload response status:', response.status);

      if (!response.ok) {
        const error = await response.json();
        console.error('Upload error response:', error);
        throw new Error(error.error || 'Failed to upload file');
      }

      const data: FileUploadResponse = await response.json();
      console.log('Upload success response:', data);

      // Final progress update
      options?.onProgress?.({
        status: 'complete',
        totalBytes: file.size,
        uploadedBytes: file.size
      });

      // Dispatch file uploaded event
      window.dispatchEvent(new CustomEvent('file-uploaded'));

      return data;
    } catch (error) {
      // Error progress update
      options?.onProgress?.({
        status: 'error',
        totalBytes: file.size,
        uploadedBytes: 0,
        error: error instanceof Error ? error.message : 'Upload failed'
      });
      throw error;
    }
  }

  /**
   * Validates a file before upload
   * @returns Error message if validation fails, null if validation passes
   */
  validateFile(file: File): string | null {
    const maxSize = 512 * 1024 * 1024; // 512MB
    // Define supported MIME types and their extensions
    type MimeTypeMap = {
      [key: string]: string[];
    };

    const allowedTypes: MimeTypeMap = {
      'text/plain': ['.txt', '.log'],
      'text/markdown': ['.md'],
      'text/x-python': ['.py'],
      'text/javascript': ['.js', '.jsx'],
      'text/typescript': ['.ts', '.tsx'],
      'text/csv': ['.csv'],
      'application/json': ['.json'],
      'application/pdf': ['.pdf'],
      'application/x-ipynb+json': ['.ipynb']
    };

    // Get file extension
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    
    // Check if the file extension is supported
    const isValidType = Object.entries(allowedTypes).some(([mimeType, extensions]) =>
      extensions.includes(ext || '') || file.type === mimeType
    );

    if (!isValidType) {
      const supportedExtensions = Array.from(new Set(
        Object.values(allowedTypes).flat()
      )).map(ext => ext.slice(1).toUpperCase()).join(', ');
      return `Invalid file type. Supported files: ${supportedExtensions}`;
    }

    if (file.size > maxSize) {
      return `File size (${this.formatFileSize(file.size)}) exceeds the limit of ${this.formatFileSize(maxSize)}.`;
    }

    return null;
  }

  /**
   * Formats file size in bytes to human readable format
   */
  private formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  }
}

// Export singleton instance
export const fileUploadService = new FileUploadService();
