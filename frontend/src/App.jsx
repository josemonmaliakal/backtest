import { useState } from "react";
import DashboardStats from "./components/DashboardStats";
import Dashboard from "./pages/Dashboard";
import "./App.css";

function App() {
  const [search, setSearch] = useState("");

  return (
    <div className="container-fluid p-4">
      
      <DashboardStats />
      <Dashboard />
      
      
    </div>
  );
}

export default App;
