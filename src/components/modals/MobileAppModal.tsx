import React from 'react';
import { X, Smartphone, QrCode, Check } from 'lucide-react';

interface MobileAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileAppModal: React.FC<MobileAppModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-gray-100 text-center animate-in zoom-in-95 duration-150">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="w-14 h-14 rounded-2xl bg-[#EEF2FF] text-[#2D5CF6] mx-auto flex items-center justify-center mb-3">
          <Smartphone className="w-7 h-7" />
        </div>

        <h3 className="text-lg font-bold text-[#1A1A1F]">
          Get Autoace Hub Mobile
        </h3>
        <p className="text-xs text-gray-400 mt-1 mb-4">
          Scan QR code or send download link to your phone.
        </p>

        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 inline-block mb-4">
          <QrCode className="w-28 h-28 text-gray-800 mx-auto" />
        </div>

        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-gray-500 mb-4">
          <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-600" /> iOS TestFlight</span>
          <span>•</span>
          <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-600" /> Android APK</span>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-full bg-[#1E3A8A] hover:bg-[#2563EB] text-white text-xs font-bold transition-all shadow-xs"
        >
          Got it
        </button>
      </div>
    </div>
  );
};
