<?php
require 'Authorization.php';
require 'Slim/Slim.php';
\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

$app->post('/login', function () {
    $user = json_decode(\Slim\Slim::getInstance()->request->getBody());
    
    if (checkCredentials($user)) {
        $authorizationKey = generateAuthorizationKey($user->login, $user->password);
        \Slim\Slim::getInstance()->response->headers->set('Authorization', $authorizationKey);
        echo '{ "message": "success" }';
    } else {
        \Slim\Slim::getInstance()->response->setStatus(401);
        echo '{ "message": "invalid credentials", "login": "'.$user->login.'", "password": "'.$user->password.'" }';
    }      
});


$app->post('/main', function() {
    $authorization = \Slim\Slim::getInstance()->request->headers->get("Authorization");
    
    if (checkAuthorizationKey($authorization)) {
        $user = json_decode(\Slim\Slim::getInstance()->request->getBody());
        echo json_encode($user);
    } else {
        \Slim\Slim::getInstance()->response->setStatus(401);
        echo '{ "message" : "Nao autorizado" }';
    }
    
});

$app->run();

?>