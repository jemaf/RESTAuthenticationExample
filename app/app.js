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


app.factory("LoginService", function($http, $cookieStore) {
   var service = {};
   var baseUrl = "http://localhost:8000"
   
   service.login = function(login, password, callback) {
     var data = {login: login, password: password};
     $http.post(baseUrl + "/login", data)
        .then( 
            function(response) {
                callback(response);
            },
            function(response) {
                callback(response);
            }
     );  
   };
   
   service.setAuthorization = function(authorizationToken, login) {
       $cookieStore.put("authorization", authorizationToken); 
       $cookieStore.put("login", login); 
       $http.defaults.headers.common.Authorization = authorizationToken;
   };
   
   service.unsetAuthorization = function() {
       $cookieStore.remove("authorization");
       $cookieStore.remove("login");
       $http.defaults.headers.common.Authorization = "";
   };
   
   return service;
});

app.controller("LoginController", ['LoginService', '$location', '$scope', 
    function(loginService, $location, $scope) {
        var self = this;
        self.login = "";
        self.password = "";

        self.loginAction = function() {
           loginService.login(self.login, self.password, function(response) {

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


app.controller("MainController", [ 'LoginService', '$cookieStore', '$location', 
    function(loginService, $cookies, $location) {
        
        if($cookies.get("authorization") === undefined) 
            $location.path("/login")
        
        this.login = $cookies.get("login");
        this.authorization = $cookies.get("authorization");

        this.logout = function()  {
            loginService.unsetAuthorization();
            $location.path("/login");
        };
    }
]);