
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { token } = req.body;
  if (!token) return res.status(400).json({ error: "Missing token address" });

  // Simulated score logic
  const score = Math.floor(Math.random() * 40 + 60); // Between 60-100
  const verdict = score > 85 ? "Very Safe & Trending" : score > 70 ? "Promising but Risky" : "High Rug Risk";

  return res.status(200).json({
    token,
    score,
    verdict,
    details: {
      liquidity: "Locked",
      holders: Math.floor(Math.random() * 10000),
      telegramMentions: Math.floor(Math.random() * 5000),
      whaleBuys: Math.floor(Math.random() * 10),
    },
  });
}
