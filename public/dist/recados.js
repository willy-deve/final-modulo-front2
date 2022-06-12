"use strict";
validarUsuarioLogado();
let espacoAlerta = document.getElementById('espaco-alerta');
let corpoAlerta = document.createElement('div');
function mostrarAlerta(mensage, type) {
    corpoAlerta.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fs-5 text-center" role="alert">
    <div>${mensage}</div>
    </div>
    `;
    espacoAlerta.appendChild(corpoAlerta);
    setTimeout(() => {
        corpoAlerta.innerHTML = '';
    }, 3000);
}
;
let modalCriar = new bootstrap.Modal('#modal-criar');
let codigoRecado = document.querySelector('#input-criar-codigo');
let descricaoRecado = document.querySelector('#input-criar-descricao');
let detalhamentoRecado = document.querySelector('#input-criar-detalhamento');
let botaoCriar = document.querySelector('#botao-criar');
let espacoCard = document.querySelector('#espaco-card');
let btnAtualizar = document.getElementById('botao-atualizar');
let modalEditar = new bootstrap.Modal('#modal-editar');
let inputEditDescricao = document.getElementById('input-editar-descricao');
let inputEditDetalhamento = document.getElementById('input-editar-detalhamento');
let botaoSair = document.getElementById('sair');
let usuarioLogado;
document.addEventListener('DOMContentLoaded', () => {
    if (!validarUsuarioLogado()) {
        alert("Você precisa estar logado para acessar ao recursos dssa página !");
        window.location.href = 'index.html';
        return;
    }
    else {
        usuarioLogado = sessionStorage.getItem('usuarioLogado');
    }
});
document.addEventListener('DOMContentLoaded', carregarRecados);
botaoCriar.addEventListener('click', criarRecado);
function criarRecado() {
    let listaRecados = pegarNoStorage();
    if (codigoRecado.value === '' || descricaoRecado.value === '' || detalhamentoRecado.value === '') {
        codigoRecado.setAttribute('style', 'border: 1px solid red; box-shadow: none');
        descricaoRecado.setAttribute('style', 'border: 1px solid red; box-shadow: none');
        detalhamentoRecado.setAttribute('style', 'border: 1px solid red; box-shadow: none');
        codigoRecado.focus();
        return;
    }
    let existeCodigo = listaRecados.some((recado) => recado.codigo === codigoRecado.value);
    if (existeCodigo) {
        alert("Já existe um card com esse codigo !");
        codigoRecado.setAttribute('style', 'border: 1px solid red; box-shadow: none');
        codigoRecado.value = '';
        codigoRecado.focus();
        return;
    }
    let novoRecado = {
        codigo: codigoRecado.value,
        detalhamento: detalhamentoRecado.value,
        descricao: descricaoRecado.value
    };
    listaRecados.push(novoRecado);
    modalCriar.hide();
    criarCard(novoRecado);
    salvarListaNoStorage(listaRecados);
    mostrarAlerta('Recado adicionado com sucesso !', 'success');
    codigoRecado.value = '';
    codigoRecado.removeAttribute('style');
    detalhamentoRecado.value = '';
    descricaoRecado.value = '';
}
function criarCard(novoRecado) {
    let cardConainer = document.createElement('div');
    cardConainer.setAttribute('class', 'card me-3 my-3 text-center');
    cardConainer.setAttribute('style', 'width: 18rem');
    cardConainer.setAttribute('id', novoRecado.codigo);
    let cardBody = document.createElement('div');
    cardBody.setAttribute('class', 'card-body d-flex flex-column justify-content-between');
    let codigoCard = document.createElement('h4');
    codigoCard.setAttribute('class', 'card-title');
    codigoCard.innerText = `# ${novoRecado.codigo}`;
    let descricaoCard = document.createElement('h5');
    descricaoCard.setAttribute('class', 'card-title');
    descricaoCard.innerHTML = novoRecado.descricao;
    let detalhamentoCard = document.createElement('p');
    detalhamentoCard.setAttribute('class', 'card-text');
    detalhamentoCard.innerHTML = novoRecado.detalhamento;
    let containerButtons = document.createElement('div');
    containerButtons.setAttribute('class', 'container mt-5');
    let botaoApagar = document.createElement('button');
    botaoApagar.setAttribute('class', 'btn btn-danger fs-5 mx-2');
    botaoApagar.addEventListener('click', () => {
        apagarRecado(novoRecado.codigo);
    });
    botaoApagar.innerHTML = `
                             <i class="bi bi-trash"></i>
                            `;
    let botaoEditar = document.createElement('button');
    botaoEditar.setAttribute('class', 'btn btn-success fs-5');
    botaoEditar.setAttribute('data-bs-toggle', 'modal');
    botaoEditar.setAttribute('data-bs-target', '#modal-editar');
    botaoEditar.addEventListener('click', () => {
        editarRecado(novoRecado);
    });
    botaoEditar.innerHTML = `
                            <i class="bi bi-pencil-square"></i>
                            `;
    containerButtons.appendChild(botaoApagar);
    containerButtons.appendChild(botaoEditar);
    cardBody.appendChild(codigoCard);
    cardBody.appendChild(descricaoCard);
    cardBody.appendChild(detalhamentoCard);
    cardBody.appendChild(containerButtons);
    cardConainer.appendChild(cardBody);
    espacoCard.appendChild(cardConainer);
}
function apagarRecado(codigo) {
    let listaRecados = pegarNoStorage();
    let indiceRecado = listaRecados.findIndex((recado) => recado.codigo == codigo);
    let confirma = window.confirm(`Tem certeza que deseja remover o recado ${codigo} ?`);
    if (confirma) {
        let cards = document.querySelectorAll('.card');
        for (const card of cards) {
            if (card.id == codigo) {
                espacoCard.removeChild(card);
                listaRecados.splice(indiceRecado, 1);
            }
        }
        salvarListaNoStorage(listaRecados);
    }
}
function editarRecado(recado) {
    btnAtualizar.setAttribute('onclick', `atualizarRecado(${recado.codigo})`);
    inputEditDescricao.value = recado.descricao;
    inputEditDetalhamento.value = recado.detalhamento;
}
function atualizarRecado(codigo) {
    let recadoEdit = {
        codigo: codigo,
        descricao: inputEditDescricao.value,
        detalhamento: inputEditDetalhamento.value
    };
    let listaRecados = pegarNoStorage();
    let indiceRecados = listaRecados.findIndex((recadoList) => recadoList.codigo == codigo);
    listaRecados[indiceRecados] = recadoEdit;
    let cards = document.querySelectorAll('.card');
    for (let card of cards) {
        if (card.id == codigo) {
            let codigoRegistro = card.children[0].childNodes[0];
            let descricaoRegistro = card.children[0].childNodes[1];
            let detalhamentoRegistro = card.children[0].childNodes[2];
            codigoRegistro.innerHTML = `# ${codigo}`;
            descricaoRegistro.innerHTML = recadoEdit.descricao;
            detalhamentoRegistro.innerHTML = recadoEdit.detalhamento;
        }
    }
    salvarListaNoStorage(listaRecados);
    mostrarAlerta('Recado Atualizado', 'success');
    modalEditar.hide();
}
function salvarListaNoStorage(recados) {
    let listaUsuarios = JSON.parse(localStorage.getItem('usuarios'));
    let indiceUsuarioLogado = listaUsuarios.findIndex((usuario) => {
        return usuario.login === usuarioLogado;
    });
    listaUsuarios[indiceUsuarioLogado].recados = recados;
    localStorage.setItem('usuarios', JSON.stringify(listaUsuarios));
}
function carregarRecados() {
    console.log(usuarioLogado);
    let recados = pegarNoStorage();
    for (let recado of recados) {
        criarCard(recado);
    }
}
function pegarNoStorage() {
    let listaUsuarios = JSON.parse(localStorage.getItem('usuarios'));
    let dadosUsuarioLogado = listaUsuarios.find((usuario) => {
        return usuario.login === usuarioLogado;
    });
    return dadosUsuarioLogado.recados;
}
botaoSair.addEventListener('click', () => {
    sessionStorage.removeItem('usuarioLogado');
    window.location.href = 'index.html';
});
function validarUsuarioLogado() {
    let usuarioLogado = sessionStorage.getItem('usuarioLogado');
    if (!usuarioLogado) {
        return false;
    }
    else {
        return true;
    }
}
