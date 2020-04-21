$(function(){
    function formatToMoeda(valor, cifrao, decimal, milhar){
        var valor = valor.replace(/\D/g, '');
        var valFormat = [];
        var retorno = '';
        for(var i = (valor.length -1); i >= 0; i--)
        {
            if(valFormat.length == 2) valFormat.push(decimal);
            if(valFormat.length == 6 || valFormat.length == 10 || 
                valFormat.length == 14 || valFormat.length == 18 
                || valFormat.length == 22) valFormat.push(milhar);
            valFormat.push(valor.charAt(i));
        }
    
        for(var i = (valFormat.length -1); i >= 0; i--)
            retorno += valFormat[i];
    
        return cifrao + (cifrao ? ' ' : '') + retorno;
    } 

    (function($){
        
        $.fn.moeda = function(prop){
            var config = $.extend({
                cifrao:  prop.cifrao ? prop.cifrao : '',
                decimal: prop.decimal ? prop.decimal : '.',
                milhar: prop.milhar ? prop.milhar : ','
            });
        
            $(this).on('keyup', function(){
                $(this).val(formatToMoeda($(this).val(), config.cifrao, config.decimal, config.milhar));
            });
            return this;
        }

    })(jQuery);
});