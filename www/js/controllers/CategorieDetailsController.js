/**
 * Created by fleundeu on 26/04/2015.
 */
angular.module('Occazstreet.controllers')
    .controller('CategorieDetailsController', function($scope,$stateParams, $timeout,ArticlesService,Globals,$ionicLoading,$ionicHistory,$filter) {

        $scope.goBack = function() {
            $ionicHistory.goBack();
        };
        // Activate ink for controller
        ionic.material.ink.displayEffect();

        ionic.material.motion.pushDown({
            selector: '.push-down'
        });
        ionic.material.motion.fadeSlideInRight({
            selector: '.animate-fade-slide-in .item'
        });

        /*On recupère la categorie envoyé en paramètre*/
        var categorie=$stateParams.categorie;
        $scope.libellecategorie=$stateParams.libelle;

        $scope.url=Globals.urlServer+Globals.port+'/';
        $scope.cheminImage=Globals.cheminImage+'/';

        $ionicLoading.show({
            template: '<md-progress-circular class="md-raised md-warn" md-mode="indeterminate"></md-progress-circular>'
        });
        ArticlesService.getArticleByCategorie(categorie).then(function(){
            $ionicLoading.hide();
            $scope.articles=ArticlesService.getArticlesByCategorie().articles;
            $scope.hasArticle=ArticlesService.getArticlesByCategorie().hasArticle;
          var orderBy = $filter('orderBy');
          $scope.order = function(predicate, reverse) {

             $scope.articles = orderBy($scope.articles , predicate, reverse);
          };
        });

        $scope.doRefresh = function() {
          ArticlesService.getArticleByCategorie(categorie).then(function () {
            $rootScope.articles=ArticlesService.getArticlesByCategorie().articles;
            $rootScope.hasArticle=ArticlesService.getArticlesByCategorie().hasArticle;

            $scope.$broadcast('scroll.refreshComplete');
          });
        };
        $timeout(function() {
            $ionicLoading.hide();
            // $state.go('app.erreurchargement');
        }, 10000);

});
