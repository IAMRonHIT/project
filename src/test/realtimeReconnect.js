// Simple test script for the RealtimeAudioService reconnection
// To use: Import this in a browser console when testing the application

const testRealtimeReconnection = async () => {
  try {
    console.log('===== TESTING REALTIME RECONNECTION =====');
    
    // Get the realtimeAudioService instance
    const realtimeAudioService = window.realtimeAudioService;
    
    if (!realtimeAudioService) {
      console.error('Could not access realtimeAudioService. Is it exposed on the window object?');
      return;
    }
    
    // Register a state change listener to monitor transitions
    realtimeAudioService.addStateChangeListener((state) => {
      console.log(`[TEST] RealtimeAudio state changed: ${state}`);
    });
    
    // Check current state
    console.log(`[TEST] Current connection state: ${realtimeAudioService.connectionState}`);
    
    // If not connected, connect first
    if (realtimeAudioService.connectionState === 'disconnected') {
      console.log('[TEST] Starting initial session');
      await realtimeAudioService.startSession();
      console.log('[TEST] Session started');
    }
    
    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update configuration with different parameters
    console.log('[TEST] Changing configuration to trigger reconnection');
    realtimeAudioService.config({
      voice: 'echo', // Change to a different voice to test
      model: 'gpt-4o-realtime-preview-2024-12-17'
    });
    
    // The service should automatically reconnect with new settings
    console.log('[TEST] Reconnection should be triggered automatically');
    
    return 'Test completed. Please check console logs for state transitions.';
  } catch (error) {
    console.error('[TEST] Error during reconnection test:', error);
    return 'Test failed with an error. See console for details.';
  }
};

// Expose the test function for use in browser console
window.testRealtimeReconnection = testRealtimeReconnection;

console.log('Realtime reconnection test loaded! Run testRealtimeReconnection() in the console to test.');
