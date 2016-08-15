/**
 * Created by fleundeu on 26/04/2015.
 */
'use strict';
angular.module('Occazstreet.controllers')
    .controller('ChatController', function($scope, $rootScope, $state, $stateParams, Messages, MockService,
                                           $ionicActionSheet,
                                           $ionicPopup,$ionicLoading, $ionicScrollDelegate, ChatsService,$timeout,ArticlesService, $interval,$cordovaClipboard,$localStorage,Globals,UtilisateursService) {

        $scope.url=Globals.urlServer+Globals.port+'/';
        $scope.cheminPhoto=Globals.cheminPhoto;
        $scope.cheminImage=Globals.cheminImage;
        var conversation={};
        var conversation;
        var messageCheckTimer;

        var viewScroll = $ionicScrollDelegate.$getByHandle('userMessageScroll');
        var footerBar; // gets set in $ionicView.enter
        var scroller;
        var txtInput;

        if($state.is('app.chatConversation'))
        {
            $scope.conversation=$stateParams.conversation;
            var article=$stateParams.article;
            $ionicLoading.show({
                template: '<md-progress-circular class="md-raised md-warn" md-mode="indeterminate"></md-progress-circular>'
            });
            ArticlesService.getArticleById(article).then(function(result){
                if(result)
                {
                    $scope.article=result.article;
                    $scope.nom=result.article.utilisateur.nom[0];
                    $scope.prenom=result.article.utilisateur.prenom;
                    $scope.photo=result.article.photo.cheminPhoto;
                    $scope.articleTitre = result.article.titre;
                    $scope.articlePrix=result.article.prix;
                    $scope.imageArticle = result.article.images[0].cheminImage;
                    $scope.deviseArticle=result.article.devise.symbole;
                    $scope.iduser=result.article.utilisateur.id;
                    $scope.idArticle=result.article.idArticle;

                    UtilisateursService.getActiviteUser(result.article.utilisateur.id).then(function(response) {
                        if (response.success) {
                            $scope.nombreDeProduit = response.activiteUser.nombreArticlePublie + response.activiteUser.nombreArticleVendu;

                            ChatsService.getConversationById( $scope.conversation).then(function(response){

                                if(response.success)
                                {
                                    $scope.emetteur=response.conversation.utilisateur1;
                                    $scope.recepteur=response.conversation.utilisateur2;
                                    getMessages();
                                    scroller = document.body.querySelector('#userChatView .scroll-content');

                                    io.socket.on('message', function (msg) {
                                        getMessages();
                                        scroller = document.body.querySelector('#userChatView .scroll-content');

                                        /*witch(msg.verb){
                                            case 'messaged':
                                                $scope.$apply($scope.messages.push(msg.data));
                                                // Call $scope.$digest to make the changes in UI
                                                $scope.$digest();
                                                break;
                                            default: return;
                                        }*/
                                    });
                                    $scope.$on('$ionicView.enter', function() {


                                        getMessages();

                                        footerBar = document.body.querySelector('#userChatView .bar-footer');
                                        scroller = document.body.querySelector('#userChatView .scroll-content');
                                        txtInput = angular.element(footerBar.querySelector('textarea'));

                                        messageCheckTimer = $interval(function() {
                                            //toute les 5 secondes on verifit s'il un nouveau message existe
                                           // getMessages()
                                        }, 3000);
                                    });

                                    $scope.$on('$ionicView.leave', function() {
                                        // Make sure that the interval is destroyed
                                        if (angular.isDefined(messageCheckTimer)) {
                                            $interval.cancel(messageCheckTimer);
                                            messageCheckTimer = undefined;
                                        }
                                    });

                                    $scope.$on('$ionicView.beforeLeave', function() {
                                        if (!$scope.input.message || $scope.input.message === '') {
                                            localStorage.removeItem('userMessage-' + $scope.toUser._id);
                                        }
                                    });
                                }


                            })

                        }
                    })

                }
            })
            $timeout(function() {
                $ionicLoading.hide();
             }, 8000);



        }
        if($state.is('app.chatContreOffre'))
        {

        }
        var initChat=function()
        {
            var article=$localStorage['detailsArticle'];
            $scope.article=article;
            $ionicLoading.show({
                template: '<md-progress-circular class="md-raised md-warn" md-mode="indeterminate"></md-progress-circular>'
            });
            angular.forEach(article,function(art) {
                $scope.nom=art.utilisateur.nom[0];
                $scope.prenom=art.utilisateur.prenom;
                $scope.photo=art.photo.cheminPhoto;
                $scope.articleTitre = art.titre;
                $scope.articlePrix=art.prix;
                $scope.idArticle=art.idArticle;
                $scope.iduser=art.utilisateur.id;
                if(art.images.length>0)
                {
                    $scope.imageArticle = art.images[0].cheminImage;
                }
                $scope.deviseArticle=art.devise.symbole;
                /*$scope.toUser = {
                 _id: $scope.iduser,
                 pic:  $scope.url+$scope.cheminPhoto+ $scope.photo,
                 username: $scope.prenom+' '+$scope.nom[0]
                 };*/
                //Creation de la conversation
                conversation.utilisateur1=$localStorage[Globals.USER_LOGGED].id;

                conversation.utilisateur2=art.utilisateur.id;
                conversation.article=art.idArticle;
                ChatsService.createConversation(conversation).then(function(response){
                    $scope.emetteur=response.conversation.utilisateur1;
                    $scope.recepteur=response.conversation.utilisateur2;
                    $scope.conversation=response.idConversation;
                    //on recupere le nombre de produit de l'utilisateur avec qui le loggué veut chatter
                    UtilisateursService.getActiviteUser(art.utilisateur.id).then(function(response) {
                        if (response.success) {
                            $scope.nombreDeProduit = response.activiteUser.nombreArticlePublie + response.activiteUser.nombreArticleVendu;
                        }
                    });
                    $ionicLoading.hide();
                });
            });
            $timeout(function() {
                $ionicLoading.hide();
            }, 5000);
            $scope.toUser = {
                _id: $scope.iduser,
                pic:  $scope.url+$scope.cheminPhoto+ $scope.photo,
                username: $scope.prenom+' '+$scope.nom[0]
            };

            $scope.fromUser = {
                _id: $localStorage[Globals.USER_LOGGED].id,
                pic: $scope.url+$scope.cheminPhoto+ $localStorage[Globals.USER_LOGGED].photo.cheminPhoto,
                username: $localStorage[Globals.USER_LOGGED].prenom +' '+$localStorage[Globals.USER_LOGGED].nom[0]
            };

            $scope.input = {
                message: localStorage['userMessage-' + $scope.toUser._id] || ''
            };
            getMessages();

            $scope.$watch('input.message', function(newValue, oldValue) {
                if (!newValue) newValue = '';
                localStorage['userMessage-' + $scope.toUser._id] = newValue;
            });
            $scope.$on('$ionicView.enter', function() {


                getMessages();

                footerBar = document.body.querySelector('#userChatView .bar-footer');
                scroller = document.body.querySelector('#userChatView .scroll-content');
                txtInput = angular.element(footerBar.querySelector('textarea'));

                messageCheckTimer = $interval(function() {
                    getMessages();
                }, 5000);
            });

            $scope.$on('$ionicView.leave', function() {
                // Make sure that the interval is destroyed
                if (angular.isDefined(messageCheckTimer)) {
                    $interval.cancel(messageCheckTimer);
                    messageCheckTimer = undefined;
                }
            });

            $scope.$on('$ionicView.beforeLeave', function() {
                if (!$scope.input.message || $scope.input.message === '') {
                    localStorage.removeItem('userMessage-' + $scope.toUser._id);
                }
            });
        }

        if($state.is('app.chat'))
        {
            alert($rootScope.offre);
            if($rootScope.offre)
            {
                var offre=$rootScope.offre;
                var message=Messages.messageOffre + offre.prix +' '+  $rootScope.articleDevise+'\n' + offre.message;
                initChat(function(){
                    alert( $scope.emetteur);
                    alert( $scope.recepteur);
                    sendMessage(message)
                });

            }
            initChat();
            //io.sails.url(Globals.urlServer+Globals.port);
            //io.socket.get('/message/addMessage');
            //Info article

        }


        // mock acquiring data via $scope and $locaStorage
        var showLoading=function()
        {
            $ionicLoading.show({
                template: '<md-progress-circular class="md-raised md-warn" md-mode="indeterminate"></md-progress-circular>'
            });
        };
        var hideLoading=function()
        {
            $ionicLoading.hide();
        };


        function getMessages() {
            io.socket.get('http://localhost:1337/message/getMessagesByConversation?idconversation='+$scope.conversation, function (response) {
                $scope.$apply($scope.messages=response.messages);
                scroller = document.body.querySelector('#userChatView .scroll-content');

                //console.log("messages "+$scope.messages);
                if(response.messages[0].utilisateur1 ===$localStorage[Globals.USER_LOGGED].id)
                {
                    $scope.fromUser = {
                        _id: response.messages[0].utilisateur1,
                        pic:  $scope.url+$scope.cheminPhoto+ response.messages[0].photo1,
                        username: response.messages[0].username1
                    };

                    $scope.toUser = {
                        _id: response.messages[0].utilisateur2,
                        pic:  $scope.url+$scope.cheminPhoto+ response.messages[0].photo2,
                        username: response.messages[0].username2
                    };
                }else
                {
                    $scope.toUser = {
                        _id: response.messages[0].utilisateur1,
                        pic:  $scope.url+$scope.cheminPhoto+ response.messages[0].photo1,
                        username: response.messages[0].username1
                    };

                    $scope.fromUser = {
                        _id: response.messages[0].utilisateur2,
                        pic:  $scope.url+$scope.cheminPhoto+ response.messages[0].photo2,
                        username: response.messages[0].username2
                    };
                }

            });
        }

        //Send message
        $scope.sendMessage=function(mess)
        {
            sendMessage(mess);
        }
        function sendMessage (mess) {

            var toUser;
            var fromUser;
            var contenu;

            if($localStorage[Globals.USER_LOGGED].id ==$scope.emetteur)
            {
                fromUser=$scope.emetteur;
                toUser=$scope.recepteur;
            }else
            {
                fromUser=$scope.recepteur;
                toUser=$scope.emetteur;
            }
            if(!mess)
            {
                contenu=$scope.input.message;
                $scope.input.message = '';

            }else
            {
                contenu=mess;
            }
            var message = {
                utilisateur:fromUser,
                toUser:toUser,
                contenu: contenu,
                article:$scope.idArticle,
                idConversation:$scope.conversation,
                dateMessage : new Date(),
                lu:false
            };
            message.username = $scope.fromUser.username;
            message.userId = $localStorage[Globals.USER_LOGGED].id;

            io.socket.post('http://localhost:1337/message/addMessage',message, function (response) {
                //console.log("message envoyée à "+toUser);
                $scope.$apply($scope.messages.push(response.message));

            });

            $timeout(function() {
                //keepKeyboardOpen();
                viewScroll.scrollBottom(true);
            }, 0);

            //});
        };

        // this keeps the keyboard open on a device only after sending a message, it is non obtrusive
        function keepKeyboardOpen() {
            txtInput.one('blur', function() {
                txtInput[0].focus();
            });
        }

        $scope.onMessageHold = function(e, itemIndex, message) {

            $ionicActionSheet.show({
                buttons: [{
                    text: '<i class="icon ion-ios-copy-outline"></i><span class="no-text-transform">Copier</span>'
                }, {
                    text: '<i class="icon ion-android-delete"></i><span class="no-text-transform">Supprimer</span>'
                }],
                buttonClicked: function(index) {
                    switch (index) {
                        case 0: // Copy Text
                            $cordovaClipboard.copy(message.text).then(function() {
                            }, function() {
                            });
                            break;
                        case 1: // Delete
                            // no server side secrets here :~)
                            $scope.messages.splice(itemIndex, 1);
                            $timeout(function() {
                                viewScroll.resize();
                            }, 0);

                            break;
                    }

                    return true;
                }
            });
        };

        // this prob seems weird here but I have reasons for this in my app, secret!
        $scope.viewProfile = function(msg) {

            if (msg.userId === $scope.fromUser._id) {
                // go to your profile
            } else {
                // go to other users profile
            }
        };

        // I emit this event from the monospaced.elastic directive, read line 480
        $scope.$on('taResize', function(e, ta) {
            if (!ta) return;

            var taHeight = ta[0].offsetHeight;

            if (!footerBar) return;

            var newFooterHeight = taHeight + 10;
            newFooterHeight = (newFooterHeight > 44) ? newFooterHeight : 44;

            footerBar.style.height = newFooterHeight + 'px';
            scroller.style.bottom = newFooterHeight + 'px';
        });

    })

