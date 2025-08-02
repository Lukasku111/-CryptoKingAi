
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Missing prompt" });

  const mockResponse = `📊 Analysis for Wallet:

- Whale-like activity detected
- Active in meme coin buys (5 in last 24h)
- No signs of dumping
- AI Recommendation: BUY $PUMP, $HYPE, $GIGA`;

  return res.status(200).json({ insight: mockResponse });
}
