import { autoAceDatabase } from '../data/sheets';
import { 
  GoogleSheetsDatabase,
  BuyerRecord,
  SellerListingRecord,
  SellerRecord,
  AgentRecord,
  ConnectionRecord,
  TransactionRecord,
  ContentRecord,
  TaskRecord,
  BusinessEventRecord,
  KpiRecord,
  BusinessRecord
} from '../types/database';
import { autoAceDAL } from './dataAccessLayer';

export interface SheetConnectionState {
  isConnected: boolean;
  spreadsheetId: string | null;
  spreadsheetName: string | null;
  spreadsheetUrl: string | null;
  lastSyncedAt: Date | null;
  isLoading: boolean;
  error: string | null;
  rowCountTotal: number;
}

const STORAGE_KEY_SPREADSHEET_ID = 'autoace_linked_spreadsheet_id';
const STORAGE_KEY_SPREADSHEET_NAME = 'autoace_linked_spreadsheet_name';

export const SHEET_NAMES = [
  'dashboard',
  'business',
  'kpis',
  'buyers',
  'seller_listings',
  'sellers',
  'agents',
  'connections',
  'transactions',
  'content',
  'tasks',
  'business_events'
] as const;

export class GoogleSheetsDataAdapter {
  private state: SheetConnectionState = {
    isConnected: false,
    spreadsheetId: localStorage.getItem(STORAGE_KEY_SPREADSHEET_ID),
    spreadsheetName: localStorage.getItem(STORAGE_KEY_SPREADSHEET_NAME) || 'AutoAce Zambia - Live Operations Database',
    spreadsheetUrl: localStorage.getItem(STORAGE_KEY_SPREADSHEET_ID) 
      ? `https://docs.google.com/spreadsheets/d/${localStorage.getItem(STORAGE_KEY_SPREADSHEET_ID)}/edit`
      : null,
    lastSyncedAt: null,
    isLoading: false,
    error: null,
    rowCountTotal: 0
  };

  private listeners: Array<(state: SheetConnectionState) => void> = [];

