import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  RefreshCw, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  PlusCircle, 
  Link2,
  LogOut,
  User as UserIcon,
  Sparkles
} from 'lucide-react';
import { googleSheetsAdapter, SheetConnectionState } from '../services/googleSheetsAdapter';
import { googleSignIn, googleSignOut, getAccessToken, initAuth } from '../services/googleAuth';
import { User } from 'firebase/auth';

export const GoogleSheetsConnectionBar: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cachedToken, setCachedToken] = useState<string | null>(null);
  const [connState, setConnState] = useState<SheetConnectionState>(googleSheetsAdapter.getState());
  const [isLinking, setIsLinking] = useState(false);
  const [manualSheetId, setManualSheetId] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    // 1. Subscribe to Google Sheets adapter state
    const unsubscribeAdapter = googleSheetsAdapter.subscribe((newState) => {
      setConnState(newState);
    });

    // 2. Initialize Firebase Auth state listener
    const unsubscribeAuth = initAuth(
      (user, token) => {
        setCurrentUser(user);
        setCachedToken(token);
        // If we already have a spreadsheet ID linked, automatically sync
        const storedId = localStorage.getItem('autoace_linked_spreadsheet_id');
        if (storedId && token) {
          googleSheetsAdapter.syncFromSpreadsheet(storedId, token).catch((e) => {
            console.warn('Auto-sync notice:', e.message);
          });
        }
      },
      () => {
        setCurrentUser(null);
        setCachedToken(null);
      }
    );

    return () => {
      unsubscribeAdapter();
      unsubscribeAuth();
    };
  }, []);

  const handleSignIn = async () => {
    setStatusMessage(null);
    try {
      const result = await googleSignIn();
      setCurrentUser(result.user);
      setCachedToken(result.accessToken);
      setStatusMessage('Google authentication verified successfully.');

      // Check if existing spreadsheet was saved
      const savedId = localStorage.getItem('autoace_linked_spreadsheet_id');
      if (savedId) {
        await googleSheetsAdapter.syncFromSpreadsheet(savedId, result.accessToken);
      }
    } catch (err: any) {
      setStatusMessage(`Sign-in error: ${err.message || 'Failed to authenticate'}`);
    }
  };

  const handleSignOut = async () => {
    await googleSignOut();
    setCurrentUser(null);
    setCachedToken(null);
    setStatusMessage('Signed out of Google account.');
  };

  const handleRefresh = async () => {
    if (!connState.spreadsheetId) {
      setStatusMessage('Please link or create a Google Sheet first.');
      return;
    }

    setStatusMessage(null);
    try {
      let token = cachedToken;
      if (!token) {
        token = await getAccessToken();
      }

      if (!token) {
        // Prompt sign in if token expired
        const authRes = await googleSignIn();
        token = authRes.accessToken;
        setCurrentUser(authRes.user);
        setCachedToken(token);
      }

      await googleSheetsAdapter.syncFromSpreadsheet(connState.spreadsheetId, token);
      setStatusMessage('Live Google Sheet synchronized successfully.');
    } catch (err: any) {
      setStatusMessage(`Sync error: ${err.message || 'Failed to refresh data'}`);
    }
  };

  const handleCreateNewSheet = async () => {
    setStatusMessage(null);
    try {
      let token = cachedToken;
      if (!token) {
        const authRes = await googleSignIn();
        token = authRes.accessToken;
        setCurrentUser(authRes.user);
        setCachedToken(token);
      }

      const newId = await googleSheetsAdapter.createAndSeedSpreadsheet(token);
      setStatusMessage(`Created "AutoAce Zambia - Live Operations Database" (ID: ${newId.slice(0, 8)}...). All 11 tables populated!`);
    } catch (err: any) {
      setStatusMessage(`Creation error: ${err.message || 'Failed to create spreadsheet'}`);
    }
  };

  const handleLinkExisting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualSheetId.trim()) return;

    setStatusMessage(null);
    try {
      let token = cachedToken;
      if (!token) {
        const authRes = await googleSignIn();
        token = authRes.accessToken;
        setCurrentUser(authRes.user);
        setCachedToken(token);
      }

      await googleSheetsAdapter.linkExistingSpreadsheet(manualSheetId.trim(), token);
      setIsLinking(false);
      setManualSheetId('');
      setStatusMessage('Linked existing Google Spreadsheet successfully.');
    } catch (err: any) {
      setStatusMessage(`Link error: ${err.message || 'Failed to link spreadsheet'}`);
    }
  };

  const formatLastSynced = (date: Date | null) => {
    if (!date) return 'Never';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-2xs p-5 sm:p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Status Overview */}
        <div className="flex items-start sm:items-center gap-3.5">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
            connState.isConnected 
              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
              : 'bg-gray-100 text-gray-500 border border-gray-200'
          }`}>
            <FileSpreadsheet className="w-5 h-5" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-sm text-[#1A1A1F] tracking-tight">
                Google Sheets Integration
              </h3>

              {/* Connected / Not Connected Badge */}
              {connState.isConnected ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Connected Live
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  Local Seed Mode
                </span>
              )}

              {currentUser && (
                <span className="hidden sm:inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-0.5 rounded-full">
                  <UserIcon className="w-3 h-3 text-gray-400" />
                  {currentUser.email || currentUser.displayName}
                </span>
              )}
            </div>

            {/* Spreadsheet Name & Sync Meta */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gray-500">
              <span>
                Sheet: <span className="font-semibold text-[#1A1A1F]">{connState.spreadsheetName || 'AutoAce Zambia - Live Operations Database'}</span>
              </span>
              <span>•</span>
              <span>
                Last Synced: <strong className="text-gray-700 font-semibold">{formatLastSynced(connState.lastSyncedAt)}</strong>
              </span>
              {connState.rowCountTotal > 0 && (
                <>
                  <span>•</span>
                  <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                    {connState.rowCountTotal} live rows in DAL
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Refresh Data Button */}
          <button
            onClick={handleRefresh}
            disabled={connState.isLoading || !connState.spreadsheetId}
            className="px-4 py-2 text-xs font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-full border border-gray-200 transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-2xs active:scale-98"
            title="Fetch live row values from Google Sheets into the AutoAce DAL"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${connState.isLoading ? 'animate-spin text-blue-600' : 'text-gray-500'}`} />
            <span>{connState.isLoading ? 'Syncing...' : 'Refresh Data'}</span>
          </button>

          {/* Open in Google Sheets Link */}
          {connState.spreadsheetUrl ? (
            <a
              href={connState.spreadsheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-xs font-bold text-[#1E3A8A] bg-blue-50/80 hover:bg-blue-100 rounded-full border border-blue-200 transition-all inline-flex items-center gap-1.5 shadow-2xs active:scale-98"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#1E3A8A]" />
              <span>Open in Sheets</span>
            </a>
          ) : null}

          {/* Connect / Create Spreadsheet Actions */}
          {!currentUser ? (
            <button
              onClick={handleSignIn}
              disabled={connState.isLoading}
              className="px-4 py-2 text-xs font-bold text-white bg-[#1E3A8A] hover:bg-[#2563EB] rounded-full transition-all inline-flex items-center gap-2 shadow-xs cursor-pointer active:scale-98"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              <span>Sign in with Google</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              {!connState.isConnected && (
                <>
                  <button
                    onClick={handleCreateNewSheet}
                    disabled={connState.isLoading}
                    className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-full transition-all inline-flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-98"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Create & Seed Sheet</span>
                  </button>

                  <button
                    onClick={() => setIsLinking(!isLinking)}
                    className="px-3.5 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-all inline-flex items-center gap-1.5 cursor-pointer active:scale-98"
                  >
                    <Link2 className="w-3.5 h-3.5 text-gray-600" />
                    <span>Link Existing</span>
                  </button>
                </>
              )}

              <button
                onClick={handleSignOut}
                title="Sign out of Google"
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Manual Link Input Modal/Drawer dropdown */}
      {isLinking && (
        <form onSubmit={handleLinkExisting} className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
          <input
            type="text"
            placeholder="Paste Google Sheet URL or Spreadsheet ID..."
            value={manualSheetId}
            onChange={(e) => setManualSheetId(e.target.value)}
            className="flex-1 px-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
          <button
            type="submit"
            disabled={connState.isLoading || !manualSheetId.trim()}
            className="px-4 py-2 text-xs font-bold text-white bg-[#1E3A8A] hover:bg-[#2563EB] rounded-full transition-all disabled:opacity-50 cursor-pointer shadow-xs"
          >
            Connect Sheet
          </button>
          <button
            type="button"
            onClick={() => setIsLinking(false)}
            className="px-3 py-2 text-xs font-semibold text-gray-500 hover:text-gray-700 rounded-full"
          >
            Cancel
          </button>
        </form>
      )}

      {/* Notification / Status message banner */}
      {(statusMessage || connState.error) && (
        <div className={`mt-4 px-4 py-2.5 rounded-2xl text-xs flex items-center justify-between gap-2 ${
          connState.error 
            ? 'bg-rose-50 text-rose-700 border border-rose-200' 
            : 'bg-blue-50 text-blue-800 border border-blue-200'
        }`}>
          <span>{connState.error || statusMessage}</span>
          <button 
            onClick={() => setStatusMessage(null)}
            className="text-[10px] uppercase font-bold tracking-wider opacity-60 hover:opacity-100 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};
