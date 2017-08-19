const request = require('request');
const chart = require('chartist');
const remote = require('electron').remote;

var stockList = ["goog", "aapl", "amzn", "ibm", "tsla", "fb"];
var stockNames = ["Alphabet Inc.", "Apple Inc.", "Amazon Inc.", "IBM Inc.", "Tesla Inc.", "Facebook Inc."];
var oldDivs = document.getElementsByClassName("stocks");
var wrapper = document.getElementById("wrapper");

document.getElementById("minimize").addEventListener("click", (e) => {
    var window = remote.getCurrentWindow();
    window.minimize();
});

document.getElementById("maximize").addEventListener("click", (e) => {
    var window = remote.getCurrentWindow();
    if (!window.isMaximized()) {
        window.maximize();
    } else {
        window.unmaximize();
    }
});

document.getElementById("close").addEventListener("click", (e) => {
    var window = remote.getCurrentWindow();
    window.close();
});

document.getElementById("searchbutton").addEventListener("click", () => {
    var search = document.getElementById("searchinput").value;
    setupSearchGraph();
    getMonthlyStockData("monthly", search, 1);
    searchStockNamer(search);

});

function getStockNumbers(stock) {
    var url = "https://www.google.com/finance/info?client=ig&q=" + stock;
    //console.log(url);
    request(url, function(error, response, body) {
        //console.log('error:', error); // Print the error if one occurred
        //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        if (!error && response.statusCode === 200) {
            body = body.slice(3);
            body = JSON.parse(body);
            //console.log(body);
            drawTable(body, stock);
        }
    });
}

function getMonthlyStockData(timeInterval, stock, value) {
    if (timeInterval == "weekly") {
        var url = "http://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=" + stock + "&apikey=EL0R";
    } else if (timeInterval == "monthly") {
        var url = "http://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=" + stock + "&apikey=EL0R";
    } else if (timeInterval == "daily") {
        var url = "http://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" + stock + "&apikey=EL0R";
    } else {
        console.log("IlligalArgumentException");
    }
    request(url, function(error, response, body) {
        //console.log('error:', error); // Print the error if one occurred
        //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        if (!error && response.statusCode === 200) {
            body = JSON.parse(body);
            //console.log(body);'
            if(value == 0){
                drawGraph(body, stock);
            } else if(value == 1){
                drawSearchGraph(body, stock);
            }
        }
    });
}

function setupSearchGraph(){
    //console.log("oldDivs.length is " + oldDivs.length);

    while(oldDivs.length > 0){
        wrapper.removeChild(oldDivs[oldDivs.length - 1]);
        //console.log("oldDivs.length is " + oldDivs.length);
    }

    console.log(document.getElementsByClassName("searchStock").length == 0);
    if(document.getElementsByClassName("searchStock").length == 0){
        var searchStock = document.createElement("div");
        var head = document.createElement("div");
        var graph = document.createElement("div");
        searchStock.className = "searchStock";
        head.className = "head";
        graph.className = "graphs";
    
        wrapper.appendChild(searchStock);
        searchStock.appendChild(head);
        searchStock.appendChild(graph);
    }
    
}

function drawTable(array, stock) {
    var infoNames = ["Ticker", "Listing Price", "Exchange", "Growth"];
    var info = [array[0]["t"], array[0]["l"], array[0]["e"], array[0]["c"]];
    var text = document.createTextNode(stock.toUpperCase());
    var stockDiv = document.getElementsByClassName("stocks")[stockList.indexOf(stock)];

    var table = stockDiv.getElementsByTagName("table")[0];
    //console.log("Table " + table);
    //Creates all table rows and appends them to table
    for (var x = 0; x < info.length; x++) {
        var tr = document.createElement("tr");
        table.insertBefore(tr, table.children[i]);
    }
    //Creats all table data and appends them to table rows
    for (var i = 0; i < info.length; i++) {
        var tr = table.children[i];
        var td0 = document.createElement("td");
        var text0 = document.createTextNode(infoNames[i]);
        var td1 = document.createElement("td");
        var text1 = document.createTextNode(info[i]);

        td0.appendChild(text0);
        tr.appendChild(td0);
        td1.appendChild(text1);
        tr.appendChild(td1);
    }

    var td = table.children[3].lastChild;
    td.style.fontWeight = "bolder";
    //console.log(td.innerHTML);

    if (td.innerHTML.charAt(0) === "+") {
        td.style.color = "#00FF00";
    } else {
        td.style.color = "#FF0000";
    }

}

