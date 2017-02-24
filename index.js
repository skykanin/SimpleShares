var request = require('request');

function googleRequest(){
	request("https://www.google.com/finance/info?client=ig&q=goog", function(error, response, body) {
		body = body.slice(3);
		body = JSON.parse(body);
		console.log(body);
		newPrice(body);
	});
	function newPrice(arr) {
		currentPrice = arr[0]["l"];
		document.getElementsByClassName("stocks")[0].innerHTML = currentPrice;
	}
}

setInterval(googleRequest(), 2000);
