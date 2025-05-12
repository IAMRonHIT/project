import React, { useState, useRef, useEffect } from 'react';
import { Video, Mic, MicOff, VideoOff, PhoneOff, User, RefreshCw, Users, MessageSquare, Share2, Layout, MoreVertical, Settings, Maximize, Minimize, Monitor, PieChart, Clock, Calendar, Check, Plus, X, ArrowLeft, Volume2, VolumeX, Coffee, Send } from 'lucide-react';

interface Participant {
  id: string;
  name: string;
  role: string;
  isVideoOn: boolean;
  isAudioOn: boolean;
  isScreenSharing: boolean;
  isSpeaking: boolean;
  avatarColor?: string;
}

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: number;
  isFromUser: boolean;
}

const VideoTab: React.FC = () => {
  // Video call state
  const [isActive, setIsActive] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [meetingCode, setMeetingCode] = useState('');
  const [meetingTitle, setMeetingTitle] = useState('Clinical Review Meeting');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<MediaStream[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [viewMode, setViewMode] = useState<'gallery' | 'speaker' | 'screenshare'>('gallery');
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');

  // Video elements refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const mounted = useRef(false);
  const callTimer = useRef<NodeJS.Timeout | null>(null);
  const [callDuration, setCallDuration] = useState(0);

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

  toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach(track => {
        track.enabled = isVideoOff;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  // Participants (simulated remote users)
  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: 'user1',
      name: 'Dr. Emily Smith',
      role: 'Orthopedic Surgeon',
      isVideoOn: true,
      isAudioOn: true,
      isScreenSharing: false,
      isSpeaking: false,
      avatarColor: 'amber'
    },
    {
      id: 'user2',
      name: 'Sarah Johnson',
      role: 'Case Manager',
      isVideoOn: true,
      isAudioOn: false,
      isScreenSharing: false,
      isSpeaking: false,
      avatarColor: 'indigo'
    },
    {
      id: 'user3',
      name: 'Mark Davis',
      role: 'Insurance Rep',
      isVideoOn: false,
      isAudioOn: true,
      isScreenSharing: false,
      isSpeaking: true,
      avatarColor: 'green'
    },
  ]);

  // Chat messages
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg1',
      sender: 'Dr. Emily Smith',
      message: 'I\'ve reviewed the MRI results. They confirm our initial diagnosis.',
      timestamp: Date.now() - 300000, // 5 minutes ago
      isFromUser: false
    },
    {
      id: 'msg2',
      sender: 'You',
      message: 'Thank you Dr. Smith. What are the next steps for the patient?',
      timestamp: Date.now() - 240000, // 4 minutes ago
      isFromUser: true
    },
    {
      id: 'msg3',
      sender: 'Mark Davis',
      message: 'I can confirm the procedure is covered under the patient\'s plan.',
      timestamp: Date.now() - 180000, // 3 minutes ago
      isFromUser: false
    },
  ]);

  // Upcoming and past meetings
  const upcomingMeetings = [
    { id: 'meeting1', title: 'Weekly Clinical Review', time: 'Today, 3:00 PM', duration: '60 min', participants: 5 },
    { id: 'meeting2', title: 'Peer-to-Peer with Dr. Johnson', time: 'Tomorrow, 10:00 AM', duration: '30 min', participants: 2 },
    { id: 'meeting3', title: 'Patient Care Planning', time: 'May 15, 2:30 PM', duration: '45 min', participants: 4 },
  ];

  const pastMeetings = [
    { id: 'past1', title: 'Authorization Review Committee', time: 'Yesterday, 1:00 PM', duration: '55 min', participants: 6, recorded: true },
    { id: 'past2', title: 'Case Discussion - Patient #12345', time: 'May 8, 11:30 AM', duration: '45 min', participants: 3, recorded: true },
    { id: 'past3', title: 'Provider Network Update', time: 'May 5, 9:00 AM', duration: '60 min', participants: 8, recorded: false },
  ];

  // Toggle full screen
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
    // In a real app, we would actually toggle fullscreen using the browser API
  };

  // Join a meeting
  const joinMeeting = () => {
    setIsJoining(true);
    // Simulate connecting to a meeting
    setTimeout(() => {
      setIsActive(true);
      setIsJoining(false);
      startCallTimer();

      // Simulate participants randomly turning on/off their video/audio
      const participantUpdateInterval = setInterval(() => {
        // Random activity simulation (video, audio, speaking status changes)
        setParticipants(prev => prev.map(p => ({
          ...p,
          isVideoOn: Math.random() > 0.2 ? p.isVideoOn : !p.isVideoOn,
          isSpeaking: Math.random() > 0.8 ? !p.isSpeaking : p.isSpeaking
        })));
      }, 8000);

      // Clean up on component unmount
      return () => clearInterval(participantUpdateInterval);
    }, 2000);
  };

  // Start the call timer
  const startCallTimer = () => {
    callTimer.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  };

  // Format seconds into MM:SS
  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hrs ? `${hrs}:` : ''}${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Leave the meeting
  const leaveMeeting = () => {
    setIsActive(false);
    if (callTimer.current) {
      clearInterval(callTimer.current);
      callTimer.current = null;
    }
    setCallDuration(0);
  };

  // Toggle screen sharing
  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      setIsScreenSharing(false);
      setViewMode('gallery');
      return;
    }

    try {
      // This would require actual implementation in a real app
      // This is just a simulation
      setIsScreenSharing(true);
      setViewMode('screenshare');
    } catch (err) {
      console.error('Error sharing screen:', err);
      alert('Failed to share screen. Please check permissions.');
    }
  };

  // Toggle recording
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real app, we would start/stop actual recording
    if (!isRecording) {
      alert('Meeting recording started');
    } else {
      alert('Meeting recording stopped and saved');
    }
  };

  // Send a chat message
  const sendChatMessage = () => {
    if (!chatMessage.trim()) return;

    const newMessage: ChatMessage = {
      id: `msg${Date.now()}`,
      sender: 'You',
      message: chatMessage,
      timestamp: Date.now(),
      isFromUser: true
    };

    setChatMessages([...chatMessages, newMessage]);
    setChatMessage('');

    // Simulate response after a delay
    setTimeout(() => {
      const responses = [
        'I agree with your assessment.',
        'Could you clarify that point?',
        'Let\'s discuss this further after the call.',
        'I\'ve made a note of that.',
        'I think we should proceed with the recommended treatment.',
      ];

      const responseMsg: ChatMessage = {
        id: `msg${Date.now() + 1}`,
        sender: participants[Math.floor(Math.random() * participants.length)].name,
        message: responses[Math.floor(Math.random() * responses.length)],
        timestamp: Date.now(),
        isFromUser: false
      };

      setChatMessages(prev => [...prev, responseMsg]);
    }, 2000 + Math.random() * 3000);
  };

  // Render lobby UI (before joining)
  const renderLobby = () => {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-indigo-500/20 flex justify-between items-center">
          <h3 className="text-lg font-medium text-white">Video Meetings</h3>
          <button className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700/50">
            <Settings size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {/* Tabs */}
          <div className="flex border-b border-indigo-500/20 mb-4">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'upcoming' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400'}`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'history' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400'}`}
            >
              History
            </button>
          </div>

          {/* Meeting list */}
          <div className="space-y-3">
            {activeTab === 'upcoming' ? (
              upcomingMeetings.length > 0 ? upcomingMeetings.map(meeting => (
                <div key={meeting.id} className="p-4 rounded-lg bg-gray-800/50 border border-indigo-500/10 hover:border-indigo-500/30 transition-all duration-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-white mb-1">{meeting.title}</h4>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock size={14} className="text-indigo-400" />
                          <span className="text-gray-300">{meeting.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users size={14} className="text-indigo-400" />
                          <span className="text-gray-300">{meeting.participants} participants</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setMeetingTitle(meeting.title);
                        joinMeeting();
                      }}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm transition-colors"
                    >
                      Join
                    </button>
                  </div>
                </div>
              )) : (
                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                  <Calendar size={48} className="opacity-30 mb-4" />
                  <p>No upcoming meetings</p>
                </div>
              )
            ) : (
              pastMeetings.length > 0 ? pastMeetings.map(meeting => (
                <div key={meeting.id} className="p-4 rounded-lg bg-gray-800/50 border border-indigo-500/10 hover:border-indigo-500/30 transition-all duration-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-white mb-1 flex items-center gap-2">
                        {meeting.title}
                        {meeting.recorded && (
                          <span className="px-1.5 py-0.5 text-xs rounded-full bg-indigo-500/20 text-indigo-400">Recorded</span>
                        )}
                      </h4>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock size={14} className="text-indigo-400" />
                          <span className="text-gray-300">{meeting.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users size={14} className="text-indigo-400" />
                          <span className="text-gray-300">{meeting.participants} participants</span>
                        </div>
                      </div>
                    </div>
                    {meeting.recorded && (
                      <button className="px-3 py-1.5 border border-indigo-500/30 text-white rounded-md text-sm hover:bg-indigo-500/20 transition-colors">
                        View
                      </button>
                    )}
                  </div>
                </div>
              )) : (
                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                  <Video size={48} className="opacity-30 mb-4" />
                  <p>No meeting history</p>
                </div>
              )
            )}
          </div>
        </div>

        {/* Preview and join controls */}
        <div className="p-4 border-t border-indigo-500/20">
          <div className="bg-gray-800/50 rounded-lg overflow-hidden mb-4">
            <div className="p-4">
              <h4 className="text-sm font-medium text-white mb-4">Quick Join</h4>
              <div className="relative rounded-md overflow-hidden">
                <input
                  type="text"
                  value={meetingCode}
                  onChange={(e) => setMeetingCode(e.target.value)}
                  placeholder="Enter meeting code or link"
                  className="w-full bg-gray-900 border border-indigo-500/20 text-white px-4 py-2 pr-12 rounded-md focus:outline-none focus:border-indigo-500"
                />
                <button
                  className="absolute right-1 top-1 p-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  disabled={!meetingCode.trim()}
                  onClick={joinMeeting}
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="relative">
              <div className="w-[160px] h-[90px] rounded-md overflow-hidden bg-gray-900 border border-indigo-500/20">
                {stream ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <RefreshCw className="animate-spin text-indigo-400" size={24} />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <User size={32} className="text-gray-600" />
                  </div>
                )}
              </div>

              <div className="absolute bottom-2 left-2 flex space-x-2">
                <button
                  onClick={toggleMute}
                  className={`p-1.5 rounded-full ${isMuted ? 'bg-gray-700 text-gray-400' : 'bg-indigo-600 text-white'}`}
                >
                  {isMuted ? <MicOff size={14} /> : <Mic size={14} />}
                </button>
                <button
                  onClick={toggleVideo}
                  className={`p-1.5 rounded-full ${isVideoOff ? 'bg-gray-700 text-gray-400' : 'bg-indigo-600 text-white'}`}
                >
                  {isVideoOff ? <VideoOff size={14} /> : <Video size={14} />}
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                setMeetingTitle('New Meeting');
                joinMeeting();
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors flex items-center gap-2"
            >
              <Video size={18} />
              Start New Meeting
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render the active meeting UI
  const renderActiveMeeting = () => {
    const totalParticipants = participants.length + 1; // +1 for self

    // Determine grid columns based on participant count
    const gridCols = totalParticipants <= 2 ? 1 :
                     totalParticipants <= 4 ? 2 : 3;

    // Should show side panel (chat or participants)
    const showSidePanel = showChat || showParticipants;

    return (
      <div className="flex flex-col h-full bg-gray-900">
        {/* Meeting header */}
        <div className="px-4 py-2 bg-gray-900 border-b border-indigo-500/20 flex justify-between items-center">
          <div className="flex items-center">
            <h3 className="text-white font-medium mr-3">{meetingTitle}</h3>
            <div className="px-2 py-0.5 bg-indigo-500/20 rounded-md text-xs text-indigo-300 flex items-center gap-1">
              <Clock size={12} />
              {formatTime(callDuration)}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isRecording && (
              <div className="flex items-center gap-1 px-2 py-0.5 bg-rose-500/20 rounded-md text-xs text-rose-400 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                REC
              </div>
            )}
            <button
              onClick={toggleFullScreen}
              className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-700/50"
            >
              {isFullScreen ? <Minimize size={16} /> : <Maximize size={16} />}
            </button>
          </div>
        </div>

        {/* Main content area with video grid */}
        <div className="flex-1 overflow-hidden flex">
          {/* Video grid */}
          <div className={`${showSidePanel ? 'w-3/4' : 'w-full'} h-full relative bg-black overflow-hidden`}>
            {viewMode === 'screenshare' ? (
              <div className="absolute inset-0 flex flex-col items-center">
                {/* Screen share view */}
                <div className="w-full flex-1 bg-gray-800 flex items-center justify-center border-b border-gray-700">
                  <div className="text-center">
                    <Monitor size={64} className="text-indigo-400 mx-auto mb-4" />
                    <p className="text-white">Screen sharing active</p>
                    <p className="text-gray-400 text-sm">Your screen is visible to all participants</p>
                  </div>
                </div>

                {/* Presenter video in small overlay */}
                <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-900 rounded-lg overflow-hidden border border-indigo-500/30">
                  {stream ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover bg-black"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <User size={32} className="text-gray-600" />
                    </div>
                  )}
                </div>
              </div>
            ) : viewMode === 'speaker' ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {/* Active speaker view */}
                <div className="relative w-full max-w-3xl h-3/4 bg-gray-900 rounded-lg overflow-hidden">
                  {/* This would be the active speaker */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-gray-800 to-gray-900">
                    <div className="w-32 h-32 rounded-full flex items-center justify-center bg-indigo-500/20 border border-indigo-500/30">
                      <span className="text-5xl text-indigo-300 font-medium">{participants[2].name.charAt(0)}</span>
                    </div>
                  </div>

                  {/* User indicator */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-white text-sm">{participants[2].name}</span>
                  </div>
                </div>

                {/* Thumbnails of other participants */}
                <div className="flex gap-2 mt-4">
                  <div className="w-36 h-24 rounded-lg overflow-hidden bg-gray-800 border border-indigo-500/20 relative">
                    {stream ? (
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <User size={24} className="text-gray-600" />
                      </div>
                    )}
                    <div className="absolute bottom-1 left-1 right-1 flex justify-between items-center">
                      <span className="text-white text-xs">You</span>
                      {isMuted && <MicOff size={12} className="text-gray-400" />}
                    </div>
                  </div>

                  {participants.slice(0, 2).map((participant, index) => (
                    <div key={index} className="w-36 h-24 rounded-lg overflow-hidden bg-gray-800 border border-indigo-500/20 relative">
                      {participant.isVideoOn ? (
                        <div className="w-full h-full bg-gradient-to-b from-gray-700 to-gray-800"></div>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-indigo-500/20 border border-indigo-500/30">
                            <span className="text-xl text-white">{participant.name.charAt(0)}</span>
                          </div>
                        </div>
                      )}
                      <div className="absolute bottom-1 left-1 right-1 flex justify-between items-center">
                        <span className="text-white text-xs">{participant.name.split(' ')[0]}</span>
                        {!participant.isAudioOn && <MicOff size={12} className="text-gray-400" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // Gallery view
              <div className="grid grid-cols-2 gap-4 p-4 w-full h-full">
                {/* Self view */}
                <div className="w-full h-full rounded-lg overflow-hidden bg-gray-800 border border-indigo-500/20 relative">
                  {stream && !isVideoOff ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="w-24 h-24 rounded-full flex items-center justify-center bg-indigo-500/20 border border-indigo-500/30">
                        <span className="text-3xl text-indigo-300 font-medium">You</span>
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
                    <span className="text-white bg-black/50 px-2 py-0.5 rounded-md text-sm">You</span>
                    <div className="flex gap-1">
                      {isMuted && (
                        <span className="bg-black/50 p-1 rounded-md">
                          <MicOff size={14} className="text-gray-400" />
                        </span>
                      )}
                      {isVideoOff && (
                        <span className="bg-black/50 p-1 rounded-md">
                          <VideoOff size={14} className="text-gray-400" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Participant tiles */}
                {participants.map((participant, index) => (
                  <div key={index} className="w-full h-full rounded-lg overflow-hidden bg-gray-800 border border-indigo-500/20 relative">
                    {participant.isVideoOn ? (
                        <div className="w-full h-full bg-gradient-to-b from-gray-700 to-gray-800"></div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="w-24 h-24 rounded-full flex items-center justify-center bg-indigo-500/20 border border-indigo-500/30">
                          <span className="text-3xl text-indigo-300 font-medium">{participant.name.charAt(0)}</span>
                        </div>
                      </div>
                    )}

                    {/* Participant info */}
                    <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
                      <span className={`text-white bg-black/50 px-2 py-0.5 rounded-md text-sm ${participant.isSpeaking ? 'border border-green-500' : ''}`}>
                        {participant.name.split(' ')[0]}
                      </span>
                      <div className="flex gap-1">
                        {!participant.isAudioOn && (
                          <span className="bg-black/50 p-1 rounded-md">
                            <MicOff size={14} className="text-gray-400" />
                          </span>
                        )}
                        {!participant.isVideoOn && (
                          <span className="bg-black/50 p-1 rounded-md">
                            <VideoOff size={14} className="text-gray-400" />
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Speaking indicator */}
                    {participant.isSpeaking && (
                      <div className="absolute inset-0 border-2 border-green-500 rounded-lg pointer-events-none"></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Side panel (chat or participants) */}
          {showSidePanel && (
            <div className="w-1/4 border-l border-indigo-500/20 bg-gray-900 flex flex-col">
              <div className="p-3 border-b border-indigo-500/20 flex justify-between items-center">
                <h3 className="text-white font-medium">
                  {showChat ? 'Chat' : 'Participants'}
                </h3>
                <button
                  onClick={() => {
                    setShowChat(false);
                    setShowParticipants(false);
                  }}
                  className="p-1 text-gray-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              {showChat ? (
                // Chat panel
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-3 space-y-3">
                    {chatMessages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.isFromUser ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-lg p-2 ${msg.isFromUser ? 'bg-indigo-600/40' : 'bg-gray-700/60'}`}>
                          {!msg.isFromUser && (
                            <div className="text-xs text-indigo-300 mb-1">{msg.sender}</div>
                          )}
                          <div className="text-sm text-white">{msg.message}</div>
                          <div className="text-right text-xs text-gray-400 mt-1">
                            {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Chat input */}
                  <div className="p-3 border-t border-indigo-500/20">
                    <div className="flex">
                      <input
                        type="text"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                        placeholder="Type a message..."
                        className="flex-1 bg-gray-800 border border-indigo-500/20 text-white rounded-l-md px-3 py-2 focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        onClick={sendChatMessage}
                        disabled={!chatMessage.trim()}
                        className={`px-3 rounded-r-md ${chatMessage.trim() ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-400'}`}
                      >
                        <Send size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // Participants panel
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {/* Self */}
                  <div className="flex items-center justify-between p-2 rounded-md bg-gray-800/50">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-indigo-500/20 border border-indigo-500/30">
                          <span className="text-sm font-medium text-indigo-300">You</span>
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-gray-900"></div>
                      </div>
                      <span className="text-white">You (Host)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={toggleMute}
                        className="p-1 rounded-md text-gray-400 hover:text-white"
                      >
                        {isMuted ? <MicOff size={14} /> : <Mic size={14} />}
                      </button>
                      <button
                        onClick={toggleVideo}
                        className="p-1 rounded-md text-gray-400 hover:text-white"
                      >
                        {isVideoOff ? <VideoOff size={14} /> : <Video size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* Other participants */}
                  {participants.map((p, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-800/30">
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-indigo-500/20 border border-indigo-500/30">
                            <span className="text-sm font-medium text-indigo-300">{p.name.charAt(0)}</span>
                          </div>
                          <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-gray-900"></div>
                        </div>
                        <div>
                          <div className="text-white text-sm">{p.name}</div>
                          <div className="text-gray-400 text-xs">{p.role}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {p.isSpeaking && (
                          <div className="w-3 h-3 mr-2 relative">
                            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
                            <div className="absolute inset-0.5 bg-green-500 rounded-full"></div>
                          </div>
                        )}
                        {!p.isAudioOn && <MicOff size={14} className="text-gray-500" />}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Meeting controls */}
        <div className="px-4 py-3 bg-gray-900 border-t border-indigo-500/20 flex justify-between items-center">
          <div className="flex items-center gap-1">
            <button
              onClick={toggleMute}
              className={`p-2 rounded-lg flex flex-col items-center ${isMuted ? 'bg-gray-700 text-gray-400' : 'bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30'}`}
            >
              {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
              <span className="text-xs mt-1">{isMuted ? 'Unmute' : 'Mute'}</span>
            </button>

            <button
              onClick={toggleVideo}
              className={`p-2 rounded-lg flex flex-col items-center ${isVideoOff ? 'bg-gray-700 text-gray-400' : 'bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30'}`}
            >
              {isVideoOff ? <VideoOff size={18} /> : <Video size={18} />}
              <span className="text-xs mt-1">{isVideoOff ? 'Start' : 'Stop'}</span>
            </button>

            <button
              onClick={toggleScreenShare}
              className={`p-2 rounded-lg flex flex-col items-center ${isScreenSharing ? 'bg-indigo-600/40 text-indigo-300' : 'bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30'}`}
            >
              <Share2 size={18} />
              <span className="text-xs mt-1">Share</span>
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setShowChat(true);
                setShowParticipants(false);
              }}
              className={`p-2 rounded-lg flex flex-col items-center ${showChat ? 'bg-indigo-600/40 text-indigo-300' : 'bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30'}`}
            >
              <MessageSquare size={18} />
              <span className="text-xs mt-1">Chat</span>
            </button>

            <button
              onClick={() => {
                setShowParticipants(true);
                setShowChat(false);
              }}
              className={`p-2 rounded-lg flex flex-col items-center ${showParticipants ? 'bg-indigo-600/40 text-indigo-300' : 'bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30'}`}
            >
              <Users size={18} />
              <span className="text-xs mt-1">People</span>
            </button>

            <button
              onClick={() => setViewMode(viewMode === 'gallery' ? 'speaker' : viewMode === 'speaker' ? 'gallery' : 'gallery')}
              className="p-2 rounded-lg flex flex-col items-center bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30"
            >
              <Layout size={18} />
              <span className="text-xs mt-1">Layout</span>
            </button>

            <button
              onClick={toggleRecording}
              className={`p-2 rounded-lg flex flex-col items-center ${isRecording ? 'bg-rose-600/40 text-rose-300' : 'bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30'}`}
            >
              <Circle size={18} className={isRecording ? 'animate-pulse' : ''} />
              <span className="text-xs mt-1">{isRecording ? 'Stop' : 'Record'}</span>
            </button>
          </div>

          <button
            onClick={leaveMeeting}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors"
          >
            Leave
          </button>
        </div>
      </div>
    );
  };

  // Render joining UI (loading screen)
  const renderJoining = () => {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-900">
        <div className="mb-8 text-center">
          <RefreshCw size={48} className="text-indigo-400 animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white">Joining meeting...</h3>
          <p className="text-gray-400 mt-2">Please wait while we connect you</p>
        </div>

        <button
          onClick={() => setIsJoining(false)}
          className="px-4 py-2 border border-indigo-500/30 text-white rounded-md hover:bg-indigo-500/20 transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  };

  if (isJoining) {
    return renderJoining();
  } else if (isActive) {
    return renderActiveMeeting();
  } else {
    return renderLobby();
  }
};

export default VideoTab;

// Helper components
const ArrowRight = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const Circle = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
  </svg>
);
