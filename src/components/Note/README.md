# Note Component

The Note component is a versatile tool that allows users to create, edit, and manage notes throughout the application. It provides features for extracting highlighted text, capturing screenshots, and attaching notes to various entities like Tickets, Care Journeys, Auth, Appeals, Claims, Care Plans, and Tasks.

## Features

### Text Highlighting
- Highlight text anywhere in the application
- Automatically extract highlighted text to notes
- Track the source of highlighted text

### Screenshots
- Capture full-page screenshots
- Capture specific areas of the screen
- Upload existing screenshots
- Add captions to screenshots

### Speech-to-Text
- Convert speech to text using the Web Speech API
- Add transcribed text to notes

### Macros
- Create and manage text macros
- Apply macros to quickly add common text patterns
- Edit and delete macros

### Entity Attachment
- Attach notes to various entities:
  - Tickets
  - Care Journeys
  - Auth
  - Appeals
  - Claims
  - Care Plans
  - Tasks
- Search for entities to attach to

### Keyboard Shortcuts
- Press 'n' to open/close the note component
- Escape key to close the note

## Components

### NoteComponent
The main component that provides the note UI and functionality.

### NoteIntegration
A wrapper component that makes it easy to integrate the note functionality into any part of the application.

### TextHighlighter
Handles text highlighting and extraction.

### ScreenshotCapture
Manages screenshot capture and upload functionality.

### NoteMacros
Provides UI for creating and managing macros.

### SpeechToText
Handles speech-to-text conversion.

### NoteAttachment
Manages attaching notes to various entities.

## Usage

### Basic Integration

```tsx
import { NoteIntegration } from '../components/Note';

function MyComponent() {
  return (
    <div className="relative">
      {/* Your component content */}
      
      <NoteIntegration 
        entityType="Task"
        buttonPosition="top-right"
        initialContent="Initial note content"
      />
    </div>
  );
}
```

### Advanced Integration

```tsx
import { NoteProvider, NoteComponent } from '../components/Note';

function MyComponent() {
  const handleSave = (content, highlights, screenshots, attachment) => {
    // Custom save logic
    console.log('Saving note:', { content, highlights, screenshots, attachment });
  };

  return (
    <NoteProvider>
      <NoteComponent 
        initialContent="Initial note content"
        onSave={handleSave}
        onClose={() => console.log('Note closed')}
      />
    </NoteProvider>
  );
}
```

## Props

### NoteIntegration Props

| Prop | Type | Description |
|------|------|-------------|
| entityType | EntityType | Type of entity to attach to |
| entityId | string | ID of the entity |
| entityName | string | Name of the entity |
| initialContent | string | Initial content for the note |
| onSave | function | Callback when note is saved |
| className | string | Additional CSS classes |
| buttonClassName | string | CSS classes for the button |
| buttonPosition | string | Position of the button (top-right, bottom-right, top-left, bottom-left, inline) |
| autoOpen | boolean | Whether to open the note automatically |
| triggerKey | string | Key to press to open the note |

### NoteComponent Props

| Prop | Type | Description |
|------|------|-------------|
| initialContent | string | Initial content for the note |
| onSave | function | Callback when note is saved |
| onClose | function | Callback when note is closed |
| className | string | Additional CSS classes |

## Demo

A demo page is available at `/note-demo` that showcases the Note component's features and integration options.
