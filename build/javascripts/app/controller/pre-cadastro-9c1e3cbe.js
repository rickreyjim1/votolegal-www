app.votolegal.controller("PreCadastroController",["$scope","$http","postmon","serialize",function(e,r,a,t){e.candidate={},e.submit_disabled=!1,e.register_params=function(){return e.candidate},e.create=function(){var a=e.register_params();return e.error_list=[],e.candidate.password&&e.candidate.password==e.candidate.confirm_password?e.accept_terms||e.transparent_campaign?(e.submit_disabled=!0,r({method:"POST",url:"/api/register",data:t.from_object(a),headers:{"Content-Type":"application/x-www-form-urlencoded"}}).then(function(){return 0==e.error_list.length&&(document.location="/pre-cadastro/success"),!1},function(r){var a=r.data.form_error,t=function(e){return document.querySelector("form[name=candidateForm] *[name="+e+"]")};for(var o in a){var s=t(o).attributes.placeholder.value;e.error_list.push(s+error_msg(a[o]))}throw e.candidate.password&&e.candidate.password!=e.candidate.confirm_password&&e.error_list.push("Os campos de senha devem ser iguais."),e.accept_terms||e.transparent_campaign||(e.accept_terms||e.error_list.push("Voc\xea deve aceitar os termos de uso."),e.transparent_campaign||e.error_list.push("Voc\xea deve aceitar fazer uma campanha transparente.")),e.submit_disabled=!1,new Error("ERROR_POST_NEW_CADIDATE")}),!1):(e.accept_terms||e.error_list.push("Voc\xea deve aceitar os termos de uso."),e.transparent_campaign||e.error_list.push("Voc\xea deve aceitar fazer uma campanha transparente."),!1):(e.error_list.push("Os campos de senha devem ser iguais."),!1)},e.address_by_zipcode=function(){var r=e.candidate.address_zipcode;return 9==r.length&&a(r).then(function(r){var a=r.data,t=e.candidate;t.address_city=a.cidade,t.address_state=a.estado_info.nome;var o=document.querySelector("form[name=candidateForm] *[name=address_street]");a.bairro&&a.logradouro?(t.address_street=a.logradouro+" - "+a.bairro,o.disabled=!0):(t.address_street="",o.disabled=!1)},function(){throw swal({title:"Problemas ao carregar os dados do CEP!",text:"Ocorreu um erro ao tentar carregar os dados de sua localidade. Verifique o CEP e tente novamente."}),new Error("ERROR_GET_ZIPCODE")}),!1},e.load_parties=function(){r.get("/api/party").then(function(r){e.party_list=r.data.party},function(){throw e.party_list=[],new Error("ERROR_GET_PARTY_LIST")})},e.load_offices=function(){r.get("/api/office").then(function(r){e.office_list=r.data.office},function(){throw e.office_list=[],new Error("ERROR_GET_OFFICE_LIST")})},e.reset=function(){e.candidate={}},e.load_offices(),e.load_parties()}]);