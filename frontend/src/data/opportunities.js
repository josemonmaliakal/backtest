export const opportunities = [
  {
    symbol: "BCLIND",
    name: "BCL INDUSTRIES",
    signal: "BUY",
    strategies: ["RSI Crossover", "200 DMA"],
    price: 185.92,
    target: 198.5,
    backtest: 28.4,
    winRate: 72,
    csvPath: "/data/BCLIND.csv"
    
  },
  {
    symbol: "GPPL",
    name: "Gujarath Pipaval Ports",
    signal: "BUY",
    strategies: ["Moving Avg Crossover"],
    price: 248.15,
    target: 275,
    backtest: 35.2,
    winRate: 68,
    csvPath : "/data/GPPL.csv"
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    signal: "SELL",
    strategies: ["200 DMA Variation"],
    price: 425.8,
    target: 398.2,
    backtest: 22.1,
    winRate: 65,
    priceData : "/data/GPPL.csv"
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    signal: "BUY",
    strategies: ["RSI Crossover", "Moving Avg"],
    price: 495.22,
    target: 540,
    backtest: 42.7,
    winRate: 76,
    priceData : "/data/GPPL.csv"
  },
];
