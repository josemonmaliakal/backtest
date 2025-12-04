/* globals Chart:false */

const stockList = [
    { symbol: "NHPC", file: "results/nhpc-out.csv" },
    { symbol: "BCLIND", file: "results/bclind-out.csv" },
    { symbol: "JAMNAUTO", file: "results/jamnauto-out.csv" },
    { symbol: "MSUMI", file: "results/msumi-out.csv" }
];

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
        dma.push(parseFloat(cols[idx["DMA"]]));
        buyLevel.push(parseFloat(cols[idx["BuyLevel"]]));
        sellLevel.push(parseFloat(cols[idx["SellLevel"]]));
        buySignals.push(Number(cols[idx["BuySignal"]]) === 1 ? cols[idx["BuyPrice"]] : "null");
        sellSignals.push(Number(cols[idx["SellSignal"]]) === 1 ? parseFloat(cols[idx["SellPrice"]]) : null);      
    });

    

    return { labels, close, dma, buyLevel, sellLevel, buySignals, sellSignals };
}





let fullData = null;
let chartInstance = null;

function filterByMonths(months) {
    if (!fullData) return fullData;

    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - months);

    const filtered = {
        labels: [],
        close: [],
        dma: [],
        buyLevel: [],
        sellLevel: [],
        buySignals: [],
        sellSignals: []
    };
    fullData.labels.forEach((d, i) => {
        const dt = new Date(d);          
       //
       if (months === "all" || dt >= cutoff) {
            filtered.labels.push(fullData.labels[i]);
            filtered.close.push(fullData.close[i]);
            filtered.dma.push(fullData.dma[i]);
            filtered.buyLevel.push(fullData.buyLevel[i]);
            filtered.sellLevel.push(fullData.sellLevel[i]);
            filtered.buySignals.push(fullData.buySignals[i]);
            filtered.sellSignals.push(fullData.sellSignals[i]);

           
           
        }
       
    });

   

    return filtered;
}

function updateChart(filtered) {
    if (chartInstance) {
        chartInstance.destroy();
    }

    const ctx = document.getElementById("myChart").getContext("2d");
   
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: filtered.labels,
            datasets: [
                {
                    label: "Close Price",
                    data: filtered.close,
                    borderColor: "blue",
                    borderWidth: 2,
                    pointRadius: 0
                },
                 {
                    label: "DMA",
                    data: filtered.dma,
                    borderWidth    : 3, // set diameter of dots here
                    borderColor    : '#ccc',
                    fill           : false,
                    pointRadius    : 0,
                    borderDash     : [0,6], // set 'length' of dash/dots to zero and
                                            // space between dots (center to center)
                                            // recommendation: 2x the borderWidth
                    borderCapStyle : 'round' // this is where the magic happens
                },                                
                {
                    label: 'BUY LEVEL',                  
                    borderColor: 'rgba(26, 143, 74, 1)',
                    data :filtered.buyLevel,
                    borderWidth    : 3, // set diameter of dots here                  
                    fill           : false,
                    pointRadius    : 0,
                    borderDash     : [0,6], // set 'length' of dash/dots to zero and
                                            // space between dots (center to center)
                                            // recommendation: 2x the borderWidth
                    borderCapStyle : 'round' // this is where the magic happens
                   
               },
               {
                    label: 'SELL LEVEL',                  
                    borderColor: 'rgba(220, 26, 26, 1)',
                    data :filtered.sellLevel,
                    borderWidth    : 3, // set diameter of dots here                  
                    fill           : false,
                    pointRadius    : 0,
                    borderDash     : [0,6], // set 'length' of dash/dots to zero and
                                            // space between dots (center to center)
                                            // recommendation: 2x the borderWidth
                    borderCapStyle : 'round' // this is where the magic happens
                   
               },
               {
                    label: "Buy Signal",
                    data: filtered.buySignals,
                    pointStyle: "triangle",
                    rotation: 0,
                    borderColor: "green",
                    backgroundColor: "green",
                    pointRadius: 8,
                    showLine: false
                },
                // BUY MARKERS
                {
                    label: "Buy",
                    type: "scatter",
                    data: filtered.buySignals,
                    pointStyle: "triangle",
                    pointBackgroundColor: "green",
                    pointBorderColor: "green",
                    pointRadius: 8,
                    showLine: false
                },
                {
                    label: "Sell",
                    type: "scatter",
                    data: filtered.sellSignals,
                    pointStyle: "triangle",
                    pointBackgroundColor: "red",
                    pointBorderColor: "red",
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
            interaction: { mode: "index", intersect: false },
            scales: { x: { display: true }, y: { display: true } }
        }
    });
}

