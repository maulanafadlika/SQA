/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "07 - Login Invalid"], "isController": false}, {"data": [1.0, 500, 1500, "05 - Halaman Login"], "isController": false}, {"data": [1.0, 500, 1500, "07 - Login Invalid-1"], "isController": false}, {"data": [0.5, 500, 1500, "06 - Login Valid"], "isController": false}, {"data": [1.0, 500, 1500, "03 - Dynamic Controls"], "isController": false}, {"data": [1.0, 500, 1500, "06 - Login Valid-1"], "isController": false}, {"data": [0.9, 500, 1500, "01 - Homepage"], "isController": false}, {"data": [1.0, 500, 1500, "02 - Dynamic Loading"], "isController": false}, {"data": [1.0, 500, 1500, "04 - Add/Remove Elements"], "isController": false}, {"data": [1.0, 500, 1500, "07 - Login Invalid-0"], "isController": false}, {"data": [1.0, 500, 1500, "06 - Login Valid-0"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 550, 0, 0.0, 346.5472727272731, 255, 1383, 287.0, 568.0, 588.4499999999999, 819.94, 9.731929576218704, 36.580443245156154, 6.816774307705919], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["07 - Login Invalid", 50, 0, 0.0, 565.5999999999999, 529, 616, 563.5, 595.6, 604.5, 616.0, 1.0565017115327726, 5.461701152643367, 1.428588408063221], "isController": false}, {"data": ["05 - Halaman Login", 50, 0, 0.0, 287.16, 262, 410, 282.0, 301.8, 338.6999999999999, 410.0, 1.0624057114931051, 3.841551152178994, 0.5800901185644773], "isController": false}, {"data": ["07 - Login Invalid-1", 50, 0, 0.0, 282.06, 259, 308, 282.0, 296.9, 304.34999999999997, 308.0, 1.062721843184765, 4.0730475142936085, 0.6808892059342387], "isController": false}, {"data": ["06 - Login Valid", 50, 0, 0.0, 568.4800000000004, 531, 672, 565.0, 593.0, 601.45, 672.0, 1.0560331171985553, 4.867487644412528, 1.3998626496926942], "isController": false}, {"data": ["03 - Dynamic Controls", 50, 0, 0.0, 288.96000000000004, 263, 438, 284.0, 305.8, 343.94999999999993, 438.0, 1.0619093129446746, 6.215902755654667, 0.5919729611341191], "isController": false}, {"data": ["06 - Login Valid-1", 50, 0, 0.0, 280.76, 255, 311, 279.5, 296.8, 299.45, 311.0, 1.0629251700680273, 3.476554195897109, 0.6823896550807823], "isController": false}, {"data": ["01 - Homepage", 50, 0, 0.0, 402.2399999999999, 259, 1383, 287.0, 822.4, 868.5999999999997, 1383.0, 1.0375166002656042, 5.895688081009296, 0.12968957503320053], "isController": false}, {"data": ["02 - Dynamic Loading", 50, 0, 0.0, 284.93999999999994, 258, 365, 284.0, 297.9, 305.15, 365.0, 1.0617289193723058, 3.563842423502431, 0.5941949307752744], "isController": false}, {"data": ["04 - Add/Remove Elements", 50, 0, 0.0, 281.81999999999994, 265, 302, 279.0, 298.8, 299.9, 302.0, 1.0624508616476487, 3.4855443599796008, 0.5963835500733091], "isController": false}, {"data": ["07 - Login Invalid-0", 50, 0, 0.0, 282.91999999999996, 258, 314, 283.0, 296.0, 311.45, 314.0, 1.0633094443144844, 1.4215948844182633, 0.7565280554196882], "isController": false}, {"data": ["06 - Login Valid-0", 50, 0, 0.0, 287.08, 258, 381, 287.5, 301.0, 307.15, 381.0, 1.062337993455998, 1.4219145056941316, 0.7262076127140611], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 550, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
