var size = 13;
var cal_aoj,cal_atcoder,cal_codeforces;
var now;

(function(){
    'use strict';
    now = new Date();
    cal_aoj = new CalHeatMap();
    cal_aoj.init({
        itemSelector: '#aoj-heatmap',
        domainLabelFormat: '%Y-%m',
        start: new Date(now.getFullYear(), now.getMonth() - 11),
        cellSize: size,
        range: 12,
        domain: "month",
        domainGutter: 5,
        legendColors: ["#efefef", "gold"],
        legend: [1, 3, 5]
    });
    cal_atcoder = new CalHeatMap();
    cal_atcoder.init({
        itemSelector: '#atcoder-heatmap',
        domainLabelFormat: '%Y-%m',
        start: new Date(now.getFullYear(), now.getMonth() - 11),
        cellSize: size,
        range: 12,
        domain: "month",
        domainGutter: 5,
        legendColors: ["#efefef", "deeppink"],
        legend: [1, 3, 5]
    });
    cal_codeforces = new CalHeatMap();
    cal_codeforces.init({
        itemSelector: '#codeforces-heatmap',
        domainLabelFormat: '%Y-%m',
        start: new Date(now.getFullYear(), now.getMonth() - 11),
        cellSize: size,
        range: 12,
        domain: "month",
        domainGutter: 5,
        legendColors: ["#efefef", "navy"],
        legend: [1, 3, 5]
    });

    var result = {};
    if(1 < window.location.search.length) {
        var query = window.location.search.substring(1);
        var parameters = query.split('&');
        for(var i = 0; i < parameters.length; i++) {
            var element = parameters[i].split('=');
            var paramName  = decodeURIComponent(element[0]);
            var paramValue = decodeURIComponent(element[1]);
            result[paramName] = paramValue;
        }
    }

    //console.log(result["handle_codeforces"]);
    //console.log(result["handle_atcoder"]);
    //console.log(result["handle_aoj"]);

    if(result["handle_codeforces"])
	      document.getElementById("handle_codeforces").value = result["handle_codeforces"];
    if(result["handle_atcoder"])
	      document.getElementById("handle_atcoder").value = result["handle_atcoder"];
    if(result["handle_aoj"])
	      document.getElementById("handle_aoj").value = result["handle_aoj"];

    getData();

})();

function getData(){

    var handle_aoj = document.getElementById("handle_aoj").value;
    var handle_atcoder = document.getElementById("handle_atcoder").value;
    var handle_codeforces = document.getElementById("handle_codeforces").value;
    var str = "handle_atcoder=" + handle_atcoder + "&handle_codeforces=" + handle_codeforces + "&handle_aoj=" + handle_aoj;
    history.replaceState('', '', `?${str}`);

    getAOJ(handle_aoj);
    getAtCoder(handle_atcoder);
    getCodeForces(handle_codeforces);
}

function getAOJ(handle){
    //var handle = document.getElementById("handle_aoj").value;
    //var handle = "is0384er";
    //console.log(handle);
    var solved = 0;
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
              var aoj_ac = {};
              var problems = {};
              if(json != undefined){
                  for(var i = 0; i < json.length; i++){
                        var prob = json[i].problemId;
                        if(problems[prob] == undefined){
                            problems[prob] = 1;
                            solved += 1;
                            aoj_ac[(json[i].judgeDate/1000) - 32400] = 1;
                        }
                  }
              }

              console.log(solved);
              document.getElementById("aoj_id").textContent = handle;
              document.getElementById("aoj_solved").textContent = solved + "AC";
              cal_aoj.update(aoj_ac);

	      }).fail(function(data){
            alert("Failed(AOJ)");
		    console.log(data);
	      });
}

function getAtCoder(handle){
    //var handle = document.getElementById("handle_atcoder").value;
    //var handle = "rika0384";
    //console.log(handle);
    var solved = 0;
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
              if(data.query.results != null){
    	          var json = data.query.results.json.json;

                  console.log(data);
                  //console.log(json);

                  var problems = {};
    	          for(var i = 0; i < json.length; i++){
    		            if(json[i].result != "AC")continue;
    		            var prob = json[i].problem_id;
    		            if(problems[prob] == undefined){
    		                problems[prob] = 1;
    		                solved += 1;
                            atcoder_ac[json[i].epoch_second - 32400] = 1;
    		            }
    	          }
              }
              console.log(solved);
              document.getElementById("atcoder_id").textContent = handle;
              document.getElementById("atcoder_solved").textContent = solved + "AC";
              cal_atcoder.update(atcoder_ac);

	      }).fail(function(data){
		        alert("Failed(AC)");
		        console.log(data);
	      });
}

function getCodeForces(handle){
    //var handle = document.getElementById("handle_codeforces").value;
    //var handle = "rika0384";
    //console.log(handle);
    var solved = 0;
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
                var json = data.query.results.json.result;
                if(json != undefined){
                    var problems = {};
                    for(var i = 0; i < json.length; i++){
                    	if(json[i].verdict != "OK" || json[i].testset != "TESTS" )  continue;
                        var prob = json[i].problem;
        	            if(problems[prob.contestId] != undefined){
                            if(problems[prob.contestId][prob.name] == undefined){
                                   problems[prob.contestId][prob.name] = 1;
                                   solved += 1;
                                   codeforces_ac[json[i].creationTimeSeconds - 32400] = 1;
                    		}
                    	}else{
                    	       problems[prob.contestId] = {};
                    		   problems[prob.contestId][prob.name] = 1;
                    		   solved += 1;
                               codeforces_ac[json[i].creationTimeSeconds - 32400] = 1;
                    	}
                    }
                    //console.log(codeforces_ac);
                    console.log(solved);
                }
                document.getElementById("codeforces_id").textContent = handle;
                document.getElementById("codeforces_solved").textContent = solved + "AC";
                cal_codeforces.update(codeforces_ac);

	      }).fail(function(data){
	          alert("Failed(CF)");

		        console.log(data);
	      });

}
