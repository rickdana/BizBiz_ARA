/**
 * Created by fleundeu on 01/05/2015.
 */
angular.module('Occazstreet.controllers')
  .controller('ArticleDetailsController', function($scope,$localStorage,$rootScope,$stateParams,$state,$mdDialog,$ionicPlatform,$ionicViewService,$ionicHistory,$http,$timeout,ArticlesService,Globals,$ionicLoading,$cordovaSocialSharing) {


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
    // Delay expansion
    /* $timeout(function() {
     $scope.isExpanded = true;
     }, 300);

     // Set Motion
     ionic.material.motion.fadeSlideInRight();

     // Set Ink
     ionic.material.ink.displayEffect();
     /*On recupère la categorie envoyé en paramètre*/
    /* var categorie=$stateParams.categorie;
     $scope.libellecategorie=$stateParams.libelle

     $scope.url=Globals.urlServer+Globals.port+'/';
     $scope.cheminImage=Globals.cheminImage+'/';
     ArticlesService.getArticleByCategorie(categorie).then(function(){
     $scope.articles=ArticlesService.getArticlesByCategorie();
     })*/

    /*get Id article from url*/
    var article=$stateParams.article;

    var logged=true;
    $scope.url=Globals.urlServer+Globals.port+'/';
    $scope.cheminImage=Globals.cheminImage;
    $scope.cheminPhoto=Globals.cheminPhoto;


    $ionicLoading.show({
      template: '<md-progress-circular class="md-raised md-warn" md-mode="indeterminate"></md-progress-circular>'
    });
    console.log("data"+$localStorage[Globals.USER_LOGGED]);

    ArticlesService.getArticleById(article).then(function (response) {
      //On sauvegarde l'article dans la memoire
      $localStorage['detailsArticle']=response.article;

      $ionicLoading.hide();

      $scope.art = response.article;
      console.dir($scope.art);
      var imageF="";
      var articleTitre="";
      var articleDetails="";


      //  angular.forEach(article,function(art){
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
      if(typeof $localStorage[Globals.USER_LOGGED]!=='undefined' &&  response.article.utilisateur.id==$localStorage[Globals.USER_LOGGED].id){
        $scope.currentUser=true
      }else
      {
        $scope.currentUser=false
      }

      // });
      /*Map Object: Ici on construit l'objet Map qui permettra de contenir les infos pour afficher le
       la localisation de produit. La Map sera centrée sur les coordonnées du produit et le marker
       indiquera la dite position.*/

      /*Social Sharing*/
      var message=articleTitre +" sur Occazstreet <br/><i>Regardez ce que je viens de trouver sur Occazstreet</i>";
      var messageT=articleTitre +" sur Occazstreet  Regardez ce que je viens de trouver sur Occazstreet";
      var image= "<img src='"+$scope.cheminImage +imageF+"'/>" ;
      var link="";
      var number="";
      var toArr="";
      var ccArr="";
      var bccArr="";
      var file="";
      var subject="";

      $scope.shareTwitter=function()
      {
        /*$cordovaSocialSharing
         .shareViaTwitter(message, image, link)
         .then(function(result) {
         // Success!
         }, function(err) {
         // An error occurred. Show a message to the user
         });*/
        window.plugins.socialsharing.shareViaTwitter(messageT,  $scope.url+$scope.cheminImage +imageF /* img */, 'http://www.x-services.nl', function()
        {console.log('share ok')}, function(errormsg){console.log(errormsg)})
      };


      $scope.shareMail=function()
      {
        var messageMail="Ce produit pourrait t\'interesser : "+articleTitre+"<br/><br/>"+articleDetails;
        var subjectMail=articleTitre +" sur Occazstreet";
        $cordovaSocialSharing
          .shareViaEmail(messageMail, subjectMail, toArr, ccArr, bccArr, file)
          .then(function(result) {
            // Success!
          }, function(err) {
            // An error occurred. Show a message to the user
          });
      };

      $scope.shareWhatsapp=function()
      {
        $cordovaSocialSharing
          .shareViaWhatsApp(message, image, link)
          .then(function(result) {
            // Success!
          }, function(err) {
            // An error occurred. Show a message to the user
            alert("Impossible de partager sur Whatsapp");
          });
        //window.plugins.socialsharing.shareViaWhatsApp(message,  $scope.url+$scope.cheminImage +imageF /* img */, null /* url */, function()
        // {console.log('share ok')}, function(errormsg){console.log(errormsg)})

      };

      $scope.shareFacebook=function()
      {
        //window.plugins.socialsharing.shareViaFacebook(message,  $scope.url+$scope.cheminImage +imageF /* img */, null /* url */, function(){
        //  console.log('share ok')}, function(errormsg){alert(errormsg)});
        $cordovaSocialSharing
          .shareViaFacebook(message +" "+image, image, link)
          .then(function(result) {
            // Success!
          }, function(err) {
            alert("Impossible de partager sur Facebook");
          });
      };

      $scope.shareSMS=function()
      {
        $cordovaSocialSharing
          .shareViaSMS(message, number)
          .then(function(result) {
            // Success!
          }, function(err) {
            // An error occurred. Show a message to the user
          });

      };

      $rootScope.sendSms=function(number)
      {
        $cordovaSocialSharing.shareViaSMS("", number);
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

      $scope.contreOffre=function(ev)
      {
        //alert(JSON.stringify($scope.article));

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

    });
    $scope.myGoBack = function() {
      $ionicHistory.goBack();
    };

    $timeout(function() {
      $ionicLoading.hide();
      // $state.go('app.erreurchargement');
    }, 10000);
  });
