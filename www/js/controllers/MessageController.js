/**
 * Created by fleundeu on 26/04/2015.
 */
'use strict';
angular.module('Occazstreet.controllers')
    .controller('MessageController', function($scope,$stateParams, $timeout,ChatsService,$localStorage,$mdToast,Globals,UtilisateursService,$ionicActionSheet,Messages) {

        // Set Header
        $scope.$parent.showHeader();
        $scope.$parent.clearFabs();
        $scope.$parent.setHeaderFab('left');

        // Set Motion
        ionic.material.motion.fadeSlideInRight();

        // Set Ink
        ionic.material.ink.displayEffect();
        var iduser=$localStorage[Globals.USER_LOGGED].id;
        $scope.url=Globals.urlServer+Globals.port+'/';
        $scope.cheminPhoto=Globals.cheminPhoto;
        $scope.hasConversation=false;
        ChatsService.getConversationByUser(iduser).then(function(result){
            console.log(JSON.stringify(result));
            if(result.hasConversation)
            {

                $scope.conversations=result.conversations;
                $scope.hasConversation=true;
            }

        });
        $scope.onConversationHold = function(e, itemIndex, conversation) {
            $ionicActionSheet.show({
                cancelText:'<span class="no-text-transform">Annuler</span>',
                destructiveText: '<span class="no-text-transform">Supprimer</span>',
                destructiveButtonClicked: function() {
                    ChatsService.deleteConversation(conversation,iduser).then(function(response){
                        alert(response);
                        $scope.conversations=response.conversation;
                        $mdToast.show({
                            template: '<md-toast class="md-toast success">' + Messages.conversationSupprime + '</md-toast>',
                            hideDelay: 3000,
                            position: 'bottom right left'
                        });
                        $state.transitionTo('app.chatConversation', null, {'reload':true});
                        viewScroll.resize();
                        return true; //Close the model?

                    })
                }
            });
        };

});