// services
.factory('MockService', ['$http', '$q',
    function($http, $q) {
        var me = {};

        me.getUserMessages = function(d) {
            /*
             var endpoint =
             'http://www.mocky.io/v2/547cf341501c337f0c9a63fd?callback=JSON_CALLBACK';
             return $http.jsonp(endpoint).then(function(response) {
             return response.data;
             }, function(err) {
             console.log('get user messages error, err: ' + JSON.stringify(
             err, null, 2));
             });
             */
            var deferred = $q.defer();

            setTimeout(function() {
                deferred.resolve(getMockMessages());
            }, 1500);

            return deferred.promise;
        };


        return me;
    }
])

// fitlers
    .filter('nl2br', ['$filter',
        function($filter) {
            return function(data) {
                if (!data) return data;
                return data.replace(/\n\r?/g, '<br />');
            };
        }
    ])

// directives
    .directive('autolinker', ['$timeout',
        function($timeout) {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    $timeout(function() {
                        var eleHtml = element.html();

                        if (eleHtml === '') {
                            return false;
                        }

                        var text = Autolinker.link(eleHtml, {
                            className: 'autolinker',
                            newWindow: false
                        });

                        element.html(text);

                        var autolinks = element[0].getElementsByClassName('autolinker');

                        for (var i = 0; i < autolinks.length; i++) {
                            angular.element(autolinks[i]).bind('click', function(e) {
                                var href = e.target.href;

                                if (href) {
                                    //window.open(href, '_system');
                                    window.open(href, '_blank');
                                }

                                e.preventDefault();
                                return false;
                            });
                        }
                    }, 0);
                }
            }
        }
    ])

