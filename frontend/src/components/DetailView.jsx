const DetailView = ({ stock, onBack }) => {
  /*return (
    <div className="container-fluid mt-4 detail-view">
      <span className="back-button" onClick={onBack}>
        <i className="bi bi-arrow-left"></i> Back to Opportunities
      </span>

      <div className="row my-4">
        <div className="col-md-8">
          <h1>{stock.symbol}</h1>
          <div className="stock-name">{stock.name}</div>
        </div>
        <div className="col-md-4">
          <div className="stat-card">
            <div className="stat-label">Current Price</div>
            <div className="stat-value">${stock.price}</div>
          </div>
        </div>
      </div>

      <h3 className="section-title">Price & Signals Chart</h3>
      <div className="chart-container text-center">
        <i className="bi bi-graph-up" style={{ fontSize: "3rem" }}></i>
        <p>Chart will be rendered here</p>
      </div>
    </div>
  );*/
  return(
          <div class="container-fluid mt-4 detail-view" id="detailView">
            <div class="row mb-4">
              <div class="col-12">
                <span class="back-button" onClick={onBack}>
                    <i class="bi bi-arrow-left"></i> Back to Opportunities
                </span>
              </div>
            </div>
            <div class="row mb-4">
              <div class="col-md-8">
                  <div class="d-flex justify-content-between align-items-start">
                      <div>
                          <h1 class="stock-symbol mb-1" id="detailSymbol">AAPL</h1>
                          <div class="stock-name" id="detailName">Apple Inc.</div>
                      </div>
                      <span class="signal-badge signal-buy" id="detailSignal">BUY</span>
                  </div>
              </div>
              <div class="col-md-4">
                  <div class="stat-card">
                      <div class="stat-label">Current Price</div>
                      <div class="stat-value" id="detailPrice">$185.92</div>
                      <div class="trend-indicator positive">
                          <i class="bi bi-arrow-up"></i> +2.4% today
                      </div>
                  </div>
              </div>
            </div>
            <div class="row mb-4">
              <div class="col-12">
                  <div class="backtest-summary">
                      <h3 class="mb-4">Backtest Summary</h3>
                      <div class="row">
                          <div class="col-md-3">
                              <div class="metric-item">
                                  <span class="metric-label">Strategy</span>
                                  <span class="metric-value">RSI Crossover + 200 DMA</span>
                              </div>
                          </div>
                          <div class="col-md-3">
                              <div class="metric-item">
                                  <span class="metric-label">Total Return</span>
                                  <span class="metric-value positive">+28.4%</span>
                              </div>
                          </div>
                          <div class="col-md-3">
                              <div class="metric-item">
                                  <span class="metric-label">Win Rate</span>
                                  <span class="metric-value">72%</span>
                              </div>
                          </div>
                          <div class="col-md-3">
                              <div class="metric-item">
                                  <span class="metric-label">Total Trades</span>
                                  <span class="metric-value">43</span>
                              </div>
                          </div>
                      </div>
                      <div class="row mt-3">
                          <div class="col-md-3">
                              <div class="metric-item">
                                  <span class="metric-label">Max Drawdown</span>
                                  <span class="metric-value negative">-12.3%</span>
                              </div>
                          </div>
                          <div class="col-md-3">
                              <div class="metric-item">
                                  <span class="metric-label">Sharpe Ratio</span>
                                  <span class="metric-value">1.84</span>
                              </div>
                          </div>
                          <div class="col-md-3">
                              <div class="metric-item">
                                  <span class="metric-label">Avg Win</span>
                                  <span class="metric-value positive">+4.8%</span>
                              </div>
                          </div>
                          <div class="col-md-3">
                              <div class="metric-item">
                                  <span class="metric-label">Avg Loss</span>
                                  <span class="metric-value negative">-2.1%</span>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                  <h3 class="section-title">Price & Signals Chart</h3>
                  <div class="chart-container">
                      <div class="text-center">
                          <i class="bi bi-graph-up" style="font-size: 3rem;"></i>
                          <p class="mt-3">Chart will be rendered here with your charting library (Chart.js, Recharts, or Plotly)</p>
                      </div>
                  </div>
              </div>
            </div>
            <div class="row mt-4">
              <div class="col-md-6">
                  <div class="stat-card">
                      <h4 class="mb-3">Recent Signals</h4>
                      <div class="metric-item">
                          <span class="metric-label">Dec 20, 2024</span>
                          <span class="metric-value positive">BUY @ $182.50</span>
                      </div>
                      <div class="metric-item">
                          <span class="metric-label">Nov 15, 2024</span>
                          <span class="metric-value negative">SELL @ $195.20</span>
                      </div>
                      <div class="metric-item">
                          <span class="metric-label">Oct 28, 2024</span>
                          <span class="metric-value positive">BUY @ $178.30</span>
                      </div>
                  </div>
              </div>
              <div class="col-md-6">
                  <div class="stat-card">
                      <h4 class="mb-3">Strategy Parameters</h4>
                      <div class="metric-item">
                          <span class="metric-label">RSI Period</span>
                          <span class="metric-value">14 days</span>
                      </div>
                      <div class="metric-item">
                          <span class="metric-label">RSI Oversold</span>
                          <span class="metric-value">30</span>
                      </div>
                      <div class="metric-item">
                          <span class="metric-label">RSI Overbought</span>
                          <span class="metric-value">70</span>
                      </div>
                      <div class="metric-item">
                          <span class="metric-label">DMA Period</span>
                          <span class="metric-value">200 days</span>
                      </div>
                  </div>
              </div>
            </div>
          </div>
        );
      };

export default DetailView;

