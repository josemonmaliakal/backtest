import React from "react";
import { buySignals, sellSignals } from "../data/signals";

const DashboardStats = ({items}) => {

  let buySignals = 0;
  let sellSignals = 0;
  items.forEach(row => {
    if (row.signal==="BUY"){
      buySignals+=1;
    }
    else{
      sellSignals+=1;
    }
  });

  return (
    <div className="container-fluid mt-4" id="dashboardView">
      {/* Stats Overview */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="stat-card">
            <div className="stat-label"> Opportunities</div>
            <div className="stat-value">{items.length}</div>            
          </div>
        </div>

        <div className="col-md-3">
          <div className="stat-card">
            <div className="stat-label">Buy Signals</div>
            <div className="stat-value positive">{buySignals}</div>            
          </div>
        </div>

        <div className="col-md-3">
          <div className="stat-card">
            <div className="stat-label">Sell Signals</div>
            <div className="stat-value negative">{sellSignals}</div>            
          </div>
        </div>

        <div className="col-md-3">
          <div className="stat-card">
            <div className="stat-label">Avg. Backtest Return</div>
            <div className="stat-value positive">+24.8%</div>            
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
