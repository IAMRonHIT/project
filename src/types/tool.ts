import { 
  Schema, 
  SchemaType,
  SimpleStringSchema,
  EnumStringSchema,
  NumberSchema,
  BooleanSchema,
  ArraySchema,
  ObjectSchema
} from '@google/generative-ai';

export type { Schema };

export interface ToolParameter extends ObjectSchema {
  type: SchemaType.OBJECT;
  properties: { [key: string]: Schema };
  required?: string[];
}

export interface ToolFunction {
  name: string;
  description: string;
  parameters: ToolParameter;
}

export interface ToolDefinition {
  type: 'function';
  function: ToolFunction;
}

export interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

// Helper function to convert JSON Schema type to Gemini Schema type
export function toSchemaType(jsonType: string): SchemaType {
  switch (jsonType.toLowerCase()) {
    case 'string':
      return SchemaType.STRING;
    case 'number':
    case 'integer':
      return SchemaType.NUMBER;
    case 'boolean':
      return SchemaType.BOOLEAN;
    case 'array':
      return SchemaType.ARRAY;
    case 'object':
      return SchemaType.OBJECT;
    default:
      return SchemaType.STRING;
  }
}

// Helper function to create a string schema
function createStringSchema(description?: string, enumValues?: string[]): Schema {
  if (enumValues) {
    return {
      type: SchemaType.STRING,
      description,
      enum: enumValues,
      format: 'enum'
    } as EnumStringSchema;
  }
  return {
    type: SchemaType.STRING,
    description,
    format: undefined
  } as SimpleStringSchema;
}

// Helper function to create a number schema
function createNumberSchema(description?: string): Schema {
  return {
    type: SchemaType.NUMBER,
    description,
    format: 'float'
  } as NumberSchema;
}

// Helper function to create a boolean schema
function createBooleanSchema(description?: string): Schema {
  return {
    type: SchemaType.BOOLEAN,
    description
  } as BooleanSchema;
}

// Helper function to create an array schema
function createArraySchema(items: Schema, description?: string): Schema {
  return {
    type: SchemaType.ARRAY,
    description,
    items
  } as ArraySchema;
}

// Helper function to create an object schema
function createObjectSchema(
  properties: { [key: string]: Schema },
  description?: string,
  required?: string[]
): Schema {
  return {
    type: SchemaType.OBJECT,
    description,
    properties,
    required
  } as ObjectSchema;
}

// Helper function to convert JSON Schema to Gemini Schema
export function toGeminiSchema(jsonSchema: any): Schema {
  const type = toSchemaType(jsonSchema.type);
  
  switch (type) {
    case SchemaType.STRING:
      return createStringSchema(jsonSchema.description, jsonSchema.enum);
      
    case SchemaType.NUMBER:
      return createNumberSchema(jsonSchema.description);
      
    case SchemaType.BOOLEAN:
      return createBooleanSchema(jsonSchema.description);
      
    case SchemaType.ARRAY:
      return createArraySchema(
        toGeminiSchema(jsonSchema.items),
        jsonSchema.description
      );
      
    case SchemaType.OBJECT:
      return createObjectSchema(
        Object.entries(jsonSchema.properties || {}).reduce((acc, [key, value]) => {
          acc[key] = toGeminiSchema(value);
          return acc;
        }, {} as { [key: string]: Schema }),
        jsonSchema.description,
        jsonSchema.required
      );
      
    default:
      return createStringSchema(jsonSchema.description);
  }
}
