var app = angular.module('exampleApp', ['ngRoute', 'ngCookies']);

app.config(function($routeProvider) {
   $routeProvider.when("/login", {
        templateUrl: "view/login.html",
        controller: "LoginController",
        controllerAs: "loginCtrl"
    }
   )
   .when("/main", {
        templateUrl: "view/main.html",
        controller: "MainController",
        controllerAs: "mainCtrl"
    }
   )
   .when("/", {
       redirectTo: "/login"
   }
   )
   .otherwise({
       template: "Página Inválida!!"
   }); 
});


/*
 * Serviço que processas as informações de login
 */
app.factory("LoginService", function($http, $cookieStore) {
   var service = {};
   var baseUrl = "http://localhost:8000";
   
   /*
    * Função que faz o login do usuário
    */
   service.login = function(login, password, callback) {
     var data = {login: login, password: password};
     
     // faz um post no serviço para realização do login
     $http.post(baseUrl + "/login", data).then( 
        function(response) {
            callback(response);
        },
        function(response) {
            callback(response);
        }
     );  
   };
   
   /*
    * Função que registra as credenciais do usuário autenticado
    */
   service.setAuthorization = function(authorizationToken, login) {

       // armazena as credenciais nos cookies e a chave de autenticação 
       // nos headers das próximas requisições
       $cookieStore.put("authorization", authorizationToken); 
       $cookieStore.put("login", login); 
       $http.defaults.headers.common.Authorization = authorizationToken;
   };
   
   /*
    * Função que limpa as credenciais do usuário autenticado
    */
   service.unsetAuthorization = function() {
       
       // limpa as credenciais do usuário
       $cookieStore.remove("authorization");
       $cookieStore.remove("login");
       $http.defaults.headers.common.Authorization = "";
   };
   
   return service;
});

/*
 * Controller responsável por fazer login do usuário
 */
app.controller("LoginController", ['LoginService', '$location', '$scope', 
    function(loginService, $location, $scope) {
        var self = this;
        self.login = "";
        self.password = "";

        /*
         * Função que faz login do usuário
         */
        self.loginAction = function() {
            // chama o processo de login
           loginService.login(self.login, self.password, function(response) {
               // se usuário foi autenticado corretamente, registra sua autenticação
               if (response.status === 200) {
                   loginService.setAuthorization(response.headers("Authorization"), self.login);
                   $location.path("/main");
               } else {
                   console.log("Erro na autenticação");
                   $scope.errorMessage = "Usuário ou senha inválidos";
               }
           });
        };
    }
]);

/*
 * Um Controller qualquer que requer autenticação do usuário
 */
app.controller("MainController", [ 'LoginService', '$cookieStore', '$location', 
    function(loginService, $cookies, $location) {
        
        // verifica se usuário está logado
        if($cookies.get("authorization") === undefined) 
            $location.path("/login")
        
        this.login = $cookies.get("login");
        this.authorization = $cookies.get("authorization");

        /*
         * Ação que faz o logout do usuário
         */
        this.logout = function()  {
            loginService.unsetAuthorization();
            $location.path("/login");
        };
    }
]);