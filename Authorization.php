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

function generateAuthorizationKey($login, $password) {
    return $login . $password;
}


function checkCredentials($user) {
    return $user->login == "teste" && $user->password == "teste";
}
