import React, { useState } from 'react';
import { X, Car, Phone, MapPin, DollarSign } from 'lucide-react';
import { ProjectItem } from '../../types';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProject: (p: Omit<ProjectItem, 'id'>) => void;
}

export const AddProjectModal: React.FC<AddProjectModalProps> = ({
  isOpen,
  onClose,
  onAddProject
}) => {
  const [vehicleTitle, setVehicleTitle] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [budget, setBudget] = useState('K150,000');
  const [location, setLocation] = useState('Lusaka');
  const [contact, setContact] = useState('+260 97 ');
  const [category, setCategory] = useState('Matching Supply');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleTitle.trim()) return;

    onAddProject({
      title: vehicleTitle,
      category,
      dueDate: `${budget} • ${location}`,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      status: 'In Progress',
      buyerName: buyerName.trim() || 'Direct Inbound Buyer',
      budget,
      location,
      contact,
      intentScore: 95,
      matchedYard: 'Vetting local yards & import catalogs'
    });

    setVehicleTitle('');
    setBuyerName('');
    setBudget('K150,000');
    setLocation('Lusaka');
    setContact('+260 97 ');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#1E3A8A] flex items-center justify-center">
              <Car className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#1A1A1F]">
                Log Buyer Lead / Request
              </h2>
              <p className="text-[11px] text-gray-400 font-medium">
                Capture high-intent automotive demand in Zambia
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 mt-4 text-xs">
          <div>
            <label className="font-bold text-gray-700 block mb-1">Vehicle Requested</label>
            <input
              type="text"
              required
              value={vehicleTitle}
              onChange={(e) => setVehicleTitle(e.target.value)}
              placeholder="e.g. Toyota Land Cruiser Prado TX / Nissan X-Trail"
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:border-[#1E3A8A] outline-none text-xs text-[#1A1A1F]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Buyer Name</label>
              <input
                type="text"
                required
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                placeholder="e.g. Mwamba Chanda"
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:border-[#1E3A8A] outline-none text-xs text-[#1A1A1F]"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Budget (ZMW)</label>
              <input
                type="text"
                required
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="e.g. K180,000"
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:border-[#1E3A8A] outline-none text-xs text-[#1A1A1F]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Location</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#1E3A8A] outline-none bg-white text-xs text-[#1A1A1F]"
              >
                <option value="Lusaka">Lusaka</option>
                <option value="Kitwe">Kitwe</option>
                <option value="Ndola">Ndola</option>
                <option value="Kabwe">Kabwe</option>
                <option value="Livingstone">Livingstone</option>
                <option value="Other / Countrywide">Other / Countrywide</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Phone / WhatsApp</label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="+260 97..."
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:border-[#1E3A8A] outline-none text-xs text-[#1A1A1F]"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Initial Stage</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#1E3A8A] outline-none bg-white text-xs text-[#1A1A1F]"
            >
              <option value="New Request">New Request (Intent Captured)</option>
              <option value="Matching Supply">Matching Supply (Locating Yard / Agent)</option>
              <option value="Qualified Lead">Qualified Lead (Hot / Ready)</option>
              <option value="Inspection Stage">Inspection Stage (Yard Physical Check)</option>
              <option value="Deal Closing">Deal Closing (Escrow / Handover)</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-[#1E3A8A] hover:bg-[#2563EB] text-white font-bold transition-all shadow-xs cursor-pointer active:scale-98"
            >
              Log Buyer Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
