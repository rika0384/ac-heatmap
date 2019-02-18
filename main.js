var size = 13;
var cal_aoj,cal_atcoder,cal_codeforces,cal_all;
var now;
var query_time;
var all_solved = 0;
var all_new_ac = 0;
var all_ac = {};
var new_time = 1546268400;//2019/1/1

//
let aoj = {};
aoj.api = {};

aoj.api.baseUrl = 'https://judgeapi.u-aizu.ac.jp';

aoj.api.request = (url, params) =>
  fetch(`${url}?${$.param(Object.assign({ _timestamp: +new Date() }, params))}`)
    .then(x => x.json());

aoj.api.users = {};

aoj.api.users.findById = id =>
  aoj.api.request(`${aoj.api.baseUrl}/users/${id}`);

aoj.api.solutions = {};

aoj.api.solutions.findByUserId = (userId, page) =>
  aoj.api.request(`${aoj.api.baseUrl}/solutions/users/${userId}`, { page });

aoj.api.solutions.findAllByUserId = userId =>
  new Promise((resolve, reject) => {
    let allSolutions = [];
    let page = 0;
    let tryUnlessEmpty = () => {
      aoj.api.solutions.findByUserId(userId, page).then(nextSolutions => {
        if (nextSolutions.length === 0) {
          allSolutions.sort((a, b) => a.submissionDate - b.submissionDate);
          resolve(allSolutions);
          return;
        }
        allSolutions = allSolutions.concat(nextSolutions);
        page++;
        tryUnlessEmpty();
      });
    };
    tryUnlessEmpty();
  });
//



