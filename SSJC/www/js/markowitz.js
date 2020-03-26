var PortfolioAllocation = require('portfolio-allocation');

var covMat = [[0.0146, 0.0187, 0.0145],
					 [0.0187, 0.0854, 0.0104],
					  [0.0145, 0.0104, 0.0289]];

    var returns = [0.062, 0.146, 0.128];
var w = PortfolioAllocation.meanVarianceEfficientFrontierPortfolios(returns, covMat, { nbPortfolios: 5 }) ;

console.log(w);









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
