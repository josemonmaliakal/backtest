import { useState } from "react";
import Filters from "../components/Filters";
import DetailView from "../components/DetailView";
import DashboardStats from "../components/DashboardStats";
import OpportunityList from "../components/OpportunityList";
import { opportunities } from "../data/opportunities";
import { loadCsv } from "../utils/loadCsv";

const Dashboard = () => {
  const [filter, setFilter] = useState("All Signals");
  const [selectedStock, setSelectedStock] = useState(null);
  const [loading, setLoading] = useState(false);

  const filteredData = opportunities.filter((item) => {
    if (filter === "Buy Only") return item.signal === "BUY";
    if (filter === "Sell Only") return item.signal === "SELL";
    return true;
  });

  const openDetail = async (stock) => {
    setLoading(true);

    const priceData = await loadCsv(stock.csvPath);
    const tradeData = await loadCsv(stock.tradesPath);

    setSelectedStock({
      ...stock,
      priceData,
      tradeData
    });

    setLoading(false);
  };

  // Detail view
  if (selectedStock) {
    return (
      <DetailView
        stock={selectedStock}
        onBack={() => setSelectedStock(null)}
      />
    );
  }




  // Dashboard view
  return (
    
    <div className="container-fluid mt-4">
      <DashboardStats  items={opportunities} />
      
      <Filters onFilterChange={setFilter} />
      
      {loading && <p>Loading price data…</p>}

      <OpportunityList
        items={filteredData}
        onSelect={openDetail}  
      />
    </div>
  );
};

export default Dashboard;
