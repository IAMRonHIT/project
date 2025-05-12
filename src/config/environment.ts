// Add import meta types for Vite
interface ImportMetaEnv {
  VITE_GEMINI_API_KEY: string;
  VITE_GEMINI_API_BASE_URL: string;
  VITE_FDA_API_KEY: string;
  VITE_GOOGLE_MAPS_API_KEY: string;
  VITE_PUBMED_API_KEY: string;
  VITE_PERPLEXITY_API_KEY: string; // Added Perplexity API Key
  [key: string]: string;
}

interface ImportMeta {
  env: ImportMetaEnv;
}

interface Environment {
  GEMINI_API_KEY: string;
  GEMINI_API_BASE_URL: string;
  FDA_API_KEY: string;
  GOOGLE_MAPS_API_KEY: string;
  PUBMED_API_KEY: string;
  PERPLEXITY_API_KEY: string; // Added Perplexity API Key
}

function validateEnvironment(): Environment {
  const requiredVars = [
    'GEMINI_API_KEY',
    'FDA_API_KEY',
    'GOOGLE_MAPS_API_KEY',
    'PUBMED_API_KEY',
    'PERPLEXITY_API_KEY' // Added Perplexity API Key
  ];

  const missingVars = requiredVars.filter(
    varName => !import.meta.env[`VITE_${varName}`]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }

  return {
    GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY!,
    GEMINI_API_BASE_URL: import.meta.env.VITE_GEMINI_API_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta',
    FDA_API_KEY: import.meta.env.VITE_FDA_API_KEY!,
    GOOGLE_MAPS_API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY!,
    PUBMED_API_KEY: import.meta.env.VITE_PUBMED_API_KEY!,
    PERPLEXITY_API_KEY: import.meta.env.VITE_PERPLEXITY_API_KEY! // Added Perplexity API Key
  };
}

export const env = validateEnvironment();
