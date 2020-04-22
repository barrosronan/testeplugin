(function($){
    'use strict';

    $.inArray = function(ch, arr){
        return arr.indexOf(ch) != -1;
    }

    $.formatToMoeda = function(valor, cifrao = '', decimal = '.', milhar = ''){
        var valor = valor.replace(/\D/g, '').substr(0, 18);
        var retorno = '';
        var pos = [6,10,14,18,22];
        for(var i = (valor.length -1); i >= 0; i--)
        {
            if(retorno.length == 2) retorno = decimal + retorno;
            if(retorno.length >= 6)
            {
                if($.inArray(retorno.length, pos))
                    retorno = milhar + retorno;
            }
            retorno = valor.charAt(i) + retorno;
        }
        return cifrao + (cifrao ? ' ' : '') + retorno;
    } 
    
    $.fn.moeda = function(prop = false){
        var config = $.extend({
            cifrao:  prop.cifrao ? prop.cifrao : '',
            decimal: prop.decimal ? prop.decimal : ',',
            milhar: prop.milhar ? prop.milhar : '.'
        });

        $(this).on('keyup', function(){
            //if(e.keyCode != 8)
                $(this).val($.formatToMoeda($(this).val(), config.cifrao, config.decimal, config.milhar));
        });
        return this;
    }

})(jQuery);
