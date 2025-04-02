# Ron AI Gemini Integration

This documentation covers the integration of Gemini models into the Ron AI platform, with mode-specific model selection and capabilities.

## Mode-Specific Model Selection

### Default Mode (Ron AI)
- Uses dynamic model selection between:
  - `gemini-2.0-flash`: For complex queries and multimodal inputs
  - `gemini-2.0-flash-lite`: For simple text processing
  - `gemini-2.0-pro-exp-02-05`: For large context windows (>1M tokens)
- Enables tool function calling for:
  - FDA API Integration
  - NPI Registry
  - Google Maps
  - PubMed API
- Streaming enabled for real-time responses

### Deep Thinking Mode
- Uses `gemini-2.0-flash-thinking-exp-01-21`
- Code execution enabled
- Streaming enabled for real-time responses
- Function calling disabled

## Directory Structure
```
Gemini/
├── modes/              # Mode-specific documentation
│   ├── default-mode/   # Ron AI mode documentation
│   └── deep-thinking/  # Deep thinking mode documentation
├── streaming.md        # Streaming implementation details
└── examples/           # Implementation examples
```

## Implementation Overview

1. Model Selection:
   - Based on input complexity
   - Content type analysis
   - Token count estimation
   - Mode-specific requirements

2. Tool Integration:
   - FDA API (Drug Label, Device Label, NDC, Recall)
   - NPI Registry (Providers and Facilities)
   - Google Maps Integration
   - PubMed API Access

3. Streaming Support:
   - Real-time token delivery
   - Error handling
   - Connection management

4. Code Execution:
   - Enabled for Deep Thinking mode
   - Sandbox environment
   - Security constraints

## Getting Started

See the mode-specific documentation in the `modes/` directory for detailed implementation guides and examples.
