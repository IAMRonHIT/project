# Deep Thinking Mode

This document details the implementation of Deep Thinking mode in the Ron AI platform, which uses the `gemini-2.0-flash-thinking-exp-01-21` model with enhanced code execution capabilities.

## Overview

Deep Thinking mode is designed for complex problem-solving tasks that require:
- Advanced reasoning
- Code execution and analysis
- Multi-step problem decomposition
- Detailed explanations

## Model Configuration

```typescript
export const deepThinkingConfig = {
  model: 'gemini-2.0-flash-thinking-exp-01-21',
  settings: {
    temperature: 0.9,
    topP: 1,
    maxOutputTokens: 4096,
    features: {
      codeExecution: true,
      streaming: true,
      functionCalling: false
    }
  }
};
```

## Code Execution Capabilities

### Supported Languages
- Python
- JavaScript/TypeScript
- R
- SQL
- Shell scripts

### Execution Environment

```typescript
interface CodeExecutionEnvironment {
  runtime: {
    python: '3.9',
    node: '18.x',
    r: '4.1',
    sqlite: '3.x'
  };
  memoryLimit: '4GB';
  timeoutSeconds: 30;
  networkAccess: false;
  fileSystemAccess: 'readonly';
}
```

### Security Measures
1. Sandboxed Environment
   - Isolated runtime
   - No network access
   - Read-only file system
   - Memory limits
   - Execution timeouts

2. Code Analysis
   - Static analysis for dangerous operations
   - Resource usage monitoring
   - Input validation
   - Output sanitization

## Implementation

### Code Execution Service

```typescript
export class CodeExecutionService {
  private sandbox: Sandbox;

  constructor() {
    this.sandbox = new Sandbox({
      memoryLimit: '4GB',
      timeout: 30000,
      network: false
    });
  }

  async executeCode(params: {
    code: string;
    language: string;
    context?: string;
  }): Promise<ExecutionResult> {
    // Validate code
    await this.validateCode(params.code, params.language);

    // Set up environment
    const env = await this.prepareEnvironment(params.language);

    try {
      // Execute code
      const result = await this.sandbox.execute({
        code: params.code,
        language: params.language,
        env
      });

      // Process result
      return this.processExecutionResult(result);
    } catch (error) {
      throw new CodeExecutionError(error.message);
    }
  }

  private async validateCode(code: string, language: string): Promise<void> {
    // Static analysis
    const analysis = await this.analyzeCode(code, language);
    
    if (analysis.hasDangerousOperations) {
      throw new SecurityError('Code contains potentially dangerous operations');
    }

    if (analysis.estimatedMemory > this.sandbox.memoryLimit) {
      throw new ResourceError('Code may exceed memory limits');
    }
  }

  private async prepareEnvironment(language: string): Promise<ExecutionEnvironment> {
    // Set up language-specific environment
    switch (language) {
      case 'python':
        return {
          runtime: 'python:3.9',
          packages: ['numpy', 'pandas', 'scikit-learn'],
          env: { PYTHONPATH: '/workspace/lib' }
        };
      case 'typescript':
        return {
          runtime: 'node:18',
          packages: ['typescript', '@types/node'],
          env: { NODE_ENV: 'development' }
        };
      // Add other language configurations
      default:
        throw new Error(`Unsupported language: ${language}`);
    }
  }

  private processExecutionResult(result: RawExecutionResult): ExecutionResult {
    return {
      output: this.sanitizeOutput(result.output),
      error: result.error ? this.formatError(result.error) : null,
      metrics: {
        executionTime: result.metrics.duration,
        memoryUsage: result.metrics.maxMemory,
        cpuUsage: result.metrics.cpuPercentage
      }
    };
  }
}
```

### Integration with Gemini

```typescript
export class DeepThinkingService {
  private codeExecution: CodeExecutionService;
  private streamService: GeminiStreamService;

  constructor(config: DeepThinkingConfig) {
    this.codeExecution = new CodeExecutionService();
    this.streamService = new GeminiStreamService(config);
  }

  async processQuery(query: string): Promise<StreamingResponse> {
    return this.streamService.createStream(
      'deep-thinking',
      query,
      {
        onToken: this.handleToken.bind(this),
        onCodeBlock: this.handleCodeBlock.bind(this),
        onError: this.handleError.bind(this),
        onComplete: this.handleComplete.bind(this)
      }
    );
  }

  private async handleCodeBlock(code: {
    content: string;
    language: string;
  }): Promise<void> {
    try {
      const result = await this.codeExecution.executeCode({
        code: code.content,
        language: code.language
      });

      // Stream execution results back
      await this.streamService.sendExecutionResult(result);
    } catch (error) {
      await this.streamService.sendExecutionError(error);
    }
  }
}
```

## Usage Example

```typescript
const deepThinking = new DeepThinkingService({
  apiKey: process.env.GEMINI_API_KEY,
  model: 'gemini-2.0-flash-thinking-exp-01-21'
});

// Example: Complex data analysis
const response = await deepThinking.processQuery(`
  Analyze this dataset and create visualizations:
  
  Year, Revenue, Growth
  2020, 1000000, 5.2
  2021, 1200000, 20.0
  2022, 1500000, 25.0
  2023, 1800000, 20.0
`);

// The model will:
// 1. Parse the data
// 2. Execute Python code for analysis
// 3. Generate visualizations
// 4. Provide insights
```

## Error Handling

1. Code Execution Errors
```typescript
class CodeExecutionError extends Error {
  constructor(
    message: string,
    public code: string,
    public language: string,
    public line?: number
  ) {
    super(message);
    this.name = 'CodeExecutionError';
  }
}
```

2. Resource Limits
```typescript
class ResourceLimitError extends Error {
  constructor(
    message: string,
    public resource: 'memory' | 'cpu' | 'time',
    public limit: number,
    public actual: number
  ) {
    super(message);
    this.name = 'ResourceLimitError';
  }
}
```

## Best Practices

1. Code Execution
   - Validate input code
   - Set appropriate timeouts
   - Monitor resource usage
   - Handle errors gracefully

2. Result Processing
   - Format output clearly
   - Include execution metrics
   - Provide error context
   - Clean up resources

3. Security
   - Sandbox all execution
   - Validate inputs
   - Monitor for abuse
   - Log all operations

4. Performance
   - Cache common operations
   - Reuse environments
   - Batch similar requests
   - Clean up regularly
