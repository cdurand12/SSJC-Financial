const {mean, variance} = require('mathjs');
var PortfolioAllocation = require('portfolio-allocation');
var cov = require( 'compute-covariance' );
var datasource;
//Amount of data to be analyzed
//1m, 3m, 6m, 1y, 5y
var dataRange = "3m";
var iextoken = "pk_aaaf0470cd674291bb61f7735ab4ce22";
var riskfreeAsset = 0;


//Risk-free asset return rate
function riskfreeconnect(callbackfunc){
	const xhttp = new XMLHttpRequest();
	var url = `https://cloud.iexapis.com/stable/data-points/market/DGS5?token=${iextoken}`;
	xhttp.open("GET", url);
	xhttp.send();

	xhttp.onreadystatechange=function(){
		if(xhttp.readyState === 4 & xhttp.status == 200){
			callbackfunc(this);
		}
	}
}

function riskfreecallback(xhttp){
	var jsonObj = JSON.parse(xhttp.responseText);
	//console.log(jsonObj);
	riskFreeAsset = jsonObj;
}


//Acquire current 5-year Treasury Bond Rate for Risk Free asset
riskfreeconnect(riskfreecallback);



//Grabs historic stock data from the past month for the stocks that are included in the user portfolio (not in the wishlist)
function histiexconnect(callbackfunc){
	const xhttp = new XMLHttpRequest();
	var stocks = getStocksArray()[0];

	if(document.getElementById('watchlistbox').checked){
		var wList = getStocksArrayWatchlist();
		stocks += ("," + wList);
	}

//Empty Portfolio/Watchlist Check
	var watchCheck = getStocksArrayWatchlist();
	//console.log(watchCheck.length);

	if((stocks.length == 0 && !document.getElementById('watchlistbox').checked) || (stocks ===",," && document.getElementById('watchlistbox').checked && watchCheck.length == 2)){
		alert("Portfolio is empty");
		console.log(stocks);
		return;
	}
	//console.log(stocks);
//Historical Data URL
	var url = `https://cloud.iexapis.com/v1/stock/market/batch?types=chart&symbols=${stocks}&range=${dataRange} &token=${iextoken}&chartCloseOnly=true`;
	//test URL
	//url = `https://sandbox.iexapis.com/v1/stock/market/batch?types=chart&symbols=${stocks}&range=1m &token=Tsk_4750097c011b4f69aa37b5bcaec5ebbe&chartCloseOnly=true`;

	xhttp.open("GET", url);
	xhttp.send();

	xhttp.onreadystatechange=function(){
		//console.log(xhttp.responseText);
		if(xhttp.readyState === 4 && xhttp.status == 200){
			callbackfunc(this);
	}
	}
}

function stockcallback(xhttp){
	var stockAvg = [];
	var stockVar = [];
	var jsonObj = JSON.parse(xhttp.responseText);

		for(var x in jsonObj){
			//console.log(jsonObj[x]);
			let percentages = [];
			for(y in jsonObj[x].chart){
				//console.log(jsonObj[x].chart[y].changePercent + x);
			//	if(jsonObj[x].chart[y].changePercent != 0){
					percentages.push(jsonObj[x].chart[y].changePercent);
			//	}
			}
			//console.log(percentages);
			//console.log(mean(percentages) + " variance: " + variance(percentages));
			stockAvg.push(mean(percentages));
			stockVar.push(percentages);
		}
		//console.log([stockAvg, stockVar]);
		analyze([stockAvg, stockVar]);
	}

