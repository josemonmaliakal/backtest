const OpportunityCard = ({ data, onSelect }) => {
  return (
    <div className="col-lg-6">
      <div
        className="opportunity-card"
        onClick={() => onSelect(data)}
        style={{ cursor: "pointer" }}
      >
        <div className="d-flex justify-content-between mb-3">
          <div>
            <div className="stock-symbol">{data.symbol}</div>
            <div className="stock-name">{data.name}</div>
          </div>
          <span
            className={`signal-badge ${
              data.signal === "BUY" ? "signal-buy" : "signal-sell"
            }`}
          >
            {data.signal}
          </span>
        </div>

        <div className="mb-3">
          {data.strategies.map((s, i) => (
            <span key={i} className="strategy-badge me-2">
              {s}
            </span>
          ))}
        </div>

        <div className="row">
          <div className="col-6">
            <div className="metric-item">
              <span className="metric-label">Current Price</span>
              <span className="metric-value">${data.price}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Target</span>
              <span className="metric-value positive">${data.target}</span>
            </div>
          </div>
          <div className="col-6">
            <div className="metric-item">
              <span className="metric-label">Backtest Return</span>
              <span className="metric-value positive">
                +{data.backtest}%
              </span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Win Rate</span>
              <span className="metric-value">{data.winRate}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunityCard;
