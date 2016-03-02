/**
 * Created by Christian on 09/07/2015.
 * Controleur de la map! Ici on recupère les coordonnées du produit puis on l'affiche à l'aide d'un Marker !
 * Le controleur est lancé lorsque l'utilisateur click sur le map min dans la vue "articleDetails"
 */
angular.module('Occazstreet.controllers')
 .controller('ArticleMapController', function($scope,$stateParams,$state,$mdDialog,$ionicPlatform,$http,$timeout,ArticlesService,Globals,$ionicLoading,$cordovaSocialSharing) {
 	 /*$scope.map = {
 	 				center:{},
 	 				marker:{},
 	 				option:{},
 	 				zoom:""
 	 }
     */

 	 var articleId= $stateParams.id;
 	  $ionicLoading.show({
            template: '<md-progress-circular class="md-raised md-warn" md-mode="indeterminate"></md-progress-circular>'
        });
        ArticlesService.getArticleById(articleId).then(function (response) {

            $ionicLoading.hide();
            $scope.map = {
                            center: { latitude:response.article.latitude, longitude:response.article.longitude },
                            marker: {
                                        id:0,
                                        coords:{latitude:response.article.latitude,longitude:response.article.longitude},
                                        option:{draggable: false}
                                        },
                            option:{draggable: false,panControl:true,scrollwheel:false,zoomControl:false},
                            zoom: 16
                         }
            // angular.forEach(article,function(ar$scope.articlet){


            // })
        });
 });
