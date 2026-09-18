import React from 'react';
import { X, Video, Mic, MicOff, VideoOff, PhoneOff } from 'lucide-react';

interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  meetingTitle?: string;
  timeRange?: string;
}

export const MeetingModal: React.FC<MeetingModalProps> = ({
  isOpen,
  onClose,
  meetingTitle = 'Meeting with Arc Company',
  timeRange = '02.00 pm - 04.00 pm'
}) => {
  const [isMuted, setIsMuted] = React.useState(false);
  const [isVideoOff, setIsVideoOff] = React.useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#0F172A] w-full max-w-xl rounded-3xl p-6 shadow-2xl border border-slate-800 text-white animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-base font-bold text-white">
                {meetingTitle}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{timeRange}</p>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Stage Simulation */}
        <div className="my-5 rounded-2xl bg-slate-900 border border-slate-800 h-56 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-slate-400 mb-2">
            <Video className="w-8 h-8 text-[#60A5FA]" />
          </div>
          <p className="text-sm font-semibold text-slate-300">Arc Company Virtual Room</p>
          <p className="text-xs text-slate-500">Connected with 4 participants</p>

          <span className="absolute bottom-3 left-3 px-2 py-1 rounded-md bg-black/60 text-[11px] text-slate-300">
            Totok Michael (Host)
          </span>
        </div>

        {/* Meeting Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
              isMuted ? 'bg-rose-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
              isVideoOff ? 'bg-rose-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
          >
            {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </button>

          <button
            onClick={onClose}
            className="w-12 h-11 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center cursor-pointer shadow-md"
          >
            <PhoneOff className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
