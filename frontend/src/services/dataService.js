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
