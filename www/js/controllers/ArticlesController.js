/**
 * Created by fleundeu on 26/04/2015.
 */
angular.module('Occazstreet.controllers')
    .controller('ArticlesController', function($scope,$window,$rootScope,$cordovaToast,$stateParams,$filter,$cordovaGeolocation,$ImageCacheFactory, $state,$http,$timeout,$mdToast,$ionicPopup,$ionicActionSheet,$cordovaDevice,$cordovaFileTransfer,$localStorage, $ionicLoading,$ionicPlatform,$mdDialog,ArticlesService,Globals,Messages,$location) {


    var compteurImage=0;
    $scope.imgURI=[];
    $rootScope.image=[];
    $scope.nombreImage=0;
    $scope.$state=$state;
    var url=Globals.urlServer+Globals.port+'/';
    var cheminImage=Globals.cheminImage;
    $scope.url=url;
    $scope.cheminImage=cheminImage;
    var data=[];
    $scope.$parent.showHeader();


    // Activate ink for controller
    //ionic.material.ink.displayEffect();

    ionic.material.motion.pushDown({
        selector: '.push-down'
    });
    ionic.material.motion.fadeSlideInRight({
        selector: '.animate-fade-slide-in .item'
    });


    //$scope.$parent.showHeader();

    if($state.current.name == 'app.articles')
    {

        $scope.$parent.showHeader();
        var lastId=Globals.PAGE;
        var skip=0;
          /*Pull to refresh*/
        $scope.doRefresh = function() {
            skip=0;
          /*if(window.Connection) {
            if (navigator.connection.type == Connection.NONE || navigator.connexion.type==Connection.UNKNOWN) {
              $mdDialog.show(
                $mdDialog.alert()
                  .parent(angular.element(document.body))
                  .title(Messages.internetErrorTitle)
                  .content(Messages.internetErrorContent)
                  .ok('Ok')
              );
            }else
            {*/
              ArticlesService.getArticlesByLimit(skip, Globals.PAGE).then(function (response) {
                if(response ==null)
                {
                  $scope.isDisabled = false;
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
                  // alert(JSON.stringify($scope.articles));
                  $scope.$broadcast('scroll.refreshComplete');
                }

              });
           /* }
          }*/


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
          console.log("skip 2"+skip);
         /* $scope.articles=response.articles;
           $scope.nombreArticles=response.nombreArticles;*/
        });

      } else {
        console.log("skip1 "+skip);
        //The other time we load data from localstorage
        $ionicLoading.hide();
        $scope.articles = $localStorage['articles'];
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
          skip=skip+response.articles.length;
          $scope.articles = $scope.articles.concat(response.articles);
          $localStorage['articles']=$scope.articles;
          $scope.$broadcast('scroll.infiniteScrollComplete');
        })
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
        alert(JSON.stringify(param));
    };


    $scope.popover = function() {
        $scope.$parent.popover.show();
        $timeout(function () {
            $scope.$parent.popover.hide();
        }, 2000);
    };

    //Traitement ajout article
    if($state.current.name == 'app.addarticle')
    {
        ArticlesService.getDevise().then(function (response) {
            $scope.devises=response.devises;
        });
        ArticlesService.getAllCategories().then(function () {
            $scope.categories=ArticlesService.getCategories();
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

        $scope.addArticle=function(article)
        {
            /*$mdDialog.show(
                $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .content("<md-progress-circular class=\"md-warn md-hue-3\"  md-mode=\"indeterminate\"></md-progress-circular>"+Messages.ajoutDuProduitEnCours)
            );*/

            // article.img=$rootScope.image;
             article.utilisateur=$localStorage[Globals.USER_LOGGED].id;
             alert("Article "+JSON.stringify(article));
            $ionicLoading.show({
                template: '<md-progress-circular  md-mode="indeterminate"></md-progress-circular> '+Messages.ajoutDuProduitEnCours
            });

            $http.get(Globals.URL_JSON_IP).success(function(dataIP){
               //On recupère la position à partir de laquelle est ajouté l'article
                alert("dataIP "+JSON.stringify(dataIP));
                article.latitude=dataIP.latitude;
                article.longitude=dataIP.longitude;
                article.nomVille=dataIP.city;
                article.nompays=dataIP.country_name;
                ArticlesService.addArticle(article).then(function(response){
                    if(response.success==true)
                    {
                        var count=0;
                        alert("article ajouté==>"+JSON.stringify(response));
                        $scope.idArticle=response.article.idArticle;
                        alert("success true");
                        var keepGoing=true;
                        alert(JSON.stringify($rootScope.image));
                        for (var i = 0; i<$rootScope.image.length;  i++) {
                          if (keepGoing) {
                            var options = new FileUploadOptions();
                            var params = {};
                            params.idArticle = $scope.idArticle;
                            var url=$rootScope.image[i].substr($rootScope.image[i].lastIndexOf('/') + 1);
                            options = {
                              fileKey: "file",
                              fileName:i+(url.split('?')[0]),
                              mimeType: "image/png",
                              idArticle: $scope.idArticle
                            };
                            options.params=params;

                            var failed = function (err) {
                              alert(JSON.stringify(err));
                              alert("article "+$scope.idArticle);
                              ArticlesService.rollBackArticle($scope.idArticle).then(function (success) {
                                if (success) {
                                  $ionicLoading.hide();
                                  $mdToast.show({
                                    template: '<md-toast class="md-toast error">' + Messages.erreurAjoutArticle + '</md-toast>',
                                    hideDelay: 10000,
                                    position: 'bottom right left'
                                  });
                                  keepGoing = false;
                                }

                              })
                            };
                            var success = function (result) {
                              count++;
                              alert("SUCCESS 1: " + JSON.stringify(result));
                              if(count==$rootScope.image.length)
                              {
                                $ionicLoading.hide();
                                $state.go('app.articles');
                                $mdToast.show({
                                  template: '<md-toast class="md-toast success">' + Messages.articleAjouteSucces + '</md-toast>',
                                  hideDelay: 10000,
                                  position: 'bottom right left'
                                });
                              }
                              /*if (result.response.success != true) {
                                //En cas de success==false on fait un rollback pour supprimer l'article qui as été ajouté ainsi que les eventuelle images inserés
                                ArticlesService.rollBackArticle($scope.idArticle).then(function (success) {
                                  if (success) {
                                    keepGoing = false;
                                    $ionicLoading.hide();
                                  }
                                })
                              }
                              else {*/

                             // }
                            };
                            var ft = new FileTransfer();
                            ft.upload($rootScope.image[i], Globals.urlServer + Globals.port + "/article/uploadImage", success, failed, options);

                          }

                        }
                    }
                    else
                    {
                       // $mdDialog.hide();
                        $ionicLoading.hide();
                        erreurAjoutArticle();

                    }

                }).catch(function(response) {
                    //$mdDialog.hide();
                    ArticlesService.rollBackArticle($scope.idArticle).then(function(success){
                        if(success)
                        {
                            console.log("ERROR: " + JSON.stringify(err));
                        }

                    });
                    $ionicLoading.hide();
                    alert("dans catch");
                   erreurAjoutArticle();

                    console.error('L\'ajout d\'article a echoué', response.status, response.data);

                })

            }).error(function(err){
                var fail=function()
                {
                    ArticlesService.rollBackArticle($scope.idArticle).then(function(success){
                        if(success)
                        {
                            console.log("ERROR: " + JSON.stringify(err));
                            keepGoing=false;
                        }

                    })
                };
                var success=function()
                {
                    console.info("SUCCESS: " + JSON.stringify(result.response));
                    if(success!=true)
                    {
                        //En cas de success==false on fait un rollback pour supprimer l'article qui as été ajouté ainsi que les eventuelle images inserés
                        ArticlesService.rollBackArticle($scope.idArticle).then(function(success){
                            if(success)
                            {
                                keepGoing=false;
                            }

                        })
                    }
                };

                //$mdDialog.hide();
                $ionicLoading.hide();
               internetError()

            })
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
                            quality: 50,
                            destinationType: Camera.DestinationType.NATIVE_URI,
                            sourceType : Camera.PictureSourceType.CAMERA,
                            encodingType: Camera.EncodingType.PNG,
                            targetWidth: 80,
                            targetHeight: 80,
                            popoverOptions: CameraPopoverOptions,
                            saveToPhotoAlbum: false,
                            allowEdit:true
                        };
                        var success = function(data){
                            alert(JSON.stringify(data));
                            $mdDialog.hide();
                            if(key==null)
                            {
                                compteurImage =compteurImage+1;
                                $scope.$apply(function () {
                                    $scope.imgURI.push(data);

                                });
                                $scope.nombreImage=compteurImage;
                            }
                            else
                            {
                                $scope.$apply(function () {
                                    $scope.imgURI[key]=data;

                                });
                            }
                            $rootScope.image=$scope.imgURI;

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
                            destinationType: Camera.DestinationType.NATIVE_URI,
                            sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
                            encodingType: Camera.EncodingType.PNG,
                            targetWidth: 80,
                            targetHeight: 80,
                            // popoverOptions: CameraPopoverOptions,
                            saveToPhotoAlbum: false
                        };
                        var success = function(data){
                            if(key==null)
                            {
                                compteurImage =compteurImage+1;
                                $scope.$apply(function () {
                                    $scope.imgURI.push(data);

                                });
                                $scope.nombreImage=compteurImage;
                            }
                            else
                            {

                                $scope.$apply(function () {
                                    $scope.imgURI[key]=data;

                                });
                            }
                            $rootScope.image=$scope.imgURI;


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


        $scope.closeDialog = function() {
            $mdDialog.cancel();
        };
        //Modification ou suppression d'une image
        $scope.onHold=function(key)
        {
            $mdDialog.show({
                controller: ImageController,
                templateUrl: 'editImage.html',
                parent:angular.element(document.body),
                targetEvent:event
            }).then(function(answer) {
                if(answer=='edit')
                {
                    $scope.addImage(key,event);
                }else
                {
                    $rootScope.image;splice(key,1);
                    $scope.imgURI.splice(key, 1);
                    compteurImage--;
                    $scope.nombreImage=compteurImage;
                    $mdDialog.cancel();

                }
            })
        };
        function ImageController($scope,$mdDialog) {
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


    }

    $scope.editArticle=function(article) {
        $ionicActionSheet.show({
            buttons: [{
                text: '<i class="icon ion-edit color-button-sheet " style="color: darkred"></i><span class="no-text-transform color-button-sheet">Editer le produit</span>'
            }, {
                text: '<i class="icon ion-trash-b color-button-sheet"></i><span class="no-text-transform color-button-sheet">Supprimer le produit</span>'
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
                                $state.reload();
                                $ionicLoading.hide();
                                $mdToast.show({
                                    template: '<md-toast class="md-toast success">' + Messages.articleSupprimeSuccess + '</md-toast>',
                                    hideDelay: 5000,
                                    position: 'bottom right left'
                                });
                            }else
                            {
                                $ionicLoading.hide();
                                mdToast.show({
                                    template: '<md-toast class="md-toast error">' + Messages.articleSupprimerEchec + '</md-toast>',
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
            //Lors de l'édition d'un article on met à jour la date d'ajout
            articleUpdate.dateAjout=new Date();
            console.log(article.etat);
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

        $http.get(Globals.URL_JSON_IP).success(function(dataIP){
            var succ = function (dataIP) {
                var statArticle={};
                statArticle.device = $cordovaDevice.getDevice().manufacturer + " " + $cordovaDevice.getModel();
                statArticle.os = $cordovaDevice.getPlatform() + " " + $cordovaDevice.getVersion();
                statArticle.uuid=$cordovaDevice.getUUID();
                statArticle.adresseIp = dataIP.query;
                statArticle.dateVue = new Date();
                statArticle.article = article;
                statArticle.operateur=data['carrierName'];
                statArticle.phoneNumber=data['lineNumber'];
                statArticle.codePays=dataIP['country'];
                ArticlesService.addStatArticle(statArticle).then(function(response){
                    console.log("StatArticle response"+response);
                })

            };
            var err = function () {
                console.log("erreur lors dela recuperation du fai");
            };
            window.plugins.carrier.getCarrierInfo(succ, err);


        }).error(function(err){
           // alert("erreur get IP "+err);
             console.log(err);
        });
       $state.transitionTo($state.current, $state.$current.params, { reload: true, inherit: true, notify: true });
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
        $mdDialog.show(
            $mdDialog.alert()
                .parent(angular.element(document.body))
                .title(Messages.erreurAjoutArticleTitre)
                .content(Messages.erreurAjoutArticle)
                .ok('OK')
        );
    };
    $scope.isDisabled = false;
    $scope.buttonRaffraichirText="Raffraichir";
    $scope.raffraichir=function()
    {
      $scope.isDisabled=true;
      $scope.buttonRaffraichirText="Patientez...";
      $scope.doRefresh();
    }
});
