"use strict";
let btnAcessar = document.getElementById('btn-acessar');
let btnCadastrar = document.getElementById('btn-cadastrar');
let container = document.getElementById('container');
btnAcessar.addEventListener('click', () => {
    container.classList.remove('painel-direito-ativo');
});
btnCadastrar.addEventListener('click', () => {
    container.classList.add('painel-direito-ativo');
});
// CADASTRO DE UM USUARIO
let formularioCadastro = document.querySelector('#formulario-cadastro');
let inputCadastroNome = document.querySelector('#input-cadastro-nome');
let inputCadastroEmail = document.querySelector('#input-cadastro-email');
let inputCadastroSenha = document.querySelector('#input-cadastro-senha');
let erro = document.querySelector('#erro');
let erroLogin = document.querySelector('#erroLogin');
let sucesso = document.querySelector('#sucesso');
formularioCadastro.addEventListener('submit', (evento) => {
    evento.preventDefault();
    verificaCamposCadastro();
});
function verificaCamposCadastro() {
    if (inputCadastroNome.value === '') {
        inputCadastroNome.focus();
        inputCadastroNome.setAttribute('style', 'outline-color: red');
        erro.setAttribute('style', 'display: block; font-size: 14px');
        erro.innerHTML = 'Verifique os campos de cadastro !';
        return;
    }
    if (inputCadastroEmail.value === '') {
        inputCadastroEmail.focus();
        inputCadastroEmail.setAttribute('style', 'outline-color: red');
        erro.setAttribute('style', 'display: block; font-size: 14px');
        erro.innerHTML = 'Verifique os campos de cadastro !';
        return;
    }
    if (inputCadastroSenha.value === '' || inputCadastroSenha.value.length < 6) {
        inputCadastroSenha.focus();
        inputCadastroSenha.setAttribute('style', 'outline-color: red');
        erro.setAttribute('style', 'display: block; font-size: 14px');
        erro.innerHTML = 'A senha precisa ser mais que 6 caracteres';
        return;
    }
    let novoUsuario = {
        nome: inputCadastroNome.value,
        login: inputCadastroEmail.value,
        senha: inputCadastroSenha.value,
        recados: []
    };
    inputCadastroNome.removeAttribute('style');
    inputCadastroEmail.removeAttribute('style');
    inputCadastroSenha.removeAttribute('style');
    cadastrarUsuario(novoUsuario);
    formularioCadastro.reset();
}
function cadastrarUsuario(novoUsuario) {
    let listaUsuarios = buscarUsuariosNoStorage();
    let existe = listaUsuarios.some((usuario) => {
        return usuario.login === novoUsuario.login;
    });
    if (existe) {
        let confirma = confirm("Este e-mail já está cadastrado. Deseja ir para a página de login?");
        if (confirma) {
            container.classList.remove('painel-direito-ativo');
            formularioCadastro.reset();
        }
        return;
    }
    listaUsuarios.push(novoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(listaUsuarios));
    erroLogin.removeAttribute('style');
    sucesso.setAttribute('style', 'display: block; font-seize: 13px');
    sucesso.innerHTML = 'Cadastrando usuario...';
    setTimeout(() => {
        container.classList.remove('painel-direito-ativo');
        sucesso.removeAttribute('style');
        formularioCadastro.reset();
    }, 3000);
}
function buscarUsuariosNoStorage() {
    return JSON.parse(localStorage.getItem('usuarios') || '[]');
}
// LOGAR O USUARIO NA APLICAÇÃO 
let formularioLogin = document.querySelector('#formulario-login');
let inputLoginEmail = document.querySelector('#input-login-email');
let inputLoginSenha = document.querySelector('#input-login-senha');
formularioLogin.addEventListener('submit', (evento) => {
    evento.preventDefault();
    validarCamposLogin();
});
function validarCamposLogin() {
    if (inputLoginEmail.value === '') {
        inputLoginEmail.focus();
        inputLoginEmail.setAttribute('style', 'outline-color: red');
        erroLogin.setAttribute('style', 'display: block; font-size 14px');
        erroLogin.innerHTML = 'Dados incorretos !';
        return;
    }
    if (inputLoginSenha.value === '') {
        inputLoginSenha.focus();
        inputLoginSenha.setAttribute('style', 'outline-color: red');
        erroLogin.setAttribute('style', 'display: block; font-size 14px');
        erroLogin.innerHTML = 'Dados incorretos !';
        return;
    }
    inputLoginEmail.removeAttribute('style');
    inputCadastroSenha.removeAttribute('style');
    erroLogin.removeAttribute('style');
    let usuarioLogando = {
        login: inputLoginEmail.value,
        senha: inputLoginSenha.value
    };
    logarNoSistema(usuarioLogando);
}
function logarNoSistema(usuarioLogando) {
    let listaUsuarios = buscarUsuariosNoStorage();
    let indiceUsuarioEncontado = listaUsuarios.findIndex((usuario) => {
        if (usuario.login === usuarioLogando.login && usuario.senha === usuarioLogando.senha) {
            return usuario;
        }
    });
    if (indiceUsuarioEncontado !== -1) {
        //chave do usuario logado na aplicação
        sessionStorage.setItem('usuarioLogado', usuarioLogando.login);
        window.location.href = 'recados.html';
    }
    else {
        erroLogin.setAttribute('style', 'display: block; font-size 14px');
        erroLogin.innerHTML = 'Dados incorretos !';
    }
}
