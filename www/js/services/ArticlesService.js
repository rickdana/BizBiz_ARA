/**
 * Created by fleundeu on 26/04/2015.
 */
angular.module('Occazstreet.services',['Occazstreet.constants','ngStorage'])
    .service('ArticlesService', function(Globals,$http,$q,$timeout,$localStorage) {
    var url=Globals.urlServer+Globals.port;
    var categorie=null;
    var articles=[];
    var articlesByCategorie=[];
    var articleDetails=[];
    /*On remonte la liste des categories*/
    this.getAllCategories=function()
    {
        var deferred=$q.defer();
        $http.get(url+'/categorie/getAllCategorie').success(function(response){
            if(response)
            {
                categorie=response.categories;
                deferred.resolve();
            }
        });
        return deferred.promise;
    };

    this.getArticlesByLimit=function(skip,limit)
    {
        var deferred=$q.defer();
        $http.get(url+'/article/getArticlesByLimit?skip='+skip+'&limit='+limit,{timeout:10000}).success(function(response){
            if(response)
            {
                deferred.resolve(response);
            }
        }).error(function(error){
            deferred.resolve(error)
        });
        return deferred.promise;
    };
    this.getAllArticles=function()
    {
      var deferred=$q.defer();
      $http.get(url+'/article/getAllArticles',{timeout:10000}).success(function(response){
        if(response)
        {
          deferred.resolve(response);
        }
      }).error(function(error){
        deferred.resolve(error)
      });
      return deferred.promise;
    };

    this.getArticleByCategorie=function(categorie)
    {
        var deferred=$q.defer();
        $http.get(url+'/article/getArticleByCategorie?idcategorie='+categorie).success(function(response){
            if(response)
            {
                articlesByCategorie=response;
                deferred.resolve();
            }
        });
        return deferred.promise;
    };

    this.addArticle=function(article)
    {
        var deferred=$q.defer();
        var req={
            method:'POST',
            url:url+'/article/createArticleP',
            data:article
        };
        $http(req).success(function(response){

            deferred.resolve(response);

        }).error(function(error){
         //   var messageAuthErreur="Une erreur est survenue lors de l'ajout de l'article";
            deferred.reject(error)
        });
        return deferred.promise;

    };

    this.deleteArticle=function(article)
    {
        var deferred=$q.defer();
        var req={
            method:'POST',
            url:url+'/article/rollBackArticle',
            data:article
        };
        $http(req).success(function(response){

            deferred.resolve(response);

        }).error(function(error){
            deferred.reject(error)
        });
        return deferred.promise;
    };
    this.rollBackArticle=function(article)
    {
      var deferred=$q.defer();
      $http.get(url+'/article/rollbackArticle?idarticle='+article).success(function(response){
        if(response)
        {
          deferred.resolve(response);
        }
      });
      return deferred.promise;

    };
    var articleFound=false;
    this.getArticleById=function(article)
    {
      var deferred=$q.defer();
      if( $localStorage['articles'].length>0)
      {
        /*for(var i=0; i<$localStorage['articles'].length;i++)
        {
          if($localStorage['articles'][i].idArticle==article)
          {
            articleFound=true;
            var response={};
            response.article=$localStorage['articles'][i];
            deferred.resolve(response);
            return deferred.promise;
          }
        }*/
        if(!articleFound)
        {
          $http.get(url + '/article/getArticleById?idarticle=' + article).success(function (rep) {
            if (rep.article) {
              deferred.resolve(rep);
            }

          }).error(function(err){
            deferred.resole(err);
            console.log("Erreur "+err);
          });
          return deferred.promise;
        }
      }
      else
      {
        $http.get(url + '/article/getArticleById?idarticle=' + article).success(function (response) {
          if (response) {
             deferred.resolve(response);
          }

        }).error(function(err){

        });
        return deferred.promise;
      }
    };

    this.editArticle=function(article)
    {
        console.log("article envoyé pour update==>"+JSON.stringify(article));
        var deferred=$q.defer();
        var req={
            method:'POST',
            url:url+'/article/updateArticle',
            data:article
        };
        $http(req).success(function(response){
            if(response)
            {
                deferred.resolve(response);
            }
        });
        return deferred.promise;
    };

    this.delete=function(article)
    {
        var deferred=$q.defer();
        $http.get(url+'/article/deleteArticle?idarticle='+article).success(function(response){
            if(response)
            {
                deferred.resolve(response)
            }

        });
        return deferred.promise;
    };

    /*getters*/
    this.getCategories=function(){
        return categorie;
    };

    this.getArticles=function(){
        return articles;
    };

    this.getArticlesByCategorie=function(){
        return articlesByCategorie;
    };

    this.getArticlesByUser=function(user)
    {
        var deferred=$q.defer();
        $http.get(url+'/article/getArticlesByUser?iduser='+user).success(function(response){
            if(response)
            {
                deferred.resolve(response);
            }
        });
        return deferred.promise;
    };

    this.getArticleVenduByUser=function(user)
    {
        var deferred=$q.defer();
        $http.get(url+'/article/getArticlesVenduByUser?iduser='+user).success(function(response){
            if(response)
            {
                deferred.resolve(response);
            }
        });
        return deferred.promise;
    };

    this.getArticlesFavorisByUser=function(user)
    {
        var deferred=$q.defer();
        $http.get(url+'/article/getArticlesFavorisByUser?iduser='+user).success(function(response){
            if(response)
            {
                deferred.resolve(response);
            }
        });
        return deferred.promise;
    };

    this.getDevise=function()
    {
        var deferred=$q.defer();
        $http.get('app-data/devise.json')
        .success(function (response) {
            if(response)
            {
              deferred.resolve(response);
            }
          });
         return deferred.promise;
        /*$http.get(url+'/devise/getActiveDevise').success(function(response){
            if(response)
            {
                deferred.resolve(response);
            }
        });*/
    };

    this.addFavoris=function(user,article)
    {
      var deferred=$q.defer();
      var req={
        method:'POST',
        url:url+'/favoris/ajouterFavoris',
        data:{idutilisateur:user,idarticle:article}
      };
      $http(req).success(function(response){
        if(response)
        {
          deferred.resolve(response);
        }
      });
      return deferred.promise;
    };

    this.signaler=function(signalement)
    {
      var deferred=$q.defer();
      var req={
        method:'POST',
        url:url+'/article/signalerArticle',
        data:{signalement:signalement}
      };
      $http(req).success(function(response){
        if(response)
        {
          deferred.resolve(response);
        }
      });
      return deferred.promise;
    };
    this.addStatArticle=function(statArticle)
    {
        var deferred=$q.defer();
        var req={
            method:'POST',
            url:url+'/statArticle/saveStat',
            data:statArticle
        };
        $http(req).success(function(response){
            if(response)
            {
                deferred.resolve(response);
            }
        });
        return deferred.promise;
    };

    this.getArticleByParam=function(param)
    {
        var deferred=$q.defer();
        var req={
            method:'POST',
            url:url+'/article/getArticlesByParam',
            data:param
        };
        $http(req).success(function(response){
            if(response)
            {
                deferred.resolve(response);
            }
        });
        return deferred.promise;
    }


});
