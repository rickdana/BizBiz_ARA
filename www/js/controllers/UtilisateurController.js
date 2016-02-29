/**
 * Created by fleundeu on 26/04/2015.
 */
angular.module('Occazstreet.controllers')
    .controller('UtilisateurController', function($scope,$stateParams,$ionicLoading,$location, $timeout,UtilisateursService,$rootScope,$mdDialog,$cordovaDatePicker,$http,$cordovaDevice,$ionicPopup,$ionicPlatform,$mdToast,$localStorage,$cordovaOauth,$ionicHistory,Globals,$state,Messages) {

        "use strict";
        $scope.$parent.showHeader();

        $scope.$parent.clearFabs();

        ionic.material.ink.displayEffect();

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
                if (!response.success) {
                    $ionicLoading.hide();
                    $mdToast.show({
                        template: '<md-toast class="md-toast error">' + Messages.authenticationFailed + '</md-toast>',
                        hideDelay: 20000,
                        position: 'bottom right left'
                    });
                } else {
                    //To remove back button on header
                    $scope.logged=$localStorage['logged'];
                    $scope.infoUserLogged=$localStorage[Globals.USER_LOGGED];
                    $ionicHistory.nextViewOptions({
                        disableAnimate:true,
                        disableBack: true
                    });
                   /* $state.transitionTo('app.articles', $stateParams, {
                        reload: true,
                        inherit: true
                       // notify: true
                    });*/
                //  $window.location.reload(true);
                    $state.go('app.articles',{inherit:true},{reload:true});
                    $ionicLoading.hide();

                }
            }, function(error) {
                $rootScope.logged=false;
            });

            /*$timeout(function() {
                $ionicLoading.hide();
                $mdToast.show({
                    template: '<md-toast class="md-toast error">' + Messages.authenticationFailed + '</md-toast>',
                    hideDelay: 10000,
                    position: 'bottom right left'
                });
                // $state.go('app.erreurchargement');
            }, 7000);*/
        };

        $scope.doInscription=function(utilisateur)
        {
            $ionicLoading.show({
                template: '<md-progress-circular class="md-raised md-warn" md-mode="indeterminate"></md-progress-circular>'
            });
           /* alert("doInscription");
            var onSuccess = function(position) {
                alert("onSuccess");
                alert($cordovaDevice.getPlatform() + " "+$cordovaDevice.getVersion());
                $http.get("https://maps.googleapis.com/maps/api/geocode/json?latlng="+position.coords.latitude+","+position.coords.longitude+"&key=AIzaSyAkU6bg0esJBmaMui6d2sp1NrzZUOjsSLY")
                .success(function(response){*/
            /**var succ=function(data)
            {**/
                var formData = {
                    email: utilisateur.email,
                    password: utilisateur.motdepasse,
                    nom:utilisateur.nom,
                    prenom:utilisateur.prenom,
                    dateDeNaissance:utilisateur.dateDeNaissance,
                    telephone:'00000000',/*data.lineNumber,*/
                    sexe:utilisateur.sexe,
                    /* nomville:response.results[0].address_components[2].short_name,
                     nompays:response.results4'[0].address_components[5].long_name,*/
                   /* device:  $cordovaDevice.getDevice().manufacturer+" "+$cordovaDevice.getModel(),
                    os: $cordovaDevice.getPlatform() + " "+$cordovaDevice.getVersion()*/
                    device:'toto',
                    os:'toto'
                };
                alert(JSON.stringify(formData));
                UtilisateursService.signup(formData).then(function(res) {
                    alert(res.success);
                    if (res.success) {
                        $ionicLoading.hide();
                        $scope.logged=$localStorage['logged'];
                        $scope.infoUserLogged=$localStorage[Globals.USER_LOGGED];
                        $ionicHistory.nextViewOptions({
                            disableAnimate:true,
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

                    } else {
                        $ionicLoading.hide();

                        $mdToast.show({
                            template: '<md-toast class="md-toast error">' + Messages.inscriptionFailed + res.message+'</md-toast>',
                            hideDelay: 20000,
                            position: 'bottom right left'
                        });
                    }
                }, function(err) {
                    $ionicLoading.hide();
                    $mdToast.show({
                        template: '<md-toast class="md-toast error">' + Messages.inscriptionFailed + '</md-toast>',
                        hideDelay: 20000,
                        position: 'bottom right left'
                    });
                });

            //};
            var err=function(err)
            {
                $ionicLoading.hide();
                $mdToast.show({
                    template: '<md-toast class="md-toast error">' + Messages.inscriptionFailed + '</md-toast>',
                    hideDelay: 20000,
                    position: 'bottom right left'
                });
                this.console.error("erreur lors dela recuperation du numéro de téléphone "+err);

            };

            //window.plugins.carrier.getCarrierInfo(succ, err);
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
              })

          }*/
            /*function onError(error) {
                alert('code: '    + error.code    + '\n' +
                    'message: ' + error.message + '\n');
            }
            var options = {maximumAge: 0, timeout: 100000,enableHighAccuracy:true};
            navigator.geolocation.getCurrentPosition(onSuccess, onError,options);*/

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
                                reload: true,
                                inherit: true,
                                notify: true
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
                    $timeout(function() {
                       hideLoading();
                        $mdToast.show({
                            template: '<md-toast class="md-toast error">' + Messages.erreurOAuthMessage+Messages.parFacebook + '</md-toast>',
                            hideDelay: 7000,
                            position: 'bottom right left'
                        });
                    }, 15000);

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
                alert(error);

                console.error("erreur lors dela recuperation du numéro de téléphone "+error);

            };
            window.plugins.carrier.getCarrierInfo(success, error);
        };

        $scope.loginWithGoogle=function()
        {
            var succ=function(data)
            {
                alert(data);
                var userData = {};
                userData.telephone=data.lineNumber;
                userData.device=$cordovaDevice.getDevice().manufacturer + " " + $cordovaDevice.getModel();
                userData.os=$cordovaDevice.getPlatform() + " " + $cordovaDevice.getVersion();
                userData.provider="Google";
                showLoading();

                $cordovaOauth.google(Globals.GOOGLECLIENTID, ["https://www.googleapis.com/auth/plus.me","email"]).then(function(result) {
                    UtilisateursService.storeAuthCode(result.access_token,userData).then(function(res){
                        hideLoading();
                        alert(res.success);
                        if(res.success)
                        {
                            $scope.logged=$localStorage['logged'];
                            $scope.infoUserLogged=$localStorage[Globals.USER_LOGGED];
                            $ionicHistory.nextViewOptions({
                                disableAnimate:true,
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
                        }
                        else
                        {
                            alert("error"+JSON.stringify(res));
                            hideLoading();
                            $mdToast.show({
                                template: '<md-toast class="md-toast error">' + Messages.erreurOAuthMessage+Messages.parGoogle + '</md-toast>',
                                hideDelay: 7000,
                                position: 'bottom right left'
                            });
                        }

                    });
                    $timeout(function() {
                        hideLoading();
                        $mdToast.show({
                            template: '<md-toast class="md-toast error">' + Messages.erreurOAuthMessage+Messages.parGoogle + '</md-toast>',
                            hideDelay: 7000,
                            position: 'bottom right left'
                        });
                    }, 15000);

                }, function(error) {
                    alert("error");
                    hideLoading();
                    console.log("une erreur a été rencontré lors de l'authentification google "+error);
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(this.angular.element(document.body))
                            .title(Messages.erreurOauthTitre+Messages.parGoogle)
                            .content(Messages.erreurOAuthMessage)
                            .ok('OK')
                    );
                });
            };
            var err=function(err)
            {
                alert(err);
                //Est ce que en cas d'impossibilité de recuperer le numéro de téléphone de l"utilisateur on crash une erreur ??? POINT A REVOIR
                //Pour l'instant on stop le process d'inscription mais est ce pertinent? POINT A REVOIR
                this.console.log("erreur recuperation carrier info =>"+err);
                hideLoading();
                $mdToast.show({
                    template: '<md-toast class="md-toast error">' + Messages.inscriptionFailed + '</md-toast>',
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
