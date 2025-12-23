import PriceChart from "./PriceChart";

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
                                  <span className="metric-label">Total Return</span>
                                  <span className="metric-value positive">+28.4%</span>
                              </div>
                               <div className="metric-item">
                                  <span className="metric-label">Profit %</span>
                                  <span className="metric-value positive">+28.4%</span>
                              </div>
                              <div className="metric-item">
                                  <span className="metric-label">Total Trades</span>
                                  <span className="metric-value">43</span>
                              </div>
                          </div>                          
                          <div className="col-md-6">
                              <div className="metric-item">
                                  <span className="metric-label">DMA Days</span>
                                  <span className="metric-value">200</span>
                              </div>
                              <div className="metric-item">
                                  <span className="metric-label">DMA Variation</span>
                                  <span className="metric-value">5%</span>
                              </div>
                              <div className="metric-item">
                                  <span className="metric-label">DMA Variation</span>
                                  <span className="metric-value">5%</span>
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
                    <PriceChart data={stock.priceData} />
                </div>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-md-4">
                  <div className="stat-card">
                      <h4 className="stat-label">Recent Signals</h4>
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
              <div className="col-md-8">
                  <div className="stat-card">
                      <h4 className="stat-label">PROFIT AND LOSS </h4>
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
            </div>
            
          </div>
        );
      };

export default DetailView;

