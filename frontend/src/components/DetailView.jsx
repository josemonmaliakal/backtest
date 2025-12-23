const DetailView = ({ stock, onBack }) => {
  return(
          <div className="container-fluid mt-4 detail-view" id="detailView">
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
                              <span class="signal-badge signal-buy" id="detailSignal">BUY</span>
                               <span class="signal-badge" >100 INR</span>
                                
                          </div>
                    </div>
                      
                  </div>
              </div>
               <div className="col-md-8">
                  <div className="stat-card">
                      <div className="stat-label">Backtest Summary</div>
                      <div className="row">
                          <div className="col-md-12">
                              <div className="metric-item">
                                  <span className="stat-value">RSI Crossover + 200 DMA</span>
                              </div>
                          </div>
                      </div>
                      <div className="row">
                          <div className="col-md-3">
                              <div className="metric-item">
                                  <span className="metric-label">Total Return</span>
                                  <span className="metric-value positive">+28.4%</span>
                              </div>
                          </div>
                          <div className="col-md-3">
                              <div className="metric-item">
                                  <span className="metric-label">Win Rate</span>
                                  <span className="metric-value">72%</span>
                              </div>
                          </div>
                          <div className="col-md-3">
                              <div className="metric-item">
                                  <span className="metric-label">Total Trades</span>
                                  <span className="metric-value">43</span>
                              </div>
                          </div>
                      </div>
                      
                  </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                  <h3 className="section-title">Price & Signals Chart</h3>
                  <div className="chart-container">
                      <div className="text-center">
                          <i className="bi bi-graph-up" style={{ fontSize: "3rem" }} ></i>
                          <p className="mt-3">Chart will be rendered here with your charting library (Chart.js, Recharts, or Plotly)</p>
                      </div>
                  </div>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-md-6">
                  <div className="stat-card">
                      <h4 className="mb-3">Recent Signals</h4>
                      <div className="metric-item">
                          <span className="metric-label">Dec 20, 2024</span>
                          <span className="metric-value positive">BUY @ $182.50</span>
                      </div>
                      <div className="metric-item">
                          <span className="metric-label">Nov 15, 2024</span>
                          <span className="metric-value negative">SELL @ $195.20</span>
                      </div>
                      <div className="metric-item">
                          <span className="metric-label">Oct 28, 2024</span>
                          <span className="metric-value positive">BUY @ $178.30</span>
                      </div>
                  </div>
              </div>
              <div className="col-md-6">
                  <div className="stat-card">
                      <h4 className="mb-3">Strategy Parameters</h4>
                      <div className="metric-item">
                          <span className="metric-label">RSI Period</span>
                          <span className="metric-value">14 days</span>
                      </div>
                      <div className="metric-item">
                          <span className="metric-label">RSI Oversold</span>
                          <span className="metric-value">30</span>
                      </div>
                      <div className="metric-item">
                          <span className="metric-label">RSI Overbought</span>
                          <span className="metric-value">70</span>
                      </div>
                      <div className="metric-item">
                          <span className="metric-label">DMA Period</span>
                          <span className="metric-value">200 days</span>
                      </div>
                  </div>
              </div>
            </div>
          </div>
        );
      };

export default DetailView;

