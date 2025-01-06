import React, { useState, useRef, useEffect } from 'react';
import { Video, Mic, MicOff, VideoOff, PhoneOff, User, RefreshCw } from 'lucide-react';

const VideoTab: React.FC = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mounted = useRef(false);

  const startVideo = async () => {
    if (!mounted.current) return;
    setIsLoading(true);
    setError(null);

    // Stop any existing stream first
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: true
      });

      if (!mounted.current) {
        mediaStream.getTracks().forEach(track => track.stop());
        return;
      }

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        try {
          await videoRef.current.play();
        } catch (playError) {
          console.error('Error playing video:', playError);
          throw new Error('Failed to start video playback');
        }
      }

      setStream(mediaStream);
      setIsVideoOff(false);
      setIsMuted(false);
    } catch (err) {
      console.error('Camera error:', err);
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setError('Camera access denied. Please allow camera access in your browser settings.');
        } else if (err.name === 'NotFoundError') {
          setError('No camera found. Please connect a camera and try again.');
        } else if (err.name === 'NotReadableError') {
          setError('Camera is in use by another application. Please close other apps using the camera.');
        } else {
          setError(err.message || 'Failed to access camera. Please check permissions.');
        }
      } else {
        setError('Failed to access camera. Please check permissions.');
      }
    } finally {
      if (mounted.current) {
        setIsLoading(false);
      }
    }
  };

  const stopVideo = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStream(null);
  };

  useEffect(() => {
    mounted.current = true;
    
    // Start video with a small delay to handle React 18 strict mode
    const timer = setTimeout(() => {
      if (mounted.current) {
        startVideo();
      }
    }, 100);

    return () => {
      mounted.current = false;
      clearTimeout(timer);
      stopVideo();
    };
  }, []);

  // Ensure video element is properly updated when stream changes
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const toggleMute = () => {
    if (stream) {
      stream.getAudioTracks().forEach(track => {
        track.enabled = isMuted;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach(track => {
        track.enabled = isVideoOff;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black backdrop-blur-xl rounded-xl p-4 shadow-soft hover:shadow-glow transition-all duration-300 relative overflow-hidden border border-white/10">
      <div className="flex-1 relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover bg-black ${isVideoOff ? 'hidden' : 'block'}`}
          onLoadedMetadata={() => console.log('Video metadata loaded')}
          onPlay={() => console.log('Video started playing')}
        />
        {(!stream || isVideoOff) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black">
            {isLoading ? (
              <RefreshCw className="animate-spin text-ron-teal-400" size={24} />
            ) : (
              <>
                <User size={64} className="text-gray-600 mb-4" />
                {error && (
                  <div className="text-ron-coral-400 text-center px-4">
                    {error}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
      <div className="flex-shrink-0 border-t border-ron-teal-400/20 mt-4">
        <div className="p-4">
          <div className="flex justify-center gap-4">
            <button
              onClick={toggleMute}
              disabled={!stream}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg
                ${!stream ? 'opacity-50 cursor-not-allowed' : ''}
                ${!isMuted ? 'bg-ron-teal-400' : 'bg-ron-teal-400/20'}
                hover:shadow-glow-teal transition-all duration-200`}
            >
              {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
              <span className="text-xs text-white">{isMuted ? 'Unmute' : 'Mute'}</span>
            </button>

            <button
              onClick={toggleVideo}
              disabled={!stream}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg
                ${!stream ? 'opacity-50 cursor-not-allowed' : ''}
                ${!isVideoOff ? 'bg-ron-teal-400' : 'bg-ron-teal-400/20'}
                hover:shadow-glow-teal transition-all duration-200`}
            >
              {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
              <span className="text-xs text-white">{isVideoOff ? 'Start Video' : 'Stop Video'}</span>
            </button>

            <button
              onClick={stopVideo}
              className="flex flex-col items-center gap-1 p-2 rounded-lg
                bg-ron-coral-400 hover:shadow-glow-coral transition-all duration-200"
            >
              <PhoneOff size={20} />
              <span className="text-xs text-white">Leave</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoTab;
