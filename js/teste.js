$(function(){

    $('#valor').moeda({
        decimal: ',',
        milhar: '.',
        cifrao: 'R$'
    });
    $('#valor').val($.formatToMoeda('3545.45', 'R$', ',', '.'));

});