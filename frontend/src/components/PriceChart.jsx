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
import { formatDate } from "../utils/FormatDate";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const PriceChart = ({ data }) => {


  const labels = data.map(row => formatDate(row.Date));
  

  // Y-axis (Close price)
  const closePrices = data.map(row => Number(row.Close));

  const dmaValues = data.map(row => row.DMA ? Number(row.DMA) : null  );

  const SellLevelValues = data.map(row=>row.SellLevel?Number(row.SellLevel):null );

  const BuyLevelValues = data.map(row=>row.BuyLevel?Number(row.BuyLevel):null );

  const buyPoints = data.map(row =>
  row.BuySignal === "1"
    ? Number(row.BuyPrice || row.Close)
    : null
);

const sellPoints = data.map(row =>
  row.SellSignal === "1"
    ? Number(row.SellPrice || row.Close)
    : null
);

  const chartData = {
    labels,
    datasets: [
    {
      label: "Close Price",
      data: closePrices,
      borderColor: "#2563eb", // blue
      backgroundColor: "rgba(37, 99, 235, 0.1)",
      borderWidth: 2,
      tension: 0.3,
      pointRadius: 0
    },
    {
      label: "DMA", 
      data: dmaValues,
      borderColor: "#f59e0b", // amber
      borderWidth: 2,
      borderDash: [6, 4],     // dashed line
      tension: 0.3,
      pointRadius: 0
    },
     {
      label: "Sell Level",
      data: SellLevelValues,
      borderColor: "#f34d23ff", // red
      borderWidth: 2,
      borderDash: [6, 4],     // dashed line
      tension: 0.3,
      pointRadius: 0
    },
    {
      label: "Buy Level",
      data: BuyLevelValues,
      borderColor: "#04811fff", // green
      borderWidth: 2,
      borderDash: [6, 4],     // dashed line
      tension: 0.3,
      pointRadius: 0
    },
     {
      label: "BUY",
      data: buyPoints,
      showLine: false,
      pointStyle: "triangle",
      pointRadius: 8,
      pointRotation: 0,                 // ▲ up
      pointBackgroundColor: "#dc2626",  // red
      pointBorderColor: "#dc2626"
    },
    {
      label: "SELL",
      data: sellPoints,
      showLine: false,
      pointStyle: "triangle",
      pointRadius: 8,
      pointRotation: 180,               // ▼ down
      pointBackgroundColor: "#16a34a",  // green
      pointBorderColor: "#16a34a"
    }


  ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
    generateLabels: (chart) => {
      const datasets = chart.data.datasets;

      return datasets.map((dataset, i) => {
        const meta = chart.getDatasetMeta(i);

        return {
          text: dataset.label,
          fillStyle: dataset.pointBackgroundColor || dataset.borderColor,
          strokeStyle: dataset.borderColor,
          lineWidth: dataset.borderWidth,
          hidden: !chart.isDatasetVisible(i),

          // 👇 THIS controls legend icon type
          lineDash: dataset.borderDash || [],
          pointStyle: dataset.pointStyle || "line",
          rotation: dataset.pointRotation || 0,

          datasetIndex: i
        };
      });
    }
  }
      },
      tooltip: {
    callbacks: {
      label: (context) => {
        const label = context.dataset.label;
        const value = context.parsed.y;
        return `${label}: ₹${value}`;
      }
    }
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
    <div style={{height:"350px"}}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default PriceChart;
