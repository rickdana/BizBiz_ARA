/**
 * Created by fleundeu on 26/04/2015.
 */
angular.module('Occazstreet.controllers')
    .controller('CategoriesController', function($scope,$stateParams, $timeout,ArticlesService,Globals,$mdToast) {

        ionic.material.motion.pushDown({
          selector: '.push-down'
        });
        ionic.material.motion.fadeSlideInRight({
          selector: '.animate-fade-slide-in .item'
        });

        ArticlesService.getAllCategories().then(function () {
            $scope.categories=ArticlesService.getCategories();

        });

        $scope.isDisabled = false;
        $scope.buttonRaffraichirText="Raffraichir";
        $scope.raffraichir=function()
        {
          $scope.isDisabled=true;
          $scope.buttonRaffraichirText="Patientez...";
          ArticlesService.getAllCategories().then(function () {
            $scope.categories=ArticlesService.getCategories();

          });

          $timeout(function() {
            $scope.isDisabled=false;
            $scope.buttonRaffraichirText="Raffraichir";
            if(!$scope.categories)
            {
              $mdToast.show(
                $mdToast.simple()
                  .textContent('Serveur inaccessible')
                  .position("top" )
                  .hideDelay(3000)
              );
            }
          }, 5000);
        };




        /**/
});