function onProfilePicError(ele) {
    this.ele.src = ''; // set a fallback
}

function getMockMessages() {
    return {"messages":[{"_id":"535d625f898df4e80e2a125e","text":"Ionic has changed the game for hybrid app development.","userId":"534b8fb2aa5e7afc1b23e69c","date":"2014-04-27T20:02:39.082Z","read":false,"readDate":"2014-12-01T06:27:37.944Z"},{"_id":"535f13ffee3b2a68112b9fc0","text":"I like Ionic better than ice cream!","userId":"534b8e5aaa5e7afc1b23e69b","date":"2014-04-29T02:52:47.706Z","read":true,"readDate":"2014-12-01T06:27:37.944Z"},{"_id":"546a5843fd4c5d581efa263a","text":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.","userId":"534b8fb2aa5e7afc1b23e69c","date":"2014-11-17T20:19:15.289Z","read":true,"readDate":"2014-12-01T06:27:38.328Z"},{"_id":"54764399ab43d1d4113abfd1","text":"Am I dreaming?","userId":"534b8e5aaa5e7afc1b23e69b","date":"2014-11-26T21:18:17.591Z","read":true,"readDate":"2014-12-01T06:27:38.337Z"},{"_id":"547643aeab43d1d4113abfd2","text":"Is this magic?","userId":"534b8fb2aa5e7afc1b23e69c","date":"2014-11-26T21:18:38.549Z","read":true,"readDate":"2014-12-01T06:27:38.338Z"},{"_id":"547815dbab43d1d4113abfef","text":"Gee wiz, this is something special.","userId":"534b8e5aaa5e7afc1b23e69b","date":"2014-11-28T06:27:40.001Z","read":true,"readDate":"2014-12-01T06:27:38.338Z"},{"_id":"54781c69ab43d1d4113abff0","text":"I think I like Ionic more than I like ice cream!","userId":"534b8fb2aa5e7afc1b23e69c","date":"2014-11-28T06:55:37.350Z","read":true,"readDate":"2014-12-01T06:27:38.338Z"},{"_id":"54781ca4ab43d1d4113abff1","text":"Yea, it's pretty sweet","userId":"534b8e5aaa5e7afc1b23e69b","date":"2014-11-28T06:56:36.472Z","read":true,"readDate":"2014-12-01T06:27:38.338Z"},{"_id":"5478df86ab43d1d4113abff4","text":"Wow, this is really something huh?","userId":"534b8fb2aa5e7afc1b23e69c","date":"2014-11-28T20:48:06.572Z","read":true,"readDate":"2014-12-01T06:27:38.339Z"},{"_id":"54781ca4ab43d1d4113abff1","text":"Create amazing apps - ionicframework.com","userId":"534b8e5aaa5e7afc1b23e69b","date":"2014-11-29T06:56:36.472Z","read":true,"readDate":"2014-12-01T06:27:38.338Z"}],"unread":0};
}

// configure moment relative time
/*moment.locale('fr', {
    relativeTime: {
        future: "in %s",
        past: "%s ago",
        s: "%d sec",
        m: "a minute",
        mm: "%d minutes",
        h: "an hour",
        hh: "%d hours",
        d: "a day",
        dd: "%d days",
        M: "a month",
        MM: "%d months",
        y: "a year",
        yy: "%d years"
    }
});*/
