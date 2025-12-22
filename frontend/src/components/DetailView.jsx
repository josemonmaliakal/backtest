const DetailView = ({ stock, onBack }) => {
  return (
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
  );
};

export default DetailView;
