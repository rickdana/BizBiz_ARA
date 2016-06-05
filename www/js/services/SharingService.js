/**
 * Created by fleundeu on 18/03/2016.
 */
angular.module('Occazstreet.services')
  .service('SharingService', function($cordovaSocialSharing) {


    this.shareTwitter=function(message,image,link)
    {
      $cordovaSocialSharing
       .shareViaTwitter(message, image, link)
       .then(function(result) {
       // Success!
       }, function(err) {
        console.log("une erreur est survenue lors de l'authentification Twitter  " +err)
       });

    };

    this.shareMail=function(messageMail,subjectMail,to,bcc,info,image)
    {
      $cordovaSocialSharing
        .shareViaEmail(messageMail, subjectMail,to,null,null,image)
        .then(function(result) {
          // Success!
        }, function(err) {
          // An error occurred. Show a message to the user
        });
    };

    this.shareWhatsapp=function(message,image,link)
    {
      $cordovaSocialSharing
        .shareViaWhatsApp(message, image, link,null)
        .then(function(result) {
          // Success!
        }, function(err) {
          // An error occurred. Show a message to the user
        });

    };

    this.shareFacebook=function(message,image,link)
    {
      $cordovaSocialSharing
        .shareViaFacebook(message , image, link)
        .then(function(result) {
          // Success!
        }, function(err) {
        });
    };

    this.shareSMS=function(message,number)
    {
      $cordovaSocialSharing
        .shareViaSMS(message, number)
        .then(function(result) {
          // Success!
        }, function(err) {
          // An error occurred. Show a message to the user
        });

    };
  });
