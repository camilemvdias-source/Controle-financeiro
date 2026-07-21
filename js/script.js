// Selecionando os elementos da página

const formulario = document.getElementById("form-financeiro");
const listaTransacoes = document.getElementById("lista-transacoes");

// Vetor que armazenará as movimentações

let transacoes = [];

// Evento de envio do formulário

formulario.addEventListener("submit", function (event) {

    event.preventDefault();

    adicionarTransacao();

});

function adicionarTransacao() {

    const descricao = document.getElementById("descricao").value;

    const valor = Number(document.getElementById("valor").value);

    const data = document.getElementById("data").value;

    const tipo = document.getElementById("tipo").value;

    const transacao = {
        descricao,
        valor,
        data,
        tipo
    };

    transacoes.push(transacao);

    console.log(transacoes);

}