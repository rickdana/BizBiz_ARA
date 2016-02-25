/**
 * Created by fleundeu on 01/05/2015.
 */
angular.module('Occazstreet.directives',[]).directive('urlCheck',function($http){

    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {

            scope.$watch('text', function(oldVal, newVal) {
                delete $http.defaults.headers.common['X-Requested-With'];
                $http({
                    method: 'GET',
                    url: newVal
                }).
                success(function(data, status, headers, config) {
                    console.log("success")
                }).
                error(function(data, status, headers, config) {
                    console.log("fail")
                });
            });
        }
    };
});

