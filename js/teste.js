$(function(){
    //$('#valor').moeda();
    $('#valor').moeda({
        decimal: ',',
        milhar: '.',
        cifrao: 'R$'
    });
    $('#valor').val($.formatToMoeda('123456789.98', 'R$', ',', '.'));



    //Maskmoney
    $('#valor2').maskMoney();
    $('#valor2').val('123456.77');  //Não fomata valor recebido

});