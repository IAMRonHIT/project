/**
 * Utility functions for asynchronous operations
 */

/**
 * Creates a promise that resolves after the specified number of milliseconds
 * @param ms Number of milliseconds to sleep
 * @returns A promise that resolves after the specified time
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Creates a timeout promise that rejects after the specified time
 * @param ms Timeout in milliseconds
 * @param message Optional error message
 * @returns A promise that rejects after the specified time
 */
export const timeout = <T>(
  promise: Promise<T>,
  ms: number,
  message = 'Operation timed out'
): Promise<T> => {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error(message));
    }, ms);
  });

  return Promise.race([promise, timeoutPromise]);
};

/**
 * Creates a retry wrapper for async functions
 * @param fn Async function to retry
 * @param maxAttempts Maximum number of attempts
 * @param delay Initial delay between retries (will be increased with exponential backoff)
 * @param shouldRetry Function to determine if a retry should be attempted
 */
export const withRetry = async <T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  delay = 1000,
  shouldRetry: (error: unknown) => boolean = () => true
): Promise<T> => {
  let lastError: unknown;
  let attempt = 0;

  while (attempt < maxAttempts) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      attempt++;

      if (attempt >= maxAttempts || !shouldRetry(error)) {
        throw error;
      }

      // Exponential backoff with jitter
      const jitter = Math.random() * 200 - 100; // ±100ms jitter
      const backoff = Math.min(delay * Math.pow(2, attempt - 1) + jitter, 30000); // Cap at 30s
      
      await sleep(backoff);
    }
  }

  // This should never be reached due to the throw in the catch block
  throw lastError;
};
