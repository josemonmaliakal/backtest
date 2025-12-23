import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const PriceChart = ({ data }) => {

   const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short"
        });
        }; 
  // X-axis (Date)
  const labels = data.map(row => formatDate(row.Date));
  

  // Y-axis (Close price)
  const closePrices = data.map(row => Number(row.Close));

  const chartData = {
    labels,
    datasets: [
      {
        label: "Close Price",
        data: closePrices,
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 0,
        borderColor: "#2563eb",        // blue
        backgroundColor: "rgba(37, 99, 235, 0.1)",
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top"
      }
    },
    scales: {
      x: {
        ticks: {
          maxTicksLimit: 10
        }
      }
    }
  };

  return (
    <div >
      <Line data={chartData} options={options} />
    </div>
  );
};

export default PriceChart;
