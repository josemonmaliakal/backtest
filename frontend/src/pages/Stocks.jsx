import { useEffect, useState } from "react";
import Breadcrumb from "../components/Breadcrumb";
import { opportunities } from "../data/opportunities";
import { loadCsv } from "../utils/loadCsv";
import { getLastSyncFromCsv } from "../utils/getLastSyncFromCsv";
import { formatDateYear } from "../utils/FormatDateYear";
import { toTimestamp } from "../utils/dateUtils";

const StocksPage = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStocks = async () => {
      // Deduplicate by symbol
      const uniqueStocks = Array.from(
        new Map(opportunities.map((s) => [s.symbol, s])).values()
      );

      const enriched = await Promise.all(
        uniqueStocks.map(async (stock) => {
          try {
            const priceData = await loadCsv(stock.csvPath);
            
            const lastSync = getLastSyncFromCsv(priceData);

            return {
              symbol: stock.symbol,
              name: stock.name,
              lastSync,
            };
          } catch (err) {
            return {
              symbol: stock.symbol,
              name: stock.name,
              lastSync: "Error",
            };
          }
        })
      );
      enriched.sort(
        (a, b) => toTimestamp(b.lastSync) - toTimestamp(a.lastSync)
      );

      setStocks(enriched);
      setLoading(false);
    };

    loadStocks();
  }, []);

  return (
    <div className="container-fluid mt-4">
      <Breadcrumb current="Stocks" />
    <div className="container-fluid mt-4">
      <h5 className="mb-3"> Available Stocks</h5>

      {loading ? (
        <p>Loading stock sync data…</p>
      ) : (
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Symbol</th>
              <th>Name</th>
              <th>Last Sync (Close Date)</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((s) => (
              <tr key={s.symbol}>
                <td>{s.symbol}</td>
                <td>{s.name}</td>
                <td>{formatDateYear(s.lastSync)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </div>    
  );
};

export default StocksPage;
