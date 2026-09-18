import React from 'react';
import { X, Phone, MessageSquare, MapPin, CheckCircle2, ShieldCheck, Car, ExternalLink, Calendar, DollarSign } from 'lucide-react';
import { ProjectItem } from '../../types';

interface LeadDetailModalProps {
  lead: ProjectItem | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus?: (leadId: string, newStatus: string) => void;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  lead,
  isOpen,
  onClose,
  onUpdateStatus
}) => {
  if (!isOpen || !lead) return null;

  const handleWhatsApp = () => {
    const cleanPhone = (lead.contact || '+260977123456').replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Hello ${lead.buyerName || 'there'}, this is Yamikani Banda from AutoAce. Regarding your inquiry for the ${lead.title} (Budget: ${lead.budget || lead.dueDate}): we have verified a clean unit matching your specifications at a vetted yard. Would you like me to share the inspection report?`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-150 relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#1E3A8A] flex items-center justify-center">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-[#1A1A1F]">
                  {lead.title}
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                  {lead.intentScore || 95}% Intent
                </span>
              </div>
              <p className="text-xs text-gray-400 font-medium">
                Lead ID: {lead.id} • Buyer: <span className="font-bold text-gray-700">{lead.buyerName || 'Verified Client'}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lead Details Grid */}
        <div className="mt-5 space-y-4 text-xs">
          {/* 2-Column Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Buyer Budget
              </span>
              <span className="text-base font-black text-[#1E3A8A] mt-0.5 block">
                {lead.budget || lead.dueDate}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Location
              </span>
              <div className="flex items-center gap-1 mt-0.5 text-gray-800 font-bold text-sm">
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span className="truncate">{lead.location || 'Lusaka, Zambia'}</span>
              </div>
            </div>
          </div>

          {/* Sourcing & Supply Match */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 text-blue-950">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E3A8A] mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Matched Fulfillment Partner</span>
            </div>
            <p className="text-xs text-blue-900 font-semibold">
              {lead.matchedYard || 'Great East Motors Yard (Kafue Road)'}
            </p>
            <p className="text-[11px] text-blue-700 mt-0.5">
              Chassis number inspected, physical yard availability confirmed. Ready for buyer viewing.
            </p>
          </div>

          {/* Contact Info */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-200">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <div>
                <span className="text-[11px] text-gray-400 font-medium block">Phone / WhatsApp</span>
                <span className="font-bold text-gray-800">{lead.contact || '+260 97 712 3456'}</span>
              </div>
            </div>

            <button
              onClick={handleWhatsApp}
              className="px-3.5 py-1.5 rounded-full bg-[#10B981] hover:bg-[#059669] text-white font-bold text-[11px] flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
          </div>

          {/* Funnel Progress Selector */}
          <div>
            <label className="font-bold text-gray-700 block mb-1.5">
              Funnel Stage
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['New Request', 'Matching Supply', 'Inspection Stage', 'Deal Closing'].map((stage) => {
                const isCurrent = lead.category === stage;
                return (
                  <button
                    key={stage}
                    type="button"
                    onClick={() => onUpdateStatus?.(lead.id, stage)}
                    className={`py-2 px-2 text-center rounded-xl font-bold text-[11px] transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-[#1E3A8A] text-white shadow-xs'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {stage}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>

          <button
            onClick={() => {
              onUpdateStatus?.(lead.id, 'Deal Closing');
              alert(`Lead "${lead.title}" advanced to Deal Closing!`);
              onClose();
            }}
            className="px-5 py-2.5 rounded-full bg-[#1E3A8A] hover:bg-[#2563EB] text-white font-bold text-xs transition-all shadow-xs cursor-pointer flex items-center gap-1.5 active:scale-98"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Advance to Close (+Fee)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
