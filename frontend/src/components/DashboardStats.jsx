import React from "react";

const DashboardStats = () => {
  return (
    <div className="container-fluid mt-4" id="dashboardView">
      {/* Stats Overview */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="stat-card">
            <div className="stat-label">Total Opportunities</div>
            <div className="stat-value">24</div>
            <div className="trend-indicator positive">
              <i className="bi bi-arrow-up"></i> 6 from last week
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="stat-card">
            <div className="stat-label">Buy Signals</div>
            <div className="stat-value positive">18</div>
            <div className="trend-indicator positive">
              <i className="bi bi-arrow-up"></i> 4 new
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="stat-card">
            <div className="stat-label">Sell Signals</div>
            <div className="stat-value negative">6</div>
            <div className="trend-indicator negative">
              <i className="bi bi-arrow-down"></i> 2 less
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="stat-card">
            <div className="stat-label">Avg. Backtest Return</div>
            <div className="stat-value positive">+24.8%</div>
            <div className="trend-indicator positive">
              <i className="bi bi-arrow-up"></i> 3.2%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
