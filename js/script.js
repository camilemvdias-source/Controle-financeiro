// Selecionando os elementos da página

const formulario = document.getElementById("form-financeiro");
const campoPesquisa = document.getElementById("pesquisa-descricao");
const filtroData = document.getElementById("filtro-data");
const filtroTipo = document.getElementById("filtro-tipo");
const listaTransacoes = document.getElementById("lista-transacoes");
const cardReceitas = document.getElementById("receitas");
const cardDespesas = document.getElementById("despesas");
const cardSaldo = document.getElementById("saldo");


// Vetor que armazenará as movimentações

let transacoes = carregarTransacoes();

let indiceEdicao = null;


// Evento de envio do formulário

formulario.addEventListener("submit", function (event) {

    event.preventDefault();

    adicionarTransacao();

});


// Evento de pesquisa

campoPesquisa.addEventListener("input", function () {

    atualizarTabela();

});

// Evento de filtro por data

filtroData.addEventListener("change", function () {

    atualizarTabela();

});

// Evento de filtro

filtroTipo.addEventListener("change", function () {

    atualizarTabela();

});


// Adicionar transação

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


    if (indiceEdicao !== null) {

        transacoes[indiceEdicao] = transacao;
        indiceEdicao = null;

    } else {

        transacoes.push(transacao);

    }


    salvarTransacoes(transacoes);

    atualizarTabela();

    atualizarResumo();

    criarGrafico();

    formulario.reset();

}



// Atualizar tabela

function atualizarTabela() {

    listaTransacoes.innerHTML = "";


    const pesquisa = campoPesquisa.value.toLowerCase();
    const tipoSelecionado = filtroTipo.value;
    const dataSelecionada = filtroData.value;


    transacoes.forEach(function(transacao, index) {


        if (!transacao.descricao.toLowerCase().includes(pesquisa)) {
            return;
        }


        if (tipoSelecionado !== "todos" && transacao.tipo !== tipoSelecionado) {
            return;
        }

        if (dataSelecionada !== "" && transacao.data !== dataSelecionada) {
    return;
}

        listaTransacoes.innerHTML += `

            <tr>

                <td>${transacao.data}</td>

                <td>${transacao.descricao}</td>

                <td>${transacao.tipo}</td>

                <td>R$ ${transacao.valor.toFixed(2)}</td>

                <td>

                    <button 
                        class="btn-editar"
                        onclick="editarTransacao(${index})">
                        Editar
                    </button>


                    <button 
                        class="btn-excluir"
                        onclick="excluirTransacao(${index})">
                        Excluir
                    </button>

                </td>

            </tr>

        `;


    });

}



// Atualizar cards

function atualizarResumo() {

    let receitas = 0;
    let despesas = 0;


    transacoes.forEach(function(transacao) {


        if (transacao.tipo === "receita") {

            receitas += transacao.valor;

        } else {

            despesas += transacao.valor;

        }


    });


    const saldo = receitas - despesas;


    cardReceitas.textContent = `R$ ${receitas.toFixed(2)}`;

    cardDespesas.textContent = `R$ ${despesas.toFixed(2)}`;

    cardSaldo.textContent = `R$ ${saldo.toFixed(2)}`;

}



// Carregar dados ao abrir página

atualizarTabela();

atualizarResumo();

criarGrafico();




// Editar transação

function editarTransacao(index) {


    const transacao = transacoes[index];


    indiceEdicao = index;


    document.getElementById("descricao").value = transacao.descricao;

    document.getElementById("valor").value = transacao.valor;

    document.getElementById("data").value = transacao.data;

    document.getElementById("tipo").value = transacao.tipo;


}




// Excluir transação

function excluirTransacao(index) {


    const confirmar = confirm("Deseja realmente excluir esta movimentação?");


    if (!confirmar) {

        return;

    }


    transacoes.splice(index, 1);


    salvarTransacoes(transacoes);


    atualizarTabela();

    atualizarResumo();

    criarGrafico();


}