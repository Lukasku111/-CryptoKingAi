
'use client';
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Line } from "react-chartjs-2";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const dummyData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Portfolio Value ($)",
      data: [800, 920, 1100, 1450, 1700, 1950, 2300],
      fill: false,
      backgroundColor: "#10b981",
      borderColor: "#10b981",
    },
  ],
};

function PinLock({ onUnlock }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (input === "0429") {
      onUnlock();
    } else {
      setError("Incorrect PIN. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-4">🔒 CryptoKingAi Access</h1>
      <Input
        className="text-black mb-2"
        type="password"
        placeholder="Enter 4-digit PIN"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        maxLength={4}
      />
      <Button onClick={handleSubmit}>Unlock</Button>
      {error && <p className="mt-2 text-red-500">{error}</p>}
    </div>
  );
}

export default function CryptoKingAiDashboard() {
  const [wallet, setWallet] = useState("");
  const [aiInsight, setAIInsight] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [scoredToken, setScoredToken] = useState(null);
  const [tokenInput, setTokenInput] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);

  const getAIInsight = async () => {
    const prompt = `You're an expert Solana analyst. Analyze wallet ${wallet} for recent meme coin purchases, whale behavior, risk levels, and growth potential. Recommend the most promising Solana memecoins to buy now.`;
    const res = await fetch("/api/ai-insight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    setAIInsight(data.insight);
  };

  const getTokenScore = async () => {
    const res = await fetch("/api/score-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: tokenInput }),
    });
    const data = await res.json();
    setScoredToken(data);
  };

  const fetchLeaderboard = async () => {
    const res = await fetch("/api/leaderboard");
    const data = await res.json();
    setLeaderboard(data.tokens);
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  if (!unlocked) return <PinLock onUnlock={() => setUnlocked(true)} />;

  return (
    <Tabs defaultValue="dashboard" className="p-6">
      <TabsList className="mb-4">
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="scanner">AI Token Scanner</TabsTrigger>
        <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
      </TabsList>

      <TabsContent value="dashboard">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-3">
            <CardContent>
              <h1 className="text-2xl font-bold mb-4">👑 CryptoKingAi — Solana Whale & MemeCoin AI</h1>
              <div className="flex gap-4 mb-4">
                <Input
                  placeholder="Enter Solana wallet address"
                  value={wallet}
                  onChange={(e) => setWallet(e.target.value)}
                />
                <Button onClick={getAIInsight}>Analyze</Button>
              </div>
              <div className="bg-muted p-4 rounded-xl shadow-sm">
                {aiInsight ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm whitespace-pre-line"
                  >
                    {aiInsight}
                  </motion.p>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    Enter a wallet to get AI-driven recommendations based on Solana whale activity.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-2">
            <CardContent>
              <h2 className="text-xl font-semibold mb-2">📊 Portfolio Growth Chart</h2>
              <Line data={dummyData} />
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h2 className="text-xl font-semibold mb-2">🧠 AI Risk & Hype Score</h2>
              <p className="text-sm text-muted-foreground">
                This panel scores each token on safety, virality, liquidity locks, and rug pull risk.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h2 className="text-xl font-semibold mb-2">🐋 Top Solana Whales</h2>
              <p className="text-sm text-muted-foreground">
                Tracking top wallets, recent meme token buys, and potential pumps.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h2 className="text-xl font-semibold mb-2">💬 AI Buy Signals</h2>
              <p className="text-sm text-muted-foreground">
                Live AI-generated buy signals based on on-chain wallet behavior and token momentum.
              </p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="scanner">
        <Card>
          <CardContent className="space-y-4">
            <h2 className="text-xl font-bold">🧠 AI Token Scanner</h2>
            <div className="flex gap-2">
              <Input
                placeholder="Paste Solana token CA (mint address)"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
              />
              <Button onClick={getTokenScore}>Scan</Button>
            </div>
            {scoredToken && (
              <div className="text-sm whitespace-pre-line bg-muted rounded-xl p-4">
                <p><strong>Score:</strong> {scoredToken.score}/100</p>
                <p><strong>Verdict:</strong> {scoredToken.verdict}</p>
                <p><strong>Details:</strong>
{JSON.stringify(scoredToken.details, null, 2)}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="leaderboard">
        <Card>
          <CardContent className="space-y-4">
            <h2 className="text-xl font-bold">🏆 Top-Ranked Tokens</h2>
            {leaderboard.length === 0 ? (
              <p className="text-sm text-muted-foreground">Loading leaderboard...</p>
            ) : (
              <div className="space-y-2">
                {leaderboard.map((token, idx) => (
                  <div key={token.address} className="p-4 rounded-xl bg-muted shadow">
                    <p className="font-semibold">#{idx + 1} — {token.name}</p>
                    <p><strong>Score:</strong> {token.score} / 100</p>
                    <p><strong>Rug Risk:</strong> {token.rugRisk}</p>
                    <p><strong>Momentum:</strong> {token.momentum}</p>
                    <Button className="mt-2 text-xs" onClick={() => navigator.clipboard.writeText(token.address)}>📋 Copy CA</Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
