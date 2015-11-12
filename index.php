<?php
require 'Slim/Slim.php';
\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

$app->get('/login', function () {
    echo "login";
});


$app->get('/main', function() {
    echo "main";
});

$app->run();

?>