/* globals Chart:false */
async function loadStocks(url) {
    const response = await fetch(url);
    const data = await response.text();
    const rows = data.split("\n").filter(r => r.trim() !== "");
    const headers = rows[0].split(",");
    const idx = {};
    headers.forEach((h, i) => idx[h.trim()] = i);    
    const stocks = [];
    rows.slice(1).forEach(row => {
        const cols = row.split(",");
        stocks.push({'symbol':cols[idx["symbol"]]});
    });
    return stocks ;
}

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
        sellSignals.push(Number(cols[idx["SellSignal"]]) === 1 ? cols[idx["SellPrice"]]  : "null");      
    });
    return { labels, close, dma, buyLevel, sellLevel, buySignals, sellSignals };
}

async function loadBestCsv(url){
    const response = await fetch(url);
    const data = await response.text();
    // Split into lines
    const lines = data.trim().split('\n');
    // Convert to key-value pairs  
    const result = {};
    var key = '';
    var value = '';
    lines.forEach(line => {            
        const commaIndex = line.indexOf(',');
        if (commaIndex !== -1) {
            key = line.substring(0, commaIndex).trim();
                // Start the value substring right after the comma and space
            value = line.substring(commaIndex + 1).trim();                
        }
        if (key && value) {
            result[key.trim()] = isNaN(value) ? value.trim() : parseFloat(value);
        }
    });
    return result;

}

let fullData = null;
let chartInstance = null;

function filterByMonths(months, fullData) {
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

function updateChart(filtered, canvasId) {
    if (chartInstance) {
        chartInstance.destroy();
    }
    console.log(canvasId);
    const ctx = document.getElementById(canvasId).getContext("2d");
   
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: filtered.labels,
            datasets: [
                {
                    label: "Close Price",
                    data: filtered.close,
                    borderColor: "#728deeff",
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
                    borderColor: 'rgba(226, 120, 126, 1)',
                    data :filtered.sellLevel,
                    borderWidth    : 3, // set diameter of dots here                  
                    fill           : false,
                    pointRadius    : 0,
                    borderDash     : [1,6], // set 'length' of dash/dots to zero and
                                            // space between dots (center to center)
                                            // recommendation: 2x the borderWidth
                    borderCapStyle : 'square' // this is where the magic happens
                   
               },
             
                // BUY MARKERS
                {
                    label: "Buy",
                    type: "scatter",
                    data: filtered.buySignals,
                    pointStyle: "triangle",
                    pointBackgroundColor: "#1f914dff",
                    pointBorderColor:"#1f914dff",
                    pointRadius: 6,
                    showLine: false
                },
                {
                    label: "Sell",
                    type: "scatter",
                    data: filtered.sellSignals,
                    pointStyle: "triangle",
                    pointBackgroundColor: "#eb5b5bff",
                    pointBorderColor: "#d64848ff",
                    pointRadius: 6,
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
            scales: {
            x: {
                type: 'time',
                time: {
                unit: 'day',
                displayFormats: {
                    day: 'dd MMM',    // tick label: "05 Dec"
                    month: 'MMM yy'   // when it groups by month
                },
                tooltipFormat: 'dd MMM yyyy'
                },
                ticks: {
                maxRotation: 0,
                autoSkip: true
                }
            },
            y: { display: true }
            }

        }
    });
}

