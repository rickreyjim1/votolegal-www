if(document.location.href.indexOf("/cadastro-completo")>=0){app.votolegal.config(["$routeProvider",function(e){e.when("/dados-pessoais",{templateUrl:"/javascripts/app/view/cadastro/dados-pessoais.tmpl",controller:"CadastroController",activetab:"pessoal"}).when("/dados-campanha",{templateUrl:"/javascripts/app/view/cadastro/dados-campanha.tmpl",controller:"CadastroController",activetab:"campanha"}).when("/projetos",{templateUrl:"/javascripts/app/view/cadastro/projetos.tmpl",controller:"CadastroController",activetab:"projetos"}).otherwise({redirectTo:"/dados-pessoais",activetab:"pessoal"})}]);var pid=window.setInterval(function(){if("undefined"!=typeof Storage){var e=localStorage.progress,r=document.querySelector("div[role=progressbar]");r.innerHTML=e+"%",r.style.width=e+"%"}},1e3)}app.votolegal.controller("CadastroController",["$scope","$http","$location","$route","$interval","auth_service","serialize","SweetAlert","trouble",function(e,r,t,a,i,n,o,s,c){e.candidate={},e.issue_list=[],e.projects=[{id:0,title:"",scope:"",changed:!0}],e.error_list=[],e.submit_disabled=!1,e.progress=0,e.date_to_profile=function(){var e=0;return e=new Date("08/15/2016 00:00:00")-new Date,Math.round(e/864e5)+1}(),e.change_filename=function(e){var r=document.querySelector("input[name="+e+"]"),t=r.value.split(/\/|\\/g).reverse()[0];if(document.querySelector("."+e+"_filename").value=t,"picture"===e&&r.files.length>0){var a=r.files[0];if(Math.round(100*a.size/1048576)/100>1)throw s.swal("Sua imagem de perfil \xe9 muito grande","A imagem deve ter no m\xe1ximo 1MB de tamanho!"),new Error("IMAGE_MAXSIZE_ERROR")}},e.check_percent=function(){var r=0;if(e.candidate){var t=e.candidate;t.picture&&t.picture.length&&(r+=6),t.video_url&&t.video_url.length&&(r+=6),t.facebook_url&&t.facebook_url.length&&(r+=4),t.twitter_url&&t.twitter_url.length&&(r+=4),t.instagram_url&&t.instagram_url.length&&(r+=4),t.website_url&&t.website_url.length&&(r+=4),t.public_email&&t.public_email.length&&(r+=6),t.summary&&t.summary.length&&(r+=6),t.biography&&t.biography.length&&(r+=6),t.responsible_name&&t.responsible_name.length&&(r+=4),t.responsible_email&&t.responsible_email.length&&(r+=4),t.raising_goal&&t.raising_goal.length&&(r+=3),t.receipt_min&&t.receipt_min.length&&(r+=2),t.receipt_max&&t.receipt_max.length&&(r+=2),t.merchant_id&&t.merchant_id.length&&(r+=3),t.merchant_key&&t.merchant_key.length&&(r+=3),t.spending_spreadsheet&&t.spending_spreadsheet.length&&(r+=3)}if(e.issue_list){var a=e.issue_list;a&&a.length>0&&(r+=10)}e.projects&&e.projects&&e.projects.length>=4&&(r+=20),e.progress=r;var i=n.session();i.set("progress",r)},e.changed_project=function(r){e.projects[r].changed=!0},e.save_candidate=function(){e.error_list=[];var t=e.candidate_params(),a=n.current_user();t.api_key=a.api_key,e.submit_disabled=!0;try{r({method:"PUT",url:"/api/candidate/"+a.id+"?api_key="+a.api_key,data:t,headers:{"Content-Type":void 0},transformRequest:function(r){var t=new FormData;for(var a in r)t.append(a,r[a]);var i=document.querySelector("input[name=picture]");if(i.files.length>0){var n=i.files[0];if(t.append("picture",n,n.name),Math.round(100*n.size/1048576)/100>1)return s.swal("Sua imagem de perfil \xe9 muito grande","A imagem deve ter no m\xe1ximo 1MB de tamanho!"),e.submit_disabled=!1,new FormData}return t}}).then(function(){s.swal("Os dados da campanha foram salvos!"),e.submit_disabled=!1,e.check_percent()},function(r){var t=r;if(c.shoot({route:"/cadastro-completo#/dados-pessoais",error:JSON.stringify(t)}),!t.data)return s.swal("Erro ao salvar os dados!"),!1;t=r.data.form_error;var a=function(e){return document.querySelector("form[name=candidateForm] label[for="+e+"]")};for(var i in t){if("picture"==i&&"invalid image"===t[i])return e.error_list.push("Arquivo de imagem inv\xe1lido!"),!1;var n=a(i).innerText;e.error_list.push(n+error_msg(t[i]))}throw e.submit_disabled=!1,new Error("ERROR_SAVING_CANDIDATE")})}catch(i){e.submit_disabled=!1,console.error(i)}return!1},e.save_campaign=function(){e.error_list=[];var t=e.campaign_params(),a=n.current_user();return t.api_key=a.api_key,e.submit_disabled=!0,r({method:"PUT",url:"/api/candidate/"+a.id+"?api_key="+a.api_key,data:t,headers:{"Content-Type":void 0},transformRequest:function(e){var r=new FormData;for(var t in e)r.append(t,e[t]);var a=document.querySelector("input[name=spending_spreadsheet]");if(a.files.length>0){var i=a.files[0];r.append("spending_spreadsheet",i,i.name)}return r}}).then(function(){s.swal("Os dados da campanha foram salvos!"),e.submit_disabled=!1,e.check_percent()},function(r){var t=r.data.form_error;if(t.hasOwnProperty("spending_spreadsheet")&&"invalid file"==t.form_error.spending_spreadsheet)return s.swal("Formato do arquivo de Planilha de Gastos inv\xe1lido!"),!1;var a=function(e){return document.querySelector("form[name=campaignForm] label[for="+e+"]")};for(var i in t){var n=a(i).innerText;e.error_list.push(n+error_msg(t[i]))}throw e.submit_disabled=!1,new Error("ERROR_SAVING_CAMPAIGN")}),!1},e.save_project=function(t){var a=e.projects[t];if(""==a.title||""==a.scope)return s.swal("Os campos de Titulo e Descri\xe7\xe3o s\xe3o obrigat\xf3rios"),!1;var i={title:a.title,scope:a.scope};a.hasOwnProperty("id")&&a.id>0&&(i.id=a.id);var c=n.current_user();return i.api_key=c.api_key,r({method:a.id&&a.id>0?"PUT":"POST",url:"/api/candidate/"+c.id+"/projects"+(a.id&&a.id>0?"/"+a.id:"")+"?api_key="+c.api_key,data:o.from_object(i),headers:{"Content-Type":"application/x-www-form-urlencoded"}}).then(function(){s.swal("O projeto foi salvo!"),e.check_percent()},function(){throw s.swal("Error","O projeto n\xe3o pode ser salvo!"),new Error("ERROR_SAVING_PROJECT")}),!1},e.new_project=function(){return e.projects.push({id:0,title:"",scope:"",changed:!0}),!1},e.remove_project=function(t){var a=e.projects[t];return s.swal({title:"Tem certeza?",text:"Voc\xea tem certeza que deseja remover este projeto?",showCancelButton:!0,confirmButtonText:"Sim",cancelButtonText:"N\xe3o",closeOnConfirm:!0,closeOnCancel:!0},function(i){if(i)if(a.hasOwnProperty("id")&&a.id>0){var o=n.current_user();r["delete"]("/api/candidate/"+o.id+"/projects/"+a.id+"?api_key="+o.api_key).then(function(){e.projects.splice(t,1),swal("O projeto foi removido com sucesso!"),e.check_percent()},function(){throw new Error("ERROR_DELETE_PROJECTS")})}else e.projects.splice(t,1)}),!1},e.count_checked=function(r){var t=e.issue_list.filter(function(e){return e.selected?!0:void 0});return t.length>4&&(r&&(r.i.selected=!1),swal("Selecione apenas 4 assuntos priorit\xe1rios.")),!1},e.candidate_params=function(){return Params.require(e.candidate).permit("picture","video_url","facebook_url","twitter_url","instagram_url","website_url","public_email","summary","biography","responsible_name","responsible_email","cnpj")},e.campaign_params=function(){var r=e.issue_list.filter(function(e){return e.selected?!0:void 0}),t=[];for(var a in r)t.push(r[a].id);var i=parseFloat(e.candidate.raising_goal);-1!=i.toString().indexOf(".")&&(i+=".00");var n={raising_goal:i,issue_priorities:t.join(","),merchant_id:e.candidate.merchant_id,merchant_key:e.candidate.merchant_key,receipt_min:e.candidate.receipt_min,receipt_max:e.candidate.receipt_max};return Params.require(n).permit("raising_goal","issue_priorities","merchant_key","merchant_id","receipt_min","receipt_max")},e.projects_params=function(){for(var e=[],r=document.querySelectorAll(".project-item"),t=0;t<r.length;t++){var a=r[t],i=a.getAttribute("data-id").replace("item-",""),n=a.querySelector("input[name=project_title]").value,o=a.querySelector("textarea[name=project_content]").value;e.push({id:i,title:n,content:o})}return e},e.get_candidate=function(){var t={},a=n.current_user();return t.api_key=a.api_key,r.get("/api/candidate/"+a.id+"?api_key="+a.api_key).then(function(r){e.candidate=r.data.candidate,e.get_issues_priority()},function(){throw new Error("ERROR_GET_CANDIDATE")}),!1},e.get_projects=function(){var t=n.current_user();r.get("/api/candidate/"+t.id+"/projects",{api_key:t.api_key}).then(function(r){var t=r.data.projects.map(function(e){return e.changed=!1,e});t.length>0&&(e.projects=t),e.check_percent()},function(){throw new Error("ERROR_GET_PROJECTS")})},e.get_issues_priority=function(){r.get("/api/issue_priority").then(function(r){e.issue_list=r.data.issue_priority;for(var t in e.issue_list)e.candidate.hasOwnProperty("candidate_issue_priorities")&&e.candidate.candidate_issue_priorities.map(function(r){e.issue_list[t].id==r.id&&(e.issue_list[t].selected=!0)});e.check_percent()},function(){throw new Error("ERROR_GET_ISSUE_PRIORITY")})},n.validate_user({role:"user"}),e.get_candidate(),e.get_projects(),e.check_percent()}]);