/**
 * Created by fleundeu on 01/05/2015.
 */
angular.module('Occazstreet.controllers')
    .controller('ProfileController', function($scope,$rootScope,$stateParams,$state,$http,$timeout,UtilisateursService,Globals,$ionicLoading,$ionicPlatform,Messages, $mdToast,$mdDialog,ArticlesService,$localStorage,helper) {


        // Set Header
        //$scope.$parent.showHeader();
        // $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        var user={};
        var profil=false;
        photoURI=[];


    /* $scope.$parent.setExpanded(false);
     $scope.$parent.setHeaderFab(false);*/

        // Set Motion
        $timeout(function() {
            ionic.material.motion.slideUp({
                selector: '.slide-up'
            });
        }, 300);

        $timeout(function() {
            ionic.material.motion.fadeSlideInRight({
                startVelocity: 3000
            });
        }, 700);

        // Set Ink
        ionic.material.ink.displayEffect();

        //On recupere l'id du user passez dans l'URL
        var utilisateur=$stateParams.utilisateur;
        $localStorage['user']=utilisateur;
        $scope.url=Globals.urlServer+Globals.port+'/';
        $scope.cheminPhoto=Globals.cheminPhoto;
        if(typeof  $localStorage[Globals.USER_LOGGED]!=='undefined')
        {
            $scope.infoUserLogged=$localStorage[Globals.USER_LOGGED];
        }
        if($scope.infoUserLogged.id==utilisateur)
        {
            $scope.showEdit=true;
        }

        if($state.current.name=='app.profile')
        {
            $ionicLoading.show({
                template: '<md-progress-circular class="md-raised md-warn" md-mode="indeterminate"></md-progress-circular>'
            });
            UtilisateursService.getUtilisateurById(utilisateur).then(function(response){
                profil=true;
                $scope.utilisateur=response.utilisateur;
                if(typeof  $localStorage[Globals.USER_LOGGED]!=='undefined' && $scope.infoUserLogged.id==utilisateur)
                {
                    $localStorage[Globals.USER_LOGGED].nom=response.utilisateur.nom;
                    $localStorage[Globals.USER_LOGGED].prenom=response.utilisateur.prenom;
                    $localStorage[Globals.USER_LOGGED].dateDeNaissance=response.utilisateur.dateDeNaissance;
                    $localStorage[Globals.USER_LOGGED].photo=response.utilisateur.photo;
                    $localStorage[Globals.USER_LOGGED].email=response.utilisateur.email;
                    $localStorage[Globals.USER_LOGGED].emailVerifie=response.utilisateur.emailVerifie;
                    $localStorage[Globals.USER_LOGGED].telephoneVerifie=response.utilisateur.telephoneVerifie;
                }

                ArticlesService.getArticlesByUser(response.utilisateur.id).then(function(result){
                  console.log(result);
                    if(result.success)
                    {
                      $scope.articles=result.articles;
                      if(result.articles.length>0)
                      {
                        $scope.articleExist=true;
                      }else
                      {
                        $scope.articleExist=false;
                      }
                    }


                });
                ArticlesService.getArticleVenduByUser(response.utilisateur.id).then(function(res){
                    $ionicLoading.hide();
                   if(res.success)
                   {
                     if(res.articles.length>0)
                     {
                       $scope.articleVenduExist=true;
                     }else
                     {
                       $scope.articleVenduExist=false;
                     }
                     $scope.articlesvendu=res.articles;
                   }


                });

                ArticlesService.getArticlesFavorisByUser(response.utilisateur.id).then(function(res){
                    $ionicLoading.hide();
                    if(res.success)
                    {
                      if(res.articles.length>0)
                      {
                        $scope.articleFavorisExist=true;
                      }else
                      {
                        $scope.articleFavorisExist=false;
                      }
                      $scope.articlesFavoris=res.articles;
                    }

                })


            });
          $timeout(function() {
            $ionicLoading.hide();
            if(!profil)
            {
              $mdToast.show({
                template: '<md-toast class="md-toast italic">' + Messages.erreurServeur + '</md-toast>',
                hideDelay: 5000,
                position: 'bottom right left'
              });
            }

          }, 7000);

        }

        //Modification du mot de pass
        if($state.current.name=='app.changePassword')
        {
            $scope.editPassword=function(changePassword)
            {
                $ionicLoading.show({
                  template: '<md-progress-circular class="md-raised md-warn" md-mode="indeterminate"></md-progress-circular>'
                });

                changePassword.email=$scope.infoUserLogged.email;
                UtilisateursService.changePassword(changePassword).then(function(response) {
                  if(response.success)
                  {
                      $ionicLoading.hide();
                      $mdToast.show({
                        template: '<md-toast class="md-toast success">' + Messages.successChangePassword + '</md-toast>',
                        hideDelay: 7000,
                        position: 'bottom right left'
                      });
                  }
                  else if(response.passwordVerif==false)
                  {
                    $ionicLoading.hide();
                    $mdDialog.show(
                      $mdDialog.alert()
                        .parent(angular.element(document.querySelector('#popupContainer')))
                        .clickOutsideToClose(true)
                        .title('Changement du mot de passe')
                        .textContent(' :( Votre ancien mot de passe n\'est pas correct')
                        .ok('Recommencer')
                    );
                  }
                  else
                  {
                    $ionicLoading.hide();
                    $mdToast.show({
                      template: '<md-toast class="md-toast error">' + Messages.failedChangePassword + '</md-toast>',
                      hideDelay: 7000,
                      position: 'bottom right left'
                    })
                  }
                })

              }
        }


    //Modification du prolfil
        //On test si le $state correspond à celui de l'édition du profil
        if($state.current.name=='app.editProfile')
        {
            //Si oui on lieu de faire une nouvelle requete en base on recupère directement les informations depuis le localstorage
            user.id=$scope.infoUserLogged.id;
            user.nom=$scope.infoUserLogged.nom;
            user.prenom=$scope.infoUserLogged.prenom;
            user.datedenaissance=new Date($scope.infoUserLogged.dateDeNaissance);
            user.sexe=$scope.infoUserLogged.sexe;
            user.email=$scope.infoUserLogged.email;

            if(($scope.infoUserLogged.nomVille ==null || $scope.infoUserLogged.nomVille=="") || ($scope.infoUserLogged.nomPays==null || $scope.infoUserLogged.nomPays=="" ) )
            {
              user.localisation="";
            }
            else
            {
              user.localisation=$scope.infoUserLogged.nomVille +', '+ $scope.infoUserLogged.nomPays;
            }

          $scope.user=user;
            if($scope.infoUserLogged.provider=='normal')
            {
              $scope.showButtonChangePassword=true;
            }
            else
            {
              $scope.showButtonChangePassword=false;
            }


            $scope.editUser=function(user)
            {
              $ionicLoading.show({
                template: '<md-progress-circular class="md-raised md-warn" md-mode="indeterminate"></md-progress-circular>'
              });
              if(user.localisation.address_components !=null || typeof user.localisation.address_components !='undefined')
              {
                for (var ac = 0; ac < user.localisation.address_components.length; ac++) {
                  var component = user.localisation.address_components[ac];

                  switch(component.types[0]) {
                    case 'locality':
                      user.nomVille = component.long_name;
                      break;
                    case 'administrative_area_level_1':
                      break;
                    case 'country':
                      user.nomPays = component.long_name;
                      break;
                  }
                }
              }
              if(user.email ==null || user.email=="" || typeof user.email=="undefined")
              {
                console.log(JSON.stringify(user));
                $ionicLoading.hide();
                $mdToast.show({
                  template: '<md-toast class="md-toast">' + " Veuillez renseigner une adresse email valide" + '</md-toast>',
                  hideDelay: 5000,
                  position: 'bottom right left'
                });
              }else
              {
                delete user.localisation;

                UtilisateursService.editUtilisateur(user).then(function(response) {
                  user.localisation=response.utilisateur.nomVille +', '+ response.utilisateur.nomPays;
                  $localStorage[Globals.USER_LOGGED].nom=response.utilisateur.nom;
                  $localStorage[Globals.USER_LOGGED].prenom=response.utilisateur.prenom;
                  $localStorage[Globals.USER_LOGGED].dateDeNaissance=response.utilisateur.dateDeNaissance;
                  $localStorage[Globals.USER_LOGGED].sexe=response.utilisateur.sexe;
                  $localStorage[Globals.USER_LOGGED].photo=response.utilisateur.photo;
                  $localStorage[Globals.USER_LOGGED].email=response.utilisateur.email;
                  $localStorage[Globals.USER_LOGGED].emailVerifie=response.utilisateur.emailVerifie;
                  $localStorage[Globals.USER_LOGGED].telephoneVerifie=response.utilisateur.telephoneVerifie;
                  $localStorage[Globals.USER_LOGGED].nomVille=response.utilisateur.nomVille;
                  $localStorage[Globals.USER_LOGGED].nomPays=response.utilisateur.nomPays;


                  $scope.infoUserLogged.nom=response.utilisateur.nom;
                  $scope.infoUserLogged.prenom=response.utilisateur.prenom;
                  $scope.infoUserLogged.dateDeNaissance=response.utilisateur.dateDeNaissance;
                  $scope.infoUserLogged.sexe=response.utilisateur.sexe;
                  $scope.infoUserLogged.photo=response.utilisateur.photo;
                  $scope.infoUserLogged.id=response.utilisateur.id;
                  $scope.infoUserLogged.email=response.utilisateur.email;
                  $scope.infoUserLogged.nomVille=response.nomVille;
                  $scope.infoUserLogged.nomPays=response.nomPays;



                  $scope.$apply();
                  $ionicLoading.hide();
                  if(response.success)
                  {
                    $mdDialog.show(
                      $mdDialog.alert()
                        .parent(angular.element(document.body))
                        .title(Messages.miseAjoutProfilTitre)
                        .content(Messages.misAJourProfilSuccess)
                        .ok('Ok')
                    );
                  }else {
                    if (response.emailAlreadyExist) {
                      $mdToast.show({
                        template: '<md-toast class="md-toast">' + Messages.changementEmailError + '</md-toast>',
                        hideDelay: 7000,
                        position: 'bottom right left'
                      });
                    }
                  }
                })

              }
            };
            $scope.editPhoto=function(key,event)
            {
                $mdDialog.show({
                    controller: PhotoController,
                    templateUrl: 'editPhoto.html',
                    parent:angular.element(document.body),
                    targetEvent:event
                })
                    .then(function(answer) {

                        if(answer=='photo')
                        {
                            var cameraOptions = {
                                quality: 50,
                                destinationType: Camera.DestinationType.NATIVE_URI,
                                sourceType : Camera.PictureSourceType.CAMERA,
                                encodingType: Camera.EncodingType.PNG,
                                targetWidth: 80,
                                targetHeight: 80,
                                popoverOptions: CameraPopoverOptions,
                                saveToPhotoAlbum: false
                            };
                            var success = function(data){

                                $mdDialog.hide();
                                $scope.$apply(function () {
                                    photoURI=data;

                                });
                                $rootScope.photo=photoURI;

                            };
                            var failure = function(message){
                                alert('Failed because: ' + message);
                            };
                            //call the cordova camera plugin to open the device's camera
                            navigator.camera.getPicture( success , failure , cameraOptions );

                        }else
                        {
                            var cameraOptions = {
                                quality: 100,
                                destinationType: Camera.DestinationType.FILE_URI,
                                sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
                                encodingType: Camera.EncodingType.PNG,
                                targetWidth: 80,
                                targetHeight: 80,
                                // popoverOptions: CameraPopoverOptions,
                                saveToPhotoAlbum: false
                            };
                            var success = function(data){
                                $scope.$apply(function () {
                                    photoURI=data;

                                });
                                $rootScope.photo=photoURI;
                                alert($rootScope.photo.length);
                            };
                            var failure = function(message){
                                $mdDialog.hide();
                                alert('Failed because: ' + message);
                            };
                            //call the cordova camera plugin to open the device's camera
                            navigator.camera.getPicture( success , failure , cameraOptions );

                        }
                    });
            };

            function PhotoController($scope,$mdDialog) {
                $ionicPlatform.on('backbutton', function() {
                    $mdDialog.hide();
                });

                $scope.hide = function() {
                    $mdDialog.hide();
                };
                $scope.closeDialog = function() {
                    $mdDialog.cancel();
                };
                $scope.answer = function(answer) {

                    $mdDialog.hide(answer);
                };

            }

            $scope.showChangeEmailForm = function(ev) {
                $mdDialog.show({
                    controller: changeEmailController,
                    templateUrl: 'changerEmail.tmpl.html',
                    parent: angular.element(document.body),
                    targetEvent: ev
                })
                    .then(function(email) {
                        alert($scope.email);
                        var email=  document.getElementById(email);
                        alert(email);
                    }, function() {

                    });
            };


            function changeEmailController($scope, $mdDialog) {
                $scope.hide = function() {
                    $mdDialog.hide();
                };

                $scope.cancel = function() {
                    $mdDialog.cancel();
                };
                $scope.updateEmail=function()
                {
                    alert($scope.newEmail);
                    $mdDialog.cancel();
                };

                $scope.answer = function(answer) {
                    $mdDialog.hide(answer);
                };
            }

        }

        if($state.current.name=='app.verificationidentite'){

            $scope.telephone=$localStorage[Globals.USER_LOGGED].telephoneVerifie;
            $scope.email=$localStorage[Globals.USER_LOGGED].emailVerifie;
            $scope.facebook=false;
            $scope.gmail=false;
        }
        if($state.current.name=='app.validerTelephone'){

            $scope.checkIndice=function()
            {
                if(helper.isEmpty($scope.indice)){
                    showError(Messages.erreurChampVide)
                }else if(helper.isValidIndice($scope.indice))
                {
                    hideError();
                }
                else
                {
                    showError( Messages.erreurIndiceTelephone);
                }
            };
            $scope.checkTelephone=function()
            {
                if(helper.isEmpty($scope.telephone)){
                    showError(Messages.erreurChampVide)
                }else if(helper.isNum($scope.telephone))
                {
                    hideError();
                }
                else
                {
                    showError( Messages.erreurNumeroTelephone);
                }
            };

            $scope.validerTelephone=function()
            {
                if(helper.isValidIndice($scope.indice))
                {

                    if(helper.isNum($scope.telephone))
                    {
                        $ionicLoading.show({
                            template: '<md-progress-circular class="md-raised md-warn" md-mode="indeterminate"></md-progress-circular>'
                        })
                        var user={};
                        var telephone =$scope.indice+parseInt($scope.telephone);
                        $scope.phone=telephone;
                        user.telephone=telephone;
                        user.idutilisateur=$localStorage[Globals.USER_LOGGED].id;
                        UtilisateursService.validerTelephone(user).then(function(response){
                            if(response.codeVerificationEnvoye)
                            {
                                $ionicLoading.hide();
                                $state.go('app.verifCode');
                                /* $mdDialog.show({
                                 template: '' +
                                 '<md-dialog>' +
                                 '<md-content>' +
                                 '<div flex layout="column" layout-align="center center">' +
                                 '<div layout layout-sm="column" layout-align="center center" style="height: 50px" >' +
                                 '<p>'+Messages.messageValidationCode+'</p>' +
                                 '</div>'+
                                 '<div layout layout-sm="column" layout-align="center center" >' +
                                 '<form ng-submit="validerCode()">' +
                                 '<md-input-container><label>Code</label>' +
                                 '<input ng-model="code" required>' +
                                 '</md-input-container>' +
                                 '<input type="submit" class="md-button md-raised md-warn"  value="'+Messages.envoyer+'"/>' +
                                 '</form>' +
                                 '</div>' +
                                 '</div>' +
                                 '</md-content>' +
                                 '</md-dialog>',
                                 controller: 'ValidCodeController'
                                 }).then(function(answer) {
                                 }, function() {
                                 });*/

                            }else
                            {
                                $ionicLoading.hide();
                                showError(Messages.erreurValidationTelephone);
                            }
                        })

                    }else
                    {
                        showError(Messages.erreurNumeroTelephone);
                    }
                }
                else
                {
                    showError( Messages.erreurIndiceTelephone);

                }
            }
        }

        if($state.current.name=='app.validerEmail'){
          $scope.email=$localStorage[Globals.USER_LOGGED].email;
          $scope.validEmail=function()
            {
                if(helper.isEmpty($scope.email)) {
                    showError(Messages.erreurChampVide);
                }else if(helper.isEmail($scope.email))
                {
                    hideError();
                    var email=$scope.email;

                    user.id=$scope.infoUserLogged.id;
                    user.email=$scope.email;
                     UtilisateursService.editUtilisateur(user).then(function(response) {
                         if(response.emailHasChange)
                         {
                             showMessage(Messages.changementEmail);
                         }
                         else
                         {
                             $state.go('app.verificationidentite');
                             showMessage(Messages.changementEmailDejaVerifie);
                         }
                     })

                }
                else
                {
                    showError( Messages.erreurFormatEmail);
                }
            }
        }

        if($state.current.name=='app.validerGooglePlus'){
            $scope.validerGooglePlus=function()
            {

            }
        }

        if($state.current.name=='app.validerFacebook'){
            $scope.validerFacebook=function()
            {

            }
        }

        if($state.current.name=='app.verifCode')
        {
            $mdToast.show({
                template: '<md-toast class="md-toast error">' +$scope.phone + '</md-toast>',
                hideDelay: 4000,
                position: 'top'
            });
            $scope.validerCode=function()
            {
                var user={};
                user.idutilisateur=$localStorage[Globals.USER_LOGGED].id;
                user.code=$scope.code;
                UtilisateursService.validerCode(user).then(function(response) {
                    alert(response.codeCorrecte);
                    if (response.codeCorrecte==='true') {
                        //$mdDialog.cancel();
                        $mdDialog.show(
                            $mdDialog.alert()
                                .parent(angular.element(document.body))
                                .title(Messages.titreCodeVerification)
                                .content(Messages.messageCodeVerificationSuccess)
                                .ok('Ok')
                        );
                        $state.go('app.verificationidentite',{inherit:true},{reload:true});
                        /*$state.transitionTo('app.verificationidentite', $stateParams, {
                         reload: true,
                         inherit: false,
                         notify: true
                         });*/

                    }else
                    {
                        $mdDialog.cancel();
                        $mdDialog.show(
                            $mdDialog.alert()
                                .parent(angular.element(document.body))
                                .title(Messages.titreCodeVerification)
                                .content(Messages.messageCodeVerificationError)
                                .ok('Ok')
                        );
                    }
                })
            };

            $scope.cancel = function() {
                $mdDialog.cancel();
            };
        }

        showError=function(message)
        {
            $mdToast.show({
                template: '<md-toast class="md-toast">' +message + '</md-toast>',
                hideDelay: 4000,
                position: 'bottom right left'
            });
        };

        showMessage=function(message)
        {
            $mdToast.show({
                template: '<md-toast class="md-toast ">' + message + '</md-toast>',
                hideDelay: 5000,
                position: 'bottom right left'
            });
        };

        hideError=function()
        {
            $mdToast.hide();
        };

    }).controller('ValidCodeController', function($scope, $mdDialog,$localStorage,Globals,Messages,UtilisateursService,$state,$stateParams,$mdToast) {
        $mdToast.show({
            template: '<md-toast class="md-toast error">' +"test" + '</md-toast>',
            hideDelay: 4000,
            position: 'top'
        });
        $scope.validerCode=function()
        {
            var user={};
            user.idutilisateur=$localStorage[Globals.USER_LOGGED].id;
            user.code=$scope.code;
            UtilisateursService.validerCode(user).then(function(response) {
                alert(response.codeCorrecte);
                if (response.codeCorrecte==='true') {
                    //$mdDialog.cancel();
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.body))
                            .title(Messages.titreCodeVerification)
                            .content(Messages.messageCodeVerificationSuccess)
                            .ok('Ok')
                    );
                    $state.go('app.verificationidentite',{inherit:true},{reload:true});
                    /*$state.transitionTo('app.verificationidentite', $stateParams, {
                     reload: true,
                     inherit: false,
                     notify: true
                     });*/

                }else
                {
                    $mdDialog.cancel();
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.body))
                            .title(Messages.titreCodeVerification)
                            .content(Messages.messageCodeVerificationError)
                            .ok('Ok')
                    );
                }
            })
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };
    }).controller('ActiviteController',function($scope,$stateParams,UtilisateursService){
        var idutilisateur= $stateParams.utilisateur;
        UtilisateursService.getActiviteUser(idutilisateur).then(function(response) {
            if(response.success)
            {
                $scope.activite=response.activiteUser;
            }
        })
    }).controller('FavorisController',function($scope,$stateParams,ArticlesService,Globals,$localStorage){
      var url=Globals.urlServer+Globals.port+'/';
      var cheminImage=Globals.cheminImage;
      $scope.url=url;
      $scope.cheminImage=cheminImage;
      $scope.isDisabled = false;
      $scope.buttonRaffraichirText="Raffraichir";
      ArticlesService.getArticlesFavorisByUser($localStorage[Globals.USER_LOGGED].id).then(function(res){
        if(res.success)
        {
          if(res.articles.length>0)
          {
            $scope.articleFavorisExist=true;
          }else
          {
            $scope.articleFavorisExist=false;
          }
          $scope.articlesFavoris=res.articles;
        }
      })
  });
