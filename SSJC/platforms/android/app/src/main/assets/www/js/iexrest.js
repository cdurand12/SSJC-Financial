'use strict';
const request = require('request');
var stream;
var source;
var partialMessage;

var rowNum = 3;
function addrow(){
  if(rowNum == 50){ return; }
  var table = document.getElementById("stocktable");
  var row = table.insertRow(-1);
  rowNum = rowNum + 1;
  var text = "row" + rowNum.toString();
  row.setAttribute("id", text);

  var td1 = document.createElement("td");
  var td2 = document.createElement("td");
  var td3 = document.createElement("td");
  var td4 = document.createElement("td");
  var td5 = document.createElement("td");
  var td6 = document.createElement("td");
  var td7 = document.createElement("td");
  var xbutton = document.createElement("td");
  row.appendChild(td1);
  row.appendChild(td2);
  row.appendChild(td3);
  row.appendChild(td4);
  row.appendChild(td5);
  row.appendChild(td6);
  row.appendChild(td7);
  row.appendChild(xbutton);

  var cell1 = document.createElement("input");
  cell1.setAttribute("style", "text-transform: uppercase");
  cell1.setAttribute("oninput", "this.value = this.value.toUpperCase()");
  cell1.setAttribute("type", "text");
  text = "stck" + rowNum.toString();
  cell1.setAttribute("placeholder", text);
  cell1.setAttribute("id", text);
  cell1.setAttribute("class", "stock");
  td1.appendChild(cell1);
  var cell2 = document.createElement("input");
  cell2.setAttribute("type", "number");
  cell2.setAttribute("placeholder", "0");
  cell2.setAttribute("min","0");
  text = "ask" + rowNum.toString();
  var funcText = "calcValue(\'" + text + "\')";
  cell2.setAttribute("oninput", funcText);
  cell2.setAttribute("id", ("num" + rowNum.toString()));
  cell2.setAttribute("class", "num");
  td2.appendChild(cell2);
  var cell3 = document.createElement("input");
  cell3.setAttribute("disabled", "true");
  cell3.setAttribute("type", "text");
  cell3.setAttribute("placeholder", "Asking Price");
  cell3.setAttribute("oninput", funcText);
  cell3.setAttribute("id", text);
  cell3.setAttribute("class", "ask");
  td3.appendChild(cell3);
  var cell4 = document.createElement("input");
  cell4.setAttribute("disabled", "true");
  cell4.setAttribute("type", "text");
  cell4.setAttribute("placeholder", "Bid Price");
  text = "bid" + rowNum.toString();
  cell4.setAttribute("id", text);
  cell4.setAttribute("class", "bid");
  td4.appendChild(cell4);
  var cell5 = document.createElement("input");
  cell5.setAttribute("disabled", "true");
  cell5.setAttribute("type", "text");
  cell5.setAttribute("placeholder", "Change");
  text = "change" + rowNum.toString();
  //cell5.setAttribute("oninput", ("color(\'" + text + "\')"))
  cell5.setAttribute("id", text);
  cell5.setAttribute("class", "pm");
  td5.appendChild(cell5);
  var cell6 = document.createElement("input");
  cell6.setAttribute("disabled", "true");
  cell6.setAttribute("type", "text");
  cell6.setAttribute("placeholder", "Change %");
  text = "percent" + rowNum.toString();
  //cell6.setAttribute("oninput", ("color(\'" + text + "\')"))
  cell6.setAttribute("id", text);
  cell6.setAttribute("class", "pr");
  td6.appendChild(cell6);
  var cell7 = document.createElement("input");
  cell7.setAttribute("type", "text");
  cell7.setAttribute("disabled", "true");
  cell7.setAttribute("placeholder", "Total Value");
  text = "value" + rowNum.toString();
  cell7.setAttribute("id", text)
  td7.appendChild(cell7);
  var xb = document.createElement("img");
  xb.setAttribute("src", "img/redx.png");
  xb.setAttribute("onclick", "deletespecificrow()");
  xb.setAttribute("height", "10");
  xb.setAttribute("width", "10");
  xb.setAttribute("vspace", "5");
  xbutton.appendChild(xb);
}

/*
function color(tag)
{
  var num = document.getElementById(tag);
  if(num[0] == "-"){ make red }
  else if(num == 0){ make grey }
  else{ make green }
}
*/

