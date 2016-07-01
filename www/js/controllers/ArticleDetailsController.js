/**
 * Created by fleundeu on 01/05/2015.
 */
angular.module('Occazstreet.controllers')
  .controller('ArticleDetailsController', function($scope,$localStorage, $rootScope,$stateParams,$state,$mdDialog,$ionicPlatform,$ionicViewService,$ionicHistory,$http,$timeout,ArticlesService,Globals,$ionicLoading,SharingService) {


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

    /*get Id article from url*/
    var article=$stateParams.article;


    var logged=true;
    $scope.url=Globals.urlServer+Globals.port+'/';
    $scope.cheminImage=Globals.cheminImage;
    $scope.cheminPhoto=Globals.cheminPhoto;


    $ionicLoading.show({
      template: '<md-progress-circular class="md-raised md-warn" md-mode="indeterminate"></md-progress-circular>'
    });

    //Check if article is in user FAVORIS
    function inFavoriteUser(data, id) {
      if(data != null)
      {
        for(var i = 0; i < data.length; i++) {
          if( data[ i].idArticle == id )
            return true;
        }
      }
      return false;
    }

    if(typeof  $localStorage[Globals.USER_LOGGED]!=='undefined')
    {
      ArticlesService.getArticlesFavorisByUser($localStorage[Globals.USER_LOGGED].id).then(function(res){
        if(res.success)
        {
          if(inFavoriteUser(res.articles,article))
          {
            $scope.favoris=true;
          }else
          {
            $scope.favoris=false;
          }
        }
      });
    }else
    {
    }

    $scope.slideHasChanged=function()
    {
      $ionicScrollDelegate.scrollTop();
      $scope.data.currSlide = $ionicSlideBoxDelegate.currentIndex();
      console.log('the slide changed to : ' + $scope.data.currSlide);
      $ionicScrollDelegate.resize();

      $timeout( function() {
      }, 50);
    };
    $ionicLoading.show({
      template: '<md-progress-circular class="md-raised md-warn" md-mode="indeterminate"></md-progress-circular>'
    });
    ArticlesService.getArticleById(article).then(function (response) {
      if(response.success)
      {
        //On sauvegarde l'article dans la memoire
        $localStorage['detailsArticle']=response.article;

        $ionicLoading.hide();

        $scope.art = response.article;

        console.log(JSON.stringify(response.article));
        var imageF="";
        var articleTitre="";
        var articleDetails="";
        console.log(response.article);
        articleTitre= response.article.titre;
        articleDetails= response.article.details;
        $rootScope.articleDevise= response.article.devise.symbole;
        $scope.articlePrix= response.article.prix;
        if( response.article.images.length>0)
        {
          imageF= response.article.images[0].cheminImage;
        }


        $scope.map = {
          center: { latitude: response.article.latitude, longitude: response.article.longitude },
          marker: {
            id:0,
            coords:{latitude: response.article.latitude,longitude: response.article.longitude},
            option:{draggable: false}
          },
          option:{draggable: false,panControl:false,scrollwheel:false,zoomControl:false},
          zoom: 16
        };
        if(typeof $localStorage[Globals.USER_LOGGED]!=='undefined'){
          if(response.article.utilisateur.id==$localStorage[Globals.USER_LOGGED].id)
          {
            $scope.currentUser=true;
          }else
          {
            $scope.currentUser=false;
          }
        }else
        {
          $scope.currentUser=false;
        }

        /*Social Sharing*/
        var message=articleTitre +" : \n  sur OccazStreet \n pour voir le détails télécharger l'application en allant sur "+Globals.APPPLAYSTORE;
        var messageT=articleTitre  +" : \n sur OccazStreet \n pour voir le détails, télécharger l'application en allant sur " +Globals.APPPLAYSTORE;
        var image= "<img src='"+$scope.cheminImage +imageF+"'/>" ;
        var link="";
        var number="";

        $scope.shareTwitter=function()
        {
          SharingService.shareTwitter(messageT +' '+Globals.PSEUDOTWITTER,$scope.url+$scope.cheminImage +imageF,'');
        };

        $scope.shareMail=function()
        {
          var messageMail="Ce produit pourrait t\'interesser : "+articleTitre+"\n"+articleDetails;
          var subjectMail=articleTitre +" sur Occazstreet";
          SharingService.shareMail(messageMail,subjectMail,null,null,null,$scope.url+$scope.cheminImage +imageF);
        };

        $scope.shareMailEmpty=function()
        {
          var to=[response.article.utilisateur.email];
          var subjectMail="Concernant votre annonce : " +articleTitre +" sur Occazstreet";
          SharingService.shareMail(null,subjectMail,to,response.article.utilisateur.email,null);
        };

        $scope.shareWhatsapp=function()
        {
          SharingService.shareWhatsapp(message,null,null);
        };

        $scope.shareFacebook=function()
        {
          SharingService.shareFacebook(message,null,$scope.url+$scope.cheminImage +imageF);
        };

        $scope.shareSMS=function()
        {
          SharingService.shareSMS(message,number);
        };

        $rootScope.sendSms=function(number)
        {
          SharingService.shareSMS("", number);
        };

        $scope.makeCall=function(number)
        {
          window.plugins.CallNumber.callNumber(onSuccess, onError, number);
        };
        var onSuccess = function(){
          console.log("success");
        };

        var onError = function(error){
          console.log("fail  "+error);
        };
      }
      else if(!response.success)
      {
        $ionicLoading.hide();
        $state.go("app.articles");

      }
    });
    $scope.myGoBack = function() {
      $ionicHistory.goBack();
    };

    $scope.contreOffre=function(ev)
    {
      if(logged)
      {
        $mdDialog.show({
          controller:ContreOffreController,
          templateUrl: 'contreOffre.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          scope:$scope.$new(),
          clickOutsideToClose:true

        })
          .then(function() {
            $ionicPlatform.on('backbutton', function() {
              $mdDialog.hide();
            });

          });
      }
      else
      {
        $state.go("app.login");
      }
    };
    function ContreOffreController($scope,$mdDialog,$rootScope)
    {
      $scope.envoyer=function()
      {
        $mdDialog.cancel();
        $rootScope.offre=$scope.contreoffre;
        $state.go("app.chat");
      }
      ;
      $scope.hide = function() {
        $mdDialog.hide();
      };
      $scope.cancel = function() {
        $mdDialog.cancel();
      };
      $scope.answer = function(answer) {
        $mdDialog.hide(answer);
      };
    }

    $scope.jachete=function(ev)
    {
      if(logged)
      {
        $mdDialog.show({
          templateUrl: 'jachete.html',
          scope: $scope,
          targetEvent: ev
        })
          .then(function() {
            $ionicPlatform.on('backbutton', function() {
              $mdDialog.cancel();
            });
            $mdDialog.cancel();

          });
      }
      else
      {
        $state.go("app.login");
      }
    };

    $scope.chat=function(ev)
    {
      if(logged)
      {

      }
      else
      {
        $state.go("app.login");
      }
    };

    $scope.close=function()
    {
      $mdDialog.cancel();
    }

    /*$timeout(function() {
      $ionicLoading.hide();
      // $state.go('app.erreurchargement');
    }, 10000);*/


    //Pour edition d'un article au niveau de l'accueil
    if(typeof  $localStorage[Globals.USER_LOGGED]!=='undefined')
    {
      $scope.userId=$localStorage[Globals.USER_LOGGED].id;
    }
    $scope.editArticle=function(article)
    {
      $state.go('app.editArticle', {article:article});
    };

    $scope.addFavoris=function(user,article)
    {

      ArticlesService.addFavoris(user,article).then(function (response) {
        if(response.success && response.suppression)
        {
          $scope.favoris=false;

        }
        else if(response.success && !response.suppression)
        {
          $scope.favoris=true;
        }
        $ionicLoading.show({ template: response.message, noBackdrop: true, duration: 2000 });
      });
    }
  }).controller('SignalerController',function($ionicLoading,$mdToast,$http,$scope,$mdDialog,$stateParams,ArticlesService,$ionicHistory,$cordovaToast){

    $http.get('app-data/motif-signalement.json')
      .success(function (response) {
        $scope.motifs=response;
      });
    var articleSignaler=$stateParams.idarticle;
    $scope.showInfos=function(ev)
    {
      $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.querySelector('#popupContainer')))
          .clickOutsideToClose(true)
          .content('Ces informations sont indispensables à Occazstreet.com pour donner suite à votre signalement de contenu abusif. Notre société est seule destinataire de ces informations qui peuvent cependant être accessibles, pour des raisons exclusivement techniques, à notre société et aux prestataires du site assurant leur traitement ainsi que leur hébergement et le support technique.')
          .ariaLabel('showInfos')
          .ok('Ok')
          .targetEvent(ev)
      );
    };

    $scope.showVosDroits=function(ev)
    {
      $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.querySelector('#popupContainer')))
          .clickOutsideToClose(true)
          .templateUrl('../')
          .content('Conformément à la règlementation, vous bénéficiez d’un droit d’opposition, pour des motifs légitimes, au traitement de vos informations ainsi que d’un droit d’accès et de rectification et de suppression des informations vous concernant, que vous pouvez exercer en nous contactant via notre page Contact.')
          .ariaLabel('showVosDroits')
          .ok('Ok')
          .targetEvent(ev)
      );
    };
    $scope.signaler=function(signalement,ev)
    {
      $ionicLoading.show({
        template: '<md-progress-circular class="md-raised md-warn" md-mode="indeterminate"></md-progress-circular>'
      });
      signalement.idarticle=articleSignaler;
      ArticlesService.signaler(signalement).then(function(response){
        $ionicLoading.hide();
          if(response.success)
          {
            var confirm = $mdDialog.confirm()
              .title('Signaler')
              .textContent('Votre message a été envoyé')
              .ariaLabel('Lucky day')
              .targetEvent(ev)
              .ok('Ok');
            $mdDialog.show(confirm).then(function() {
              $ionicHistory.goBack();
            }, function() {
            });
          }
      });

    };

  });
