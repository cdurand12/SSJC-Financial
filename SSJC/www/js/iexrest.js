'use strict';
const request = require('request');
var stream;
var partialMessage;

//var stocks = 'AAPL';

// this is the STOCK 1

function iexconnect(){

  if(stream){
  stream.abort();
  console.log("stream stopped");
  }

function connect() {
  //var stocks = getStocks();
  var stocks = document.getElementById("stck1").value;
  //var stocks = 'AAPL,'
  console.log(stocks);
    stream = request({
        url: (`https://cloud-sse.iexapis.com/stable/stocksUSNoUTP5Second?token=pk_9b5669a51e754b99bf4f4824f3e2a4e4&symbols=${stocks}`),
        headers: {
            'Connection': 'keep-alive',
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache'
        }
    })
}
connect();

stream.on('socket', () => {
    console.log("Connected");
});

stream.on('end', () => {
    console.log("Reconnecting");
    connect();
});

stream.on('complete', () => {
    console.log("Reconnecting");
    connect();
});

stream.on('error', (err) => {
    console.log("Error", err);
    connect();
});

stream.on('data', (response) => {
    var chunk = response.toString();
    var cleanedChunk = chunk.replace(/data: /g, '');

    if (partialMessage) {
        cleanedChunk = partialMessage + cleanedChunk;
        partialMessage = "";
    }

    var chunkArray = cleanedChunk.split('\r\n\r\n');

    chunkArray.forEach(function (message) {
            try {
                var quote = JSON.parse(message)[0];
                document.getElementById("ask1").value = quote.latestPrice;
                document.getElementById("bid1").value = quote.iexBidPrice;
                console.log(quote.symbol,quote.latestPrice, quote.iexBidPrice);
            } catch (error) {
                partialMessage = message;
            }
    });
console.log("data recieved");
});

function wait () {
    setTimeout(wait, 1000);
};

wait();

function getStocks(){
  var table = document.getElementById('stocktable');
  var stocksList;
  for(var i=0; i < table.rows[i]; i++){
    if(table.rows[i].cells[0].innertext != NULL){
      stocksList += ((table.rows[i].cells[0].innerText) + ",");
    }
  }
  return stocksList;
}

}
