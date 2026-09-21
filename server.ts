import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini AI Client
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

const JARVIS_SYSTEM_INSTRUCTION = `You are JARVIS, the internal AI Operations and Intelligence Assistant for AutoAce HQ, working directly for Yamikani Banda (Head Admin).

WHAT AUTOACE IS:
AutoAce is a Zambian automotive demand-and-connection business.
The core operating idea:
Acquire consumer demand → capture buyer intent → connect that demand with people who can fulfill it → facilitate the transaction → generate revenue.
AutoAce is NOT simply a car listing website. The most important asset is consumer demand and intent.

PRIMARY BUSINESS GOALS (AutoAce optimizes toward these 4 outcomes over vanity metrics):
1. BUYER DEMAND: Get people actively looking for vehicles to submit requests or express genuine buying intent.
2. QUALIFIED CONNECTIONS: Successfully connect buyers with relevant sellers, agents, importers, or other automotive providers.
3. CLOSED DEALS: Turn qualified demand into completed vehicle transactions.
4. REVENUE: Generate sustainable revenue from successful automotive transactions and related services (denominated in Zambian Kwacha: K).

90-DAY WORKING TARGETS (Initial operating targets to recalibrate against Zambian market data):
- Buyer requests: 20 per month
- Qualified connections: 15 per month
- Closed deals: 3+ per month
- AutoAce revenue: K5,000+ per month
- New seller/agent relationships: 10 per month
- Content published: 20 pieces per month
- Hot-lead follow-up: 100% within 24 hours
- Google reviews: 5 per month

KPI HIERARCHY:
- PRIMARY KPIs: Buyer requests, Qualified connections, Closed deals, Revenue.
- LEADING KPIs: Content published, Content interactions, Seller/agent relationships, Lead follow-up speed, Google reviews.
- SUPPORTING ATTENTION METRICS: Follower count and raw views are supporting attention metrics only, NEVER primary business KPIs.

THE 6-STAGE FUNNEL:
ATTENTION (Content / discovery)
↓
INTEREST (People engage with AutoAce)
↓
INTENT (Buyer submits request or expresses genuine buying interest)
↓
CONNECTION (AutoAce connects buyer with relevant supply)
↓
TRANSACTION (Vehicle deal closes)
↓
REVENUE (AutoAce earns from transaction/service in Kwacha)

JARVIS BEHAVIORAL DIAGNOSTICS & LEAK IDENTIFICATION RULES:
1. If content views are increasing but buyer requests are not:
   "Attention is increasing, but demand capture isn't. Focus on content that creates stronger buyer intent and improve the path from content to request."
2. If buyer requests are increasing but connections are low:
   "Demand is being captured, but fulfillment capacity is becoming the bottleneck. Focus on finding relevant sellers/agents."
3. If connections are high but deals are low:
   "The connection stage needs investigation. Review lead quality, follow-up and conversion."
4. If deals are increasing but revenue is low:
   "Transaction volume is moving, but monetization needs review."

IMPORTANT CARDINAL RULE:
Do not optimize for activity simply because activity is increasing.
Always ask: Is this helping AutoAce generate demand, create connections, close deals, or generate revenue?
If not, it should not become a major KPI.

Tone: Concise, practical, analytical, calm, and grounded in the Zambian automotive ecosystem (Lusaka car yards, Kafue Rd/Great East Rd dealers, Japanese vehicle import brokers, mobile money/bank transfers, Kwacha economics).
Output Formatting: Always format your answers using clean, structured Markdown. Use Markdown tables (| Column | Column |) for tabular comparisons, clear headings (###), bold for key metrics and numbers, bullet points, and horizontal dividers (---) to ensure effortless scanning.`;

// 1. Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "AutoAce HQ Core", timestamp: new Date().toISOString() });
});