function drawGraph(obj, stock) {
    var even = true;
    var graphDivs = document.getElementsByClassName("graphs");
    var keys = Object.keys(obj["Monthly Time Series"]);
    var data = { labels: [], series: [{ name: 'series1', data: [] }] };
    var options = {
        width: 400,
        height: 200,
        showPoint: false,
        lineSmooth: false,
        onlyInteger: true,
        series: { 'series1': { showArea: true } },
        axisY: {
            labelInterpolationFnc: function(value) {
                return '$' + value;
            },
            type: chart.AutoScaleAxis,
            showGrid: false,
        },
        axisX: { showGrid: false }
    };

    for (var i = 0; i < 7; i++) {

        var info = obj["Monthly Time Series"][Object.keys(obj["Monthly Time Series"])[i]]["4. close"];
        var key = keys[i];

        if (even) {
            data.labels.unshift(key.slice(5, 10));
        } else {
            data.labels.unshift("");
        }

        data.series[0]['data'].unshift(parseInt(info));

        even ? even = false : even = true; //switch value of even
    }
    //console.log(data);
    new chart.Line(graphDivs[stockList.indexOf(stock)], data, options);
}

function drawSearchGraph(obj, stock){
    var graphDiv = document.getElementsByClassName("graphs");
    var keys = Object.keys(obj["Monthly Time Series"]);
    var data = { labels: [], series: [{ name: 'series1', data: [] }] };
    var options = {
        width: '1000px',
        height: '600px',
        showPoint: false,
        lineSmooth: false,
        onlyInteger: true,
        scaleMinSpace: 200,
        series: { 'series1': { showArea: true } },
        axisY: {
            labelInterpolationFnc: function(value) {
                return '$' + value;
            },
            type: chart.AutoScaleAxis,
            showGrid: true,
        },
        axisX: { showGrid: false }
    };

    for (var i = 0; i < 7; i++) {

        var info = obj["Monthly Time Series"][Object.keys(obj["Monthly Time Series"])[i]]["4. close"];
        var key = keys[i];

        data.labels.unshift(key.slice(5, 10));
        data.series[0]['data'].unshift(parseInt(info));
    }
    //console.log(data);
    new chart.Line(graphDiv[0], data, options);
}

function setupClickHandlers() {
    var stocks = document.getElementsByClassName("stocks");
    for (var i = 0; i < stocks.length; i++) {
        var stock = stocks[i];
        var flipper = stock.children[0];
        stock.onclick = (function(flipper) {
            var rotated = false;
            return function() {
                if (!rotated) {
                    flipper.style.transform = "rotateY(180deg)";
                    flipper.style.webkitTransform = "rotateY(180deg)";
                    rotated = true;
                } else if (rotated) {
                    flipper.style.transform = "rotateY(0deg)";
                    flipper.style.webkitTransform = "rotateY(0deg)";
                    rotated = false;
                }
            };
        })(flipper);
    }
}

function flip() {
    var rotated = false;
    if (!rotated) {
        flipper.style.transform = "rotateY(180deg)";
        flipper.style.webkitTransform = "rotateY(180deg)";
        rotated = true;
    } else {
        flipper.style.transform = "rotateY(0deg)";
        flipper.style.webkitTransform = "rotateY(0deg)";
        rotated = false;
    }
}

//Adds names to all the stocks
function stockNamer() {
    var head = document.getElementsByClassName("head");
    for (var y = 0; y < stockNames.length; y++) {
        if (!head[y].hasChildNodes()) {
            var node = document.createTextNode(stockNames[y]);
            var h1 = document.createElement("h1");
            h1.appendChild(node);
            head[y].appendChild(h1);
        }
    }
}

function searchStockNamer(stock){
    var head = document.getElementsByClassName("head");
    var node = document.createTextNode(stock);
    var h1 = document.createElement("h1");
    h1.id="header";
    h1.appendChild(node);
    if(head[0].hasChildNodes()){
        document.getElementById("header").parentNode.removeChild(document.getElementById("header"));
    }
    head[0].appendChild(h1);
}
//Runs the functions for displaying the front page
function loadFrontPage(){
    for (var i = 0; i < stockList.length; i++) {
        getStockNumbers(stockList[i]);
        getMonthlyStockData("monthly", stockList[i], 0);
    }
    stockNamer();
    setupClickHandlers();
}
loadFrontPage();






