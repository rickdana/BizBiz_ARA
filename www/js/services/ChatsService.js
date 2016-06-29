/**
 * Created by fleundeu on 09/07/2015.
 */
'use strict';
angular.module('Occazstreet.services')
    .service('ChatsService', function($q,$http,Globals) {
        var url=Globals.urlServer+Globals.port;
        this.getConversationByUser=function(iduser)
        {
            var deferred=$q.defer();
            $http.get(url+'/conversation/getConversationByUser?iduser='+iduser).success(function(response){
                if(response)
                {
                    deferred.resolve(response);
                }
            });
            return deferred.promise;
        },

        this.getConversationById=function(idconversation)
        {
            var deferred=$q.defer();
            $http.get(url+'/conversation/getConversationById?idconversation='+idconversation).success(function(response){
                if(response)
                {
                    deferred.resolve(response);
                }
            });
            return deferred.promise;
        },

        this.createConversation=function(conversation)
        {
            var deferred=$q.defer();

            var req={
                method:'POST',
                url:url+'/conversation/addConversation',
                data:conversation
            };
            $http(req).success(function(response){
                if(response.success){
                    deferred.resolve(response);
                }else
                {
                    deferred.reject(response);
                }
            }).error(function(error){
                console.log("Une erreur est survenue lors de la création de la conversation");
                deferred.reject(error)
            })
            return deferred.promise;

        },
        this.getMessagesByConversation=function(conversation){
            var deferred=$q.defer();
            $http.get(url+'/conversation/getMessagesByConversation?idconversation='+conversation).success(function(response){
                if(response)
                {
                    deferred.resolve(response);
                }
            });
            return deferred.promise;
        },

        this.deleteConversation=function(conversation,iduser){
            var deferred=$q.defer();
            $http.get(url+'/conversation/deleteConversation?idconversation='+conversation+'&iduser='+iduser).success(function(response){
                if(response)
                {
                    deferred.resolve(response);
                }
            });
        },


        this.sendMessage=function(messasge)
        {
            var deferred=$q.defer();
            var req={
                method:'POST',
                url:url+'/message/addMessage',
                data:message
            };

            $http(req).success(function(response){
                if(response.success){
                    deferred.resolve(response);
                }else
                {
                    deferred.reject(response);
                }
            }).error(function(error){
                console.log("Une erreur est survenue lors de l'envoi du messsage");
                deferred.reject(error)
            })
            return deferred.promise;
        }
    });
