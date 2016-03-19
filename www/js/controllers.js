angular.module('Occazstreet.controllers', ['ngMaterial','ngCordova','ngStorage','monospaced.elastic','angularMoment'])

.controller('AppCtrl', function($scope,$state,$window, $ionicModal, $ionicPopover, $timeout,ArticlesService,UtilisateursService,$rootScope,Globals,$localStorage,$ionicHistory) {
  // Form data for the login modal
  $scope.loginData = {};


        $scope.url=Globals.urlServer+Globals.port+'/';
        $scope.isExpanded = false;
        $scope.hasHeaderFabLeft = false;
        $scope.hasHeaderFabRight = false;
        $scope.$state=$state;

      /* var navIcons = document.getElementsByClassName('ion-navicon');
        for (var i = 0; i < navIcons.length; i++) {
            navIcons.addEventListener('click', function() {
                this.classList.toggle('active');
            });
        }*/

        ////////////////////////////////////////
        // Layout Methods
        ////////////////////////////////////////

        $scope.hideNavBar = function() {
            document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
        };

        $scope.showNavBar = function() {
            document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
        };

        $scope.noHeader = function() {
            var content = document.getElementsByTagName('ion-content');
            for (var i = 0; i < content.length; i++) {
                if (content[i].classList.contains('has-header')) {
                    content[i].classList.toggle('has-header');
                }
            }
        };

        $scope.setExpanded = function(bool) {
            $scope.isExpanded = bool;
        };

        $scope.setHeaderFab = function(location) {
            var hasHeaderFabLeft = false;
            var hasHeaderFabRight = false;

            switch (location) {
                case 'left':
                    hasHeaderFabLeft = true;
                    break;
                case 'right':
                    hasHeaderFabRight = true;
                    break;
            }

            $scope.hasHeaderFabLeft = hasHeaderFabLeft;
            $scope.hasHeaderFabRight = hasHeaderFabRight;
        };

        $scope.hasHeader = function() {
            var content = document.getElementsByTagName('ion-content');
            for (var i = 0; i < content.length; i++) {
                if (!content[i].classList.contains('has-header')) {
                    content[i].classList.toggle('has-header');
                }
            }

        };

        $scope.hideHeader = function() {
            $scope.hideNavBar();
            $scope.noHeader();
        };

        $scope.showHeader = function() {
            $scope.showNavBar();
            $scope.hasHeader();
        };

        $scope.clearFabs = function() {
            var fabs = document.getElementsByClassName('button-fab');
            if (fabs.length && fabs.length > 1) {
                fabs[0].remove();
            }
        };


        /*$scope.toggleCategorie = function(categorie) {
            if ($scope.isCategorieShown(categorie)) {
                $scope.shownCategorie = null;
            } else {
                $scope.shownCategorie = categorie;
            }
        };
        $scope.isCategorieShown = function(categorie) {
            return $scope.shownCategorie === categorie;
        };*/
        $scope.cheminPhoto=Globals.cheminPhoto;
        $scope.url=Globals.urlServer+Globals.port+'/';
        //Test si l'utilisateur est connecté
        /*UtilisateursService.isTokenExpired(window.localStorage.token).then(function(response) {
            alert("response"+response);
            if(response)
            {
                $scope.logged=false;
            }
            else
            {
                $scope.logged=true;
            }
        });*/


        if($localStorage[Globals.USER_LOGGED] !='undefined' && $localStorage[Globals.USER_LOGGED] !=null && $localStorage["logged"]==true)
        {
            $scope.infoUserLogged=$localStorage[Globals.USER_LOGGED];
            $scope.logged=$localStorage["logged"];
        }else
        {
            $scope.logged=false;
            $scope.infoUserLogged='undefined';
        }

        $scope.doLogout = function() {
            $scope.logged=false;
            $scope.infoUserLogged=null;
            $localStorage.$reset();
            $ionicHistory.nextViewOptions({
                disableAnimate:true,
                disableBack: true
            });
            $state.go('app.articles', {}, { reload: true });
           $window.location.reload(true);


        };
    })
/*.controller('ArticleController', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})*/
.controller('PlaylistCtrl', function($scope, $stateParams){
})
.controller('InviteFriendsController',function($scope,$stateParams,Globals,SharingService){

    var message="je t'invite à telecharger l'application "+ Globals.APPNAME +", elle est juste trop bien !!! :) "+Globals.APPPLAYSTORE;

    $scope.shareTwitter=function()
    {
      SharingService.shareTwitter(message,null,null);

    };


    $scope.shareMail=function()
    {
      var subjectMail="Occazstreet";
      SharingService.shareMail(message, subjectMail);
    };

    $scope.shareWhatsapp=function()
    {
      SharingService.shareWhatsapp(message, null, null);
    };

    $scope.shareFacebook=function()
    {
      SharingService.shareFacebook(message, null, null);

    };

    $scope.shareSMS=function()
    {
      SharingService.shareSMS(message, null);
    };

});
