/**
 * Created by fleundeu on 26/04/2015.
 */
angular.module('Occazstreet.controllers')
    .controller('AideController', function($scope,$stateParams, $timeout,Globals) {

    $scope.version=Globals.VERSION;
    $scope.facebookPage=Globals.FACEBOOKPAGE;
    $scope.twitterPage=Globals.TWITTERPAGE;

}).controller('CguController', function($scope,$stateParams, $timeout) {


}).controller('PolitiqueConfidentialiteController', function($scope,$stateParams, $timeout) {


}).controller('ConseilSecuriteController', function($scope,$stateParams, $timeout) {


  }).controller('ContactController', function($scope,$state,$stateParams, $http,$q,$ionicHistory,Globals,$ionicLoading,$mdDialog) {

    if($state.is('app.contactsujet'))
    {
      $scope.sujet=$stateParams.sujet;
    }

    $scope.contacter=function(sujet,contact){

      $ionicLoading.show({
        template: '<md-progress-circular class="md-raised md-warn" md-mode="indeterminate"></md-progress-circular>'
      });
    var url=Globals.urlServer+Globals.port;
    contact.sujet=sujet;
      var deferred=$q.defer();
      var req={
        method:'POST',
        url:url+'/article/sendMessageContact',
        data:{contact:contact}
      };
      $http(req).success(function(response){
        if(response)
        {
          $ionicLoading.hide();
          if(response.success)
          {
            var confirm = $mdDialog.confirm()
              .title('Contact')
              .textContent('Votre message a été envoyé')
              .ariaLabel('Lucky day')
              .ok('Ok');
            $mdDialog.show(confirm).then(function() {
              $ionicHistory.goBack();
            }, function() {
            });
          }
        }
      });
    }
  });



