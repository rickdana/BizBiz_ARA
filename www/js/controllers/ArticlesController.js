/**
 * Created by fleundeu on 26/04/2015.
 */
angular.module('Occazstreet.controllers')
    .controller('ArticlesController', function($scope,$window,$rootScope,$cordovaToast,$stateParams,$filter,$cordovaGeolocation,$ImageCacheFactory,$state,$http,$timeout,$mdToast,$ionicPopup,$ionicActionSheet,$cordovaDevice,$cordovaFileTransfer,$localStorage, $ionicLoading,$ionicPlatform,$mdDialog,ArticlesService,Globals,Messages) {


    var compteurImage=0;
    $scope.imgURI=[];
    $rootScope.image=[];
    $scope.a=0;
    $scope.$state=$state;
    var url=Globals.urlServer+Globals.port+'/';
    var cheminImage=Globals.cheminImage;
    $scope.url=url;
    $scope.cheminImage=cheminImage;
    $rootScope.nombreImage=0;
    var data=[];
    //$scope.$parent.showHeader();


    // Activate ink for controller
    //ionic.material.ink.displayEffect();

    ionic.material.motion.pushDown({
        selector: '.push-down'
    });
    ionic.material.motion.fadeSlideInRight({
        selector: '.animate-fade-slide-in .item'
    });


    //$scope.$parent.showHeader();

    if($state.current.name == 'app.articles' || $state.current.name=='app.exploreArticle')
    {



        $scope.$parent.showHeader();
        var lastId=Globals.PAGE;
        var skip=0;
        var nombreArticleMax=0;
          /*Pull to refresh*/
        $scope.doRefresh = function() {
            skip=0;

              ArticlesService.getArticlesByLimit(skip, Globals.PAGE).then(function (response) {
                if(response ==null)
                {
                  $scope.isDisabled = false;
                  $rootScope.serverDown=true;
                  $scope.articles=[];
                  $scope.buttonRaffraichirText="Raffraichir";
                  $mdDialog.show(
                    $mdDialog.alert()
                      .parent(angular.element(document.body))
                      .title(Messages.erreurServeurTitle)
                      .content(Messages.serverDown)
                      .ok('Ok')
                  );
                  $localStorage['articles']=[];
                  $scope.$broadcast('scroll.refreshComplete');
                }else
                {
                  $scope.articles=response.articles;
                  $localStorage['articles']=[];
                  $localStorage['articles']=$scope.articles;
                  nombreArticleMax=response.nombreArticleTotal;
                  // alert(JSON.stringify($scope.articles));
                  $scope.$broadcast('scroll.refreshComplete');
                }

              });

        };

      //The first time we load data from server and cache in localstorage
      var init = $localStorage['init'];
      if (typeof init == "undefined" || typeof $localStorage['articles']=="undefined") {
          $localStorage['init']={'setup':'done'};
          /*$ionicLoading.show({
            template: '<md-progress-circular class="md-raised md-warn" md-mode="indeterminate"></md-progress-circular>'
          });*/
          ArticlesService.getArticlesByLimit(skip, lastId).then(function (response) {
          lastId=response.articles[response.articles.length-1].idArticle;
          skip=response.articles.length;
          nombreArticleMax=response.nombreArticleTotal;
          $ionicLoading.hide();
          $scope.articles=response.articles;
          //Build the list of images to preload
          var images=[];
          for(var i=0;i<response.articles.length;i++)
          {
            for(var j=0;j<response.articles[i].images.length;j++)
            {
              images.push(url+cheminImage+response.articles[i].images[j].cheminImage);
            }
          }
          $ImageCacheFactory.Cache(images);
          $localStorage['articles']=response.articles;
            $localStorage['nombreArticleMax']=response.nombreArticleTotal;
          console.log("skip 2"+skip);
         /* $scope.articles=response.articles;
           $scope.nombreArticles=response.nombreArticles;*/
        });

      } else {
        console.log("skip1 "+skip);
        //The other time we load data from localstorage
        $ionicLoading.hide();
        $scope.articles = $localStorage['articles'];
        nombreArticleMax=$localStorage['nombreArticleMax'];
      }


      /*Infinite Scroll*/
      $scope.loadMoreArticles=function()
      {
        console.log("skip "+skip);
        if(skip==0)
        {
          skip=Globals.PAGE;
        }
        ArticlesService.getArticlesByLimit(skip,lastId+lastId).then(function (response) {
          console.log(skip + "   "+lastId+lastId);
          nombreArticleMax=response.nombreArticleTotal;
          skip=skip+response.articles.length;
          $scope.articles = $scope.articles.concat(response.articles);
          $localStorage['articles']=$scope.articles;
          $scope.$broadcast('scroll.infiniteScrollComplete');
        })
      };
      $scope.moreDataCanBeLoaded=function()
      {
        if(skip>=nombreArticleMax)
        {
          return false;
        }else
        {
          return true
        }
      };

      //filter and order
      $scope.order = function(predicate, reverse) {
        var orderBy = $filter('orderBy');
        $scope.articles= orderBy($localStorage['articles'] , predicate, reverse);
      };

        $timeout(function() {
            $ionicLoading.hide();
            // $state.go('app.erreurchargement');
        }, 5000);
        //$state.transitionTo($state.current, $state.$current.params, { reload: false, inherit: true, notify: true });
    }


    $scope.search=function(param)
    {
    };


    $scope.popover = function() {
        $scope.$parent.popover.show();
        $timeout(function () {
            $scope.$parent.popover.hide();
        }, 2000);
    };

    //Traitement ajout article
    if($state.current.name == 'app.addarticle') {

      /*if ($rootScope.serverDown) {
        $state.go("app.articles");
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.body))
            .title(Messages.internetErrorTitle)
            .content(Messages.internetErrorContent)
            .ok('Ok')
        );
      }else
      {*/
        $scope.devise='FCFA';
        /*ArticlesService.getDevise().then(function (response) {
          $scope.devises = response;
        });*/
        ArticlesService.getAllCategories().then(function () {
          $scope.categories = ArticlesService.getCategories();
        });
        /*var posOptions = {timeout: 10000, enableHighAccuracy: false};
         $cordovaGeolocation
         .getCurrentPosition(posOptions)
         .then(function (position) {
         var lat  = position.coords.latitude;
         var long = position.coords.longitude;
         alert(lat);
         alert(long);
         }, function(err) {
         // error
         alert("error "+JSON.stringify(err));
         });*/


        addArticle = function (article) {
          /*var posOptions = {timeout: 10000, enableHighAccuracy: false};
          $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {
              $http.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + position.coords.latitude + "," + position.coords.longitude + "&key=AIzaSyAkU6bg0esJBmaMui6d2sp1NrzZUOjsSLY", {timeout: 10000})
                .success(function (response) {*/

                for (var ac = 0; ac < article.localisation.address_components.length; ac++) {
                    var component = article.localisation.address_components[ac];

                    switch(component.types[0]) {
                      case 'locality':
                        article.nomVille = component.long_name;
                        break;
                      case 'administrative_area_level_1':
                        break;
                      case 'country':
                        article.nompays = component.long_name;
                        break;
                    }
                  }
                  /*article.latitude = position.coords.latitude;
                  article.longitude = position.coords.longitude;*/

                  ArticlesService.addArticle(article).then(function (response) {
                    if (response.success == true) {
                      var count = 0;
                      $scope.idArticle = response.article.idArticle;
                      var keepGoing = true;
                      if ($rootScope.image.length > 0) {
                        for (var i = 0; i < $rootScope.image.length; i++) {
                          if (keepGoing) {
                            var options = new FileUploadOptions();
                            var params = {};
                            params.idArticle = response.article.idArticle;
                            var url = $rootScope.image[i].substr($rootScope.image[i].lastIndexOf('/') + 1);
                            options = {
                              fileKey: "file",
                              fileName: i + (url.split('?')[0]),
                              mimeType: "image/png",
                              idArticle: response.article.idArticle
                            };
                            options.params = params;
                            var failed = function (err) {
                              ArticlesService.rollBackArticle(response.article.idArticle).then(function (success) {
                                if (success) {
                                  $ionicLoading.hide();
                                  $mdToast.show({
                                    template: '<md-toast class="md-toast ">' + Messages.erreurAjoutArticle + '</md-toast>',
                                    hideDelay: 10000,
                                    position: 'bottom right left'
                                  });
                                  keepGoing = false;
                                }
                              })
                            };
                            var success = function (result) {
                              count++;
                              if (count == $rootScope.image.length) {
                                $ionicLoading.hide();
                                $state.go('app.articles');
                                $mdToast.show({
                                  template: '<md-toast class="md-toast ">' + Messages.articleAjouteSucces + '</md-toast>',
                                  hideDelay: 10000,
                                  position: 'bottom right left'
                                });
                              }
                            };
                            var ft = new FileTransfer();
                            ft.upload($rootScope.image[i], Globals.urlServer + Globals.port + "/article/uploadImage", success, failed, options);
                          }
                        }
                      } else {
                        $ionicLoading.hide();
                        $state.go('app.articles');
                        $mdToast.show({
                          template: '<md-toast class="md-toast ">' + Messages.articleAjouteSucces + '</md-toast>',
                          hideDelay: 10000,
                          position: 'bottom right left'
                        });

                      }

                    }
                    else {
                      // $mdDialog.hide();
                      $ionicLoading.hide();
                      erreurAjoutArticle();

                    }
                  });


               /* });
            }, function (error) {

            })*/
        };
        $scope.addArticle = function (article) {
          article.utilisateur = $localStorage[Globals.USER_LOGGED].id;
          $ionicLoading.show({
            template: '<md-progress-circular  md-mode="indeterminate" style="margin-left: auto;margin-right: auto"></md-progress-circular> ' + Messages.ajoutDuProduitEnCours
          });
          /*if(article.devise == null || typeof article.devise=='undefined')
          {
            $ionicLoading.hide();
            $mdToast.show({
              template: '<md-toast class="md-toast ">' +'Veuillez choisir une devise' + '</md-toast>',
              hideDelay: 3000,
              position: 'bottom right left'
            });

          }else */if(article.localisation.address_components ==null || typeof  article.localisation.address_components =='undefined')
          {
            $ionicLoading.hide();
            $mdToast.show({
              template: '<md-toast class="md-toast ">' +'Veuillez renseigner une localisation correcte' + '</md-toast>',
              hideDelay: 3000,
              position: 'bottom right left'
            });
          }else if(article.categorie == null || typeof article.categorie=='undefined')
          {
            $ionicLoading.hide();
            $mdToast.show({
              template: '<md-toast class="md-toast ">' +'Veuillez sélectionner une catégorie' + '</md-toast>',
              hideDelay: 3000,
              position: 'bottom right left'
            });
          }else
          {
            for (var ac = 0; ac < article.localisation.address_components.length; ac++) {
              var component = article.localisation.address_components[ac];

              switch(component.types[0]) {
                case 'locality':
                  article.nomVille = component.long_name;
                  break;
                case 'administrative_area_level_1':
                  break;
                case 'country':
                  article.nompays = component.long_name;
                  break;
              }
            }
            article.latitude=article.localisation.geometry.location.lat();
            article.longitude=article.localisation.geometry.location.lng();
            article.dateAjout = new Date();
            delete article.localisation;
            ArticlesService.addArticle(article).then(function (response) {
              if (response.success == true) {
                var count = 0;
                $scope.idArticle = response.article.idArticle;
                var keepGoing = true;
                if ($rootScope.image.length > 0) {
                  for (var i = 0; i < $rootScope.image.length; i++) {
                    if (keepGoing) {
                      var options = new FileUploadOptions();
                      var params = {};
                      params.idArticle = response.article.idArticle;
                      var url = $rootScope.image[i].substr($rootScope.image[i].lastIndexOf('/') + 1);
                      options = {
                        fileKey: "file",
                        fileName: i + (url.split('?')[0]),
                        mimeType: "image/png",
                        idArticle: response.article.idArticle
                      };
                      options.params = params;
                      var failed = function (err) {
                        ArticlesService.rollBackArticle(response.article.idArticle).then(function (success) {
                          if (success) {
                            $ionicLoading.hide();
                            $mdToast.show({
                              template: '<md-toast class="md-toast ">' + Messages.erreurAjoutArticle + '</md-toast>',
                              hideDelay: 10000,
                              position: 'bottom right left'
                            });
                            keepGoing = false;
                          }
                        })
                      };
                      var success = function (result) {
                        count++;
                        if (count == $rootScope.image.length) {
                          $ionicLoading.hide();
                          $state.go('app.articles');
                          $mdToast.show({
                            template: '<md-toast class="md-toast ">' + Messages.articleAjouteSucces + '</md-toast>',
                            hideDelay: 10000,
                            position: 'bottom right left'
                          });
                        }
                      };
                      var ft = new FileTransfer();
                      ft.upload($rootScope.image[i], Globals.urlServer + Globals.port + "/article/uploadImage", success, failed, options);
                    }
                  }
                } else {
                  $ionicLoading.hide();
                  $state.go('app.articles');
                  $mdToast.show({
                    template: '<md-toast class="md-toast ">' + Messages.articleAjouteSucces + '</md-toast>',
                    hideDelay: 10000,
                    position: 'bottom right left'
                  });

                }

              }
              else {
                // $mdDialog.hide();
                $ionicLoading.hide();
                erreurAjoutArticle();

              }
            })

          }


          /*var i = 0;

          function checkLocationState() {
            cordova.plugins.diagnostic.isLocationEnabled(function (enabled) {
              if (enabled) {
                if (i == 0) {
                  i = 1;
                  addArticle(article);
                }
              } else {
                var confirm = $mdDialog.confirm()
                  .title('Localisation')
                  .textContent('Activer votre localisation afin d\'ameliorer votre expérience utilisateur')
                  .ok('Accepter')
                  .cancel('Refuser');
                $mdDialog.show(confirm).then(function () {
                  cordova.plugins.diagnostic.switchToLocationSettings();
                }, function () {
                  $ionicLoading.hide();
                  $mdDialog.show(
                    $mdDialog.alert()
                      .clickOutsideToClose(true)
                      .title('Localisation')
                      .textContent(':( Desolé vous ne pouvez pas ajouter d\'article. veuillez activer votre localisation et reessayez!')
                      .ok('Ok')
                  );
                });
              }
            }, function (error) {
              var confirm = $mdDialog.confirm()
                .title('Localisation')
                .textContent('Activer votre localisation afin d\'ameliorer votre expérience utilisateur')
                .ok('Accepter')
                .cancel('Refuser');
              $mdDialog.show(confirm).then(function () {
                cordova.plugins.diagnostic.switchToLocationSettings();
              }, function () {
                $ionicLoading.hide()
              });
            });
          }*/

         /* document.addEventListener('resume', checkLocationState, false);
          document.addEventListener('deviceready', checkLocationState, false);*/
        };

        $scope.addImage=function(key,event)
        {
          $mdDialog.show({
            controller: ImageController,
            templateUrl: 'uploadImageChoice.html',
            parent:angular.element(document.body),
            targetEvent:event
          })
            .then(function(answer) {

              if(answer=='photo')
              {
                var cameraOptions = {
                  quality: 100,
                  destinationType: Camera.DestinationType.NATIVE_URI,
                  sourceType : Camera.PictureSourceType.CAMERA,
                  encodingType: Camera.EncodingType.PNG,
                  targetWidth: 400,
                  targetHeight: 400,
                //  popoverOptions: CameraPopoverOptions,
                  saveToPhotoAlbum: false,
                  allowEdit:false
                };
                var success = function(data){
                  $mdDialog.hide();
                  if(key==null)
                  {
                    compteurImage =compteurImage+1;
                    $scope.$apply(function () {
                      $scope.imgURI.push(data);
                      $rootScope.nombreImage=compteurImage;

                    });
                  }
                  else
                  {

                    $scope.$apply(function () {
                      $scope.imgURI[key]=data;
                      $rootScope.nombreImage=compteurImage;

                    });
                  }
                  $rootScope.image=$scope.imgURI;

                };
                var failure = function(message){
                  console.log(message);
                };
                //call the cordova camera plugin to open the device's camera
                navigator.camera.getPicture( success , failure , cameraOptions );

              }else
              {
                var cameraOptions = {
                  quality: 100,
                  destinationType: Camera.DestinationType.NATIVE_URI,
                  sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
                  encodingType: Camera.EncodingType.PNG,
                  targetWidth: 400,
                  targetHeight: 400,
                  // popoverOptions: CameraPopoverOptions,
                  saveToPhotoAlbum: false
                };
                var success = function(data){
                  if(key==null)
                  {
                    compteurImage =compteurImage+1;
                    $scope.$apply(function () {
                      $scope.imgURI.push(data);
                      $rootScope.nombreImage=compteurImage;

                    });
                  }
                  else
                  {

                    $scope.$apply(function () {
                      $scope.imgURI[key]=data;
                      $rootScope.nombreImage=compteurImage;

                    });
                  }
                  $rootScope.image=$scope.imgURI;


                };
                var failure = function(message){
                  $mdDialog.hide();
                };
                //call the cordova camera plugin to open the device's camera
                navigator.camera.getPicture( success , failure , cameraOptions );

              }
            });
        };
        $scope.closeDialog = function () {
          $mdDialog.cancel();
        };
        //Modification ou suppression d'une image
        $scope.onHold = function (key) {
          $mdDialog.show({
            controller: ImageController,
            templateUrl: 'editImage.html',
            parent: angular.element(document.body),
            targetEvent: event
          }).then(function (answer) {
            if (answer == 'edit') {
              $scope.addImage(key, event);
            } else {
              $rootScope.image.splice(key, 1);
              $scope.imgURI.splice(key, 1);
              compteurImage--;
              $rootScope.nombreImage = compteurImage;
              $mdDialog.cancel();

            }
          })
        };
        function ImageController($scope, $mdDialog) {
          $ionicPlatform.on('backbutton', function () {
            $mdDialog.hide();
          });

          $scope.hide = function () {
            $mdDialog.hide();
          };
          $scope.closeDialog = function () {
            $mdDialog.cancel();
          };
          $scope.answer = function (answer) {
            $mdDialog.hide(answer);
          };

        }
    }

    $scope.editArticle=function(article,createurArticle) {
        if(createurArticle== $localStorage[Globals.USER_LOGGED].id)
        {
          $ionicActionSheet.show({
            buttons: [{
              text: '<i class="icon ion-edit color-button-sheet " style="color: darkred"></i><span class="no-text-transform color-button-sheet">Editer l\'annonce</span>'
            }, {
              text: '<i class="icon ion-trash-b color-button-sheet"></i><span class="no-text-transform color-button-sheet">Supprimer l\'annonce</span>'
            }],
            cancelText:'<i class="icon ion-close color-button-sheet"></i><span class="no-text-transform color-button-sheet">Annuler</span>',
            buttonClicked: function(index) {
              switch (index) {
                case 0: // Edition
                  $state.go('app.editArticle', {article:article});
                  break;
                case 1: // Supprression
                  $ionicLoading.show({
                    template: '<md-progress-circular class="md-raised md-warn" md-mode="indeterminate"></md-progress-circular>'
                  });
                  ArticlesService.delete(article).then(function(response){
                    if(response.success)
                    {

                      $ionicLoading.hide();
                      $mdToast.show({
                        template: '<md-toast class="md-toast ">' + Messages.articleSupprimeSuccess + '</md-toast>',
                        hideDelay: 5000,
                        position: 'bottom right left'
                      });
                    }else
                    {
                      $ionicLoading.hide();
                      mdToast.show({
                        template: '<md-toast class="md-toast ">' + Messages.articleSupprimerEchec + '</md-toast>',
                        hideDelay: 5000,
                        position: 'bottom right left'
                      });
                    }
                  });
                  break;
              }

              return true;
            }
          });
        }

    };

    if($state.current.name=='app.editArticle')
    {
        var article=$stateParams.article;
      console.log("article to edit"+article);
        ArticlesService.getArticleById(article).then(function (response) {
          console.log(JSON.stringify(response.article));
           // $scope.compteurImage=response.article.images.length;
            if(response.article.etat==='Vendu' || response.article.etat==true)
            {
                response.article.etat=true;
            }else if(response.article.etat==='Normal' || response.article.etat==false)
            {
                response.article.etat=false;
            }
            $scope.article=response.article;
            $scope.article.localisation=response.article.nomVille+', '+response.article.nompays;
            $scope.path=$scope.url+$scope.cheminImage;
            $scope.imgURI=response.article.images;

        });

        $scope.saveEditArticle=function(article)
        {
            $ionicLoading.show({
                template: '<md-progress-circular class="md-raised md-warn" md-mode="indeterminate"></md-progress-circular>'
            });
            var articleUpdate={};
            articleUpdate.idArticle=article.idArticle;
            articleUpdate.titre=article.titre;
            articleUpdate.details=article.details;
            articleUpdate.prix=article.prix;
            articleUpdate.complementadresse=article.complementadresse;
            //Lors de l'édition d'un article on met à jour la date d'ajout
            articleUpdate.dateModification=new Date();
            if(article.localisation.address_components)
            {
              for (var ac = 0; ac < article.localisation.address_components.length; ac++) {
                var component = article.localisation.address_components[ac];

                switch(component.types[0]) {
                  case 'locality':
                    articleUpdate.nomVille = component.long_name;
                    break;
                  case 'administrative_area_level_1':
                    break;
                  case 'country':
                    articleUpdate.nompays = component.long_name;
                    break;
                }
              }
              articleUpdate.latitude=article.localisation.geometry.location.lat();
              articleUpdate.longitude=article.localisation.geometry.location.lng();
            }else
            {
              articleUpdate.nomVille=article.localisation.split(',')[0];
              articleUpdate.npmpays=article.localisation.split(',')[1];
            }



            if(article.etat)
            {
                articleUpdate.etat='Vendu';
            }else
            {
                articleUpdate.etat='Normal';
            }
            ArticlesService.editArticle(articleUpdate).then(function(response){
                console.log("response "+ JSON.stringify(response));
                var articleFound=false;
                var etatArticle;
                if(response.article.etat=='Vendu')
                {
                  etatArticle=true;
                }else
                {
                  etatArticle=false;
                }
                if(response.success)
                {
                  //Si l'article est mise à jour on verifie qu'il est dans le localstorage si oui on le met à jour egalement dans le localstorage
                  for(var i=0; i<$localStorage['articles'].length;i++)
                  {
                    if($localStorage['articles'][i].idArticle==article.idArticle)
                    {
                      articleFound=true;
                      response.article.etat=etatArticle;
                      $localStorage['articles'][i]=response.article;
                      console.log(response.article);
                      $scope.article=$localStorage['articles'][i];
                      $scope.article.localisation=response.article.nomVille+', '+response.article.nompays;
                      $scope.path=$scope.url+$scope.cheminImage;
                      $scope.imgURI=$localStorage['articles'][i].images;
                      $ionicLoading.hide();

                      $mdDialog.show(
                        $mdDialog.alert()
                          .parent(angular.element(document.body))
                          .title(Messages.miseAjoutArticleTitre)
                          .content(Messages.articleMiseAjour)
                          .ok('Ok')
                      );
                    }
                  }
                  //Si l'article n'est pas present dans le localstorage on l'ajoute
                  if(!articleFound)
                  {
                    response.article.etat=etatArticle;
                    $localStorage['articles'].push(response.article);
                    $scope.article=response.article;
                    $scope.article.localisation=response.article.nomVille+', '+response.article.nompays;

                    $scope.path=$scope.url+$scope.cheminImage;
                    $scope.imgURIresponse=article.images;
                    $ionicLoading.hide();

                    $mdDialog.show(
                      $mdDialog.alert()
                        .parent(angular.element(document.body))
                        .title(Messages.miseAjoutArticleTitre)
                        .content(Messages.articleMiseAjour)
                        .ok('Ok')
                    );
                  }

                }

            })
        }

    }

    if($state.current.name=='app.exploreArticle')
    {

      $ionicLoading.show({
        template: '<md-progress-circular  md-mode="indeterminate"></md-progress-circular> '
      });

      $scope.images = [];
      $scope.loadImageArticle=function()
      {
        ArticlesService.getAllArticles().then(function(response){
          console.log(response.articles.length);
          for(var i in response.articles)
          {

            if(response.articles[i].images.length>0)
            {
              console.log(JSON.stringify(response.articles[i]));
              $scope.images.push({idArticle:response.articles[i].idArticle,srcImage:url+cheminImage+response.articles[i].images[0].cheminImage});
            }else
            {
              $scope.images.push({idArticle:response.articles[i].idArticle,srcImage:null});
            }
          }
          $scope.articlesExplore=response.articles;
        })
        $ionicLoading.hide();
      }

    }


    $scope.saveStat=function(article)
    {
      /*cordova.plugins.diagnostic.isLocationEnabled(function (enabled) {
        var posOptions  = {timeout: 10000, enableHighAccuracy: false};
        $cordovaGeolocation
          .getCurrentPosition(posOptions)
          .then(function (position) {
            $http.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + position.coords.latitude + "," + position.coords.longitude + "&key=AIzaSyAkU6bg0esJBmaMui6d2sp1NrzZUOjsSLY", {timeout: 10000})
              .success(function (response) {
                var succ = function (dataIP) {
                  var statArticle={};
                  statArticle.device = $cordovaDevice.getDevice().manufacturer + " " + $cordovaDevice.getModel();
                  statArticle.os = $cordovaDevice.getPlatform() + " " + $cordovaDevice.getVersion();
                  statArticle.uuid=$cordovaDevice.getUUID();
                  statArticle.adresseIp = "";
                  statArticle.dateVue = new Date();
                  statArticle.article = article;
                  statArticle.operateur=data['carrierName'];
                  statArticle.phoneNumber=data['lineNumber'];
                  statArticle.codePays=response.results[0].address_components[5].long_name + " - "+response.results[0].address_components[2].short_name;
                  ArticlesService.addStatArticle(statArticle).then(function(response){
                    console.log("StatArticle response"+response);
                  });
                  alert(JSON.stringify(data));

                };
                var err = function (err) {
                  alert(err);
                  console.log("erreur lors dela recuperation du fai");
                };
                window.plugins.carrier.getCarrierInfo(succ, err);

              })
          }).error(function(err){
            // alert("erreur get IP "+err);
            console.log(err);
          });
      }, function (error) {*/
      var statArticle={};

      var succ = function (data) {
            statArticle.device = $cordovaDevice.getDevice().manufacturer + " " + $cordovaDevice.getModel();
            statArticle.os = $cordovaDevice.getPlatform() + " " + $cordovaDevice.getVersion();
            statArticle.uuid=$cordovaDevice.getUUID();
            statArticle.adresseIp = "";
            statArticle.dateVue = new Date();
            statArticle.article = article;
            statArticle.operateur=data['carrierName'];
            statArticle.phoneNumber=data['phoneNumber'];
            statArticle.codePays=data['countryCode'];
            ArticlesService.addStatArticle(statArticle).then(function(response){
              console.log("StatArticle response"+response);
            })
          };
          var err = function (err) {
            console.log(err);
            statArticle.device = $cordovaDevice.getDevice().manufacturer + " " + $cordovaDevice.getModel();
            statArticle.os = $cordovaDevice.getPlatform() + " " + $cordovaDevice.getVersion();
            statArticle.uuid=$cordovaDevice.getUUID();
            statArticle.adresseIp = "";
            statArticle.dateVue = new Date();
            statArticle.article = article;
            statArticle.operateur=null;
            statArticle.phoneNumber=null;
            statArticle.codePays=null;
            ArticlesService.addStatArticle(statArticle).then(function(response){
              console.log("StatArticle response"+response);
            })
          };
          window.plugins.sim.getSimInfo(succ, err);
      //});
    };

    var internetError=function()
    {
        $mdDialog.show(
            $mdDialog.alert()
                .parent(angular.element(document.body))
                .title(Messages.internetErrorTitle)
                .content(Messages.internetErrorContent)
                .ok('OK')
        );
    };

    var erreurAjoutArticle=function()
    {
      $mdToast.show({
        template: '<md-toast class="md-toast ">' + Messages.erreurAjoutArticle + '</md-toast>',
        hideDelay: 10000,
        position: 'bottom right left'
      });

    };
    $scope.isDisabled = false;
    $scope.buttonRaffraichirText="Raffraichir";
    $scope.raffraichir=function()
    {
      $scope.isDisabled=true;
      $scope.buttonRaffraichirText="Patientez...";
      $scope.doRefresh();
    };

    $scope.ajouterAnnonce=function()
    {
      $state.go("app.addarticle");
    }
});