//Analyzes Portfolio using the maximumSharpeRatioWeights function from the portfolio allocation library
function analyze(inputs)
{
	const averages = inputs[0];
	const variances = inputs[1];
	//console.log(inputs);
	console.log("Averages: " + averages);
	console.log(variances);
	variances.forEach(element => element.shift());
	console.log(variances);
	//TEST DATA
	//var covMat = [[0.40755159,0.03175842,0.05183923,0.05663904,0.0330226,0.00827775,0.02165938,0.01332419,0.0343476,0.02249903],
						// [0.03175842,0.9063047,0.03136385,0.02687256,0.01917172,0.00934384,0.02495043,0.00761036,0.02874874,0.01336866],
						// [0.05183923,0.03136385,0.19490901,0.04408485,0.03006772,0.01322738,0.03525971,0.0115493,0.0427563,0.02057303],
						// [0.05663904,0.02687256,0.04408485,0.19528471,0.02777345,0.00526665,0.01375808,0.00780878,0.02914176,0.01640377],
						// [0.0330226,0.01917172,0.03006772,0.02777345,0.34059105,0.00777055,0.02067844,0.00736409,0.02542657,0.01284075],
						// [0.00827775,0.00934384,0.01322738,0.00526665,0.00777055,0.15983874,0.02105575,0.00518686,0.01723737,0.00723779],
						// [0.02165938,0.02495043,0.03525971,0.01375808,0.02067844,0.02105575,0.68056711,0.01377882,0.04627027,0.01926088],
						// [0.01332419,0.00761036,0.0115493,0.00780878,0.00736409,0.00518686,0.01377882,0.95526918,0.0106553,0.00760955],
						// [0.0343476,0.02874874,0.0427563,0.02914176,0.02542657,0.01723737,0.04627027,0.0106553,0.31681584,0.01854318],
						// [0.02249903,0.01336866,0.02057303,0.01640377,0.01284075,0.00723779,0.01926088,0.00760955,0.01854318,0.11079287]];
	//var returns = [1.175,1.19,0.396,1.12,0.346,0.679,0.089,0.73,0.481,1.08];

	var covMat2 = cov(variances);
	console.log("Covariance Matrix" + covMat2);

  var returns = averages;
	try{
		var w = PortfolioAllocation.maximumSharpeRatioWeights(returns, covMat2, riskfreeAsset) ;
	}
	catch(err){
		alert("No portfolio found with a positive return.");
	}
	//var w = PortfolioAllocation.maximumSharpeRatioWeights(returns, covMat2, riskfreeAsset) ;
	console.log("WEIGHTS: " + w);
	markowitzAlert(w);
}


function markowitzAlert(weights){
	var alertString = "To optimize your portfolio: \n";
	if(document.getElementById("wholeradio").checked){
		for(var i = 0; i < getStocksArray()[0].length; i++){
			alertString += document.getElementById("stck" + (i+1)).value + " " + shareDistribution2(weights[i], i) + "\n";
		}
		for(var i = 0; i < weights.length - getStocksArray()[0].length; i++){
			alertString += (shareDistribution2(weights[i + getStocksArray()[0].length], i + getStocksArray()[0].length) + "\n");
		}
		alert(alertString);
	}
	else{
		for(var i = 0; i < getStocksArray()[0].length; i++){
			alertString += document.getElementById("stck" + (i+1)).value + " " + shareDistribution(weights[i], i) + "\n";
		}
		for(var i = 0; i < weights.length - getStocksArray()[0].length; i++){
			alertString += (shareDistribution(weights[i + getStocksArray()[0].length], i + getStocksArray()[0].length) + "\n");
		}
		alert(alertString);
}
}


