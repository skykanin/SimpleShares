var request = require('request');
var stockList = ["goog", "aapl", "ssnlf", "test0", "test1", "test2"];

function getInfo(stock){
	var url = "https://www.google.com/finance/info?client=ig&q=" + stock;
	console.log(url);
	request(url, function(error, response, body) {
		console.log('error:', error); // Print the error if one occurred
		console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
		if(!error && response.statusCode === 200) {
			body = body.slice(3);
			body = JSON.parse(body);
			console.log(body);
			draw(body, stock);
		}
	});

	function draw(arr, stock){
		currentPrice = arr[0]["l"];
		var caption = document.createElement("caption");
		var text = document.createTextNode(stock.toUpperCase());
		var span = document.createElement("span");
		var value = document.createTextNode(currentPrice + "$");
		var div = document.createElement("div");
		var stockDiv = document.getElementsByClassName("stocks")[stockList.indexOf(stock)];
		stockDiv.appendChild(div);
		span.appendChild(value);
		div.appendChild(span);
		div.style.height = (currentPrice/5).toString() + "px";
		div.className = "bar";
		}
	}


/*for(var i = 0; i < stockList.length; i++){
	getInfo(stockList[i]);
}*/

getInfo(stockList[0]);
getInfo(stockList[1]);
