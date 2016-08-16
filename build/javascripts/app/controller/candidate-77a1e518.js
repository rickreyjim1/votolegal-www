document.location.href.indexOf("/candidato")>=0&&(app.votolegal.config(["$routeProvider",function(e){e.when("/",{templateUrl:"/javascripts/app/view/candidato/index.tmpl",controller:"CandidateController"}).when("/doar",{templateUrl:"/javascripts/app/view/candidato/doar.tmpl",controller:"CandidateController"}).otherwise({redirectTo:"/"})}]),$(document).ready(function(){$("body").on("click","input.opcao_doar_radio",function(e){e.preventDefault,$(".valor-doa-container").removeClass("doa-container-active"),$(this).closest(".valor-doa-container").addClass("doa-container-active")}),$("input.opcao_doar_radio:checked").trigger("click")})),app.votolegal.controller("CandidateController",["$scope","$http","$sce","serialize","auth_service","SweetAlert","trouble","postmon",function(e,t,a,r,o,n,d,i){e.candidate={},e.doar={},e.payment={},e.name=function(){var e=document.location.href;return e=e.split(/\//)[2].split(".")[0],"localhost"!==e?e:void 0}(),e.make_percent=function(e,t){return 0===t?"0%":(e/t*100).toFixed(2)+"%"},e.render_video=function(e){return'<iframe id="candidate_video" src="'+a.trustAsResourceUrl(e)+'" width="560" height="315" allowfullscreen></iframe>'},e._issues_priorities_decorator=function(t){return e.candidate.candidate_issue_priorities.map(function(e){return e.name}).join(t||", ")},e.candidate_by_name=function(a){return t({method:"GET",url:"/api/candidate/"+a}).then(function(t){var a=t.data.candidate;e.candidate=a,function(){var t=document.querySelector("title");"VotoLegal - Candidato(a)"===t.innerText&&(t.innerText+=" "+e.candidate.popular_name)}(),e.candidate.issues_decorator=e._issues_priorities_decorator(),e.candidate.total_donated=e.candidate.total_donated||0,e.candidate.raising_goal=parseFloat(e.candidate.raising_goal)||0,function(){var t=document.querySelector("#video-renderer");t&&(t.innerHTML=e.render_video(a.video_url))}(),e.candidate.projects=[],e.candidate_projects(a)},function(e){throw d.shoot({route:document.location.href,error:JSON.stringify(e)}),new Error("Model is invalid or cannot be found!")}),!1},e.address_by_zipcode=function(){var t=e.doar.address_zipcode;return 9==t.length&&i(t).then(function(t){var a=t.data,r=e.doar;r.address_city=a.cidade,r.address_state=a.estado_info.nome;var o=document.querySelector("form[name=doarForm] *[name=address_district]");a.bairro?(r.address_district=a.bairro,o.disabled=!0):(r.address_district="",o.disabled=!1);var n=document.querySelector("form[name=doarForm] *[name=address_street]");a.logradouro?(r.address_street=a.logradouro,n.disabled=!0):(r.address_street="",n.disabled=!1)},function(){throw swal({title:"Problemas ao carregar os dados do CEP!",text:"Ocorreu um erro ao tentar carregar os dados de sua localidade. Verifique o CEP e tente novamente."}),["address_state","address_city","address_district","address_street"].map(function(t){try{e.candidate[t]="",document.querySelector("form[name=doarForm] *[name="+t+"]").disabled=!0}catch(a){}}),new Error("ERROR_GET_ZIPCODE")}),!1},e.candidate_projects=function(a){return t({method:"GET",url:"/api/candidate/"+a.id+"/projects"}).then(function(t){var a=t.data.projects;!function(){var e=0;a.map(function(t){e+=t.votes}),a=a.map(function(t){return t.total=e,t})}(),e.candidate.projects=a},function(e){throw d.shoot({route:document.location.href,error:JSON.stringify(e)}),new Error("Project list is invalid or cannot be found!")}),!1},e.doar_continue=function(t){if(!t||10>t)return n.swal("Preencha um valor superior a 10,00 reais."),!1;document.getElementById("amount-review").classList.remove("hide");var a=document.querySelectorAll(".valor-doa-container");for(var r in a)a[r]&&a[r].classList&&a[r].classList.add("hide");document.getElementById("doar-form").classList.remove("hide"),e.doar.amount=parseFloat(t),e.get_session()},e.doar_edit=function(){document.getElementById("amount-review").classList.add("hide");var e=document.querySelectorAll(".valor-doa-container");for(var t in e)e[t]&&e[t].classList&&e[t].classList.remove("hide");document.getElementById("doar-form").classList.add("hide")},e.get_session=function(){var a=e.candidate.id||0;return t({url:"/api/candidate/"+a+"/donate/session"}).then(function(t){e.payment.session=t.data.id||0;try{PagSeguroDirectPayment.setSessionId(t.data.id)}catch(a){}},function(e){throw d.shoot({route:"/cadastro/boleto",error:JSON.stringify(e)}),new Error("ERROR_GET_SESSION")}),!1},e.candidate_by_name(e.name)}]);