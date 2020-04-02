const {mean, variance} = require('mathjs');
var PortfolioAllocation = require('portfolio-allocation');
var cov = require( 'compute-covariance' );
var datasource;

//Grabs historic stock data from the past month for the stocks that are included in the user portfolio (not in the wishlist)
function histiexconnect(callbackfunc){
	const xhttp = new XMLHttpRequest();
	var stocks = getStocks();
	var url = `https://cloud.iexapis.com/v1/stock/market/batch?types=chart&symbols=${stocks}&range=1m &token=pk_9b5669a51e754b99bf4f4824f3e2a4e4`;
	//test URL
	//url = `https://sandbox.iexapis.com/v1/stock/market/batch?types=chart&symbols=${stocks}&range=1m &token=Tsk_4750097c011b4f69aa37b5bcaec5ebbe`;

	xhttp.open("GET", url);
	xhttp.send();

	xhttp.onreadystatechange=function(){
		//console.log(xhttp.responseText);
		if(xhttp.readyState === 4 && xhttp.status == 200){
			callbackfunc(this);
	}
	//console.log([stockAvg, stockVar]);
	//return [stockAvg, stockVar];

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
	var w = PortfolioAllocation.maximumSharpeRatioWeights(returns, covMat2, 0) ;
	console.log("WEIGHTS: " + w);
}









//*****OPENCPU DIDN'T WORK********
// ocpu.seturl("http://public.opencpu.org/ocpu/library/base/R")
//
// var mydata = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
//
// //call R function: stats::sd(x=data)
//
// function rtest(){
//     console.log("rtest working");
//     var req = ocpu.rpc("sd",{
//         x : mydata
//     }, function(output){
//         alert("Standard Deviation equals: " + output);
//     });
//
//     //optional
//     req.fail(function(){
//         alert("R returned an error: " + req.responseText);
//     });
// }
//
//
// function rtest2(){
//   console.log("rtest2 working");
//   var markfunc = "function(x, n){ return(x^n)}";
//
//   var mysnippet = new ocpu.Snippet(markfunc);
//
//   var req = ocpu.rpc("do.call", {
//        what : mysnippet,
//        args : {
//            x : [1,2,3,4,5],
//            n : 3
//        }
//    }, function(output){
//      console.log(output);
//    });
//
//    //if R returns an error, alert the error message
//    req.fail(function(){
//        alert("Server error: " + req.responseText);
//    });
//
//    req.always(function(){
//        $("button").removeAttr("disabled");
// });
// }
