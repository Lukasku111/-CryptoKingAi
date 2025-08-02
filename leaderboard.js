
export default async function handler(_, res) {
  const tokens = Array.from({ length: 5 }).map((_, i) => ({
    name: `SOL-MEME-${i + 1}`,
    address: `SoLToKenMintAddr${i + 1}`,
    score: Math.floor(Math.random() * 20 + 80),
    rugRisk: i < 2 ? "Low" : "Medium",
    momentum: i < 2 ? "🚀 High" : "Moderate",
  }));

  return res.status(200).json({ tokens });
}
