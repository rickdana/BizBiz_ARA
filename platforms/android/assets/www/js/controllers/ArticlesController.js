/**
 * Created by fleundeu on 26/04/2015.
 */
angular.module('Occazstreet.controllers')
    .controller('ArticlesController', function($scope,$rootScope,$stateParams,$filter,$cordovaGeolocation,$ImageCacheFactory, $state,$http,$timeout,$mdToast,$ionicPopup,$ionicActionSheet,$cordovaDevice,$cordovaFileTransfer,$localStorage, $ionicLoading,$ionicPlatform,$mdDialog,ArticlesService,Globals,Messages,$location) {


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
        $scope.loadMore=function()
        {
          alert("loadMore");
        };
          /*Pull to refresh*/
        $scope.doRefresh = function() {
            ArticlesService.getAllArticles().then(function (response) {
                $scope.articles=response.articles;
               // alert(JSON.stringify($scope.articles));
                $scope.$broadcast('scroll.refreshComplete');
            });

        };
        $ionicLoading.show({
            template: '<md-progress-circular class="md-raised md-warn" md-mode="indeterminate"></md-progress-circular>'
        });
        ArticlesService.getAllArticles().then(function (response) {
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

            //filter and order
            var orderBy = $filter('orderBy');

            $scope.order = function(predicate, reverse) {
                $scope.articles = orderBy($scope.articles , predicate, reverse);
            };
            /* $scope.articles=response.articles;
             $scope.nombreArticles=response.nombreArticles;*/
        });

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


    /*$scope.loadCategorie=function()
    {
        alert("loadCategorie");
        return $timeout(function() {
            ArticlesService.getAllCategories().then(function () {
                $scope.categories=ArticlesService.getCategories();
                alert(JSON.stringify($scope.categories));

            });
        }, 650);
    }*/


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
        }
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
                        })
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
                        })
                        break;
                }

                return true;
            }
        });
    }

    if($state.current.name=='app.editArticle')
    {
        var article=$stateParams.article;
        console.log("article a éditer "+article);
        ArticlesService.getArticleById(article).then(function (response) {
            $scope.compteurImage=response.article.images.length;
            console.log("nombre d'image "+$scope.compteurImage);
            console.log("article à éditer "+JSON.stringify(response.article));
            if(response.article.etat==='Vendu')
            {
                response.article.etat=true;
            }else
            {
                response.article.etat=false;
            }
            $scope.article=response.article;
            $scope.path=$scope.url+$scope.cheminImage;
            $scope.imgURI=response.article.images;

        })

        $scope.saveEditArticle=function(article)
        {
            $ionicLoading.show({
                template: '<md-progress-circular class="md-raised md-warn" md-mode="indeterminate"></md-progress-circular>'
            })
            var articleUpdate={};
            articleUpdate.idArticle=article.idArticle;
            articleUpdate.titre=article.titre;
            articleUpdate.details=article.details;
            articleUpdate.prix=article.prix;
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
                if(response.success)
                {
                    $scope.article=response.article;
                    $scope.path=$scope.url+$scope.cheminImage;
                    $scope.imgURI=response.article.images;
                    $ionicLoading.hide();

                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.body))
                            .title(Messages.miseAjoutArticleTitre)
                            .content(Messages.articleMiseAjour)
                            .ok('Ok')
                    );
                }

            })
        }

    }


    $scope.saveStat=function(article)
    {
        $http.get(Globals.URL_JSON_IP).success(function(dataIP){
            var succ = function (data) {
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
            alert("erreur get IP "+err);
        })
       $state.transitionTo($state.current, $state.$current.params, { reload: true, inherit: true, notify: true });
    }

    var internetError=function()
    {
        $mdDialog.show(
            $mdDialog.alert()
                .parent(angular.element(document.body))
                .title(Messages.internetErrorTitle)
                .content(Messages.internetErrorContent)
                .ok('OK')
        );
    }

    var erreurAjoutArticle=function()
    {
        $mdDialog.show(
            $mdDialog.alert()
                .parent(angular.element(document.body))
                .title(Messages.erreurAjoutArticleTitre)
                .content(Messages.erreurAjoutArticle)
                .ok('OK')
        );
    }



});
