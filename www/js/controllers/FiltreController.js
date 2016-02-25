/**
 * Created by fleundeu on 21/10/2015.
 */
angular.module('Occazstreet.controllers')
    .controller('FiltreController', function($scope,$rootScope,$stateParams,$state,$filter, $timeout,ArticlesService,$ionicViewService,Globals,$mdToast,$ionicLoading,Messages) {

        $rootScope.url=Globals.urlServer+Globals.port+'/';
        $rootScope.cheminImage=Globals.cheminImage;


        // Activate ink for controller
        //ionic.material.ink.displayEffect();

        ionic.material.motion.pushDown({
            selector: '.push-down'
        });
        ionic.material.motion.fadeSlideInRight({
            selector: '.animate-fade-slide-in .item'
        });
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
       // ionic.material.ink.displayEffect();

        $scope.param = {
            filterBy : "prix asc",
            prixmin:"",
            prixmax:"",
            motclef:""
        };
        $scope.defaultSelection=function()
        {
            $scope.param = {
                filterBy : "prix asc",
                prixmin:"",
                prixmax:"",
                motclef:""
            };
            $mdToast.show({
                template: '<md-toast class="md-toast">' + Messages.filtreParDefaut + '</md-toast>',
                hideDelay: 1500,
                position: 'bottom right left'
            });
        };
        $scope.search=function(param)
        {
            $rootScope.params=param;
            $ionicLoading.show({
                template: '<md-progress-circular class="md-raised md-warn" md-mode="indeterminate"></md-progress-circular>'
            });
            ArticlesService.getArticleByParam(param).then(function (result) {
                $rootScope.articles=result.articles;
                $rootScope.motclef=param.motclef;
                console.log( $scope.articles);
                $ionicViewService.nextViewOptions({
                    enableBack: true
                });

                $state.go('app.resultSearch');
                $ionicLoading.hide();

            });

        };
        var orderBy = $filter('orderBy');
        $scope.order = function(predicate, reverse) {
            $rootScope.articles = orderBy( $rootScope.articles , predicate, reverse);
        };

        /*Pull to refresh*/
        $scope.doRefresh = function() {
            ArticlesService.getArticleByParam($rootScope.params).then(function (result) {
                $rootScope.articles=[];
                $rootScope.articles=result.articles;
                $rootScope.motclef=$rootScope.params.motclef;

                $scope.$broadcast('scroll.refreshComplete');
            });

        };


        if($state.is('app.localisation'))
        {
            $scope.map = {
                center: { latitude:"", longitude:"" },
                marker: {
                    id:0,
                    coords:{latitude:"",longitude:""},
                    option:{draggable: false},
                },
                option:{draggable: false,panControl:false,scrollwheel:false,zoomControl:false},
                zoom: 16
            }
        }



        /**/
});
