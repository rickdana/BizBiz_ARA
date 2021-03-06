// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('Occazstreet', ['ionic','ngMaterial','ngCordova','angularMoment','ionic-datepicker','ionic.service.core','google.places','ionic.ion.imageCacheFactory','uiGmapgoogle-maps','Occazstreet.controllers','Occazstreet.services','Occazstreet.constants'])
.run(function($ionicPlatform,Messages,$rootScope,$cordovaStatusbar, $state,UtilisateursService,Globals,$localStorage,$mdDialog,amMoment,ArticlesService,$cordovaSQLite,ArticlesService) {


    amMoment.changeLocale('fr');
    var db;
  $ionicPlatform.ready(function() {

    /*if (window.cordova) {
      db=$cordovaSQLite.openDB({name:"occazstreet.db",location:'default'});
    }else{
      db = window.openDatabase("occazstreet.db", '1', 'occazstreet', 1024 * 1024 * 100); // browser
    }
    $cordovaSQLite.execute(db,'DROP TABLE IF  EXISTS categories');
    $cordovaSQLite.execute(db,'CREATE TABLE IF NOT EXISTS categories (idcategorie INTEGER primary key , libelle TEXT, statut TEXT)');

    var categories;
    ArticlesService.getAllCategoriesLoad().then(function () {
      categories=ArticlesService.getCategories();
      console.log(JSON.stringify(categories));

      angular.forEach(categories, function(value, index) {
        var query = "INSERT INTO categories (idcategorie,libelle,statut) VALUES (?,?,?)";
        $cordovaSQLite.execute(db, query, [value.idcategorie,value.libelle,value.statut]).then(function(res) {
          var message = "INSERT Line -> " + res.insertId;
          console.log(message);
        }, function (err) {
          console.error(err);
        });
      });*/


    /*  for(var i = 0; i < categories.length; i++){
        $cordovaSQLite.execute(db, 'INSERT INTO categories (idcategorie,libelle,statut) VALUES (?,?,?)', [categories[i].idcategorie,categories[i].libelle,categories[i].statut])
          .then(function(result) {
            console.log("Categories chargées")
          }, function(error) {
            console.log("erreur lors du chargement des catégories "+ JSON.stringify(error))
          })
      }*/




    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    ionic.Platform.isFullScreen = true;
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.backgroundColorByHexString("#CC1E1E");
      StatusBar.styleLightContent();
    }


    /*Verifie si le device est offline*/
    document.addEventListener("offline", onOffline, false);
    document.addEventListener("online",onOnLine,false);

    $rootScope.isAndroid = ionic.Platform.isAndroid();

    function checkConnection() {
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

    }
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        if (toState.requiresLogin && typeof $localStorage["logged"] == "undefined") {
            // no logged user, we should be going to #login
            event.preventDefault();

            $state.go('app.login');
        }
    });

    $rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
      $rootScope.previousState = from.name;
      $rootScope.currentState = to.name;
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

.config(function($stateProvider, $urlRouterProvider,$mdGestureProvider,uiGmapGoogleMapApiProvider,$compileProvider) {
  uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyAkJjVm29bwZEMDQ30VLeqeXNz_4tmfYSY',
        v: '3.17',
        libraries: 'weather,geometry,visualization,places'
    });
  $mdGestureProvider.skipClickHijack();
  $compileProvider.debugInfoEnabled(false);
  // $ionicConfigProvider.scrolling.jsScrolling(false);

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
  }).state('app.signaler', {
      url: "/signaler/:idarticle",
      views: {
        'menuContent': {
          templateUrl: "templates/signaler.html",
          controller:'SignalerController'
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
  }).state('app.contact', {
      url: "/contact",
      views: {
        'menuContent': {
          templateUrl: "templates/contact.html",
          controller:'ContactController'
        }
      },
      requiresLogin:false
    }).state('app.contactsujet', {
      url: "/contactsujet/:sujet",
      views: {
        'menuContent': {
          templateUrl: "templates/contactsujet.html",
          controller: 'ContactController'
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
    Cache:false,
    url: "/login",
    views: {
      'menuContent': {
        templateUrl: "templates/login.html",
        controller:'UtilisateurController'
      }
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
      requiresLogin:true
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
