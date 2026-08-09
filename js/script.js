// ================================
// ELEMENTOS DA PÁGINA
// ================================

const formulario = document.getElementById("form-financeiro");

const campoDescricao =
    document.getElementById("pesquisa-descricao");

const filtroTipo =
    document.getElementById("filtro-tipo");

const filtroData =
    document.getElementById("filtro-data");

const listaTransacoes =
    document.getElementById("lista-transacoes");

const cardReceitas =
    document.getElementById("receitas");

const cardDespesas =
    document.getElementById("despesas");

const cardSaldo =
    document.getElementById("saldo");

const contadorRegistros =
    document.getElementById("contador-registros");

const resumoReceitas =
    document.getElementById("resumo-receitas");

const resumoDespesas =
    document.getElementById("resumo-despesas");

const resumoSaldo =
    document.getElementById("resumo-saldo");

const botaoSubmit =
    document.getElementById("btn-submit");


// ================================
// DADOS
// ================================

let transacoes = carregarTransacoes();

let indiceEdicao = null;


// ================================
// FORMATAÇÃO DE VALORES
// ================================

function formatarMoeda(valor) {

    return Number(valor).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


// ================================
// FORMATAÇÃO DE DATA
// ================================

function formatarData(data) {

    if (!data) {
        return "-";
    }

    const partes = data.split("-");

    const ano = partes[0];
    const mes = partes[1];
    const dia = partes[2];

    return `${dia}/${mes}/${ano}`;
}


// ================================
// ÍCONE EDITAR
// ================================

const iconeEditar = `

<svg
    viewBox="0 0 24 24"
    fill="none"
>

    <path
        d="M4 20h4L19 9a2.1 2.1 0 0 0-4-4L4 16v4Z"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
    />

</svg>

`;


// ================================
// ÍCONE EXCLUIR
// ================================

const iconeExcluir = `

<svg
    viewBox="0 0 24 24"
    fill="none"
>

    <path
        d="M4 7h16"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
    />

    <path
        d="M9 7V4h6v3"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
    />

    <path
        d="M7 7l1 13h8l1-13"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
    />

    <path
        d="M10 11v5"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
    />

    <path
        d="M14 11v5"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
    />

</svg>

`;


// ================================
// EVENTOS
// ================================

formulario.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        adicionarTransacao();

    }
);


campoDescricao.addEventListener(
    "input",
    atualizarTabela
);


filtroTipo.addEventListener(
    "change",
    atualizarTabela
);


filtroData.addEventListener(
    "change",
    atualizarTabela
);


// ================================
// ADICIONAR TRANSAÇÃO
// ================================

function adicionarTransacao() {

    const descricao =
        document.getElementById("descricao")
            .value
            .trim();

    const valor =
        Number(
            document.getElementById("valor").value
        );

    const data =
        document.getElementById("data").value;

    const tipo =
        document.getElementById("tipo").value;


    // Verificação

    if (
        descricao === "" ||
        !valor ||
        valor <= 0 ||
        data === ""
    ) {

        alert(
            "Preencha todos os campos corretamente."
        );

        return;
    }


    const transacao = {

        descricao: descricao,

        valor: valor,

        data: data,

        tipo: tipo

    };


    // Se estiver editando

    if (indiceEdicao !== null) {

        transacoes[indiceEdicao] =
            transacao;

        indiceEdicao = null;


        botaoSubmit.querySelector(
            "span"
        ).textContent =
            "Adicionar movimentação";

    }

    // Caso seja uma nova movimentação

    else {

        transacoes.push(
            transacao
        );

    }


    // Salvar

    salvarTransacoes(
        transacoes
    );


    // Atualizar sistema

    atualizarTabela();

    atualizarResumo();

    criarGrafico();


    // Limpar formulário

    formulario.reset();

}


// ================================
// ATUALIZAR TABELA
// ================================

