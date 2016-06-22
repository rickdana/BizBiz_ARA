// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('Occazstreet', ['ionic','ngMaterial','ngCordova','angularMoment','ionic-datepicker','ionic.service.core','google.places','ionic.ion.imageCacheFactory','uiGmapgoogle-maps','Occazstreet.controllers','Occazstreet.services','Occazstreet.constants'])
.run(function($ionicPlatform,Messages,$rootScope,$cordovaStatusbar, $state,UtilisateursService,Globals,$localStorage,$mdDialog,amMoment,ArticlesService) {


    amMoment.changeLocale('fr');
  $ionicPlatform.ready(function() {

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    /*Verifie si le device est offline*/
    document.addEventListener("offline", onOffline, false);
    document.addEventListener("online",onOnLine,false);

    $rootScope.isAndroid = ionic.Platform.isAndroid();

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        if (toState.requiresLogin && typeof $localStorage["logged"] == "undefined") {
            // no logged user, we should be going to #login
            event.preventDefault();

            $state.go('app.login');
        }
      function checkConnection() {
        var networkState = navigator.connection.type;
        alert("toto");

        var states = {};
        states[Connection.UNKNOWN]  = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI]     = 'WiFi connection';
        states[Connection.CELL_2G]  = 'Cell 2G connection';
        states[Connection.CELL_3G]  = 'Cell 3G connection';
        states[Connection.CELL_4G]  = 'Cell 4G connection';
        states[Connection.CELL]     = 'Cell generic connection';
        states[Connection.NONE]     = 'No network connection';

        alert('Connection type: ' + states[networkState]);
      }

      /*if(toState.requiresServerUp)
      {

        var networkState = navigator.connection.type;

        var states = {};
        states[Connection.UNKNOWN]  = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI]     = 'WiFi connection';
        states[Connection.CELL_2G]  = 'Cell 2G connection';
        states[Connection.CELL_3G]  = 'Cell 3G connection';
        states[Connection.CELL_4G]  = 'Cell 4G connection';
        states[Connection.CELL]     = 'Cell generic connection';
        states[Connection.NONE]     = 'No network connection';

         if(networkState ==0)
        {
          $state.go('app.articles');
          $mdToast.show({
            template: '<md-toast class="md-toast">' + Messages.internetErrorContent + '</md-toast>',
            hideDelay: 7000,
            position: 'bottom right left'
          });
        }
      }*/
       /*if(toState.requiresConnexion && serverDown)
       {
         event.preventDefault();
         $state.go('app.articles');
       }
        if (typeof $localStorage["logged"] != "undefined" && toState.name == 'app.login') {
            $state.go('app.articles');
        }*/
    });



    function onOnLine()
    {
      ArticlesService.getDevise().then(function (response) {
        if(response==null)
        {
          $rootScope.serverDown =true;
        }
      });
    }

    function onOffline() {
        $rootScope.offLine=true;
        $mdDialog.show(
            $mdDialog.alert()
                .parent(angular.element(document.body))
                .title(Messages.internetErrorTitle)
                .content(Messages.internetErrorContent)
                .ok('Ok')
        );
    }

  });
})

