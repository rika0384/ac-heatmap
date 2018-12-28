var size = 13;
var solved_codeforces = 0;
var solved_atcoder = 0;
var solved_aoj = 0;



var now;

(function(){
    'use strict';
    now = new Date();
    getAOJ();
    getAtCoder();
    getCodeForces();
})();

function getData(){
    getAOJ();
    getAtCoder();
    getCodeForces();
}

function getAOJ(){
    //var handle = document.getElementById("handle_aoj").value;
    console.log(handle);
    var handle = "is0384er";
    var url = "https://judgeapi.u-aizu.ac.jp/solutions/users/" + handle;
    var query = "select * from json where url = '" + url + "'";
    var yql   = "https://query.yahooapis.com/v1/public/yql?format=json&q=" + encodeURIComponent(query);
    $.ajax(
	      {
		        type     : 'GET',
		        url      : yql,
		        dataType : 'json',
		        timeout  : 20000,
		        cache    : false,
	      }).done(function(data){
              //console.log(data);
	          var json = data.query.results.json.json;
              console.log(json);
              solved_aoj = 0;
              var aoj_ac = {};
              var problems = {};
              if(json != undefined){
                  for(var i = 0; i < json.length; i++){
                        var prob = json[i].problemId;
                        if(problems[prob] == undefined){
                            problems[prob] = 1;
                            solved_aoj += 1;
                            aoj_ac[json[i].judgeDate/1000] = 1;
                        }
                  }
              }

              console.log(aoj_ac);

              var cal_aoj = new CalHeatMap();
              cal_aoj.init({
                  itemSelector: '#aoj-heatmap',
                  domainLabelFormat: '%Y-%m',
                  start: new Date(now.getFullYear(), now.getMonth() - 11),
                  cellSize: size,
                  range: 12,
                  domain: "month",
                  domainGutter: 5,
                  data: aoj_ac,
                  legendColors: ["#efefef", "gold"],
                  legend: [1, 3, 5]
              });


	      }).fail(function(data){
            alert("Failed(AOJ)");
		    console.log(data);
	      });
}

function getAtCoder(){
    //var handle = document.getElementById("handle_atcoder").value;
    var handle = "rika0384";
        console.log(handle);
    solved_atcoder = 0;
    var url = "https://kenkoooo.com/atcoder/atcoder-api/results?user=" + handle;
    var query = "select * from json where url = '" + url + "'";
    var yql   = "https://query.yahooapis.com/v1/public/yql?format=json&q=" + encodeURIComponent(query);
    $.ajax(
	      {
		        type     : 'GET',
		        url      : yql,
		        dataType : 'json',
		        timeout  : 20000,
		        cache    : false,
	      }).done(function(data){
              var atcoder_ac = {};
              solved_atcoder = 0;
              if(data.query.results != null){
    	          var json = data.query.results.json.json;

                  console.log(data);
                  console.log(json);

                  var problems = {};
    	          solved_atcoder = 0;
    	          for(var i = 0; i < json.length; i++){
    		            if(json[i].result != "AC")continue;
    		            var prob = json[i].problem_id;
    		            if(problems[prob] == undefined){
    		                problems[prob] = 1;
    		                solved_atcoder += 1;
                            atcoder_ac[json[i].epoch_second] = 1;
    		            }
    	          }
              }
              console.log(atcoder_ac);
              var cal_atcoder = new CalHeatMap();
              cal_atcoder.init({
                  itemSelector: '#atcoder-heatmap',
                  domainLabelFormat: '%Y-%m',
                  start: new Date(now.getFullYear(), now.getMonth() - 11),
                  cellSize: size,
                  range: 12,
                  domain: "month",
                  domainGutter: 5,
                  data: atcoder_ac,
                  legendColors: ["#efefef", "deeppink"],
                  legend: [1, 3, 5]
              });



	      }).fail(function(data){
		        alert("Failed(AC)");
		        console.log(data);
	      });
}

function getCodeForces(){
    //var handle = document.getElementById("handle_codeforces").value;
    var handle = "rika0384";
        console.log(handle);
    var url = "https://codeforces.com/api/user.status?handle=" + handle;
    var query = "select * from json where url = '" + url + "'";
    var yql   = "https://query.yahooapis.com/v1/public/yql?format=json&q=" + encodeURIComponent(query);
    $.ajax(
	      {
		        type     : 'GET',
		        url      : yql,
		        dataType : 'json',
		        timeout  : 10000,
		        cache    : false,
	      }).done(function(data){
                console.log(data);
                var codeforces_ac = {};
                solved_codeforces = 0;
                var json = data.query.results.json.result;
                if(json != undefined){
                    var problems = {};
                    for(var i = 0; i < json.length; i++){
                    	if(json[i].verdict != "OK" || json[i].testset != "TESTS" )  continue;
                        var prob = json[i].problem;
        	            if(problems[prob.contestId] != undefined){
                            if(problems[prob.contestId][prob.name] == undefined){
                                   problems[prob.contestId][prob.name] = 1;
                                   solved_codeforces += 1;
                                   codeforces_ac[json[i].creationTimeSeconds] = 1;
                    		}
                    	}else{
                    	       problems[prob.contestId] = {};
                    		   problems[prob.contestId][prob.name] = 1;
                    		   solved_codeforces += 1;
                               codeforces_ac[json[i].creationTimeSeconds] = 1;
                    	}
                    }
                    console.log(codeforces_ac);
                    console.log(solved_codeforces);
                }


                var cal_codeforces = new CalHeatMap();
                cal_codeforces.init({
                    itemSelector: '#codeforces-heatmap',
                    domainLabelFormat: '%Y-%m',
                    start: new Date(now.getFullYear(), now.getMonth() - 11),
                    cellSize: size,
                    range: 12,
                    domain: "month",
                    domainGutter: 5,
                    data: codeforces_ac,
                    legendColors: ["#efefef", "navy"],
                    legend: [1, 3, 5]
                });


	      }).fail(function(data){
	          alert("Failed(CF)");

		        console.log(data);
	      });

}