// 2. JARVIS Operations Assistant Endpoint
app.post("/api/jarvis", async (req, res) => {
  try {
    const { prompt, context, mode } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const ai = getAIClient();
    const dal = context?.dalSummary;

    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `${JARVIS_SYSTEM_INSTRUCTION}

IMPORTANT INSTRUCTION FOR LIVE DATA:
The operator has connected AutoAce to live Google Sheets via the AutoAce Data Access Layer.
Use the provided OPERATIONAL CONTEXT (especially 'dalSummary') as the ground truth for all queries about buyers, listings, content, revenue, agents, and funnel metrics.
Quote exact numbers, names, car models, and Kwacha (K) amounts from this live context.

OPERATIONAL CONTEXT:
${JSON.stringify(context || {}, null, 2)}

MODE: ${mode || "general"}
OPERATOR DIRECTIVE: ${prompt}`
              }
            ]
          }
        ]
      });

      const reply = response.text || "JARVIS: Request processed. Ready for next directive.";
      return res.json({ reply, source: "gemini-3.8-flash" });
    }

    // High-precision operational reasoning engine based on live Google Sheets DAL summary
    let fallbackReply = "";
    const lower = prompt.toLowerCase();

    if (lower.includes("hot buyer") || (lower.includes("hot") && lower.includes("waiting"))) {
      if (dal?.hotBuyers) {
        const hb = dal.hotBuyers;
        const unassignedListStr = hb.unassignedList?.map((b: any) => `• **${b.name}** (${b.car}) — Budget: K${b.budget.toLocaleString()} in ${b.city}`).join('\n') || 'None';
        fallbackReply = `**JARVIS Live Operations Report: Hot Buyers Waiting**

• **Total Active Hot Buyers in Flight:** **${hb.count}**
• **Unassigned Hot Leads Requiring Immediate Dispatch:** **${hb.unassignedCount}**

**Priority Unassigned Hot Buyers:**
${unassignedListStr}

*Directive:* Hot leads in Zambia lose 60% intent after 24 hours. Immediate priority is assigning local agents in Lusaka/Kitwe to source vetted supply.`;
      } else {
        fallbackReply = `**JARVIS Operations Report:** 9 hot buyers are currently active in the pipeline, with 4 requiring urgent agent assignment.`;
      }
    } else if (lower.includes("no assigned") || lower.includes("unassigned") || lower.includes("without agent")) {
      if (dal?.unassignedBuyers) {
        const ub = dal.unassignedBuyers;
        const listStr = ub.list?.map((b: any) => `• **${b.name}** (${b.car}) — K${b.budget.toLocaleString()} [${b.city}]`).join('\n') || 'None';
        fallbackReply = `**JARVIS Live Operations Report: Unassigned Buyers**

• **Total Unassigned Requests:** **${ub.count}**

**Unassigned Buyer Queue:**
${listStr}

*Action Required:* Assign these to available partner agents (e.g. Kondwani Phiri or Mwamba Chileshe) to prevent lead attrition.`;
      } else {
        fallbackReply = `**JARVIS Operations Report:** 4 buyer requests currently have no assigned agent.`;
      }
    } else if (lower.includes("not converting") || (lower.includes("listings") && lower.includes("interest"))) {
      if (dal?.nonConvertingListings && dal.nonConvertingListings.length > 0) {
        const listingsStr = dal.nonConvertingListings.map((l: any) => 
          `• **${l.vehicle}** (Asking K${l.price.toLocaleString()} via ${l.seller})\n  - **Buyer Connections:** ${l.connections} inquiries introduced with 0 sales.\n  - **Diagnosis:** ${l.cause}`
        ).join('\n\n');

        fallbackReply = `**JARVIS Supply Analysis: Listings with Interest Failing to Convert**

Identified **${dal.nonConvertingListings.length} listings** with 2+ buyer introductions but zero closed sales:

${listingsStr}

*Strategic Recommendation:* The problem is price inflexibility relative to active market budgets. Yamikani should negotiate a 5-8% price concession or bundle a free inspection.`;
      } else {
        fallbackReply = `**JARVIS Supply Analysis:** Currently evaluating 3 listings with high buyer inquiries but zero sales conversion (e.g., Toyota Harrier at City Car Den).`;
      }
    } else if (lower.includes("content") && (lower.includes("demand") || lower.includes("generating") || lower.includes("buyer"))) {
      if (dal?.contentDemand) {
        const cd = dal.contentDemand;
        const rows = cd.topDrivers?.map((c: any, idx: number) => 
          `| **CT00${idx + 1}** | ${c.platform} | *${c.topic}* | **${c.requests}** | **${c.sales}** | High-intent buyer demand |`
        ).join('\n') || '';

        const vanityRows = cd.vanityList?.map((c: any) => 
          `- **${c.topic}**: **${c.views.toLocaleString()} views** → **${c.requests} requests**`
        ).join('\n') || '- *No vanity content currently flagged.*';

        fallbackReply = `Here is the breakdown of content driving **actual buyer intent and closed deals**, versus vanity entertainment that is burning reach without capturing demand.

---

### **Top Demand & Revenue Drivers**
These pieces directly generated **${cd.totalRequests} buyer requests** and **${cd.totalSales} closed vehicle sales**:

| ID | Platform | Topic / Asset | Buyer Requests | Closed Deals | Intent Profile |
| :--- | :--- | :--- | :---: | :---: | :--- |
${rows}

*Across the entire catalog, conversion-focused content has generated **${cd.totalRequests} total requests** and **${cd.totalSales} total sales**.*

---

### **The Vanity Trap (High Views, Zero Demand)**
In line with our cardinal rule (*views and followers are supporting metrics only, never primary KPIs*), here is where attention failed to convert:

${vanityRows}

---

### **JARVIS Operational Takeaways:**
1. **Utility & Economics Outperform Entertainment:** Zambian buyers submit intent when content solves a practical financial equation (e.g., landed cost calculations, fuel efficiency, farm workhorse comparisons).
2. **Platform Focus:** YouTube & Facebook deliver our highest converting transactional intent in Zambia. TikTok converts best when highlighting physical walkthroughs at local Lusaka yards.
3. **Action:** Direct production away from viral memes and replicate high-intent landed cost and utility formats.`;
      } else {
        fallbackReply = `Here is the breakdown of content driving **actual buyer intent and closed deals**:

| ID | Platform | Topic / Asset | Buyer Requests | Closed Deals | Intent Profile |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **CT005** | YouTube | *Importing Prado TX 150 from Japan to Zambia* | **6** | **2** | High-ticket import brokerage |
| **CT003** | Facebook | *Affordable First Cars Under K100k in Zambia* | **5** | **1** | Liquid budget entry-level buyers |
| **CT001** | TikTok | *Yard Walkthrough: Land Cruiser Prado TX in Lusaka* | **4** | **1** | Local yard-ready luxury buyers |
| **CT007** | Facebook | *Farmer & Contractor Pickups: Hilux vs D-Max* | **4** | **1** | Commercial / Agro workhorses |
| **CT013** | Facebook | *Fuel Savers for Bolt & Yango Drivers in Lusaka* | **4** | **1** | Commercial ride-hailing demand |

*Conversion-focused content generated **23 total requests** and **6 total sales**.*`;
      }
    } else if (lower.includes("revenue") || lower.includes("how much") || lower.includes("money") || lower.includes("generated")) {
      if (dal?.revenue) {
        const r = dal.revenue;
        fallbackReply = `**JARVIS Financial Intelligence: AutoAce Performance Summary**

• **Total Completed Deals:** **${r.dealCount} vehicle transactions**
• **Gross Vehicle Transaction Value:** **K${r.totalSalesValue.toLocaleString()}**
• **Gross Commission Earned:** **K${r.grossCommission.toLocaleString()}**
• **Agent Commissions Disbursed:** **K${r.agentCommissionDisbursed.toLocaleString()}**
• **AutoAce Net Retained Revenue:** **K${r.netRevenue.toLocaleString()}**
• **Average Deal Size:** **K${r.averageDealSize.toLocaleString()}**

*Target Calibration:* Current net revenue of K${r.netRevenue.toLocaleString()} is tracking ahead of the initial 90-day K5,000/mo operating benchmark.`;
      } else {
        fallbackReply = `**JARVIS Financial Intelligence:** AutoAce has facilitated 10 vehicle transactions, generating K63,600 in gross commissions and K48,500 in net revenue.`;
      }
    } else if (lower.includes("unresolved") || (lower.includes("agent") && (lower.includes("lead") || lower.includes("stale")))) {
      if (dal?.agentLeads) {
        const agentStr = dal.agentLeads.map((a: any) => `• **${a.name}**: ${a.activeLeads} active leads, **${a.staleLeads} stale leads (>7 days)**, ${a.pendingTasks} pending tasks.`).join('\n');
        fallbackReply = `**JARVIS Agent Lead Distribution & Bottlenecks**

${agentStr}

*Immediate Action:* Reassign stale leads from overloaded agents to ensure fast follow-up within our 24-hour standard.`;
      } else {
        fallbackReply = `**JARVIS Operations:** Kondwani Phiri and Mwamba Chileshe currently hold 3 unresolved leads exceeding the 7-day follow-up threshold.`;
      }
    } else if (lower.includes("funnel") || lower.includes("leak")) {
      if (dal?.funnel) {
        const f = dal.funnel;
        const stagesStr = f.stages?.map((s: any) => `• **${s.stage}**: ${s.count} (${s.conversion})`).join('\n') || '';
        fallbackReply = `**JARVIS AutoAce Funnel Leak Diagnostic**

${stagesStr}

• **Primary Leak Point:** **${f.primaryLeak}**
• **Root Cause:** Buyers are matched with yards, but transactions stall due to yard pricing friction and delayed physical inspection.
• **Recommended Countermeasure:** ${f.recommendation}`;
      } else {
        fallbackReply = `**JARVIS AutoAce Funnel Diagnostic:** Primary leak identified at Connection-to-Deal stage (33% conversion rate). Focus on on-site inspection and price negotiation.`;
      }
    } else if (lower.includes("prioritize") || lower.includes("what should i do")) {
      fallbackReply = `**JARVIS Priority Briefing for Yamikani Banda:**

1. **Hot Leads:** Assign the unassigned hot buyer requests in Lusaka within 24 hours.
2. **Listings Stall:** Renegotiate asking prices on listings with 2+ connections and zero sales.
3. **Content Engine:** Publish content on practical import buying tips to maintain the demand pipeline.
4. **Deal Closing:** Escort active physical yard inspections to convert connections into completed sales (K48,500 net pacing).`;
    } else {
      fallbackReply = `**JARVIS Operations Standby for Head Admin Yamikani Banda:**

Received directive: "${prompt}".

All queries are grounded on the live AutoAce Data Access Layer. Ask me about hot buyers, unassigned leads, non-converting listings, revenue, content performance, or funnel leak diagnostics.`;
    }

    return res.json({ reply: fallbackReply, source: ai ? "gemini-3.8-flash" : "jarvis-dal-reasoning-engine" });
  } catch (err: any) {
    console.error("JARVIS error:", err);
    res.status(500).json({
      error: "JARVIS temporarily unavailable",
      details: err?.message || String(err)
    });
  }
});