function calcValue(asknumber)
{
  var row = asknumber.toString();
  var askP = Number(document.getElementById(row).value);
  row = asknumber[3];
  var num = Number(document.getElementById("num" + row).value);
  if(num < 0){ document.getElementById("num" + row).value = 0; num = 0; }
  var totVal = askP * num;
  var input = document.getElementById("value" + row);
  input.value = totVal;
}

function deleterow() {
  if(document.getElementById("stocktable").rows.length > 2){
    document.getElementById("stocktable").deleteRow(-1);
    rowNum = rowNum - 1;
  }
}

function deletespecificrow() {
      var td = event.target.parentNode;
      var tr = td.parentNode;
      tr.parentNode.removeChild(tr);
}

function iexconnect(){

  if(stream){
  stream.abort();
  console.log("stream stopped");
  }

function connect() {
  var stocks = getStocks();
  console.log(stocks);
    stream = request({
        url: (`https://cloud-sse.iexapis.com/stable/stocksUSNoUTP5Second?token=pk_9b5669a51e754b99bf4f4824f3e2a4e4&symbols=${stocks}`),
        headers: {
            'Connection': 'keep-alive',
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache'
        }})
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
              for(var i = 1; i < document.getElementById("stocktable").rows.length; i++){
                var quote = JSON.parse(message)[0];
                console.log(quote);
                console.log(quote.symbol, "ask"+i, document.getElementById("stck" + i).value);
                if(quote.symbol == document.getElementById("stck" + i).value){
                  document.getElementById("ask" + i).value = quote.latestPrice;
                  calcValue("ask"+i);
                  document.getElementById("bid" + i).value = quote.iexBidPrice;
                  document.getElementById("change" + i).value = quote.change;
                  document.getElementById("percent" + i).value = quote.changePercent;
                }
                //JSON example https://cloud.iexapis.com/stable/stock/aapl/quote?token=pk_9b5669a51e754b99bf4f4824f3e2a4e4
                //console.log(quote.symbol,quote.latestPrice, quote.iexBidPrice);
                }
            } catch (error) {
                partialMessage = message;
            }
    });
console.log("data recieved");
});

function wait () { setTimeout(wait, 1000); };

wait();
}

function iexconnect2(){
  if(source != null && source.readyState !== 2){
    console.log("stream stopped");
    source.close();
  }

  var stocks = getStocks();
  source = new EventSource(`https://cloud-sse.iexapis.com/stable/stocksUSNoUTP5Second?token=pk_9b5669a51e754b99bf4f4824f3e2a4e4&symbols=${stocks}`);

  source.onmessage = function(){
    var chunk = event.data.toString();
    var cleanedChunk = chunk.replace(/data: /g, '');

    if (partialMessage) {
        cleanedChunk = partialMessage + cleanedChunk;
        partialMessage = "";
    }

    var chunkArray = cleanedChunk.split('\r\n\r\n');

    chunkArray.forEach(function (message) {
            try {
              for(var i = 1; i < document.getElementById("stocktable").rows.length; i++){
                var quote = JSON.parse(message)[0];
                console.log(quote);
                console.log(quote.symbol, "ask"+i, document.getElementById("stck" + i).value);
                if(quote.symbol == document.getElementById("stck" + i).value){
                  document.getElementById("ask" + i).value = quote.latestPrice;
                  calcValue("ask"+i);
                  document.getElementById("bid" + i).value = quote.iexBidPrice;
                  document.getElementById("change" + i).value = quote.change;
                  document.getElementById("percent" + i).value = quote.changePercent;
                }
                //JSON example https://cloud.iexapis.com/stable/stock/aapl/quote?token=pk_9b5669a51e754b99bf4f4824f3e2a4e4
                //console.log(quote.symbol,quote.latestPrice, quote.iexBidPrice);
                }
            } catch (error) {
                partialMessage = message;
            }
    });
console.log("data recieved from iexconnect2");
  }
}

function getStocks(){
  var table = document.getElementById('stocktable');
  var stocksList = "";
  var tableLength = document.getElementById("stocktable").rows.length;
  console.log(tableLength);
  for(var i=1; i < tableLength; i++){
    if(document.getElementById("stck" + i).value != ""){
      stocksList += (document.getElementById("stck" + i).value + ",");
    }
  }
  var returnList = stocksList.substring(0, stocksList.length - 1);
  console.log(returnList);
  return returnList;
}
