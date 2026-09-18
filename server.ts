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

Tone: Concise, practical, analytical, calm, and grounded in the Zambian automotive ecosystem (Lusaka car yards, Kafue Rd/Great East Rd dealers, Japanese vehicle import brokers, mobile money/bank transfers, Kwacha economics).`;

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

    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `${JARVIS_SYSTEM_INSTRUCTION}\n\nOPERATIONAL CONTEXT:\n${JSON.stringify(
                  context || {}
                )}\n\nMODE: ${mode || "general"}\n\nOPERATOR REQUEST: ${prompt}`
              }
            ]
          }
        ]
      });

      const reply = response.text || "JARVIS: Request processed. Ready for next directive.";
      return res.json({ reply, source: "gemini-3.8-flash" });
    }

    // Fallback operational reasoning if no GEMINI_API_KEY is configured
    let fallbackReply = "";
    const lower = prompt.toLowerCase();

    if (lower.includes("funnel") || lower.includes("leak") || lower.includes("kpi") || lower.includes("diagnostic")) {
      fallbackReply = `**JARVIS AutoAce Funnel Diagnostic:**\n\n• **Funnel Status:** Evaluating Attention → Interest → Intent → Connection → Transaction → Revenue.\n• **Key Rule Enforced:** "Do not optimize for activity simply because activity is increasing. Always ask: Is this helping AutoAce generate demand, create connections, close deals, or generate revenue?"\n\n**Operating Heuristics:**\n1. If views rise but requests lag: *"Attention is increasing, but demand capture isn't. Focus on content that creates stronger buyer intent and improve the path from content to request."*\n2. If requests rise but connections lag: *"Demand is being captured, but fulfillment capacity is becoming the bottleneck. Focus on finding relevant sellers/agents."*\n3. If connections rise but deals lag: *"The connection stage needs investigation. Review lead quality, follow-up and conversion."*\n4. If deals rise but revenue lags: *"Transaction volume is moving, but monetization needs review (90-day target: K5,000+/mo)."*`;
    } else if (lower.includes("prioritize") || lower.includes("what should i do")) {
      fallbackReply = `**JARVIS AutoAce Priority Briefing for Yamikani Banda:**\n\n1. **Intent & Demand (Primary 1):** Follow up with hot buyer requests submitted in Lusaka within 24 hours (90-Day Target: 20 requests/mo, 100% follow-up).\n2. **Fulfillment Connections (Primary 2):** Connect active buyers to vetted Lusaka car yards & Japanese import agents (90-Day Target: 15 connections/mo, 10 new seller relationships).\n3. **Deals & Revenue (Primary 3 & 4):** Facilitate physical inspections and closing escrow to pace toward 3+ closed deals and K5,000+ revenue this month.\n\n*Reminder: Vanity metrics (followers/views) are supporting attention only. Optimize strictly for demand, connections, deals, and revenue.*`;
    } else if (lower.includes("content") || lower.includes("hook") || lower.includes("script")) {
      fallbackReply = `**JARVIS Content Strategy (Demand-Generating):**\n\n- **Objective:** Convert attention into concrete vehicle requests in Zambia (not empty views).\n- **Hook:** "Looking to buy a clean Toyota RunX or Nissan X-Trail in Lusaka under K120,000?"\n- **Script (35s):** Breakdown common gearbox & suspension traps on local Zambian imports. Explain how AutoAce verifies chassis condition before you hand over cash.\n- **Call To Action:** "Don't gamble your hard-earned Kwacha. Submit your exact budget and vehicle request to AutoAce, and we will source and verify it."`;
    } else if (lower.includes("target") || lower.includes("90-day") || lower.includes("goal")) {
      fallbackReply = `**AutoAce 90-Day Working Targets:**\n\n• **Buyer Requests:** 20 / month\n• **Qualified Connections:** 15 / month\n• **Closed Deals:** 3+ / month\n• **AutoAce Revenue:** K5,000+ / month\n• **New Seller/Agent Relationships:** 10 / month\n• **Content Published:** 20 pieces / month\n• **Hot-Lead Follow-up:** 100% within 24 hours\n• **Google Reviews:** 5 / month\n\n*Note: These are initial operating benchmarks to be recalibrated as Zambian transaction data accumulates.*`;
    } else {
      fallbackReply = `**JARVIS Operations Standby for Head Admin Yamikani Banda:**\n\nReceived directive: "${prompt}".\n\nOperational check: Ensure the focus remains strictly on the 4 primary business outcomes: (1) Buyer Demand, (2) Qualified Connections, (3) Closed Deals, and (4) Revenue (ZMW). Ready to analyze metrics or sequence today's priorities.`;
    }

    return res.json({ reply: fallbackReply, source: "jarvis-operational-engine" });
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
