import { useState } from "react";
import DashboardStats from "./components/DashboardStats";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import StocksPage from "./pages/Stocks";
import "./App.css";

function App() {
  const [search, setSearch] = useState("");

  return (
    <div className="container-fluid p-4">
      
      
       <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/stocks" element={<StocksPage />} />
      </Routes>
      
      
    </div>
  );
}

export default App;