function getLastSignals(fullData) {
    const { labels, close, buySignals, sellSignals } = fullData;

    var lastBuy = null
    var lastSell = null            
    // Find last index where buySignals[i] is not null
    for (let i = buySignals.length - 1; i >= 0; i--) {
        if (buySignals[i] !== "null") {
            lastBuy =  {
                date: labels[i],
                price: close[i],
                buyPrice: buySignals[i],
               
            };
            break;
        }
    }
    // Find last index where sellSignals[i] is not null
    for (let i = sellSignals.length - 1; i >= 0; i--) {
        if (sellSignals[i] !== "null") {
            lastSell =  {
                date: labels[i],
                price: close[i],
                sellPrice: sellSignals[i]
            };
            break;
        }
    }

    return [lastBuy, lastSell]; // No buy signal found
}
async function loadAllStockSignals() {
    const results = [];    
    const stockList = await loadStocks('db/stocks.csv');
    for (const stock of stockList) {        
        const fullData = await loadCSV('results/'+stock.symbol.toLowerCase()+'-out.csv');  
        const [lastBuy, lastSell] = getLastSignals(fullData);
       results.push({
            stock: stock.symbol,
            lastBuy,
            lastSell
        });
    }

    return results;
}
async function selectStock(stock,type, data) {            
            var rows = document.querySelectorAll('.stock-row');
            for (var i = 0; i < rows.length; i++) {
                rows[i].classList.remove('active');                
               
            }
            var hide = document.querySelectorAll('.hide-content');
            for (var i = 0; i < hide.length; i++) {
                var BuyElement = document.getElementById('flush-collapse'+i);
                var sellEelemnt = document.getElementById('flush-sell-collapse'+i);
                if (BuyElement!=null){
                    if (BuyElement.classList.contains('show')){
                    BuyElement.classList.remove('show');
                    }
                }
                if (sellEelemnt!=null){
                    if (sellEelemnt.classList.contains('show')){
                        sellEelemnt.classList.remove('show');
                    }
                }
            }
           
            event.currentTarget.classList.add('active');
            const  bestData = await loadBestCsv('results/best-'+stock+'.csv');
            const cleaned = bestData.FYSummary.replace(/^"|"$/g, '').replace(/'/g, '"');
            const fySummary = JSON.parse(cleaned);
            // Build rows (round to 2 decimals and add a CSS class for negatives)
            const rowsHtml = Object.entries(fySummary)
                .map(([fy, val]) => {
                const formatted = val.net.toFixed(2); // "123.45"
                const cls = val.net < 0 ? 'text-danger' : 'text-success';
                 
                const tempHtml ='<tr>'+
                        '<td class="text-muted" >'+fy+'</td>'+
                        '<td class="text-end '+cls+'" >'+ val.avgBuy.toFixed(2) +'</td>'+
                        '<td class="text-end '+cls+'" >'+ val.avgSell.toFixed(2)  +'</td>'+
                        '<td class="text-end '+cls+'" >'+ val.units  +'</td>'+
                        '<td class="text-end '+cls+'" >'+ formatted +'</td>'+
                       
                    '</tr>'
                return tempHtml;
               
                })
                .join('');
           

            var detailsDiv = document.getElementById(type+'StockDetails-'+stock);          
            var html = '<div class="mb-4 row">';
            html +=         '<div class="col-lg-6" >';
            html +=             '<canvas class="my-4 w-100"';
            html +=                 'id="'+type+'chart-'+stock+'" width="900";height="380">';
            html +=             '</canvas>';
            html +=         '</div>';
            html +=         '<div class="col-lg-6" >';
            html +=             '<h5 class="card-title mb-4">Best Algorithm</h5>'
            html +=                 '<table class="table table-sm">';
            html +=                     '<tbody>';
            html +=                         '<tr>';
            html +=                             '<td class="text-muted" >DMA Period</td>';
            html +=                             '<td class="text-end fw-bold"  ><span id="bestDmaPeriod">'+bestData.DMA+'</span> days</td>';
            html +=                             '<td class="text-muted"   ></td>';
            html +=                             '<td class="text-muted"   >DMA Deviation</td>';
            html +=                             '<td class="text-end fw-bold"   ><span id="bestDeviation">'+bestData.Deviation+'</span> %</td>';
            html +=                         '</tr>';  
            html +=                         '<tr>';
            html +=                             '<td class="text-muted" colspan=3 >ROI</td>';
            html +=                             '<td class="text-end fw-bold" colspan=2 ><span id="bestROI">'+bestData.ROI.toFixed(2)+'</span>%</td>';
            html +=                         '</tr>';  
            html +=                         '<tr class="bg-success" >';
            html +=                             '<td class="text-muted">F.Y</td>';
            html +=                             '<td class="text-end">BUY (avg) </td>';
            html +=                             '<td class="text-end">SELL (avg) </td>';
            html +=                             '<td class="text-end">Units</td>';
            html +=                             '<td class="text-end"><span id="FY">PROFIT/LOSS</td>';
            html +=                         '</tr>';  
            html +=                         rowsHtml;  
            html +=                         '<tr>';
            html +=                             '<td class="text-muted" colspan=3 >Net Profit</td>';
            html +=                             '<td class="text-end fw-bold" colspan=2 ><span id="bestNetProfit">'+bestData.NetProfit.toFixed(2)+'</span></td>';
            html +=                         '</tr>';
            html +=                     '</tbody>';
            html +=                 '</table>';
            html +=             '</div>';
            html +=         '</div>';
            detailsDiv.innerHTML = html;
            updateChart(data, type+"chart-"+stock);
}


async function renderAllSignals() {
            var tbody = document.getElementById('buyTableBody');
            const allSignals = await loadAllStockSignals();
           
            const parseDate = (str) => {
                // Example: supports ISO "YYYY-MM-DD" or "YYYY/MM/DD"
                // If you have "DD/MM/YYYY", uncomment the next block and comment the Date(str) line.
                // const [d, m, y] = str.split(/[\/\-]/).map(Number);
                // return new Date(y, m - 1, d);
                return new Date(str);
            };

            allSignals.sort((a, b) => {
                const da = parseDate(a.lastBuy?.date ?? '1970-01-01');
                const db = parseDate(b.lastBuy?.date ?? '1970-01-01');
                return db - da; // descending
            });

            tbody.innerHTML = '';
            for (var i = 0; i < allSignals.length; i++) {
                var row = document.createElement('tr');
                row.className = 'stock-row';
                row.setAttribute('data-stock', allSignals[i].stock);
                row.setAttribute('data-type', 'buy');
                row.setAttribute('data-bs-toggle',"collapse");
                row.setAttribute('data-bs-target',"#flush-collapse"+i);
                fullData = await loadCSV("results/"+allSignals[i].stock+"-out.csv");
                const filtered = filterByMonths(12,fullData);
                row.onclick =  function() {
                    var idx = this.getAttribute('data-stock');
                    selectStock(idx,'buy',filtered);                    
                   
                };
                row.innerHTML = '<td><div class="fw-bold">' + allSignals[i].stock + '</div><small class="text-muted">' +  allSignals[i].stock  + '</small></td>' +
                    '<td>' +  allSignals[i].lastBuy.date + '</td>' +
                    '<td>'+allSignals[i].lastBuy.buyPrice  + '</td>';
                               
                tbody.appendChild(row);
                var row = document.createElement('tr');
                row.className = 'stock-row';
                row.innerHTML = '<td colspan=4 style="padding:0px">'+  
                        '<div id="flush-collapse'+i+'"class="accordion-collapse collapse" aria-labelledby="flush-headingTwo" data-bs-parent="#accordionFlushExample">'+
                            '<div class="accordion-body acc-table-content ">'+
                                '<div class="card-body" id="buyStockDetails-'+allSignals[i].stock+'">'+
                                    '<div class="text-center text-muted py-5">'+
                                        '<i class="bi bi-funnel" style="font-size: 3rem; opacity: 0.3;"></i>'+
                                        '<p class="mt-3">Select a stock to view details</p>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+  
                '</td>';
                tbody.appendChild(row);
            }
            var tbody = document.getElementById('sellTableBody');
            tbody.innerHTML = '';
            for (var i = 0; i < allSignals.length; i++) {                
                var row = document.createElement('tr');
                row.className = 'stock-row';
                row.setAttribute('data-stock',  allSignals[i].stock );
                row.setAttribute('data-type', 'sell');
                row.setAttribute('data-bs-toggle',"collapse");
                row.setAttribute('data-bs-target',"#flush-sell-collapse"+i);
                fullData = await loadCSV("results/"+allSignals[i].stock+"-out.csv");
                const filtered = filterByMonths(12,fullData);                
                row.onclick = function() {
                    var idx = this.getAttribute('data-stock');
                    selectStock(idx,'sell',filtered);
                };
                row.innerHTML = '<td><div class="fw-bold">' + allSignals[i].stock + '</div><small class="text-muted">' + allSignals[i].stock + '</small></td>' +
                    '<td>' +  allSignals[i].lastSell.date + '</td>' +
                    '<td>'+ allSignals[i].lastSell.sellPrice + '</td>';
                   
                tbody.appendChild(row);
                var row = document.createElement('tr');
                row.className = 'stock-row hide-content';
                row.innerHTML = '<td colspan=4 style="padding:0px">'+                            
                    '<div id="flush-sell-collapse'+i+'"class="accordion-collapse collapse" aria-labelledby="flush-headingTwo" data-bs-parent="#accordionFlushExample">'+
                    '<div class="accordion-body acc-table-content ">'+
                      '<div class="card-body" id="sellStockDetails-'+allSignals[i].stock+'">'+
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



async function filterStocks() {
            var searchTerm = document.getElementById('searchInput').value.toLowerCase();
            var activeTabPane = document.querySelector('.tab-pane.active');
            var activeTabId = activeTabPane.id;
            const allSignals = await loadAllStockSignals();
           
            if (activeTabId === 'buy-signals') {
                var tbody = document.getElementById('buyTableBody');
                tbody.innerHTML = '';
                for (var i = 0; i < allSignals.length; i++) {                                
                    if (allSignals[i].stock.toLowerCase().includes(searchTerm)) {
                        var row = document.createElement('tr');
                        row.className = 'stock-row';
                        row.setAttribute('data-stock', allSignals[i].stock);
                        row.setAttribute('data-type', 'buy');
                        row.setAttribute('data-bs-toggle',"collapse");
                        row.setAttribute('data-bs-target',"#flush-collapse"+i);
                        fullData = await loadCSV("results/"+allSignals[i].stock+"-out.csv");
                        const filtered = filterByMonths(12,fullData);
                        row.onclick =  function() {
                            var idx = this.getAttribute('data-stock');
                            selectStock(idx,'buy',filtered);
                        };                        
                        row.innerHTML = '<td><div class="fw-bold">' + allSignals[i].stock + '</div><small class="text-muted">' +  allSignals[i].stock  + '</small></td>' +
                        '<td>' +  allSignals[i].lastBuy.date + '</td>' +
                        '<td>'+allSignals[i].lastBuy.buyPrice  + '</td>';                                
                        tbody.appendChild(row);
                        tbody.appendChild(row);
                        var row = document.createElement('tr');
                        row.className = 'stock-row';
                        row.innerHTML = '<td colspan=4 style="padding:0px">'+  
                                '<div id="flush-collapse'+i+'"class="accordion-collapse collapse" aria-labelledby="flush-headingTwo" data-bs-parent="#accordionFlushExample">'+
                                    '<div class="accordion-body acc-table-content ">'+
                                        '<div class="card-body" id="buyStockDetails-'+allSignals[i].stock+'">'+
                                            '<div class="text-center text-muted py-5">'+
                                                '<i class="bi bi-funnel" style="font-size: 3rem; opacity: 0.3;"></i>'+
                                                '<p class="mt-3">Select a stock to view details</p>'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+  
                        '</td>';
                        tbody.appendChild(row);
                    }
                }
            } else {
                var tbody = document.getElementById('sellTableBody');
                tbody.innerHTML = '';
                for (var i = 0; i < allSignals.length; i++) {                    
                    if (allSignals[i].stock.toLowerCase().includes(searchTerm)) {
                        var row = document.createElement('tr');
                        row.className = 'stock-row';
                        row.setAttribute('data-stock',  allSignals[i].stock );
                        row.setAttribute('data-type', 'sell');
                        row.setAttribute('data-bs-toggle',"collapse");
                        row.setAttribute('data-bs-target',"#flush-sell-collapse"+i);
                        fullData = await loadCSV("results/"+allSignals[i].stock+"-out.csv");
                        const filtered = filterByMonths(12,fullData);                
                        row.onclick = function() {
                            var idx = this.getAttribute('data-stock');
                            selectStock(idx,'sell',filtered);
                        };
                        row.innerHTML = '<td><div class="fw-bold">' + allSignals[i].stock + '</div><small class="text-muted">' + allSignals[i].stock + '</small></td>' +
                            '<td>' +  allSignals[i].lastSell.date + '</td>' +
                            '<td>'+ allSignals[i].lastSell.sellPrice + '</td>';
                           
                        tbody.appendChild(row);
                        var row = document.createElement('tr');
                        row.className = 'stock-row hide-content';
                        row.innerHTML = '<td colspan=4 style="padding:0px">'+                            
                            '<div id="flush-sell-collapse'+i+'"class="accordion-collapse collapse" aria-labelledby="flush-headingTwo" data-bs-parent="#accordionFlushExample">'+
                                '<div class="accordion-body acc-table-content ">'+
                                    '<div class="card-body" id="sellStockDetails-'+allSignals[i].stock+'">'+
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
            }
}

document.addEventListener('DOMContentLoaded', function() {  
    renderAllSignals();
 });

 





