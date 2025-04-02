# Implementation Examples

This directory contains practical examples demonstrating the integration and usage of Gemini models in both Default (Ron AI) and Deep Thinking modes.

## Directory Structure

```
examples/
├── default-mode/           # Ron AI mode examples
│   ├── fda/               # FDA API integration examples
│   ├── npi/               # NPI Registry integration examples
│   ├── maps/              # Google Maps integration examples
│   └── pubmed/            # PubMed integration examples
└── deep-thinking/         # Deep Thinking mode examples
    ├── code-execution/    # Code execution examples
    └── analysis/          # Complex analysis examples
```

## Default Mode Examples

### FDA Integration
- Drug label search
- Device information lookup
- NDC code validation
- Recall notifications

### NPI Registry
- Provider search
- Facility lookup
- Specialty filtering
- Location-based search

### Google Maps
- Healthcare facility search
- Distance calculations
- Route optimization
- Coverage analysis

### PubMed
- Research article search
- Citation retrieval
- Author lookup
- Topic analysis

## Deep Thinking Mode Examples

### Code Execution
- Data analysis
- Statistical computations
- Machine learning models
- Visualization generation

### Complex Analysis
- Multi-step problem solving
- Research synthesis
- Pattern recognition
- Trend analysis

## Running the Examples

1. Set up environment variables:
```bash
GEMINI_API_KEY=your_api_key
FDA_API_KEY=your_fda_key
GOOGLE_MAPS_API_KEY=your_maps_key
PUBMED_API_KEY=your_pubmed_key
```

2. Install dependencies:
```bash
npm install
```

3. Run specific examples:
```bash
npm run example:fda
npm run example:npi
npm run example:maps
npm run example:pubmed
npm run example:deep-thinking
```

## Example Files

Each example includes:
- Source code
- Sample data
- Expected output
- Error handling
