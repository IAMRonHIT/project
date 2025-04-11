import React, { useState } from 'react';
import { Phone, PhoneOff, PhoneIncoming, PhoneOutgoing, Clock, User } from 'lucide-react';
import { Badge } from '../Badge';
import { useTheme } from '../../hooks/useTheme';

interface CallLog {
  name: string;
  time: string;
  duration: string;
  type: 'incoming' | 'outgoing';
  status?: 'success' | 'missed' | 'ongoing';
}

const PhoneTab: React.FC = () => {
  const [isCalling, setIsCalling] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [callLogs] = useState<CallLog[]>([
    {
      name: 'Sarah Johnson',
      time: 'Today, 09:30 AM',
      duration: '15 mins',
      type: 'outgoing',
      status: 'success'
    },
    {
      name: 'Mark Davis',
      time: 'Yesterday, 04:15 PM',
      duration: '10 mins',
      type: 'incoming',
      status: 'success'
    },
    {
      name: 'Dr. Emily Smith',
      time: 'Yesterday, 02:30 PM',
      duration: '-',
      type: 'incoming',
      status: 'missed'
    }
  ]);

  const handleCall = () => {
    setIsCalling(true);
    // Simulate call duration
    setTimeout(() => {
      setIsCalling(false);
    }, 5000);
  };

  return (
    <div className="flex flex-col min-h-0">
      {isCalling ? (
        <div className={`
          flex-1 flex flex-col items-center justify-center
          ${isDark ? '"bg-black backdrop-blur-xl rounded-xl p-8 shadow-soft hover:shadow-glow transition-all duration-300 relative overflow-hidden border border-white/10"-900/50' : 'bg-white/80'}
          backdrop-blur-xl
        `}>
          <div className={`
            w-24 h-24 rounded-full mb-6
            bg-ron-teal-400/10
            border border-ron-teal-400/20
            flex items-center justify-center
            animate-pulse
          `}>
            <User size={48} className="text-ron-teal-400" />
          </div>
          <h2 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Sarah Johnson
          </h2>
          <Badge variant="success" className="mb-8">
            Calling...
          </Badge>
          <button
            onClick={() => setIsCalling(false)}
            title="End Call"
            className={`
              p-4 rounded-full
              bg-ron-coral-400
              text-white
              transition-all duration-200
              hover:shadow-glow-coral
              border border-transparent
              animate-pulse
            `}
          >
            <PhoneOff size={24} />
          </button>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="space-y-2 p-4">
              {callLogs.map((log, index) => (
                <div
                  key={index}
                  className={`
                    p-4 rounded-lg
                    ${isDark ? '"bg-black backdrop-blur-xl rounded-xl p-8 shadow-soft hover:shadow-glow transition-all duration-300 relative overflow-hidden border border-white/10"-800/50' : 'bg-white/50'}
                    backdrop-blur-sm
                    border border-ron-teal-400/20
                    transition-all duration-200
                    hover:shadow-glow-teal
                  `}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`
                        w-10 h-10 rounded-full
                        bg-ron-teal-400/10
                        border border-ron-teal-400/20
                        flex items-center justify-center
                      `}>
                        <User size={20} className="text-ron-teal-400" />
                      </div>
                      <div>
                        <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {log.name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Clock size={12} />
                          {log.time}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          log.status === 'success' ? 'success' :
                          log.status === 'missed' ? 'error' : 'info'
                        }
                        size="sm"
                        icon={log.type === 'incoming' ? <PhoneIncoming size={12} /> : <PhoneOutgoing size={12} />}
                      >
                        {log.status === 'missed' ? 'Missed' : log.duration}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-shrink-0 border-t border-ron-teal-400/20">
            <div className="p-4">
              <div className="flex justify-center">
                <button
                  onClick={handleCall}
                  title="Initiate Call"
                  className={`
                    p-4 rounded-full
                    bg-ron-teal-400
                    text-white
                    transition-all duration-200
                    hover:shadow-glow-teal
                    border border-transparent
                  `}
                >
                  <Phone size={24} />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PhoneTab;