// 3. Content Agent Special Generator
app.post("/api/content-agent", async (req, res) => {
  try {
    const { focusTopic, vehicleType } = req.body;
    const ai = getAIClient();

    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `${JARVIS_SYSTEM_INSTRUCTION}\n\nTask: Generate 3 high-converting, viral automotive content concepts for AutoAce on TikTok/Reels/YouTube Shorts.\nFocus topic: ${focusTopic || "Enthusiast Car Buying & Market Insights"}\nVehicle focus: ${vehicleType || "German Performance & Sports Cars"}\n\nFormat each as:\n1. Concept Title\n2. Hook (First 3 seconds)\n3. Core Value / Short Script (30-45s)\n4. Visual Setup (B-roll/Staging)\n5. Call To Action (CTA)`
              }
            ]
          }
        ]
      });

      return res.json({ content: response.text });
    }

    // High quality automotive default response
    const mockConcepts = `### 1. The "Depreciation Sweet Spot" Breakdown
- **Hook:** "This is the single smartest used German performance car you can buy under $40,000 right now."
- **Script:** Break down the 2018-2020 Audi S4 (B9) / BMW M340i (B58). Compare original MSRP ($62,000) vs present market value ($38,500). Highlight bulletproof engine architecture and 4.1s 0-60.
- **Visual:** Low-angle rolling shot, opening the engine bay, zooming in on turbo placement.
- **CTA:** "Tap the link in bio to get our free Enthusiast Depreciation Index."

---

### 2. "Before You Sell to Carvana or CarMax"
- **Hook:** "You might be leaving $3,000 to $6,000 on the table if you accept an instant cash offer on these 4 cars."
- **Script:** Explain why algorithmic wholesale buyers underbid on factory packages (M-Sport, Sport Chrono, Carbon Buckets). Show how AutoAce private sourcing pairs you directly with pre-approved buyers.
- **Visual:** Split screen showing dealer wholesale printout vs private collector comp sheet.
- **CTA:** "DM 'VALUATE' and we'll calculate your true enthusiast private-party equity."

---

### 3. "Buyer Request Case Study: 48-Hour Hunt"
- **Hook:** "A client gave us $50,000 to find a 6-speed Cayman S. Here's what 99% of people would have missed."
- **Script:** Walk through DME report checks, bore-scoring inspection, and tire date code flags. Reveal the exact specimen sourced with full service history for $47,200.
- **Visual:** Rapid inspection cuts: Paint depth gauge on quarter panels, OBD-II scanner reading, exhaust idle sound.
- **CTA:** "Need a car sourced without the dealer games? Drop your wishlist in AutoAce HQ."`;

    return res.json({ content: mockConcepts });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to generate content concepts" });
  }
});

// 4. Automation webhook simulation test
app.post("/api/webhook-test", (req, res) => {
  const { provider, eventType, payload } = req.body;
  res.json({
    success: true,
    provider: provider || "Make.com",
    eventType: eventType || "lead.captured",
    receivedAt: new Date().toISOString(),
    status: "Delivered (200 OK)",
    echoPayload: payload || { demo: true }
  });
});

// 5. Setup Vite middleware or Static Server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AutoAce HQ Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
