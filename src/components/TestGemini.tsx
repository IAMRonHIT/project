import React, { useState } from 'react';

const TestGemini = () => {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testGeminiApi = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/test-gemini');
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      setResult(data.response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Error testing Gemini API:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gemini Pro 2.5 Experimental Test</h1>
      <button 
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded disabled:opacity-50"
        onClick={testGeminiApi}
        disabled={loading}
      >
        {loading ? 'Testing...' : 'Test Gemini Pro 2.5 Exp'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">API Response:</h2>
          <div className="bg-gray-100 p-4 rounded overflow-auto max-h-[80vh]">
            <pre className="whitespace-pre-wrap">{result}</pre>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Preview:</h3>
            <div 
              className="border border-gray-300 rounded p-4 mt-2 bg-white"
              dangerouslySetInnerHTML={{ __html: result }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TestGemini; 