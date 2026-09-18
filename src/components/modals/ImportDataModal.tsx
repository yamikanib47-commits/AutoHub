import React, { useState } from 'react';
import { X, UploadCloud, FileText, CheckCircle2 } from 'lucide-react';

interface ImportDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete?: () => void;
}

export const ImportDataModal: React.FC<ImportDataModalProps> = ({
  isOpen,
  onClose,
  onImportComplete
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSimulatedImport = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onImportComplete?.();
        onClose();
      }, 1000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-150 text-[#1A1A1F]">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <h2 className="text-base font-bold text-[#1A1A1F]">
            Import Project Data
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-5">
          <div 
            onClick={handleSimulatedImport}
            className="border-2 border-dashed border-gray-200 hover:border-[#2D5CF6] rounded-2xl p-6 text-center cursor-pointer transition-colors bg-gray-50/50"
          >
            {isSuccess ? (
              <div className="flex flex-col items-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-2" />
                <p className="text-sm font-bold text-gray-800">Import Succeeded!</p>
              </div>
            ) : isUploading ? (
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full border-2 border-[#1E3A8A] border-t-transparent animate-spin mb-2" />
                <p className="text-xs font-semibold text-gray-600">Parsing and synchronizing rows...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <UploadCloud className="w-10 h-10 text-[#1E3A8A] mb-2" />
                <p className="text-xs font-bold text-gray-700">Drag & drop CSV, JSON, or Excel</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Click to browse your device files</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 text-xs"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSimulatedImport}
            className="px-5 py-2 rounded-xl bg-[#1E3A8A] hover:bg-[#2563EB] text-white font-bold text-xs transition-all shadow-xs"
          >
            Choose File
          </button>
        </div>
      </div>
    </div>
  );
};
