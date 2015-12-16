var app = angular.module("app")

app.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise("");

  $stateProvider
    .state('index', {
      url: "",
      templateUrl: "../index.html",
      abstract:true    
    })
     .state('index.sprekn', {
      url: '',   
      templateUrl: 'sprekn.html'
    })
    .state('index.about', {
      url:"about",
      templateUrl: "about.html"
    });
});