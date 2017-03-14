var request = require('request');
var stockList = ["goog", "aapl", "amzn", "ibm", "tsla", "fb"];
var stockNames = ["Alphabet Inc.", "Apple Inc.", "Amazon Inc.", "IBM Inc.", "Tesla Inc.", "Facebook Inc."]

function getInfo(stock){
	var url = "https://www.google.com/finance/info?client=ig&q=" + stock;
	console.log(url);
	request(url, function(error, response, body) {
		//console.log('error:', error); // Print the error if one occurred
		//console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
		if(!error && response.statusCode === 200) {
			body = body.slice(3);
			body = JSON.parse(body);
			console.log(body);
			draw(body, stock);
		}
	});

	function draw(arr, stock){
		var infoNames = ["Ticker", "Listing Price", "Exchange", "Growth"];
		var info = [arr[0]["t"], arr[0]["l"], arr[0]["e"], arr[0]["c"]];
		var text = document.createTextNode(stock.toUpperCase());
		var span = document.createElement("span");
		var value = document.createTextNode(info[1] + "$");
		var div = document.createElement("div");
		var stockDiv = document.getElementsByClassName("stocks")[stockList.indexOf(stock)];
		stockDiv.appendChild(div);
		span.appendChild(value);
		div.appendChild(span);
		div.style.height = (info[1]/4).toString() + "px";
		div.className = "bar";

		var table = stockDiv.firstChild;

		//Creates all table rows and appends them to table
		for (var x = 0; x < info.length; x++) {
			var tr = document.createElement("tr");
			table.appendChild(tr);
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
		console.log(td);

		if (td.innerHTML.charAt(0) === "+") {
			td.style.color = "#00FF00";
		} else {
			td.style.color = "#DD0048";
		}

		//Name all the stocks
		var head = document.getElementsByClassName("head");
		for (var y = 0; y < stockNames.length; y++) {
			var node = document.createTextNode(stockNames[y]);
			var h1 = document.createElement("h1");
			if(!head[y].hasChildNodes()){
				head[y].appendChild(h1);
				h1.appendChild(node);
			}
		}
	}
}


for(var i = 0; i < stockList.length; i++){
	getInfo(stockList[i]);
}