  public subscribe(listener: (state: SheetConnectionState) => void): () => void {
    this.listeners.push(listener);
    listener(this.state);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l({ ...this.state }));
  }

  public getState(): SheetConnectionState {
    return { ...this.state };
  }

  /**
   * Helper to format rows from raw database records for spreadsheet seeding,
   * injecting real Google Sheets formulas for calculated fields and the dashboard sheet.
   */
  private prepareSheetData(sheetName: string): { headers: string[]; rows: any[][] } {
    if (sheetName === 'dashboard') {
      const formulas = autoAceDAL.getDashboardFormulas();
      const headers = ['Cell', 'Metric Name', 'Formula', 'Calculated Value', 'Operational Notes'];
      const rows = formulas.map((f) => [
        f.cell,
        f.metric_name,
        f.formula,
        f.calculated_value,
        f.notes
      ]);
      return { headers, rows };
    }

    const records = (autoAceDatabase as any)[sheetName];
    if (!Array.isArray(records) || records.length === 0) {
      return { headers: [], rows: [] };
    }

    const headers = Object.keys(records[0]);
    const rows = records.map((record: any, index: number) => {
      const rowNum = index + 2; // Row 1 is headers
      return headers.map((h) => {
        // Use live Google Sheets formulas on transactions sheet
        if (sheetName === 'transactions') {
          if (h === 'autoace_commission') return `=G${rowNum}*0.03`;
          if (h === 'agent_commission') return `=H${rowNum}*0.5`;
          if (h === 'autoace_net_revenue') return `=H${rowNum}-I${rowNum}`;
        }

        const val = record[h];
        if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
        return val ?? '';
      });
    });

    return { headers, rows };
  }

  /**
   * Create a new Google Spreadsheet with all 11 tables pre-populated with seed data
   */
  public async createAndSeedSpreadsheet(accessToken: string): Promise<string> {
    this.state.isLoading = true;
    this.state.error = null;
    this.notify();

    try {
      // 1. Create spreadsheet with all 11 sheets
      const createPayload = {
        properties: {
          title: 'AutoAce Zambia - Live Operations Database'
        },
        sheets: SHEET_NAMES.map((title) => ({
          properties: {
            title,
            gridProperties: {
              frozenRowCount: 1
            }
          }
        }))
      };

      const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(createPayload)
      });

      if (!createRes.ok) {
        const errJson = await createRes.json().catch(() => ({}));
        throw new Error(errJson.error?.message || `Failed to create Google Spreadsheet (${createRes.status})`);
      }

      const createdData = await createRes.json();
      const spreadsheetId = createdData.spreadsheetId;
      const spreadsheetUrl = createdData.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

      // 2. Populate all 11 sheets with seed headers and records
      const valueData = SHEET_NAMES.map((name) => {
        const { headers, rows } = this.prepareSheetData(name as keyof typeof autoAceDatabase);
        return {
          range: `${name}!A1`,
          values: [headers, ...rows]
        };
      });

      const seedRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          valueInputOption: 'USER_ENTERED',
          data: valueData
        })
      });

      if (!seedRes.ok) {
        console.warn('Initial values batchUpdate returned warning, proceeding with spreadsheet ID');
      }

      // 3. Update state and save
      localStorage.setItem(STORAGE_KEY_SPREADSHEET_ID, spreadsheetId);
      localStorage.setItem(STORAGE_KEY_SPREADSHEET_NAME, 'AutoAce Zambia - Live Operations Database');

      this.state.isConnected = true;
      this.state.spreadsheetId = spreadsheetId;
      this.state.spreadsheetName = 'AutoAce Zambia - Live Operations Database';
      this.state.spreadsheetUrl = spreadsheetUrl;
      this.state.lastSyncedAt = new Date();
      this.state.isLoading = false;
      this.state.error = null;

      // Sync and load the data into the DAL
      await this.syncFromSpreadsheet(spreadsheetId, accessToken);

      this.notify();
      return spreadsheetId;
    } catch (err: any) {
      this.state.isLoading = false;
      this.state.error = err.message || 'Failed to create spreadsheet';
      this.notify();
      throw err;
    }
  }

  /**
   * Link an existing Google Spreadsheet ID
   */
  public async linkExistingSpreadsheet(spreadsheetId: string, accessToken: string): Promise<void> {
    const cleanId = spreadsheetId.includes('/d/') 
      ? spreadsheetId.split('/d/')[1].split('/')[0] 
      : spreadsheetId.trim();

    if (!cleanId) throw new Error('Invalid Spreadsheet ID or URL');

    this.state.isLoading = true;
    this.state.error = null;
    this.notify();

    try {
      await this.syncFromSpreadsheet(cleanId, accessToken);
      localStorage.setItem(STORAGE_KEY_SPREADSHEET_ID, cleanId);
      this.state.spreadsheetId = cleanId;
      this.state.spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${cleanId}/edit`;
      this.state.isConnected = true;
      this.state.isLoading = false;
      this.notify();
    } catch (err: any) {
      this.state.isLoading = false;
      this.state.error = err.message || 'Failed to connect to existing spreadsheet';
      this.notify();
      throw err;
    }
  }

  /**
   * Read all 11 tables live from Google Sheets and load into the AutoAce Data Access Layer
   */
  public async syncFromSpreadsheet(spreadsheetId: string, accessToken: string): Promise<GoogleSheetsDatabase> {
    this.state.isLoading = true;
    this.state.error = null;
    this.notify();

    try {
      const ranges = SHEET_NAMES.map((name) => `ranges=${encodeURIComponent(name + '!A1:Z150')}`).join('&');
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchGet?${ranges}`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error?.message || `Google Sheets API read failed (${res.status})`);
      }

      const batchResult = await res.json();
      const valueRanges = batchResult.valueRanges || [];

      const parsedData: Partial<GoogleSheetsDatabase> = {};
      let totalRows = 0;

      valueRanges.forEach((rangeObj: { range: string; values?: any[][] }) => {
        const sheetTitleMatch = rangeObj.range.match(/^'?([^'!]+)'?!/);
        const sheetTitle = sheetTitleMatch ? sheetTitleMatch[1] : '';
        const rows = rangeObj.values || [];

        if (rows.length > 1) {
          const headers = rows[0] as string[];
          const dataRows = rows.slice(1);
          totalRows += dataRows.length;

          const objects = dataRows.map((r) => {
            const obj: Record<string, any> = {};
            headers.forEach((header, idx) => {
              const raw = r[idx];
              obj[header] = this.coerceValue(header, raw);
            });
            return obj;
          });

          parsedData[sheetTitle as keyof GoogleSheetsDatabase] = objects as any;
        } else if (rows.length === 1) {
          parsedData[sheetTitle as keyof GoogleSheetsDatabase] = [] as any;
        }
      });

      // Construct live typed database
      const liveDatabase: GoogleSheetsDatabase = {
        business: (parsedData.business as BusinessRecord[]) || autoAceDatabase.business,
        kpis: (parsedData.kpis as KpiRecord[]) || autoAceDatabase.kpis,
        buyers: (parsedData.buyers as BuyerRecord[]) || autoAceDatabase.buyers,
        seller_listings: (parsedData.seller_listings as SellerListingRecord[]) || autoAceDatabase.seller_listings,
        sellers: (parsedData.sellers as SellerRecord[]) || autoAceDatabase.sellers,
        agents: (parsedData.agents as AgentRecord[]) || autoAceDatabase.agents,
        connections: (parsedData.connections as ConnectionRecord[]) || autoAceDatabase.connections,
        transactions: (parsedData.transactions as TransactionRecord[]) || autoAceDatabase.transactions,
        content: (parsedData.content as ContentRecord[]) || autoAceDatabase.content,
        tasks: (parsedData.tasks as TaskRecord[]) || autoAceDatabase.tasks,
        business_events: (parsedData.business_events as BusinessEventRecord[]) || autoAceDatabase.business_events,
        dashboard_formulas: autoAceDAL.getDashboardFormulas()
      };

      // Feed live database directly into AutoAce Data Access Layer
      autoAceDAL.setDatabase(liveDatabase, {
        isLive: true,
        source: 'Google Sheets',
        spreadsheetId,
        lastSyncedAt: new Date()
      });

      this.state.isConnected = true;
      this.state.spreadsheetId = spreadsheetId;
      this.state.lastSyncedAt = new Date();
      this.state.rowCountTotal = totalRows;
      this.state.isLoading = false;
      this.state.error = null;
      this.notify();

      return liveDatabase;
    } catch (err: any) {
      this.state.isLoading = false;
      this.state.error = err.message || 'Sync failed';
      this.notify();
      throw err;
    }
  }

  /**
   * Type coercion helper for spreadsheet cells
   */
  private coerceValue(header: string, rawVal: any): any {
    if (rawVal === undefined || rawVal === null || rawVal === '') {
      return '';
    }

    const str = String(rawVal).trim();

    // Numeric fields
    const isNumberField = 
      header.includes('budget') ||
      header.includes('price') ||
      header.includes('revenue') ||
      header.includes('commission') ||
      header.includes('sale_value') ||
      header.includes('views') ||
      header.includes('likes') ||
      header.includes('comments') ||
      header.includes('shares') ||
      header.includes('inquiries') ||
      header.includes('requests') ||
      header.includes('sales') ||
      header.includes('year') ||
      header.includes('rate') ||
      header.includes('fee') ||
      header.includes('leads') ||
      header.includes('deals');

    if (isNumberField) {
      // Strip currency markers and commas like "K63,600" or "$45,000"
      const cleanNum = str.replace(/[K$,]/g, '').trim();
      const num = Number(cleanNum);
      return isNaN(num) ? str : num;
    }

    // Boolean fields
    if (str.toUpperCase() === 'TRUE') return true;
    if (str.toUpperCase() === 'FALSE') return false;

    return str;
  }
}

export const googleSheetsAdapter = new GoogleSheetsDataAdapter();