function atualizarTabela() {

    listaTransacoes.innerHTML = "";


    const pesquisa =
        campoDescricao.value
            .toLowerCase()
            .trim();


    const tipoSelecionado =
        filtroTipo.value;


    const dataSelecionada =
        filtroData.value;


    // Filtrar

    const filtradas =
        transacoes.filter(
            function (transacao) {

                const correspondeDescricao =
                    transacao.descricao
                        .toLowerCase()
                        .includes(pesquisa);


                const correspondeTipo =
                    tipoSelecionado === "todos" ||
                    transacao.tipo ===
                    tipoSelecionado;


                const correspondeData =
                    dataSelecionada === "" ||
                    transacao.data ===
                    dataSelecionada;


                return (
                    correspondeDescricao &&
                    correspondeTipo &&
                    correspondeData
                );

            }
        );


    // Nenhuma movimentação

    if (filtradas.length === 0) {

        listaTransacoes.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="empty-state"
                >

                    Nenhuma movimentação encontrada.

                </td>

            </tr>

        `;

    }


    // Mostrar movimentações

    else {

        filtradas.forEach(
            function (transacao) {

                const index =
                    transacoes.indexOf(
                        transacao
                    );


                const ehReceita =
                    transacao.tipo ===
                    "receita";


                listaTransacoes.innerHTML += `

                    <tr>

                        <td>
                            ${formatarData(
                                transacao.data
                            )}
                        </td>


                        <td>

                            <strong>
                                ${transacao.descricao}
                            </strong>

                        </td>


                        <td>

                            <span
                                class="
                                tipo-badge
                                ${
                                    ehReceita
                                        ? "tipo-receita"
                                        : "tipo-despesa"
                                }
                                "
                            >

                                ${
                                    ehReceita
                                        ? "↑ Receita"
                                        : "↓ Despesa"
                                }

                            </span>

                        </td>


                        <td
                            class="
                            ${
                                ehReceita
                                    ? "valor-receita"
                                    : "valor-despesa"
                            }
                            "
                        >

                            ${formatarMoeda(
                                transacao.valor
                            )}

                        </td>


                        <td>

                            <div class="acoes">


                                <button
                                    class="btn-editar"
                                    title="Editar"
                                    onclick="
                                        editarTransacao(
                                            ${index}
                                        )
                                    "
                                >

                                    ${iconeEditar}

                                </button>


                                <button
                                    class="btn-excluir"
                                    title="Excluir"
                                    onclick="
                                        excluirTransacao(
                                            ${index}
                                        )
                                    "
                                >

                                    ${iconeExcluir}

                                </button>


                            </div>

                        </td>

                    </tr>

                `;

            }
        );

    }


    // Contador

    if (filtradas.length === 0) {

        contadorRegistros.textContent =
            "Nenhuma movimentação encontrada";

    }

    else {

        contadorRegistros.textContent =

            `Mostrando ${filtradas.length}
            de ${transacoes.length}
            movimentação${
                transacoes.length === 1
                    ? ""
                    : "ões"
            }`;

    }

}


// ================================
// ATUALIZAR RESUMO
// ================================

function atualizarResumo() {

    let receitas = 0;

    let despesas = 0;


    transacoes.forEach(
        function (transacao) {

            if (
                transacao.tipo ===
                "receita"
            ) {

                receitas +=
                    Number(
                        transacao.valor
                    );

            }

            else {

                despesas +=
                    Number(
                        transacao.valor
                    );

            }

        }
    );


    const saldo =
        receitas - despesas;


    // Cards

    cardReceitas.textContent =
        formatarMoeda(
            receitas
        );


    cardDespesas.textContent =
        formatarMoeda(
            despesas
        );


    cardSaldo.textContent =
        formatarMoeda(
            saldo
        );


    // Resumo

    resumoReceitas.textContent =
        formatarMoeda(
            receitas
        );


    resumoDespesas.textContent =
        formatarMoeda(
            despesas
        );


    resumoSaldo.textContent =
        formatarMoeda(
            saldo
        );

}


// ================================
// EDITAR TRANSAÇÃO
// ================================

function editarTransacao(index) {

    const transacao =
        transacoes[index];


    indiceEdicao =
        index;


    document.getElementById(
        "descricao"
    ).value =
        transacao.descricao;


    document.getElementById(
        "valor"
    ).value =
        transacao.valor;


    document.getElementById(
        "data"
    ).value =
        transacao.data;


    document.getElementById(
        "tipo"
    ).value =
        transacao.tipo;


    // Alterar texto do botão

    botaoSubmit.querySelector(
        "span"
    ).textContent =
        "Salvar alteração";


    // Rolar até o formulário

    document
        .getElementById("formulario")
        .scrollIntoView({

            behavior: "smooth",

            block: "center"

        });

}


// ================================
// EXCLUIR TRANSAÇÃO
// ================================

function excluirTransacao(index) {

    const confirmar =
        confirm(
            "Deseja realmente excluir esta movimentação?"
        );


    if (!confirmar) {

        return;

    }


    transacoes.splice(
        index,
        1
    );


    salvarTransacoes(
        transacoes
    );


    atualizarTabela();

    atualizarResumo();

    criarGrafico();

}


// ================================
// INICIALIZAÇÃO
// ================================

atualizarTabela();

atualizarResumo();

criarGrafico();