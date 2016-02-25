/**
 * Created by fleundeu on 26/04/2015.
 */
angular.module('Occazstreet.controllers')
    .controller('CategoriesController', function($scope,$stateParams, $timeout,ArticlesService,Globals) {

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

        ArticlesService.getAllCategories().then(function () {
            $scope.categories=ArticlesService.getCategories();

        });




        /**/
});
