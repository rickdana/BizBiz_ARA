/**
 * Created by fleundeu on 26/04/2015.
 */
angular.module('Occazstreet.services')
    .service('UtilisateursService', function(Globals,$http,$q,$timeout,$window,$localStorage,Messages) {

        var username = {};
        var isAuthenticated = false;
        var baseUrl=Globals.urlServer+Globals.port;
        this.getUtilisateurById=function(utilisateur)
        {
          var deferred=$q.defer();
            $http.get(baseUrl+'/utilisateur/getUtilisateurById?idutilisateur='+utilisateur).success(function(response){
                if(response)
                {
                    deferred.resolve(response);
                }
            })
            return deferred.promise;
        };

        function storeUserCredentials(response) {
            /*$window.localStorage[Globals.LOCAL_TOKEN_KEY]=response.data.token;
             $window.localStorage[Globals.USER_LOGGED]=JSON.stringify(response.data);
             $window.localStorage["logged"]=true;*/
            $localStorage[Globals.LOCAL_TOKEN_KEY]=response.data.token;
            $localStorage[Globals.USER_LOGGED]=response.data;
            $localStorage['logged']=true;
            useCredentials(response);
        }

        function useCredentials(response) {
            username = response.data;
            isAuthenticated = true;
            var authToken = response.data.token;
            console.log("Toekn "+authToken);
            // Set the token as header for your requests!
            $http.defaults.headers.common['X-Auth-Token'] = authToken;
        }

        this.signin=function(credentials){
            var deferred=$q.defer();
            var req={
                method:'POST',
                url:baseUrl+'/utilisateur/authenticate',
                data:credentials
            }
            $http(req).success(function(response){
                if(response.success){
                    storeUserCredentials(response);
                    $localStorage[Globals.LOCAL_TOKEN_KEY]=response.data.token;
                    $localStorage[Globals.USER_LOGGED]=response.data;
                    $localStorage['logged']=true;
                    deferred.resolve(response);
                }else
                {
                    deferred.resolve(response);
                }
            }).error(function(error){
                messageAuthErreur="Une erreur est survenue durant votre authentification";
                deferred.reject(error)
            })
            return deferred.promise;
        };

        this.signup=function(utilisateur)
        {
            var deferred=$q.defer();
            var req={
                method:'POST',
                url:baseUrl+'/utilisateur/signup',
                data:utilisateur
            }
            $http(req).success(function(response){
                if(response.success)
                {

                    /*$localStorage[Globals.LOCAL_TOKEN_KEY]=response.data.token;
                    $localStorage[Globals.USER_LOGGED]=response.data;
                    $localStorage.logged=true;*/
                    storeUserCredentials(response);
                    deferred.resolve(response);
                }else
                {
                    destroyUserCredentials();
                    deferred.resolve(response);
                }

            }).error(function(error){
                messageAuthErreur="Une erreur est survenue durant votre inscription";
                deferred.reject(error);
            })
            return deferred.promise;
        };

        this.validerTelephone=function(utilisateur)
        {
            var deferred=$q.defer();
            var req={
                method:'GET',
                url:baseUrl+'/utilisateur/validerPhone?idutilisateur='+utilisateur.idutilisateur+'&telephone='+utilisateur.telephone
                //data:utilisateur
            }
            $http(req).success(function(response){
                if(response)
                {
                    deferred.resolve(response);
                }

            }).error(function(error){
                deferred.reject(Messages.messageErreurValidationTelephone);
            });
            return deferred.promise;
        };
        this.validerCode=function(utilisateur)
        {
            var deferred=$q.defer();
            var req={
                method:'GET',
                url:baseUrl+'/utilisateur/validerCode?idutilisateur='+utilisateur.idutilisateur+'&code='+utilisateur.code
                //data:utilisateur
            }
            $http(req).success(function(response){
                if(response)
                {
                    deferred.resolve(response);
                }

            }).error(function(error){
                console.log(error);
                deferred.reject(Messages.messageErreurValidationCode);
            });
            return deferred.promise;
        };


        this.isTokenExpired=function(token)
        {
            var deferred=$q.defer();
            var req={
                method:'GET',
                url:baseUrl+'/utilisateur/isTokenExpired?token='+token
            }
            $http(req).success(function(response){
                if(!response.success)
                {
                    deferred.resolve(response);
                }
                else
                {
                    deferred.resolve("true");
                }

            }).error(function(error){
                deferred.reject(error);
            })
            return deferred.promise;
        };

        function destroyUserCredentials() {
            var authToken = undefined;
            username = '';
            isAuthenticated = false;
            $http.defaults.headers.common['X-Auth-Token'] = undefined;
            delete $localStorage[Globals.LOCAL_TOKEN_KEY];
            $localStorage[Globals.USER_LOGGED]=null;
            delete $localStorage[Globals.USER_LOGGED];
            $localStorage['logged']=false;

        }
        this.doLogout = function() {
            destroyUserCredentials();
            return true;
        };

        this.isAuthenticated=function()
        {
            return isAuthenticated;
        };

        this.reInitPassword=function(email)
        {
          var deferred=$q.defer();
          var req={
            method:'POST',
            url:baseUrl+'/utilisateur/reInitPassword',
            data:{email:email}
          };
          $http(req).success(function(response){
            if(response)
            {
              deferred.resolve(response);
            }

          }).error(function(error){
            messageAuthErreur="Une erreur est survenue durant votre inscription";
            deferred.reject(error);
          });
          return deferred.promise;
        };

        this.editUtilisateur=function(utilisateur)
        {
            var deferred=$q.defer();
            var req={
                method:'POST',
                url:baseUrl+'/utilisateur/updateUtilisateurP',
                data:utilisateur
            };
            $http(req).success(function(response){
                if(response)
                {
                    $localStorage[Globals.LOCAL_TOKEN_KEY]=response.utilisateur.token;
                    $localStorage[Globals.USER_LOGGED]=response.utilisateur;
                    $localStorage['logged']=true;
                    deferred.resolve(response);
                }

            }).error(function(error){
                messageAuthErreur="Une erreur est survenue durant votre inscription";
                deferred.reject(error);
            });
            return deferred.promise;
        };

        this.storeAuthCode=function(token,userData)
        {
            var deferred=$q.defer();
            userData.token=token;
            var req={
                method:'POST',
                url:baseUrl+'/utilisateur/oauth',
                data:userData
            };
            $http(req).success(function(response){
                if(response)
                {
                    $localStorage[Globals.LOCAL_TOKEN_KEY]=response.data.token;
                    $localStorage[Globals.USER_LOGGED]=response.data;
                    $localStorage.logged=true;
                    storeUserCredentials(response);
                    deferred.resolve(response);
                }

            }).error(function(error){
                messageAuthErreur="Une erreur est survenue durant votre inscription";
                deferred.reject(error);
            });
            return deferred.promise;
        };

        this.getActiviteUser=function(idutilisateur)
        {
            var deferred=$q.defer();
            var req={
                method:'GET',
                url:baseUrl+'/utilisateur/getActiviteUser?idutilisateur='+idutilisateur
            };
            $http(req).success(function(response){
                if(response)
                {
                    deferred.resolve(response);
                }

            }).error(function(error){
                deferred.reject(error);
            });
            return deferred.promise;
        };
       this.changePassword=function(passwordData)
       {
         var req={
           method:'POST',
           url:baseUrl+'/utilisateur/changePassword',
           data:passwordData
         };
         var deferred=$q.defer();
         $http(req).success(function(response){
             if(response)
             {
               deferred.resolve(response);
             }
         }).error(function(error){
           messageAuthErreur="Une erreur est survenue durant le changement de votre mot de passe";
           deferred.reject(error);
         });
         return deferred.promise;
       };


    }).config(function($httpProvider,Globals){
        $httpProvider.interceptors.push(function($q, $location,$localStorage) {
            return {
                'request': function (config) {
                    config.headers = config.headers || {};
                    if ($localStorage[Globals.LOCAL_TOKEN_KEY]!='undefined' &&  $localStorage[Globals.LOCAL_TOKEN_KEY]!=null) {

                        config.headers.Authorization =$localStorage[Globals.LOCAL_TOKEN_KEY];
                        //config.headers['X-Auth-Token'] =$localStorage[Globals.LOCAL_TOKEN_KEY];
                    }
                    return config;
                },
                'responseError': function(response) {
                    if(response.status === 401 || response.status === 403) {
                        doLogout();
                        $location.path('/login');
                    }
                    return $q.reject(response);
                }
            };
        });
    });
