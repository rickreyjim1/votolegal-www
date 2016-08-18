var domain=document.location.href;(domain.match(/^https:\/\/([a-z0-9_-]*).votolegal.org.br/)||domain.match(/votolegal.org.br\/candidato/))&&(app.votolegal.config(["$routeProvider",function(e){e.when("/",{templateUrl:"/javascripts/app/view/candidato/index.tmpl",controller:"CandidateController"}).when("/doar",{templateUrl:"/javascripts/app/view/candidato/doar.tmpl",controller:"CandidateController"}).when("/doar/success",{templateUrl:"/javascripts/app/view/candidato/success.tmpl",controller:"CandidateController"}).otherwise({redirectTo:"/"})}]),$(document).ready(function(){$("body").on("click","input.opcao_doar_radio",function(e){e.preventDefault,$(this).hasClass("opcao_doar_diff")?$(this).closest(".valor-doa-container").find(".doar-number-diferente").attr("disabled",!1):$(".doar-number-diferente").attr("disabled",!0),$(".valor-doa-container").removeClass("doa-container-active"),$(this).closest(".valor-doa-container").addClass("doa-container-active")}),$("input.opcao_doar_radio:checked").trigger("click")})),app.votolegal.controller("CandidateController",["$scope","$http","$sce","serialize","auth_service","SweetAlert","trouble","postmon",function(e,r,a,t,o,d,n,i){e.candidate={},e.doar={},e.payment={},e.error_list=[],e.name=function(){var e=document.location.href;return e=e.split(/\//)[2].split(".")[0],"localhost"!==e?e:void 0}(),e.month_list=function(){list=[];for(var e=1;12>=e;e++)list.push(e);return list}(),e.year_list=function(){list=[];for(var e=2016;2030>=e;e++)list.push(e);return list}(),e.make_percent=function(e,r){return 0===r?"0%":(e/100/r*100).toFixed(2)+"%"},e.render_video=function(e){return'<iframe id="candidate_video" src="'+a.trustAsResourceUrl(e)+'" width="560" height="315" allowfullscreen></iframe>'},e._issues_priorities_decorator=function(r){return e.candidate.candidate_issue_priorities.map(function(e){return e.name}).join(r||", ")},e.candidate_by_name=function(a){return r({method:"GET",url:"/api/candidate/"+a}).then(function(r){var a=r.data.candidate;e.candidate=a,function(){var r=document.querySelector("title");"VotoLegal - Candidato(a)"===r.innerText&&(r.innerText+=" "+e.candidate.popular_name)}(),function(){var r=e.candidate.video_url;r.match("youtube")&&(e.candidate.video_url="https://www.youtube.com/embed/"+URI.init(r).query("v"))}(),e.candidate.issues_decorator=e._issues_priorities_decorator(),e.candidate.total_donated=e.candidate.total_donated||0,e.candidate.raising_goal=parseFloat(e.candidate.raising_goal)||0,function(){var r=document.querySelector("#video-renderer");r&&(r.innerHTML=e.render_video(a.video_url))}(),e.candidate.projects=[],e.candidate_projects(a)},function(e){throw n.shoot({route:document.location.href,error:JSON.stringify(e)}),new Error("Model is invalid or cannot be found!")}),!1},e.billing_by_zipcode=function(){var r=e.doar.billing_address_zipcode;return 9==r.length&&i(r).then(function(r){var a=r.data,t=e.doar;t.billing_address_city=a.cidade,t.billing_address_state=a.estado;var o=document.querySelector("form[name=doarForm] *[name=billing_address_district]");a.bairro?(t.billing_address_district=a.bairro,o.disabled=!0):(t.billing_address_district="",o.disabled=!1);var d=document.querySelector("form[name=doarForm] *[name=billing_address_street]");a.logradouro?(t.billing_address_street=a.logradouro,d.disabled=!0):(t.billing_address_street="",d.disabled=!1)},function(){throw swal({title:"Problemas ao carregar os dados do CEP!",text:"Ocorreu um erro ao tentar carregar os dados de sua localidade. Verifique o CEP e tente novamente."}),["billing_address_state","billing_address_city","billing_address_district","billing_address_street"].map(function(r){try{e.doar[r]="",document.querySelector("form[name=doarForm] *[name="+r+"]").disabled=!0}catch(a){}}),new Error("ERROR_GET_ZIPCODE")}),!1},e.address_by_zipcode=function(){var r=e.doar.address_zipcode;return 9==r.length&&i(r).then(function(r){var a=r.data,t=e.doar;t.address_city=a.cidade,t.address_state=a.estado;var o=document.querySelector("form[name=doarForm] *[name=address_district]");a.bairro?(t.address_district=a.bairro,o.disabled=!0):(t.address_district="",o.disabled=!1);var d=document.querySelector("form[name=doarForm] *[name=address_street]");a.logradouro?(t.address_street=a.logradouro,d.disabled=!0):(t.address_street="",d.disabled=!1)},function(){throw swal({title:"Problemas ao carregar os dados do CEP!",text:"Ocorreu um erro ao tentar carregar os dados de sua localidade. Verifique o CEP e tente novamente."}),["address_state","address_city","address_district","address_street"].map(function(r){try{e.doar[r]="",document.querySelector("form[name=doarForm] *[name="+r+"]").disabled=!0}catch(a){}}),new Error("ERROR_GET_ZIPCODE")}),!1},e.candidate_projects=function(a){return r({method:"GET",url:"/api/candidate/"+a.id+"/projects"}).then(function(r){var a=r.data.projects;!function(){var e=0;a.map(function(r){e+=r.votes}),a=a.map(function(r){return r.total=e,r})}(),e.candidate.projects=a},function(e){throw n.shoot({route:document.location.href,error:JSON.stringify(e)}),new Error("Project list is invalid or cannot be found!")}),!1},e.doar_continue=function(r){if(!r||10>r)return d.swal("Preencha um valor superior a 10,00 reais."),!1;document.getElementById("amount-review").classList.remove("hide");var a=document.querySelectorAll(".valor-doa-container");for(var t in a)a[t]&&a[t].classList&&a[t].classList.add("hide");document.getElementById("doar-form").classList.remove("hide"),e.doar.amount=parseFloat(r),e.get_session()},e.doar_edit=function(){document.getElementById("amount-review").classList.add("hide");var e=document.querySelectorAll(".valor-doa-container");for(var r in e)e[r]&&e[r].classList&&e[r].classList.remove("hide");document.getElementById("doar-form").classList.add("hide")},e.get_session=function(){var a=e.candidate.id||0;return r({url:"/api/candidate/"+a+"/donate/session"}).then(function(r){e.payment.session=r.data.id,PagSeguroDirectPayment.setSessionId(r.data.id)},function(e){throw n.shoot({route:"/cadastro/boleto",error:JSON.stringify(e)}),new Error("ERROR_GET_SESSION")}),!1},e.get_brand=function(r){r.slice(0,6);return 6==r.length&&e.card_brand({bin:r.slice(0,6),success_cb:function(e){var r=e.brand,a=document.querySelector("#card-image");a&&(a.innerHTML='<img src="//stc.pagseguro.uol.com.br/public/img/payment-methods-flags/42x20/'+r.name+'.png" alt="'+r.name+'" title="'+r.name+'">')},error_cb:function(){var e=document.querySelector("#card-image");e&&(e.classList.add("text-danger"),e.innerText="(bandeira do cart\xe3o n\xe3o encontrada)")}}),!1},e.send_donation=function(){e.error_list=[];var a=PagSeguroDirectPayment.getSenderHash();e.doar.sender_hash=a,function(){var r=document.querySelector("#billing_address"),a="address_zipcode address_state address_city address_street address_district address_house_number address_complement".split(/\s/);if(r.classList.contains("hide"))for(var t in a)e.doar["billing_"+a[t]]=e.doar[a[t]]}();var o=function(e){return document.querySelector("form[name=doarForm] label[for="+e+"]")||void 0},i=e.donation_params(),s=e.card_params(),c={card_number:"N\xfamero do cart\xe3o",card_month:"M\xeas do cart\xe3o",card_year:"Ano do cart\xe3o",card_cvv:"C\xf3digo do cart\xe3o"};for(var l in s)s[l]||0!=s[l].length||e.error_list.push(c[l]+" \xe9 obrigat\xf3rio");return e.error_list.length>0?!1:void e.card_brand({bin:s.card_number.slice(0,6),success_cb:function(a){var c=a.brand?a.brand:void 0;c&&e.card_token({card_number:s.card_number,brand:c.name,cvv:s.card_cvv,month:s.card_month,year:s.card_year,success_cb:function(a){e.error_list=[],i.credit_card_token=a.card.token;var s=i.birthdate;if(s&&s.length>0){var c=s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);4===c.length&&(i.birthdate=[c[3],c[2],c[1]].join("-"))}else i.birthdate="";return i.amount=parseInt(100*i.amount),r({method:"POST",url:"/api/candidate/"+e.candidate.id+"/donate",data:t.from_object(i),headers:{"Content-Type":"application/x-www-form-urlencoded"}}).then(function(){document.location="#/doar/success"},function(r){if(e.error_list=[],r&&r.data&&r.data.form_error){var a=r.data.form_error;for(var t in a){var i=o(t);if(void 0!==i){var s=i.innerText;t.match(/billing/)&&(s+=" (endere\xe7o de cobran\xe7a) "),e.error_list.push(s+error_msg(a[t]))}}return n.shoot({route:document.location.href,error:JSON.stringify(r)}),!1}throw n.shoot({route:document.location.href,error:JSON.stringify(r)}),d.swal("Erro inesperado com a doa\xe7\xe3o"),new Error("DONATION_POST_ERROR")}),!1},error_cb:function(r){throw e.error_list.push("N\xe3o foi possivel carregar os dados do cart\xe3o!"),n.shoot({route:document.location.href,error:JSON.stringify(r)}),new Error("CARDBRAND_GET_ERROR")}})},error_cb:function(r){throw e.error_list.push("Bandeira do cart\xe3o n\xe3o pode ser id\xeantificada!"),n.shoot({route:document.location.href,error:JSON.stringify(r)}),new Error("CARDBRAND_GET_ERROR")}})},e.payment_method=function(e){PagSeguroDirectPayment.getPaymentMethods({amount:parseFloat(e.amount),success:e.success_cb,error:e.error_cb,complete:e.complete_cb})},e.card_brand=function(e){PagSeguroDirectPayment.getBrand({cardBin:e.bin,success:e.success_cb||function(){},error:e.error_cb||function(){},complete:e.complete_cb||function(){}})},e.card_token=function(e){PagSeguroDirectPayment.createCardToken({cardNumber:e.card_number,brand:e.brand,cvv:e.cvv,expirationMonth:e.month,expirationYear:e.year,success:e.success_cb||function(){},error:e.error_cb||function(){},complete:e.complete_cb||function(){}})},e.same_billing_addr=function(){var r=document.querySelector("#billing_address"),a="address_zipcode address_state address_city address_street address_district address_house_number address_complement".split(/\s/);if(r.classList.contains("hide")){for(var t in a)e.doar["billing_"+a[t]]="";r.classList.remove("hide")}else{for(var t in a)e.doar["billing_"+a[t]]=e.doar[a[t]];r.classList.add("hide")}return!1},e.donation_params=function(){return e.doar.credit_card_name=e.doar.name,Params.require(e.doar).permit("name","cpf","email","phone","birthdate","address_street","address_house_number","address_district","address_zipcode","address_city","address_state","billing_address_street","billing_address_house_number","billing_address_complement","billing_address_district","billing_address_zipcode","billing_address_city","billing_address_state","credit_card_name","amount","sender_hash","credit_card_token","address_complement","billing_address_complement")},e.card_params=function(){return Params.require(e.payment).permit("card_number","card_month","card_year","card_cvv")},e.candidate_by_name(e.name)}]);