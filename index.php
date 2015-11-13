<?php
require 'Authorization.php';
require 'Slim/Slim.php';
\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

/*
 * Rota para tratar requisições de login
 */
$app->post('/login', function () {

    // recupera o body com os dados do login
    $user = json_decode(\Slim\Slim::getInstance()->request->getBody());
    
    // verifica se usuário existe no banco de dados
    if (checkCredentials($user)) {
        //cria e define a chave de autorização se existir
        $authorizationKey = generateAuthorizationKey($user->login, $user->password);
        \Slim\Slim::getInstance()->response->headers->set('Authorization', $authorizationKey);
        echo '{ "message": "success" }';
    } else {
        // retorna mensagem de erro caso usuário não exista
        \Slim\Slim::getInstance()->response->setStatus(401);
        echo '{ "message": "invalid credentials", "login": "'.$user->login.'", "password": "'.$user->password.'" }';
    }      
});


/*
 * Rota que exige autenticação do usuário para acessar
 */
$app->post('/main', function() {
    // recupera a chave de autorização
    $authorization = \Slim\Slim::getInstance()->request->headers->get("Authorization");
    
    // verifica se a chave é valida
    if (checkAuthorizationKey($authorization)) {
        $user = json_decode(\Slim\Slim::getInstance()->request->getBody());
        echo json_encode($user);
    } else {
        // se inválida, retorna mensagem de erro
        \Slim\Slim::getInstance()->response->setStatus(401);
        echo '{ "message" : "Nao autorizado" }';
    }
    
});

$app->run();

?>