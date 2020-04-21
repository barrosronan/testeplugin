<?php
    ob_start();
    session_start();
    require_once('config.php');

    $seo = new SEO($Url);   //Instancia e define o header (meta tags, title) e a página a ser exibida.

    require('inc/header.php');

    $seo->Show();   //Carrega a página selecionada.

    require_once('inc/footer.php');

    ob_end_flush();