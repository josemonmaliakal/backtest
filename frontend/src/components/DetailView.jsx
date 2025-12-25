import { useEffect, useState } from "react";
import PriceChart from "./PriceChart";
import { formatDate } from "../utils/FormatDate";

const DetailView = ({ stock, onBack }) => {
    const INITIAL_CAPITAL = 100000;
    const [netProfit, setNetProfit] = useState(0);
    const [signals, setSignals]=useState([]);
    const [fySummary, setFySummary] = useState({});
    const [dma, setDMA] = useState(0);
    const [dmaDeviation, setDmaDeviation] = useState(0);
    const [profitPct, setProfitPct] = useState(0);
    const [cagr, setCagr] = useState(0);
    /* ---------------- HELPERS ---------------- */
    const extractSignals = (priceData, limit = 3) => {
    const result = [];
    priceData.forEach(row => {
      if (row.BuySignal === "1") {
        result.push({
          type: "BUY",
          date: row.Date,
          price: Number(row.BuyPrice || row.Close)
        });
      }

      if (row.SellSignal === "1") {
        result.push({
          type: "SELL",
          date: row.Date,
          price: Number(row.SellPrice || row.Close)
        });
      }
    });
    return result
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
    };
    /*  EFFECT ---------------- */
    useEffect(() => {
        let firstDate = null;
        let lastDate = null;
        // Recent signals
        setSignals(extractSignals(stock.priceData));
        // FY Summary
        stock.tradeData.forEach(row => {
        console.log(row);
        if (row.key === "FYSummary") {
            const parsed = JSON.parse(row.value.replace(/'/g, '"'));
            setFySummary(parsed);
            if (parsed.length > 0) {
                firstDate = new Date(parsed[0].buyDate);
                lastDate = new Date(parsed[parsed.length - 1].sellDate);
            }
        }
        if (row.key === "NetProfit") {
                const np = Number(row.value);
                setNetProfit(np);
                setProfitPct((np / INITIAL_CAPITAL) * 100);
                if (firstDate && lastDate) {
                    const years =
                    (lastDate - firstDate) / (1000 * 60 * 60 * 24 * 365);
                    const cagrValue =
                    (Math.pow(final / INITIAL_CAPITAL, 1 / years) - 1) * 100;
                    setCagr(cagrValue);
                }
        }
        if (row.key==="DMA"){
            setDMA(row.value);
        }
        if (row.key=="Deviation"){
            setDmaDeviation(row.value);
        }
        });
    }, [stock]);

  /* ---------------- RENDER ---------------- */

  return (
    <div className="container-fluid mt-4 detail-view">

    <div className="row mb-4">
              <div className="col-12">
                <span className="back-button" onClick={onBack}>
                    <i className="bi bi-arrow-left"></i> Back to Opportunities
                </span>
              </div>
    </div>
    <div className="row mb-4">
        <div className="col-md-4">
            <div className="stat-card">
                <div className="stat-label">{stock.name}</div>
                <div className="row">
                          <div className="col-md-12">
                              <div className="metric-item">
                                  <span className="stat-value">{stock.symbol}</span>
                              </div>
                          </div>
                </div>
                <div className="row">
                          <div className="col-md-12">
                              <span className="signal-badge signal-buy" id="detailSignal">BUY</span>
                               <span className="signal-badge" >100 INR</span>                                
                          </div>
                </div>
            </div>
        </div>
        <div className="col-md-8">
            <div className="stat-card">
                <div className="stat-label">Backtest Summary : RSI Crossover + 200 DMA </div>
                <div className="row">
                          <div className="col-md-12">
                              <div className="metric-item">
                                  <span className="stat-value"></span>
                              </div>
                          </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <div className="metric-item">
                                  <span className="metric-label">Net Return</span>
                                  <span className={`metric-value ${netProfit >= 0 ? "positive" : "negative"}`}>
                                        ₹{netProfit.toFixed(2)}
                                    </span>
                        </div>
                        <div className="metric-item">
                                  <span className="metric-label">Profit / Loss %</span>
                                   <span className={`metric-value ${profitPct >= 0 ? "positive" : "negative"}`}>
                                        {profitPct.toFixed(2)}%
                                   </span>
                        </div>
                        <div className="metric-item">
                                  <span className="metric-label">CAGR</span>
                                  <span className={`metric-value ${profitPct >= 0 ? "positive" : "negative"}`}>
                                        {cagr.toFixed(2)}%
                                   </span>
                        </div>
                    </div>
                    <div className="col-md-6">
                              <div className="metric-item">
                                  <span className="metric-label">DMA Days</span>
                                  <span className="metric-value">{dma}</span>
                              </div>
                              <div className="metric-item">
                                  <span className="metric-label">Deviation</span>
                                  <span className="metric-value">{dmaDeviation}%</span>
                              </div>
                             
                    </div>
                </div>
            </div>
        </div>
    </div>


      <div className="row mt-3">
        <div className="col-12">
          <PriceChart data={stock.priceData} />
        </div>
      </div>

      <div className="row mt-4">

        {/* RECENT SIGNALS */}
        <div className="col-md-4">
          <div className="stat-card">
            <h4 className="stat-label">Recent Signals</h4>

            {signals.length === 0 && (
              <p className="text-muted">No signals yet</p>
            )}

            <table className="table table-hover">
              <tbody>
                {signals.map((s, i) => (
                  <tr key={i}>
                    <td>
                      { formatDate(s.date)}
                    </td>
                    <td className={s.type === "BUY" ? "positive" : "negative"}>
                      {s.type}
                    </td>
                    <td className={s.type === "BUY" ? "positive" : "negative"}>
                      ₹{s.price.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FY PROFIT & LOSS */}
        <div className="col-md-8">
          <div className="stat-card">
            <h4 className="stat-label">PROFIT AND LOSS (FY)</h4>

            <table className="table table-sm">
              <thead>
                <tr>
                  <th>F.Y</th>
                  <th>Avg Buy</th>
                  <th>Avg Sell</th>
                  <th>Units</th>
                  <th>P&L</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(fySummary).map(([fy, r]) => (
                  <tr key={fy}>
                    <td>{fy}</td>
                    <td>{r.avgBuy.toFixed(2)}</td>
                    <td>{r.avgSell.toFixed(2)}</td>
                    <td>{r.units}</td>
                    <td className={r.net >= 0 ? "positive" : "negative"}>
                      ₹{r.net.toFixed(2)}
                    </td>
                  </tr>                 
                  
                ))}
                <tr >
                    <td colSpan={4} className="text-start fw-bold">
                    NET PROFIT
                    </td>
                    <td className={`fw-bold ${netProfit >= 0 ? "positive" : "negative"}`}>
                    ₹{netProfit.toFixed(2)}
                    </td>
                </tr>
              </tbody>
            </table>

          </div>
        </div>

      </div>
    </div>
  );
};

export default DetailView;

