$(function(){
    var $pesquisa = $('form[name="pesquisa"]');
    var $cadFunc = $('form[name="cadFuncionario"]');
    var $cadFilho = $('form[name="cadfilho"]');

function in_array(ch, arr)
{
    for(var i = 0; i < arr.length; i++)
        if(ch == arr[i]) return true;
    return false;
}

//Formata para moeda.
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

//Função que valida a data.
function validaData(data)
{
    var dt = data.split('/');
    var dia = dt[0];
    var mes = dt[1];
    var ano = dt[2];

    var diav = true;
    var mesv = true;
    var anov = true;
    
    now = new Date;

    if(ano >= 1900 && ano <= now.getFullYear())
    {
        var mes31 = ['01','03','05','07','08','10','12'];
        var mes30 = ['04','06','09','11'];

        if(in_array(mes, mes31))
        {
            if(dia < 1 || dia > 31)
                diav = false;
        }
        else if(in_array(mes, mes30))
        {
            if(dia < 1 || dia > 30)
                diav = false;
        }
        else if(mes == 2)
        {
            var fev;
            if((ano % 4 == 0 && ano % 100 != 0) || (ano % 400 == 0))
                fev = 29;
            else
                fev = 28;

            if(dia < 1 || dia > fev) diav = false;
        }
        else
            mesv = false;
    }
    else
    {
        anov = false;
    }

    if(!anov)
        return 'Ano válido somente entre 1900 à '+now.getFullYear()+'.';
    else if(!mesv)
        return 'Mês informado não existe no calendário.';
    else if(!diav)
        return 'Dia informado não existe no calendário.';
    else
        return '';
}

    $.ajaxSetup({
        url: '../_controller/Funcionario.php',
        type: 'POST'
    });

    $('#dataNascimentoFuncionario, #datanascimentofilho').datepicker({
        numberOfMonths: 1,
        minDate: new Date('1-1-1950'), 
        dateFormat: 'dd/mm/yy',
        monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
        monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
        changeYear: true,
        changeMonth: true
    });

    $('#dataNascimentoFuncionario, #datanascimentofilho').keyup(function(e){
        var num = $(this).val();
        if(e.keyCode != 8)
            if(num.length == 2 || num.length == 5) num += '/';
        $(this).val(num);
    });
 
    $("#salarioFuncionario").moeda({
        cifrao: 'R$',
        decimal: ',',
        milhar: '.'
    });
    
    // ************************ FUNCIONÁRIO **************************
    
    $('.novofuncionario').click(function(e){
        $('.modal-funcionario').fadeIn();
        $('.novofilho').attr('disabled','disabled').removeClass('bt-success');
        $cadFunc.attr('data-action','create');
        $cadFunc.fadeIn();
    });

    $('form[name="cadFuncionario"] .close').click(function(e){
        e.preventDefault();
        $('form[name="cadFuncionario"]').fadeOut();
        $('.modal-funcionario').fadeOut();
        $('form[name="cadFuncionario"] input,form[name="cadFuncionario"] textarea').val('');
        $('.tableFilho tbody').empty();
    });

    function busca(dados)
    {
        $.ajax({
            data: dados,
            beforeSend: function(){
                $('.tableFuncionario tbody').fadeTo('fast',0.3);
                $('.tableFuncionario + .loader').fadeIn();
            },
            success: function(resposta){
                $('.tableFuncionario tbody').empty().append(resposta);
            },
            complete: function(){
                $('.tableFuncionario tbody').fadeTo('fast',1);
                $('.tableFuncionario + .loader').fadeOut();
            }
        });
    }
    
    busca('acao=pesquisar&pesquisa='+$('input[name="pesquisa"]').val());

    $pesquisa.submit(function(e){
        e.preventDefault();
        var dados = 'acao=pesquisar&' + $(this).serialize();
        busca(dados);
    });

    $cadFunc.submit(function(e){
        e.preventDefault();
        var valida = 0;
        //*****
        if($('#nomeFuncionario').val() == '')
        {
            $('#nomeFuncionario + .alert').show();
            valida += 1;
        }
        else
            $('#nomeFuncionario + .alert').hide();

        //*****
        if($('#dataNascimentoFuncionario').val() == '' || $('#dataNascimentoFuncionario').val().length < 10)
        {
            $('#dataNascimentoFuncionario + .alert').html('Informe uma data de nascimento válida.').show();
            valida += 1;
        }
        else
        {
            var msg = validaData($('#dataNascimentoFuncionario').val());
            if(msg == '')
                $('#dataNascimentoFuncionario + .alert').html('').hide();
            else
            {
                $('#dataNascimentoFuncionario + .alert').html(msg).show();
                valida += 1;
            }
        }

        //*****
        if($('#salarioFuncionario').val() == '')
        {
            $('#salarioFuncionario + .alert').show();
            valida += 1;
        }
        else
            $('#salarioFuncionario + .alert').hide();

        //*****
        if($('#atividadesFuncionario').val() == '')
        {
            $('#atividadesFuncionario + .alert').show();
            valida += 1;
        }
        else
            $('#atividadesFuncionario + .alert').hide();
        //*****

        if(valida > 0) return false;

        var acao = $(this).attr('data-action');
        var dados = 'acao='+ acao +'&' + $(this).serialize();

        $.ajax({
            data: dados,
            success: function(resposta){
                if($.isNumeric(resposta) || resposta == true)
                {
                    $('#codfunc').val(resposta);
                    $('.msgcreate').removeAttr('message-danger').addClass('message-success');
                    resposta = 'Funcionário '+ (acao == 'create' ? 'inserido' : 'atualizado') +' com sucesso.';
                    $('.novofilho').removeAttr('disabled','disabled').addClass('bt-success');
                }
                else
                    $('.msgcreate').removeClass('message-success').addClass('message-danger');

                $('.msgcreate').empty().append("<p class='message'>"+ resposta +"</p>");
                $('.msgcreate' ).fadeIn().delay(3000).fadeOut();
                busca('acao=pesquisar&pesquisa='+$('input[name="pesquisa"]').val());
            }
        });
    });

    $('.tableFuncionario tbody').on('click','.delete',function(e){
        
        if(confirm("Deseja remover esse funcionário e todos os seus dependentes?"))
        {
            var cod = $(this).attr('data-id');
            $.ajax({
                data: "acao=delete&cod="+cod,
                success: function(resposta){
                    
                    if(resposta == 'ok')
                    {
                        $('.info-delete').removeClass('message-danger').addClass('message-success');
                        resposta = 'Funcionário e seus dependentes removido(s) com sucesso.'; 
                        busca('acao=pesquisar&pesquisa='+$('input[name="pesquisa"]').val());
                    }
                    else
                        $('.info-delete').removeClass('message-success').addClass('message-danger');

                    $('.info-delete').empty().append("<p class='message'>"+ resposta +"</p>");
                    $('.info-delete').fadeIn().delay(3000).fadeOut();
                }
            });
        }
    });
    
    $('.tableFuncionario tbody').on('click','.editar',function(e){
        var cod = $(this).attr('data-id');

        $.ajax({
            data: "acao=editar&cod="+cod,
            dataType: 'json',
            error: function(resposta){
                $('.msgcreate').removeClass('message-success').addClass('message-danger');
                $('.msgcreate').empty().append("<p class='message'>"+ resposta.responseText +"</p>");
                $('.msgcreate' ).fadeIn().delay(5000).fadeOut();
            },
            success: function(resposta){
               
                var dt = resposta.DataNascimento.split(' ');
                dt = dt[0].split('-');
                dt = dt[2]+'/'+dt[1]+'/'+dt[0];

                $('#nomeFuncionario').val(resposta.Nome);
                $('#dataNascimentoFuncionario').val(dt);
                $('#salarioFuncionario').val(formatToMoeda(resposta.Salario, 'R$', ',', '.'));
                $('#atividadesFuncionario').val(resposta.Atividades);
                $('#codfunc').val(resposta.CodFuncionario);
                $cadFunc.attr('data-action','update');
                buscaFilho(cod);
                $('.novofilho').removeAttr('disabled','disabled').addClass('bt-success');
            }
        });
        $('.modal-funcionario').fadeIn();
        $cadFunc.fadeIn();
    });

    // ************************ FILHO **************************

    $('.novofilho').click(function(e){
        $('form[name="cadfilho"]').attr('data-action','createfilho');
        $('.modalfilho').fadeIn();
        $('form[name="cadfilho"]').fadeIn();
    });
    
    $('form[name="cadfilho"] .close').click(function(e){
        $('form[name="cadfilho"]').fadeOut();
        $('.modalfilho').fadeOut();
        $('form[name="cadfilho"] input').val('');
    });

    function buscaFilho(codFunc)
    {
        $.ajax({
            data: 'acao=selfilhos&cod='+codFunc,
            beforeSend: function(){
                $('.tableFilho tbody').fadeTo('fast',0.3);
                $('.tableFilho + .loader').fadeIn();
            },
            success: function(resposta){
                $('.tableFilho tbody').empty().append(resposta);
            },
            complete: function(){
                $('.tableFilho tbody').fadeTo('fast',1);
                $('.tableFilho + .loader').fadeOut();
            }
        });
    }

    $cadFilho.submit(function(e){
        e.preventDefault();
        var valida = 0;

        //*****
        if($('#nomefilho').val() == '')
        {
            $('#nomefilho + .alert').show();
            valida += 1;
        }
        else
            $('#nomefilho + .alert').hide();

        //*****
        if($('#datanascimentofilho').val() == '' || $('#datanascimentofilho').val().length < 10)
        {
            $('#datanascimentofilho + .alert').html('Informe uma data de nascimento válida.').show();
            valida += 1;
        }
        else
        {
            var msg = validaData($('#datanascimentofilho').val());
            if(msg == '')
                $('#datanascimentofilho + .alert').html('').hide();
            else
            {
                $('#datanascimentofilho + .alert').html(msg).show();
                valida += 1;
            }
        }

        if(valida > 0) return false;

        var acao = $(this).attr('data-action');
        var dados = 'acao='+ acao +'&codfunc='+$('#codfunc').val()+'&'+ $(this).serialize();

        $.ajax({
            data: dados,
            success: function(resposta){
                if(resposta == 'ok')
                {
                    $('.msgcreate').removeClass('message-danger').addClass('message-success');
                    resposta = 'Filho '+ (acao == 'createfilho' ? 'inserido' : 'atualizado') +' com sucesso.';
                }
                else
                    $('.msgcreate').removeClass('message-success').addClass('message-danger');

                $('.msgcreate').empty().append("<p class='message'>"+ resposta +"</p>");
                $('.msgcreate' ).fadeIn().delay(3000).fadeOut();
                buscaFilho($('#codfunc').val());
                $('form[name="cadfilho"]').fadeOut();
                $('.modalfilho').fadeOut();
                $('form[name="cadfilho"] input').val('');
                busca('acao=pesquisar&pesquisa='+$('input[name="pesquisa"]').val());
            }
        });
    });


    $('.tableFilho tbody').on('click','.editarfilho',function(e){
        var cod = $(this).attr('data-id');

        $.ajax({
            data: "acao=editarfilho&cod="+cod,
            dataType: 'json',
            error: function(resposta){
                $('.info-filho').addClass('message-danger');
                $('.info-filho').empty().append("<p class='message'>"+ resposta.responseText +"</p>");
                $('.info-filho' ).fadeIn().delay(5000).fadeOut();
            },
            success: function(resposta){
                var dt = resposta.DataDeNascimento.split(' ');
                dt = dt[0].split('-');
                dt = dt[2]+'/'+dt[1]+'/'+dt[0];

                $('#nomefilho').val(resposta.Nome);
                $('#datanascimentofilho').val(dt);
                $('#codfilho').val(resposta.CodFuncionarioFilho);
                $cadFilho.attr('data-action','updatefilho');
            }
        });
        $('.modalfilho').fadeIn();
        $cadFilho.fadeIn();
    });

    $('.tableFilho tbody').on('click','.excluirfilho',function(e){
        e.preventDefault();

        if(confirm("Deseja remover esse registro?"))
        {
            var cod = $(this).attr('data-id');
            $.ajax({
                data: "acao=deletefilho&cod="+cod,
                success: function(resposta){
                    
                    if(resposta == 'ok')
                    {
                        $('.msgcreate').addClass('message-success');
                        resposta = 'Filho removido com sucesso.'; 
                        buscaFilho($('#codfunc').val());
                        busca('acao=pesquisar&pesquisa='+$('input[name="pesquisa"]').val());
                    }
                    else
                        $('.msgcreate').addClass('message-danger');

                    $('.msgcreate').empty().append("<p class='message'>"+ resposta +"</p>");
                    $('.msgcreate').fadeIn().delay(3000).fadeOut();
                }
            });
        }
    });
});