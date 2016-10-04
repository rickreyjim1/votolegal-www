/**
 * PreCadastro controller
 * Register a new candidate to be moderated by admin team
 */
 
app.votolegal.controller('PreCadastroController', ['$scope', '$http', 'postmon', 'serialize', function($scope, $http, postmon, serialize){
  $scope.candidate = {};
  $scope.submit_disabled = false;

  // getting form params
  $scope.register_params = function(){
    return $scope.candidate;
  };

  // create a new cadidate
  $scope.create = function(isValid){
    var params = $scope.register_params();
    $scope.error_list = [];
      
    if (!$scope.accept_terms && !$scope.transparent_campaign){
      if(!$scope.accept_terms) $scope.error_list.push("Você deve aceitar os termos de uso.");
      if(!$scope.transparent_campaign) $scope.error_list.push("Você deve aceitar fazer uma campanha transparente.");

      return false;
    }

    // password confirmation error
    if(!$scope.candidate.password || ($scope.candidate.password != $scope.candidate.confirm_password)){
      $scope.error_list.push("Os campos de senha devem ser iguais.");
      return false;
    }

    $scope.submit_disabled = true;
    $http({
      method: 'POST', 
      url: '/api/register', 
      data: serialize.from_object(params),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    })
    .then(
      // success callback
      function(response){
        if($scope.error_list.length == 0)
          document.location = '/pre-cadastro/success';

        return false;
      },
      // error callback
      function(response){
        var res = response.data.form_error;

        var f = function(field){
          return document.querySelector('form[name=candidateForm] *[name='+field+']');
        };

        // setting error message
        for(var field in res){
          if(field == 'cpf' && res[field] == 'already exists'){
            $scope.error_list.push("CPF já cadastrado! Para completar o seu cadastro, por favor faça o login.");
            return false;
          }
          
          var name = f(field).attributes['placeholder'].value;
          $scope.error_list.push(name + error_msg(res[field]));
        }

        // password confirmation error
        if($scope.candidate.password && ($scope.candidate.password != $scope.candidate.confirm_password)){
          $scope.error_list.push("Os campos de senha devem ser iguais.");
        }
        if (!$scope.accept_terms && !$scope.transparent_campaign){
          if(!$scope.accept_terms) $scope.error_list.push("Você deve aceitar os termos de uso.");
          if(!$scope.transparent_campaign) $scope.error_list.push("Você deve aceitar fazer uma campanha transparente.");
        }

        // enable submit
        $scope.submit_disabled = false;

        // throw an exception
        throw new Error("ERROR_POST_NEW_CADIDATE");
        return false;
      }
    );

    return false;
  };

  // load zipcode meta informations
  $scope.address_by_zipcode = function(event){
    var zipcode = $scope.candidate.address_zipcode;

    if(zipcode.length == 9){
      postmon(zipcode).then(
        // success callback
        function(response) {
          var res = response.data, $f = $scope.candidate;
          $f.address_city   = res.cidade;
          $f.address_state  = res.estado_info.nome;
          
          var street = document.querySelector('form[name=candidateForm] *[name=address_street]');
          if(res.bairro && res.logradouro) {
            $f.address_street = res.logradouro + " - " + res.bairro; 
            street.disabled = true
          }
          else {
            $f.address_street = ""; 
            street.disabled = false;
          }
        },
        // error callback
        function(response){
          swal({ title: "Problemas ao carregar os dados do CEP!", text: "Ocorreu um erro ao tentar carregar os dados de sua localidade. Verifique o CEP e tente novamente." });
          throw new Error("ERROR_GET_ZIPCODE");
        }
      );
    }

    return false;
  };

  // load party data
  $scope.load_parties = function(){
    $http.get('/api/party')
    .then(
      function(response){ $scope.party_list = response.data.party; },
      function(response){ $scope.party_list = []; throw new Error("ERROR_GET_PARTY_LIST"); }
    );
  };

  // load office data
  $scope.load_offices = function(){
    $http.get('/api/office')
    .then(
      function(response){ $scope.office_list = response.data.office; },
      function(response){ $scope.office_list = []; throw new Error("ERROR_GET_OFFICE_LIST"); }
    );
  };
  
  // reset form fields
  $scope.reset = function(){
    $scope.candidate = {};
  };


  // load parties from api
  $scope.load_offices();
  $scope.load_parties();
}]);