function calcPortfolioValue()
{
  var totalAcc = 0;
  for(var i = 1; i < document.getElementById("stocktable").rows.length; i++){
    if(document.getElementById("value" + i).value != ""){
    totalAcc += parseFloat(document.getElementById("value" + i).value);
    }
  }
	totalAcc += (1*document.getElementById("ufunds").value);
	console.log(totalAcc);
  return totalAcc;
}
//Share analysis for partial shares
//
// function shareDistribution(weight, rownum)
// {
// 	if(weight != 0 || document.getElementById("num" + (rownum+1)).value > 0){
// 	var shareProjection = 0;
// 	console.log(weight + " , " + document.getElementById("ask" + (rownum+1)).value);
// 	shareProjection = (calcPortfolioValue() * weight)/document.getElementById("ask" + (rownum+1)).value;
// 	var stockdifferential = shareProjection - document.getElementById("num" + (rownum+1)).value;
// 	if(stockdifferential < .001 && stockdifferential > -.001){
// 		return("Hold");
// 	}
// 	if(stockdifferential > 0){
// 		return ("Buy " + stockdifferential.toFixed(3) + " shares");
// 	}
// 		return ("Sell " + (stockdifferential*-1).toFixed(3) + " shares");
// 	}
// 	if(stockdifferential <= 0){
// 		return ("Sell " + (stockdifferential*-1).toFixed(3) + " shares");
// 	}
// 	console.log("weight is zero");
// 	return ("Hold " + document.getElementById("num" + (rownum+1)).value + " shares");
// }


function shareDistribution(weight, rownum)
{
	var stableLength = getStocksArray()[0].length;
	if(rownum+1 > stableLength){
		var windex = (rownum+1) - stableLength;
		console.log(weight + " , " + document.getElementById("wask" + (windex)).value);
		var shareProjection2 = 0.0;
		shareProjection2 = (calcPortfolioValue() * weight)/document.getElementById("wask" + (windex)).value;
		if(shareProjection2 > 0){
			return(document.getElementById("wstck" + (windex)).value + " Buy " + shareProjection2.toFixed(3) + " shares");
		}
		return(document.getElementById("wstck" + (windex)).value + " Don't Buy Shares in Stock");
	}
	if(weight != 0 || document.getElementById("num" + (rownum+1)).value > 0){
	var shareProjection = 0;
	shareProjection = (calcPortfolioValue() * weight)/document.getElementById("ask" + (rownum+1)).value;
	var stockdifferential = shareProjection - document.getElementById("num" + (rownum+1)).value;
	if(stockdifferential < .001 && stockdifferential > -.001){
		return("Hold");
	}
	if(stockdifferential > 0){
		return ("Buy " + stockdifferential.toFixed(3) + " shares");
	}
		return ("Sell " + (stockdifferential*-1).toFixed(3) + " shares");
	}
	if(stockdifferential <= 0){
		return ("Sell " + (stockdifferential*-1).toFixed(3) + " shares");
	}
	console.log("weight is zero");
	return ("Hold " + document.getElementById("num" + (rownum+1)).value + " shares");
}







//Share analysis for whole shares
//

function shareDistribution2(weight, rownum)
{
	var stableLength = getStocksArray()[0].length;
	if(rownum+1 > stableLength){
		var windex = (rownum+1) - stableLength;
		console.log(weight + " , " + document.getElementById("wask" + (windex)).value);
		var shareProjection2 = 0;
		shareProjection2 = (calcPortfolioValue() * weight)/document.getElementById("wask" + (windex)).value;
		if(shareProjection2 > 0){
			return(document.getElementById("wstck" + (windex)).value + " Buy " + shareProjection2.toFixed(0) + " shares");
		}
		return(document.getElementById("wstck" + (windex)).value + " Don't Buy");
	}
	if(weight != 0 || document.getElementById("num" + (rownum+1)).value > 0){
	var shareProjection = 0;
	console.log(weight + " , " + document.getElementById("ask" + (rownum+1)).value);
	shareProjection = (calcPortfolioValue() * weight)/document.getElementById("ask" + (rownum+1)).value;
	var stockdifferential = shareProjection - document.getElementById("num" + (rownum+1)).value;
	if(stockdifferential < .001 && stockdifferential > -.001){
		return("Hold");
	}
	if(stockdifferential > 0){
		return ("Buy " + stockdifferential.toFixed(0) + " shares");
	}
		return ("Sell " + (stockdifferential*-1).toFixed(0) + " shares");
	}
	if(stockdifferential <= 0){
		return ("Sell " + (stockdifferential*-1).toFixed(0) + " shares");
	}
	console.log("weight is zero");
	return ("Hold ");
}
