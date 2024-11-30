import React, { useState, useRef, useEffect } from 'react';
import { Video, Mic, MicOff, VideoOff, PhoneOff, User, Users, ScreenShare, Layout } from 'lucide-react';
import { Badge } from '../Badge';
import { useTheme } from '../../hooks/useTheme';

interface Participant {
  name: string;
  role: string;
  isActive: boolean;
  isSpeaking?: boolean;
  hasVideo?: boolean;
  hasMic?: boolean;
}

const VideoTab: React.FC = () => {
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [participants] = useState<Participant[]>([
    {
      name: 'Dr. Emily Smith',
      role: 'Orthopedic Surgeon',
      isActive: true,
      isSpeaking: true,
      hasVideo: true,
      hasMic: true
    },
    {
      name: 'Sarah Johnson',
      role: 'Case Manager',
      isActive: true,
      hasVideo: false,
      hasMic: true
    },
    {
      name: 'Mark Davis',
      role: 'Insurance Rep',
      isActive: true,
      hasVideo: true,
      hasMic: false
    }
  ]);

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setVideoStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setIsVideoOff(true);
    }
  };

  const stopVideo = () => {
    if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop());
      setVideoStream(null);
    }
  };

  useEffect(() => {
    startVideo();
    return () => {
      stopVideo();
    };
  }, []);

  const ActionButton: React.FC<{
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
    variant?: 'default' | 'danger' | 'warning';
    active?: boolean;
  }> = ({ icon, label, onClick, variant = 'default', active = false }) => {
    const buttonClass = `
      flex flex-col items-center gap-1 p-2 rounded-lg
      ${variant === 'danger' 
        ? 'bg-ron-coral-400 hover:shadow-glow-coral' 
        : variant === 'warning'
          ? 'bg-ron-lime-400/20 hover:shadow-glow-lime'
          : active
            ? 'bg-ron-teal-400 hover:shadow-glow-teal'
            : 'bg-ron-teal-400/20 hover:shadow-glow-teal'
      }
      transition-all duration-200
      backdrop-blur-sm
      border border-transparent
      hover:border-ron-teal-400/20
    `;

    return (
      <button onClick={onClick} className={buttonClass}>
        {icon}
        <span className="text-xs text-white">{label}</span>
      </button>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className={`
        flex-1 relative
        ${isDark ? 'bg-gray-900/50' : 'bg-white/80'}
        backdrop-blur-xl
      `}>
        {/* Main Video Area */}
        <div className="absolute inset-0 rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className={`
              w-full h-full object-cover
              ${isVideoOff ? 'hidden' : 'block'}
            `}
          />
          {isVideoOff && (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <User size={64} className="text-gray-600" />
            </div>
          )}
        </div>

        {/* Participants List */}
        <div className="absolute top-4 right-4 space-y-2">
          {participants.map((participant, index) => (
            <div
              key={index}
              className={`
                flex items-center gap-2 p-2 rounded-lg
                ${isDark ? 'bg-gray-800/80' : 'bg-white/80'}
                backdrop-blur-sm
                border border-ron-teal-400/20
                ${participant.isSpeaking ? 'shadow-glow-teal' : ''}
              `}
            >
              <div className={`
                w-8 h-8 rounded-full
                bg-ron-teal-400/10
                border border-ron-teal-400/20
                flex items-center justify-center
                ${participant.isSpeaking ? 'animate-pulse' : ''}
              `}>
                <User size={16} className="text-ron-teal-400" />
              </div>
              <div>
                <p className="text-sm text-white">{participant.name}</p>
                <p className="text-xs text-gray-400">{participant.role}</p>
              </div>
              <div className="flex gap-1">
                {!participant.hasVideo && <VideoOff size={14} className="text-gray-400" />}
                {!participant.hasMic && <MicOff size={14} className="text-gray-400" />}
              </div>
            </div>
          ))}
        </div>

        {/* Meeting Info */}
        <div className="absolute top-4 left-4">
          <Badge variant="success" glow size="sm">
            <Users size={14} className="mr-1" />
            {participants.length + 1} Participants
          </Badge>
        </div>
      </div>

      {/* Controls */}
      <div className={`
        p-4 border-t border-ron-teal-400/20
        ${isDark ? 'bg-gray-900/50' : 'bg-white/80'}
        backdrop-blur-xl
      `}>
        <div className="flex justify-center gap-4">
          <ActionButton
            icon={isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            label={isMuted ? 'Unmute' : 'Mute'}
            onClick={() => setIsMuted(!isMuted)}
            active={!isMuted}
          />
          <ActionButton
            icon={isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
            label={isVideoOff ? 'Start Video' : 'Stop Video'}
            onClick={() => setIsVideoOff(!isVideoOff)}
            active={!isVideoOff}
          />
          <ActionButton
            icon={<ScreenShare size={20} />}
            label="Share Screen"
          />
          <ActionButton
            icon={<Layout size={20} />}
            label="Layout"
          />
          <ActionButton
            icon={<PhoneOff size={20} />}
            label="Leave"
            variant="danger"
            onClick={stopVideo}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoTab;
