import { useState } from "react";
import Filters from "../components/Filters";
import DetailView  from "../components/DetailView";
import OpportunityList from "../components/OpportunityList";
import { opportunities } from "../data/opportunities";

const Dashboard = () => {
  const [filter, setFilter] = useState("All Signals");
  const [selectedStock, setSelectedStock] = useState(null);

  const filteredData = opportunities.filter((item) => {
    if (filter === "Buy Only") return item.signal === "BUY";
    if (filter === "Sell Only") return item.signal === "SELL";
    return true;
  });

   // 👇 THIS replaces dashboardView / detailView toggling
  if (selectedStock) {
    return (
      <DetailView
        stock={selectedStock}
        onBack={() => setSelectedStock(null)}
      />
    );
  }

  return (
    <div className="container-fluid mt-4">
      <Filters onFilterChange={setFilter} />
      <OpportunityList
        items={filteredData}
        onSelect={setSelectedStock}
      />
    </div>
  );
};

export default Dashboard;
