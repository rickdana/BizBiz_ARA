/**
 * Created by fleundeu on 09/07/2015.
 */
angular.module('Occazstreet.services')
    .service('helper', function() {

        this.isNum=function(number)
        {
            var reg = /^\d+$/;
            return reg.test(number);

           /* alert("dans is Num"+number);
            alert(isNan(number));
            if(isNaN(number))
            {
                return false
            }
            else
            {
                return true;
            }*/
        };
        this.isValidIndice=function(indice)
        {
            var reg= /^\+[0-9]{1,3}$/;
            return reg.test(indice);

        };
        this.isEmpty=function(str)
        {
            if (!str || str.length === 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        this.isEmail=function(email)
        {
            var reg = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            return reg.test(email);
        }

    });
