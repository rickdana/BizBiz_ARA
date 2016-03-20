/**
 * Created by fleundeu on 26/04/2015.
 */
angular.module('Occazstreet.controllers')
    .controller('UtilisateurController', function($scope,$window,$stateParams,$ionicLoading,$location, $timeout,UtilisateursService,$rootScope,$mdDialog,$cordovaDatePicker,$http,$cordovaDevice,$ionicPopup,$ionicPlatform,$mdToast,$localStorage,$cordovaOauth,$ionicHistory,Globals,$state,Messages) {

        "use strict";
        $scope.$parent.showHeader();

        $scope.$parent.clearFabs();

        //Variable pour affichier ou pas le toast après le timeout lors de l'authentification
        var connected=false;

        ionic.material.ink.displayEffect();

        $scope.sexe=1;
        $scope.url=Globals.urlServer+Globals.port+'/';
        $scope.cheminPhoto=Globals.cheminPhoto;
        $scope.doLogin=function(credential)
        {
            $scope.$parent.showHeader();

            var credentials = {
                email: credential.email,
                password: credential.motdepasse
            };
            $ionicLoading.show({
                template: '<md-progress-circular class="md-raised md-warn" md-mode="indeterminate"></md-progress-circular>'
            });
            UtilisateursService.signin(credentials).then(function(response) {
              if(response==null)
              {
                $timeout(function() {
                  $ionicLoading.hide();
                  if(!connected)
                  {
                    $mdToast.show({
                      template: '<md-toast class="md-toast toast-style-text">' + Messages.erreurServeur + '</md-toast>',
                      hideDelay: 5000,
                      position: 'bottom right left'
                    });
                  }

                }, 7000);
              }else if (!response.success) {
                    $ionicLoading.hide();

                    $mdToast.show({
                        template: '<md-toast class="md-toast">' + Messages.authenticationFailed + '</md-toast>',
                        hideDelay: 5000,
                        position: 'bottom right left',
                        theme:'success-toast'

                    });
              } else if(response.success){
                    connected=true;
                    //To remove back button on header
                    $scope.logged=$localStorage['logged'];
                    $scope.infoUserLogged=$localStorage[Globals.USER_LOGGED];
                    $ionicHistory.nextViewOptions({
                        disableAnimate:true,
                        disableBack: true
                    });
                    $state.transitionTo('app.articles', $stateParams, {
                        location: true,
                        inherit: false,
                        notify: false
                    });
                   // $state.go('app.articles',{inherit:true},{reload:true});
                    //$window.location.reload(true);

                  $ionicLoading.hide();

                }
            }, function(error) {
                $rootScope.logged=false;
            });
        };

        $scope.doInscription=function(utilisateur)
        {
            $ionicLoading.show({
                template: '<md-progress-circular class="md-raised md-warn" md-mode="indeterminate"></md-progress-circular>'
            });
            var onSuccess = function(position) {
                $http.get("https://maps.googleapis.com/maps/api/geocode/json?latlng="+position.coords.latitude+","+position.coords.longitude+"&key=AIzaSyAkU6bg0esJBmaMui6d2sp1NrzZUOjsSLY",{timeout:10000} )
                .success(function(response) {
                    var succ = function (data) {
                      var formData = {
                        email: utilisateur.email,
                        password: utilisateur.motdepasse,
                        nom: utilisateur.nom,
                        prenom: utilisateur.prenom,
                        dateDeNaissance: utilisateur.dateDeNaissance,
                        telephone: data.lineNumber,
                        sexe: $scope.sexe,
                        nomville:response.results[0].address_components[2].short_name,
                        nompays:response.results[0].address_components[5].long_name,
                        device: $cordovaDevice.getDevice().manufacturer + " " + $cordovaDevice.getModel(),
                        os: $cordovaDevice.getPlatform() + " " + $cordovaDevice.getVersion()

                      };
                      UtilisateursService.signup(formData).then(function (res) {
                        if (res.success) {
                          $ionicLoading.hide();
                          $scope.logged = $localStorage['logged'];
                          $scope.infoUserLogged = $localStorage[Globals.USER_LOGGED];
                          $ionicHistory.nextViewOptions({
                            disableAnimate: true,
                            disableBack: true
                          });
                          $state.transitionTo('app.articles', $stateParams, {
                            reload: true,
                            inherit: true,
                            notify: true
                          });
                          $mdToast.show({
                            template: '<md-toast class="md-toast success">' + Messages.welcome + '</md-toast>',
                            hideDelay: 10000,
                            position: 'bottom right left'
                          });

                        } else if (!response.success) {
                          $ionicLoading.hide();

                          $mdToast.show({
                            template: '<md-toast class="md-toast ">' + Messages.inscriptionFailed + res.message + '</md-toast>',
                            hideDelay: 20000,
                            position: 'bottom right left'
                          });
                        } else if (response == null) {
                          $ionicLoading.hide();

                          $mdToast.show({
                            template: '<md-toast class="md-toast ">' + Messages.erreurServeur + res.message + '</md-toast>',
                            hideDelay: 20000,
                            position: 'bottom right left'
                          });
                        }
                      }, function (err) {
                        $ionicLoading.hide();
                        $mdToast.show({
                          template: '<md-toast class="md-toast">' + Messages.erreurServeur + '</md-toast>',
                          hideDelay: 20000,
                          position: 'bottom right left'
                        });
                      });

                    };
                    var err = function (err) {
                      $ionicLoading.hide();
                      $mdToast.show({
                        template: '<md-toast class="md-toast">' + Messages.inscriptionFailed + '</md-toast>',
                        hideDelay: 20000,
                        position: 'bottom right left'
                      });
                      this.console.error("erreur lors dela recuperation du numéro de téléphone " + err);

                    };

                    window.plugins.carrier.getCarrierInfo(succ, err);
                  });
           /* $timeout(function () {
                hideLoading();
                $mdToast.show({
                    template: '<md-toast class="md-toast error">' + Messages.operationAnormalementLongue + '</md-toast>',
                    hideDelay: 7000,
                    position: 'bottom right left'
                });
            }, 15000);*/

            /*  })
              .error(function(error){
                  alert(error);
              })*/

          };
          function onError(error) {
              console.log('code: '    + error.code    + '\n' +
                  'message: ' + error.message + '\n');
          }
          var options = {maximumAge: 0, timeout: 100000,enableHighAccuracy:true};
          navigator.geolocation.getCurrentPosition(onSuccess, onError,options);

        };

        function formatDate(date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [year, month, day].join('-');
        };


        $scope.loginWithFacebook=function()
        {

            var success=function(data)
            {
                var userData = {};
                userData.telephone=data.lineNumber;
                userData.device=$cordovaDevice.getDevice().manufacturer + " " + $cordovaDevice.getModel();
                userData.os=$cordovaDevice.getPlatform() + " " + $cordovaDevice.getVersion();
                userData.provider="Facebook";
                showLoading();

              $cordovaOauth.facebook(Globals.FACEBOOKCLIENTID, ["email", "public_profile", "user_website", "user_location", "user_relationships","user_birthday"]).then(function(result) {
                  UtilisateursService.storeAuthCode(result.access_token,userData).then(function(res){
                        hideLoading();
                        if(res.success)
                        {
                            $scope.logged=$localStorage['logged'];
                            $scope.infoUserLogged=$localStorage[Globals.USER_LOGGED];
                            $ionicHistory.nextViewOptions({
                                disableAnimate:true,
                                disableBack: true
                            });
                            $state.transitionTo('app.articles', $stateParams, {
                                location: true,
                                inherit: true,
                                notify: true,
                                reload:true
                            });
                            $mdToast.show({
                                template: '<md-toast class="md-toast success">' + Messages.welcome + '</md-toast>',
                                hideDelay: 10000,
                                position: 'bottom right left'
                            });
                        }else
                        {
                            $mdToast.show({
                                template: '<md-toast class="md-toast error">' + Messages.erreurOAuthMessage+Messages.parFacebook + '</md-toast>',
                                hideDelay: 7000,
                                position: 'bottom right left'
                            });
                        }
                    });
                    /*$timeout(function() {
                       hideLoading();
                        $mdToast.show({
                            template: '<md-toast class="md-toast error">' + Messages.erreurOAuthMessage+Messages.parFacebook + '</md-toast>',
                            hideDelay: 7000,
                            position: 'bottom right left'
                        });
                    }, 15000);*/

                }, function(error) {
                    hideLoading();
                    console.log("une erreur a été rencontré lors de l'authentification Facebook "+error);
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(this.angular.element(document.body))
                            .title(Messages.erreurOauthTitre+Messages.parFacebook)
                            .content(Messages.erreurOAuthMessage)
                            .ok('OK')
                    );
                });
            };
            var error=function(error)
            {
                console.error("erreur lors dela recuperation du numéro de téléphone "+error);
            };
            window.plugins.carrier.getCarrierInfo(success, error);
        };

        $scope.loginWithGoogle=function()
        {
            var succ=function(data)
            {
                var userData = {};
                userData.telephone=data.lineNumber;
                userData.device=$cordovaDevice.getDevice().manufacturer + " " + $cordovaDevice.getModel();
                userData.os=$cordovaDevice.getPlatform() + " " + $cordovaDevice.getVersion();
                userData.provider="Google";
                showLoading();

                window.plugins.googleplus.login(
                  {
                    //'scopes': 'plus.me userinfo.profile', // optional space-separated list of scopes, the default is sufficient for login and basic profile info
                    'offline': true // optional, used for Android only - if set to true the plugin will also return the OAuth access token ('oauthToken' param), that can be used to sign in to some third party services that don't accept a Cross-client identity token (ex. Firebase)
                    //'webApiKey': '626198170177-84dc2fc7e6i7j30hth755oui7448femj.apps.googleusercontent.com' // optional API key of your Web application from Credentials settings of your project - if you set it the returned idToken will allow sign in to services like Azure Mobile Services
                    // there is no API key for Android; you app is wired to the Google+ API by listing your package name in the google dev console and signing your apk (which you have done in chapter 4)
                  },
                  function (result) {
                    userData.nom=result.familyName;
                    userData.prenom=result.givenName;
                    userData.email=result.email;
                    userData.token=result.authToken;
                    userData.imgUrl=result.imageUrl;
                    if(result.gender==='male')
                    {
                      userData.sexe=1;
                    }else
                    {
                      userData.sexe=2;
                    }
                    UtilisateursService.storeAuthCode(result.oauthToken,userData).then(function(res){
                      hideLoading();
                      if(res.success)
                      {
                        $scope.logged=$localStorage['logged'];
                        $scope.infoUserLogged=$localStorage[Globals.USER_LOGGED];
                        $ionicHistory.nextViewOptions({
                          disableAnimate:true,
                          disableBack: true
                        });
                        $state.transitionTo('app.articles', $stateParams, {
                          //reload: true,
                          inherit: false,
                          notify: false,
                          location:true
                        });
                        $mdToast.show({
                          template: '<md-toast class="md-toast success">' + Messages.welcome + '</md-toast>',
                          hideDelay: 10000,
                          position: 'bottom right left'
                        });
                      }
                      else
                      {
                        console.log("error"+JSON.stringify(res));
                        hideLoading();
                        $mdToast.show({
                          template: '<md-toast class="md-toast error">' + Messages.erreurOAuthMessage+Messages.parGoogle + '</md-toast>',
                          hideDelay: 7000,
                          position: 'bottom right left'
                        });
                      }

                    });
                    /*$timeout(function() {
                      hideLoading();
                      $mdToast.show({
                        template: '<md-toast class="md-toast error">' + Messages.erreurOAuthMessage+Messages.parGoogle + '</md-toast>',
                        hideDelay: 7000,
                        position: 'bottom right left'
                      });
                    }, 15000);*/

                  },
                  function (error) {
                    console.log("error  "+error);
                    hideLoading();
                    console.log("une erreur a été rencontré lors de l'authentification google "+error);
                    $mdDialog.show(
                      $mdDialog.alert()
                        .parent(this.angular.element(document.body))
                        .title(Messages.erreurOauthTitre+Messages.parGoogle)
                        .content(Messages.erreurOAuthMessage)
                        .ok('OK')
                    );
                  }
                );

                /*$cordovaOauth.google(Globals.GOOGLECLIENTID, ["https://www.googleapis.com/auth/plus.me","email"]).then(function(result) {

                }, function(error) {

                });*/
            };
            var err=function(err)
            {
                //Est ce que en cas d'impossibilité de recuperer le numéro de téléphone de l"utilisateur on crash une erreur ??? POINT A REVOIR
                //Pour l'instant on stop le process d'inscription mais est ce pertinent? POINT A REVOIR
                this.console.log("erreur recuperation carrier info =>"+err);
                hideLoading();
                $mdToast.show({
                    template: '<md-toast class="md-toast">' + Messages.inscriptionFailed + '</md-toast>',
                    hideDelay: 20000,
                    position: 'bottom right left'
                });
                this.console.error("erreur lors dela recuperation du numéro de téléphone "+err);

            };
            window.plugins.carrier.getCarrierInfo(succ, err);

        };

        if($state.name==='app.logout')
        {

            UtilisateursService.doLogout().then(function(res){
                if(res)
                {
                    $state.transitionTo('app.articles', $stateParams, {
                        reload: true,
                        inherit: true,
                        notify: true
                    });

                  $mdToast.show({
                        template: '<md-toast class="md-toast success">' + Messages.deconnexion + '</md-toast>',
                        hideDelay: 50000,
                        position: 'bottom right left'
                    });
                }
            });

        }


        function PasswordController($scope, $mdDialog) {
            $scope.hide = function() {
                $mdDialog.hide();
            };
            $scope.cancel = function() {
                $mdDialog.cancel();
            };
            $scope.recuperermotdepasse = function() {
                $mdDialog.hide();
            };
        }

        $scope.recuperermotdepasse=function()
        {

        };

        $scope.close=function()
        {
            $mdDialog.hide();
        };

        var showLoading=function()
        {
            $ionicLoading.show({
                template: '<md-progress-circular class="md-raised md-warn" md-mode="indeterminate"></md-progress-circular>'
            });
        };
        var hideLoading=function()
        {
            $ionicLoading.hide();
        };
    });