.config(function($stateProvider, $urlRouterProvider,$mdGestureProvider,uiGmapGoogleMapApiProvider) {
  uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyAkJjVm29bwZEMDQ30VLeqeXNz_4tmfYSY',
        v: '3.17',
        libraries: 'weather,geometry,visualization,places'
    });
  $mdGestureProvider.skipClickHijack();

  $stateProvider
  .state('app', {
    cache: false,
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl',
    requiresLogin:false
  })
  .state('app.aide', {
      url: "/aide",
      views: {
          'menuContent': {
              templateUrl: "templates/aide.html",
              controller:'AideController'
          }
      },
      requiresLogin:false
  })
  .state('app.conditionutilisation', {
      url: "/conditionutilisation",
      views: {
          'menuContent': {
              templateUrl: "templates/conditionutilisation.html",
              controller:'CguController'
          }
      },
      requiresLogin:false
  }).state('app.politiqueconfidentialite', {
      url: "/politiqueconfidentialite",
      views: {
          'menuContent': {
              templateUrl: "templates/politiqueconfidentialite.html",
              controller:'PolitiqueConfidentialiteController'
          }
      },
     requiresLogin:false
  }).state('app.conseilsecurite', {
    url: "/conseilsecurite",
    views: {
      'menuContent': {
        templateUrl: "templates/conseilsecurite.html",
        controller:'ConseilSecuriteController'
      }
    },
    requiresLogin:false
  })
  .state('app.login', {
    url: "/login",
    views: {
      'menuContent': {
        templateUrl: "templates/login.html",
        controller:'UtilisateurController'
      },
      Cache:false
    }
  }).state('app.logout', {
          url: "/logout",
          controller:'UtilisateurController'
  })
      .state('app.profile',{
          cache: false,
          url:"/profile/:utilisateur",
          views:{
              'menuContent':{
                  templateUrl:"templates/profile.html",
                  controller:'ProfileController'
              }
          },
          requiresLogin:false
      })
      .state('app.editProfile',{
          url:"/editprofile/:utilisateur",
          views:{
              'menuContent':{
                  templateUrl:"templates/editerProfil.html",
                  controller:'ProfileController'
              }
          },
          requiresLogin:true
      })
    .state('app.articles', {
      cache:true,
      url: "/articles",
      views: {
        'menuContent': {
          templateUrl: "templates/articles.html",
          controller: 'ArticlesController'
        }
      },
          requiresLogin:false
    }) .state('app.resultSearch', {
          cache:false,
          url: "/result",
          views: {
              'menuContent': {
                  templateUrl: "templates/articlesResultSearch.html",
                  controller: 'FiltreController'
              }
          },
          requiresLogin:false
      }).state('app.editArticle', {
          cache:false,
          url: "/article/edit/:article",
          views: {
              'menuContent': {
                  templateUrl: "templates/editerArticle.html",
                  controller: 'ArticlesController'
              }
          },
          requiresLogin:true
      }).state('app.changePassword', {
          cache:false,
          url: "/changePassword",
          views: {
            'menuContent': {
              templateUrl: "templates/changerMotDePasse.html",
              controller: 'ProfileController'
            }
          },
          requiresLogin:true
        }).state('app.forgotPassword', {
          cache:false,
          url: "/forgotPassword",
          views: {
            'menuContent': {
              templateUrl: "templates/forgotPassword.html"
             // controller: 'UtilisateurController'
            }
          },
        }).state('app.chat', {
          url: "/chat",
          views: {
              'menuContent': {
                  templateUrl: "templates/chat.html",
                  controller: 'ChatController'
              }
          },
          requiresLogin:true
      }).state('app.chatConversation', {
          url: "/chatConversation/:conversation/:article",
          views: {
              'menuContent': {
                  templateUrl: "templates/chat.html",
                  controller: 'ChatController'
              }
          },
          requiresLogin:true
      }).state('app.verificationidentite', {
          url: "/verificationIdentite",
          views: {
              'menuContent': {
                  templateUrl: "templates/verificationIdentite.html",
                  controller: 'ProfileController'
              }
          },
          requiresLogin:true
      }).state('app.validerEmail', {
          url: "/validerEmail",
          views: {
              'menuContent': {
                  templateUrl: "templates/validerEmail.html",
                  controller: 'ProfileController'
              }
          },
          requiresLogin: true
      }).state('app.verifCode', {
          url: "/verifCode",
          views: {
              'menuContent': {
                  templateUrl: "templates/verifCode.html",
                  controller: 'ProfileController'
              }
          },
          requiresLogin: true
      }).state('app.validerFacebook', {
          url: "/validerFacebook",
          views: {
              'menuContent': {
                  templateUrl: "templates/validerFacebook.html",
                  controller: 'ProfileController'
              }
          },
          requiresLogin: true
      }).state('app.validerGooglePlus', {
          url: "/validerGooglePlus",
          views: {
              'menuContent': {
                  templateUrl: "templates/validerGooglePlus.html",
                  controller: 'ProfileController'
              }
          },
          requiresLogin: true
      }).state('app.validerTelephone', {
          url: "/validerTelephone",
          views: {
              'menuContent': {
                  templateUrl: "templates/validerTelephone.html",
                  controller: 'ProfileController'
              }
          },
          requiresLogin: true
      }).state('app.addarticle', {
          cache:false,
          url: "/addarticle",
          views: {
              'menuContent': {
                  templateUrl: "templates/addArticle.html",
                  controller: 'ArticlesController'
              }
          },
          requiresLogin:true
      }).state('app.filtres', {
          url: "/filtres",
          views: {
              'menuContent': {
                  templateUrl: "templates/filtres.html",
                  controller: 'ArticlesController'
              }
          },
          requiresLogin:false

      }).state('app.categories', {
          url: "/categories",
          views: {
              'menuContent': {
                  templateUrl: "templates/categories.html",
                  controller: 'CategoriesController'
              }
          },
          requiresLogin:false
      }).state('app.favoris', {
      url: "/favoris",
      views: {
        'menuContent': {
          templateUrl: "templates/favoris.html",
          controller: 'FavorisController'
        }
      },
      requiresLogin:false
    }).state('app.exploreArticle', {
        url: "/exploreArticle",
        views: {
          'menuContent': {
            templateUrl: "templates/exploreArticle.html",
            controller: 'ArticlesController'
          }
        },
        requiresLogin:false
      }).state('app.collections', {
          url: "/collections",
          views: {
              'menuContent': {
                  templateUrl: "templates/collections.html",
                  controller: 'CollectionsController'
              }
          },
          requiresLogin:false
      }).state('app.messages', {
          url: "/messages",
          views: {
              'menuContent': {
                  templateUrl: "templates/messages.html",
                  controller: 'MessageController'
              }
          },
          requiresLogin:true
      })
      .state('app.articlebycat', {
          url: "/categories/:categorie/:libelle",
          views: {
              'menuContent': {
                  templateUrl: "templates/categorieDetails.html",
                  controller: 'CategorieDetailsController'
              }
          }
      })
      .state('app.articledetails',{
          url:"/article/:article",
          views:{
              'menuContent':{
                  templateUrl:"templates/articleDetails.html",
                  controller:'ArticleDetailsController'
              }
          }
    })
      .state('app.map',{
          url:"/article/article/:id",
          views:{
              'menuContent':{
                  templateUrl:"templates/map.html",
                  controller:'ArticleMapController'
              }
          }
      }).state('app.localisation',{
          url:"/filtre/localisation",
          views:{
              'menuContent':{
                  templateUrl:"templates/mapFiltre.html",
                  controller:'ArticleMapController'
              }
          }
      })
  .state('app.friends', {
      url: "/inviteFriends",
      views: {
          'menuContent': {
              templateUrl: "templates/inviteFriends.html",
              controller: 'InviteFriendsController'
          }
      },
      authenticate:false
  }) .state('app.activite', {
          url:"/activite/:utilisateur",
          views: {
              'menuContent': {
                  templateUrl: "templates/activite.html",
                  controller: 'ActiviteController'
              }
          },
          authenticate:false
      }).state('app.erreurchargement', {
          url:'/erreurchargement',
          views:{
              'menuContent':{
                  templateUrl:"templates/erreurChargement.html",
                  controller:'ArticleController'
              }
          }
      });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/articles');
});
