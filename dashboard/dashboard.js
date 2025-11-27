/* globals Chart:false */

async function loadCSV(url) {
    const response = await fetch(url);
    const data = await response.text();

    const rows = data.split("\n").filter(r => r.trim() !== "");

    const headers = rows[0].split(",");
    const idx = {};
    headers.forEach((h, i) => idx[h.trim()] = i);

    const labels = [];
    const close = [];
    const dma = [];
    const buyLevel = [];
    const sellLevel = [];
    const buySignals = [];
    const sellSignals = [];

    rows.slice(1).forEach(row => {
        const cols = row.split(",");
        labels.push(cols[idx["Date"]]);

        close.push(parseFloat(cols[idx["Close"]]));
        dma.push(parseFloat(cols[idx["DMA200"]]));
        buyLevel.push(parseFloat(cols[idx["BuyLevel"]]));
        sellLevel.push(parseFloat(cols[idx["SellLevel"]]));

        // Marker points
        buySignals.push(cols[idx["BuySignal"]] === "1" ? parseFloat(cols[idx["BuyPrice"]]) : null);
        sellSignals.push(cols[idx["SellSignal"]] === "1" ? parseFloat(cols[idx["SellPrice"]]) : null);
    });

    return { labels, close, dma, buyLevel, sellLevel, buySignals, sellSignals };
}

async function drawChart() {
    const {
        labels, close, dma, buyLevel, sellLevel, buySignals, sellSignals
    } = await loadCSV("data/nhpc_dma200_5.csv");

    const ctx = document.getElementById("myChart").getContext("2d");

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Close Price",
                    data: close,
                    borderColor: "blue",
                    borderWidth: 2,
                    pointRadius: 0
                },
                {
                    label: "DMA 200",
                    data: dma,
                    borderColor: "orange",
                    borderWidth: 2,
                    pointRadius: 0
                },
                {
                    label: "Buy Level",
                    data: buyLevel,
                    borderColor: "green",
                    borderDash: [5, 5],
                    borderWidth: 1,
                    pointRadius: 0
                },
                {
                    label: "Sell Level",
                    data: sellLevel,
                    borderColor: "red",
                    borderDash: [5, 5],
                    borderWidth: 1,
                    pointRadius: 0
                },
                {
                    label: "Buy Signal",
                    data: buySignals,
                    pointStyle: "triangle",
                    rotation: 0,
                    borderColor: "green",
                    backgroundColor: "green",
                    pointRadius: 8,
                    showLine: false
                },
                {
                    label: "Sell Signal",
                    data: sellSignals,
                    pointStyle: "triangle",
                    rotation: 180,
                    borderColor: "red",
                    backgroundColor: "red",
                    pointRadius: 8,
                    showLine: false
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: "top" }
            },
            interaction: {
                mode: "index",
                intersect: false
            },
            scales: {
                x: { display: true },
                y: { display: true }
            }
        }
    });
}

drawChart();
