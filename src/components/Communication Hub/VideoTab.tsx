import React, { useState, useRef, useEffect } from 'react';
import { Video, Mic, MicOff, VideoOff, PhoneOff, User, RefreshCw } from 'lucide-react';

const VideoTab: React.FC = () => {
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startVideo = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      const videoTracks = stream.getVideoTracks();
      if (videoTracks.length === 0) {
        setError('No video track available');
        setIsVideoOff(true);
        return;
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setVideoStream(stream);
      setIsVideoOff(false);
    } catch (err) {
      console.error('Camera error:', err);
      setError(err instanceof Error ? err.message : 'Failed to access camera');
      setIsVideoOff(true);
    } finally {
      setIsLoading(false);
    }
  };

  const stopVideo = () => {
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setVideoStream(null);
    }
  };

  useEffect(() => {
    startVideo();
    return () => stopVideo();
  }, []);

  const toggleMute = () => {
    if (videoStream) {
      videoStream.getAudioTracks().forEach(track => {
        track.enabled = isMuted;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (videoStream) {
      videoStream.getVideoTracks().forEach(track => {
        track.enabled = isVideoOff;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  return (
    <div className="flex flex-col min-h-0 bg-gray-900">
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="relative h-full">
          <div className="absolute inset-0 rounded-lg overflow-hidden flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-contain ${isVideoOff || !videoStream ? 'hidden' : 'block'}`}
            />
            {(isVideoOff || !videoStream) && (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800">
                <User size={64} className="text-gray-600 mb-4" />
                {error && (
                  <div className="text-ron-coral-400 text-center mb-4 px-4">
                    {error}
                  </div>
                )}
                {isLoading ? (
                  <RefreshCw className="animate-spin text-ron-teal-400" size={24} />
                ) : error && (
                  <button
                    onClick={startVideo}
                    className="flex flex-col items-center gap-1 p-2 rounded-lg bg-ron-lime-400/20 hover:shadow-glow-lime"
                  >
                    <RefreshCw size={20} />
                    <span className="text-xs text-white">Retry Camera</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 border-t border-ron-teal-400/20">
        <div className="p-4">
          <div className="flex justify-center gap-4">
            <button
              onClick={toggleMute}
              disabled={!videoStream}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg
                ${!videoStream ? 'opacity-50 cursor-not-allowed' : ''}
                ${!isMuted ? 'bg-ron-teal-400' : 'bg-ron-teal-400/20'}
                hover:shadow-glow-teal transition-all duration-200`}
            >
              {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
              <span className="text-xs text-white">{isMuted ? 'Unmute' : 'Mute'}</span>
            </button>

            <button
              onClick={toggleVideo}
              disabled={!videoStream}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg
                ${!videoStream ? 'opacity-50 cursor-not-allowed' : ''}
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
