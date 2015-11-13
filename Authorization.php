<?php

/*
 * Função que verifica a validade de chave de autorização
 */
function checkAuthorizationKey($key) {
    if($key == "testeteste") {
        return true;
    }
    
    return false;
}

/*
 * Função que gera chave de autorização
 */
function generateAuthorizationKey($login, $password) {
    return $login . $password;
}

/*
 * Função que verifica se usuário está cadastrado
 */
function checkCredentials($user) {
    return $user->login == "teste" && $user->password == "teste";
}
