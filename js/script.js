// Selecionando os elementos da página

const formulario = document.getElementById("form-financeiro");
const listaTransacoes = document.getElementById("lista-transacoes");
const cardReceitas = document.getElementById("receitas");
const cardDespesas = document.getElementById("despesas");
const cardSaldo = document.getElementById("saldo");

// Vetor que armazenará as movimentações

let transacoes = carregarTransacoes();

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

salvarTransacoes(transacoes);

atualizarTabela();

atualizarResumo();

formulario.reset();

}

function atualizarTabela() {

    listaTransacoes.innerHTML = "";

    transacoes.forEach(function(transacao){

        listaTransacoes.innerHTML += `
            <tr>

                <td>${transacao.data}</td>

                <td>${transacao.descricao}</td>

                <td>${transacao.tipo}</td>

                <td>R$ ${transacao.valor.toFixed(2)}</td>

                <td>
                    <button>Excluir</button>
                </td>

            </tr>
        `;

    });

}

function atualizarResumo() {

    let receitas = 0;
    let despesas = 0;

    transacoes.forEach(function(transacao){

        if(transacao.tipo === "receita"){
            receitas += transacao.valor;
        }else{
            despesas += transacao.valor;
        }

    });

    const saldo = receitas - despesas;

    cardReceitas.textContent = `R$ ${receitas.toFixed(2)}`;
    cardDespesas.textContent = `R$ ${despesas.toFixed(2)}`;
    cardSaldo.textContent = `R$ ${saldo.toFixed(2)}`;

}