(function(){
    'use strict';
    now = new Date();

    cal_all = new CalHeatMap();
	    cal_all.init({
	        itemSelector: '#all-heatmap',
	        domainLabelFormat: '%Y-%m',
	        start: new Date(now.getFullYear(), now.getMonth() - 11),
	        cellSize: size,
	        range: 12,
	        domain: "month",
	        domainGutter: 5,
	        legend: [1, 3, 5]
	    });

    cal_aoj = new CalHeatMap();
    cal_aoj.init({
        itemSelector: '#aoj-heatmap',
        domainLabelFormat: '%Y-%m',
        start: new Date(now.getFullYear(), now.getMonth() - 11),
        cellSize: size,
        range: 12,
        domain: "month",
        domainGutter: 5,
        //legendColors: ["#efefef", "gold"],
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
        //legendColors: ["#efefef", "deeppink"],
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
        //legendColors: ["#efefef", "navy"],
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

    now = new Date();
    query_time = Math.floor(now/300);
    all_solved = 0;
    all_new_ac = 0;
    all_ac = {};


    var handle_aoj = document.getElementById("handle_aoj").value;
    var handle_atcoder = document.getElementById("handle_atcoder").value;
    var handle_codeforces = document.getElementById("handle_codeforces").value;
    var str = "handle_atcoder=" + handle_atcoder + "&handle_codeforces=" + handle_codeforces + "&handle_aoj=" + handle_aoj;
    history.replaceState('', '', `?${str}`);

    getAOJ(handle_aoj);
    getAtCoder(handle_atcoder);
    getCodeForces(handle_codeforces);
}



function getAOJ(handle) {
    aoj.api.solutions.findAllByUserId(handle).then(function(solutions) {
        let problems = new Set();
        var aoj_ac = {};
        var solved = 0;
        var new_ac = 0;
        for (let solution of solutions) {
            if (problems.has(solution.problemId)) continue;
            problems.add(solution.problemId);
            solved += 1;
            aoj_ac[(solution.judgeDate/1000)] = 1;
            all_ac[(solution.judgeDate/1000)] = 1;
            if(Number(solution.judgeDate/1000) >= new_time)new_ac++;
        }

        console.log(solved);
        document.getElementById("aoj_id").textContent = handle;
        document.getElementById("aoj_solved").textContent = solved + "AC（" + new_ac + "AC）";
        cal_aoj.update(aoj_ac);
        all_solved += solved;
        all_new_ac += new_ac;

        cal_all.update(all_ac);
        document.getElementById("all_solved").textContent = all_solved + "AC（" + all_new_ac + "AC）";

    });

}

function getAtCoder(handle){
    //var handle = document.getElementById("handle_atcoder").value;
    //var handle = "rika0384";
    //console.log(handle);
    var solved = 0;
    var new_ac = 0;
    var atcoder_ac = {};
    var url = "https://kenkoooo.com/atcoder/atcoder-api/results?user=" + handle + "&timestamp=" + query_time;

    document.getElementById("atcoder_id").textContent = handle;
    document.getElementById("atcoder_solved").textContent = solved +"AC（" + new_ac+ "AC）";
    cal_atcoder.update(atcoder_ac);

    fetch(url).then(function(response) {
                return response.json();
            }).then(function(json) {
                console.log(json);
                var problems = {};
                for(var i = 0; i < json.length; i++){
                      if(json[i].result != "AC")continue;
                      var prob = json[i].problem_id;
                      if(problems[prob] == undefined){
                          problems[prob] = 1;
                          solved += 1;
                          atcoder_ac[json[i].epoch_second] = 1;
                          all_ac[json[i].epoch_second] = 1;
                          if(Number(json[i].epoch_second) >= new_time)new_ac++;
                      }
                }
                console.log(solved);
                console.log(new_ac);
                document.getElementById("atcoder_id").textContent = handle;
                document.getElementById("atcoder_solved").textContent = solved +"AC（" + new_ac+ "AC）";
                cal_atcoder.update(atcoder_ac);
                all_solved += solved;
                all_new_ac += new_ac;
                cal_all.update(all_ac);
                document.getElementById("all_solved").textContent = all_solved + "AC（" + all_new_ac + "AC）";

            });

}

function getCodeForces(handle){
    //var handle = document.getElementById("handle_codeforces").value;
    //var handle = "rika0384";
    //console.log(handle);
    var solved = 0;
    var new_ac = 0;
    var codeforces_ac = {};
    var url = "https://codeforces.com/api/user.status?handle=" + handle + "&timestamp=" + query_time;

    document.getElementById("codeforces_id").textContent = handle;
    document.getElementById("codeforces_solved").textContent = solved + "AC（" + new_ac + "AC）";
    cal_codeforces.update(codeforces_ac);

    fetch(url).then(function(response) {
                return response.json();
            }).then(function(json) {
                json = json.result;
                console.log(json);

                var problems = {};
                for(var i = 0; i < json.length; i++){
                    if(json[i].verdict != "OK" || json[i].testset != "TESTS" )  continue;
                    var prob = json[i].problem;
                    if(problems[prob.contestId] != undefined){
                        if(problems[prob.contestId][prob.name] == undefined){
                               problems[prob.contestId][prob.name] = 1;
                               solved += 1;
                               codeforces_ac[json[i].creationTimeSeconds] = 1;
                               all_ac[json[i].creationTimeSeconds] = 1;
                               if(Number(json[i].creationTimeSeconds) >= new_time)new_ac++;
                        }
                    }else{
                           problems[prob.contestId] = {};
                           problems[prob.contestId][prob.name] = 1;
                           solved += 1;
                           codeforces_ac[json[i].creationTimeSeconds] = 1;
                           all_ac[json[i].creationTimeSeconds] = 1;
                           if(Number(json[i].creationTimeSeconds) >= new_time)new_ac++;
                    }
                }
                console.log(codeforces_ac);
                console.log(solved);

                document.getElementById("codeforces_id").textContent = handle;
                document.getElementById("codeforces_solved").textContent = solved + "AC（" + new_ac + "AC）";
                cal_codeforces.update(codeforces_ac);
                all_solved += solved;
                all_new_ac += new_ac;
                cal_all.update(all_ac);
                document.getElementById("all_solved").textContent = all_solved + "AC（" + all_new_ac + "AC）";

            });

}
