
import React, { useState, useEffect, useRef } from 'react';
import { useNote } from '../contexts/NoteContext';

// Add type declarations for the Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface SpeechToTextProps {
  onTranscript?: (text: string) => void;
}

const SpeechToText: React.FC<SpeechToTextProps> = ({ onTranscript }) => {
  const { dispatch } = useNote();
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  // Check if browser supports speech recognition
  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }
    
    // Initialize speech recognition
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';
    
    // Set up event handlers
    recognitionRef.current.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      
      // Update transcript
      setTranscript(finalTranscript || interimTranscript);
    };
    
    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      if (event.error === 'not-allowed') {
        setIsSupported(false);
      }
      stopRecording();
    };
    
    recognitionRef.current.onend = () => {
      // Only stop recording if we didn't intend to keep recording
      if (isRecording) {
        startRecording();
      }
    };
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);
  
  // Start recording
  const startRecording = () => {
    if (!recognitionRef.current) return;
    
    try {
      recognitionRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting speech recognition:', error);
    }
  };
  
  // Stop recording
  const stopRecording = () => {
    if (!recognitionRef.current) return;
    
    try {
      recognitionRef.current.stop();
      setIsRecording(false);
      
      // If we have a transcript, call the callback
      if (transcript && onTranscript) {
        onTranscript(transcript);
      }
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
    }
  };
  
  // Toggle recording
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      setTranscript('');
      startRecording();
    }
  };
  
  // Add transcript to note
  const addTranscriptToNote = () => {
    if (!transcript) return;
    
    // Update note content - get current content first
    const currentContent = document.querySelector('.note-content')?.textContent || '';
    const newContent = currentContent + (currentContent ? '\n\n' : '') + transcript;
    
    dispatch({ 
      type: 'SET_CONTENT', 
      content: newContent
    });
    
    // Call the callback if provided
    if (onTranscript) {
      onTranscript(transcript);
    }
    
    // Reset transcript
    setTranscript('');
  };
  
  if (!isSupported) {
    return (
      <div className="text-sm text-indigo-300/80">
        Speech recognition is not supported in your browser.
      </div>
    );
  }
  
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <button
          onClick={toggleRecording}
          className={`p-2 rounded-full transition-all duration-200 ${
            isRecording 
              ? 'bg-red-900/30 text-red-400 border border-red-500/40 shadow-[0_0_5px_rgba(239,68,68,0.4)] animate-pulse' 
              : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white border border-gray-700/50'
          }`}
          aria-label={isRecording ? 'Stop recording' : 'Start recording'}
          title={isRecording ? 'Stop recording' : 'Start recording'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
            <line x1="12" y1="19" x2="12" y2="23"></line>
            <line x1="8" y1="23" x2="16" y2="23"></line>
          </svg>
        </button>
        <span className="text-sm font-medium text-indigo-300/80">
          {isRecording ? 'Recording...' : 'Click to record'}
        </span>
      </div>
      
      {transcript && (
        <div className="mt-2">
          <div className="p-3 bg-indigo-900/30 border border-indigo-500/30 rounded-md text-sm text-white shadow-[0_0_5px_rgba(79,70,229,0.2)]">
            {transcript}
          </div>
          <div className="flex justify-end mt-2">
            <button
              onClick={addTranscriptToNote}
              className="px-3 py-1 text-sm text-white bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-md hover:shadow-[0_0_15px_rgba(79,70,229,0.7)] hover:brightness-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-[0_0_10px_rgba(79,70,229,0.5)] border border-indigo-500/30"
            >
              Add to Note
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeechToText;