async function drawChart() {
    fullData = await loadCSV("results/nhpc-out.csv");
    // console.log(fullData)
    // Default: show last 1 year (12 months)
    const filtered = filterByMonths(12);
    updateChart(filtered);
}

function setupFilterButtons() {
    document.getElementById("filter3m").onclick = () => updateChart(filterByMonths(3));
    document.getElementById("filter6m").onclick = () => updateChart(filterByMonths(6));
    document.getElementById("filter1y").onclick = () => updateChart(filterByMonths(12));
    document.getElementById("filterAll").onclick = () => updateChart(filterByMonths("all"));
}


function getLastBuySignal(fullData) {
    const { labels, close, buySignals, sellSignals } = fullData;

    // Find last index where buySignals[i] is not null
    for (let i = buySignals.length - 1; i >= 0; i--) {
        if (buySignals[i] !== "null") {
            return {
                date: labels[i],
                price: close[i],
                buyPrice: buySignals[i],
                sellPrice: sellSignals[i]
            };
        }
    }

    return null; // No buy signal found
}
async function loadAllStockSignals() {
    const results = [];

    for (const stock of stockList) {
        const fullData = await loadCSV(stock.file);
        const lastBuy = getLastBuySignal(fullData);

        results.push({
            stock: stock.symbol,
            lastBuy
        });
    }

    return results;
}

async function renderBuySignals() {
            var tbody = document.getElementById('buyTableBody');
            const allSignals = await loadAllStockSignals();
            console.log(allSignals)
            
            tbody.innerHTML = '';
            for (var i = 0; i < allSignals.length; i++) {
                console.log(allSignals[i])
                
                var buyPrice = buySignals[i];
                var row = document.createElement('tr');
                row.className = 'stock-row';
                row.setAttribute('data-index', i);
                row.setAttribute('data-type', 'buy');
                row.setAttribute('data-bs-toggle',"collapse");
                row.setAttribute('data-bs-target',"#flush-collapse"+i);
                row.onclick = function() {
                    var idx = parseInt(this.getAttribute('data-index'));
                    selectStock(buySignals[idx]);
                };
                row.innerHTML = '<td><div class="fw-bold">' + allSignals[i].stock + '</div><small class="text-muted">' +  allSignals[i].stock  + '</small></td>' +
                    '<td>' +  allSignals[i].lastBuy.date + '</td>' +
                    '<td>'+allSignals[i].lastBuy.buyPrice  + '</td>' +
                    '<td>' +  allSignals[i].stock  +'</td>';                
                tbody.appendChild(row);
                var row = document.createElement('tr');
                row.className = 'stock-row';
                row.innerHTML = '<td colspan=4 style="padding:0px">'+                            
                    '<div id="flush-collapse'+i+'"class="accordion-collapse collapse" aria-labelledby="flush-headingTwo" data-bs-parent="#accordionFlushExample">'+
                    '<div class="accordion-body acc-table-content ">'+
                      '<div class="card-body" id="stockDetails-'+allSignals[i].stock+'">'+
                        '<div class="text-center text-muted py-5">'+
                            '<i class="bi bi-funnel" style="font-size: 3rem; opacity: 0.3;"></i>'+
                            '<p class="mt-3">Select a stock to view details</p>'+
                        '</div>'
                      '</div>'+
                      '</div>'+
                    '</div>'+                    
                    '</td>';
                tbody.appendChild(row);
            }
        }


document.addEventListener('DOMContentLoaded', function() {
            drawChart();
            setupFilterButtons();
            renderBuySignals();
            //renderSellSignals();
});


