// ======================================================
// CONTROLE FINANCEIRO
// Projeto com foco em JavaScript
// ======================================================


// ======================================================
// 1. DADOS DA APLICAÇÃO
// ======================================================

// O storage.js já possui:
// carregarTransacoes()
// salvarTransacoes()

let transacoes = carregarTransacoes();

let idEmEdicao = null;


// ======================================================
// 2. ELEMENTOS DO HTML
// ======================================================

const formulario =
    document.getElementById("form-financeiro");

const descricaoInput =
    document.getElementById("descricao");

const valorInput =
    document.getElementById("valor");

const dataInput =
    document.getElementById("data");

const tipoInput =
    document.getElementById("tipo");

const listaTransacoes =
    document.getElementById("lista-transacoes");

const pesquisaInput =
    document.getElementById("pesquisa-descricao");

const filtroTipo =
    document.getElementById("filtro-tipo");

const filtroData =
    document.getElementById("filtro-data");

const receitasElement =
    document.getElementById("receitas");

const despesasElement =
    document.getElementById("despesas");

const saldoElement =
    document.getElementById("saldo");

const resumoReceitas =
    document.getElementById("resumo-receitas");

const resumoDespesas =
    document.getElementById("resumo-despesas");

const resumoSaldo =
    document.getElementById("resumo-saldo");

const contadorRegistros =
    document.getElementById("contador-registros");

const botaoSubmit =
    document.getElementById("btn-submit");


// ======================================================
// 3. EVENTOS
// ======================================================

formulario.addEventListener(
    "submit",
    adicionarTransacao
);

pesquisaInput.addEventListener(
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


// ======================================================
// 4. ADICIONAR / EDITAR TRANSAÇÃO
// ======================================================

function adicionarTransacao(event) {

    event.preventDefault();


    // Captura os valores do formulário

    const descricao =
        descricaoInput.value.trim();

    const valor =
        Number(valorInput.value);

    const data =
        dataInput.value;

    const tipo =
        tipoInput.value;


    // ==================================================
    // VALIDAÇÃO
    // ==================================================

    if (descricao === "") {

        mostrarMensagem(
            "Digite uma descrição."
        );

        descricaoInput.focus();

        return;
    }


    if (isNaN(valor) || valor <= 0) {

        mostrarMensagem(
            "Digite um valor válido."
        );

        valorInput.focus();

        return;
    }


    if (data === "") {

        mostrarMensagem(
            "Selecione uma data."
        );

        dataInput.focus();

        return;
    }


    // ==================================================
    // CRIA O OBJETO
    // ==================================================

    const novaTransacao = {

        id:
            idEmEdicao !== null
                ? idEmEdicao
                : Date.now(),

        descricao: descricao,

        valor: valor,

        data: data,

        tipo: tipo

    };


    // ==================================================
    // EDIÇÃO
    // ==================================================

    if (idEmEdicao !== null) {

        transacoes =
            transacoes.map(
                function (transacao) {

                    if (
                        transacao.id ===
                        idEmEdicao
                    ) {

                        return novaTransacao;

                    }

                    return transacao;

                }
            );


        mostrarMensagem(
            "Movimentação atualizada!"
        );

    }

    // ==================================================
    // NOVA TRANSAÇÃO
    // ==================================================

    else {

        transacoes.push(
            novaTransacao
        );


        mostrarMensagem(
            "Movimentação adicionada!"
        );

    }


    // ==================================================
    // SALVAR NO LOCALSTORAGE
    // ==================================================

    salvarTransacoes(
        transacoes
    );


    // Sai do modo edição

    idEmEdicao = null;


    // Volta o botão ao normal

    alterarBotao(
        "Adicionar movimentação"
    );


    // Limpa o formulário

    formulario.reset();


    // Atualiza tudo

    atualizarAplicacao();

}


// ======================================================
// 5. FILTRAR TRANSAÇÕES
// ======================================================

function obterTransacoesFiltradas() {

    const pesquisa =
        pesquisaInput.value
            .toLowerCase()
            .trim();


    const tipoSelecionado =
        filtroTipo.value;


    const dataSelecionada =
        filtroData.value;


    return transacoes.filter(
        function (transacao) {

            // Pesquisa pela descrição

            const correspondePesquisa =
                transacao.descricao
                    .toLowerCase()
                    .includes(pesquisa);


            // Filtro por tipo

            const correspondeTipo =
                tipoSelecionado === "todos" ||
                transacao.tipo ===
                tipoSelecionado;


            // Filtro por data

            const correspondeData =
                dataSelecionada === "" ||
                transacao.data ===
                dataSelecionada;


            return (
                correspondePesquisa &&
                correspondeTipo &&
                correspondeData
            );

        }
    );

}


// ======================================================
// 6. ATUALIZAR TABELA
// ======================================================

function atualizarTabela() {

    listaTransacoes.innerHTML = "";


    const transacoesFiltradas =
        obterTransacoesFiltradas();


    // ==================================================
    // NENHUM RESULTADO
    // ==================================================

    if (
        transacoesFiltradas.length === 0
    ) {

        listaTransacoes.innerHTML = `

            <tr>

                <td
                    colspan="5"
                >

                    Nenhuma movimentação encontrada.

                </td>

            </tr>

        `;


        atualizarContador(0);

        return;
    }


    // ==================================================
    // CRIAR LINHAS
    // ==================================================

    transacoesFiltradas.forEach(
        function (transacao) {

            const linha =
                document.createElement("tr");


            // Data

            const dataFormatada =
                formatarData(
                    transacao.data
                );


            // Valor

            const valorFormatado =
                formatarMoeda(
                    transacao.valor
                );


            // Tipo

            const tipoTexto =
                transacao.tipo === "receita"
                    ? "Receita"
                    : "Despesa";


            const classeTipo =
                transacao.tipo === "receita"
                    ? "tipo-receita"
                    : "tipo-despesa";


            const classeValor =
                transacao.tipo === "receita"
                    ? "valor-receita"
                    : "valor-despesa";


            // ==================================================
            // HTML DA LINHA
            // ==================================================

            linha.innerHTML = `

                <td>
                    ${dataFormatada}
                </td>

                <td>
                    ${transacao.descricao}
                </td>

                <td>

                    <span
                        class="tipo-badge ${classeTipo}"
                    >

                        ${tipoTexto}

                    </span>

                </td>

                <td
                    class="${classeValor}"
                >

                    ${valorFormatado}

                </td>

                <td>

                    <div class="acoes">

                        <button
                            type="button"
                            class="btn-editar"
                        >

                            Editar

                        </button>


                        <button
                            type="button"
                            class="btn-excluir"
                        >

                            Excluir

                        </button>

                    </div>

                </td>

            `;


            // ==================================================
            // BOTÃO EDITAR
            // ==================================================

            const botaoEditar =
                linha.querySelector(
                    ".btn-editar"
                );


            botaoEditar.addEventListener(
                "click",
                function () {

                    editarTransacao(
                        transacao.id
                    );

                }
            );


            // ==================================================
            // BOTÃO EXCLUIR
            // ==================================================

            const botaoExcluir =
                linha.querySelector(
                    ".btn-excluir"
                );


            botaoExcluir.addEventListener(
                "click",
                function () {

                    excluirTransacao(
                        transacao.id
                    );

                }
            );


            // Adiciona a linha na tabela

            listaTransacoes.appendChild(
                linha
            );

        }
    );


    atualizarContador(
        transacoesFiltradas.length
    );

}


// ======================================================
// 7. EDITAR TRANSAÇÃO
// ======================================================

function editarTransacao(id) {

    const transacao =
        transacoes.find(
            function (item) {

                return item.id === id;

            }
        );


    if (!transacao) {

        return;

    }


    // Preenche o formulário

    descricaoInput.value =
        transacao.descricao;


    valorInput.value =
        transacao.valor;


    dataInput.value =
        transacao.data;


    tipoInput.value =
        transacao.tipo;


    // Guarda o ID

    idEmEdicao = id;


    // Altera o botão

    alterarBotao(
        "Salvar alteração"
    );


    // Coloca o cursor na descrição

    descricaoInput.focus();


    // Volta para o formulário

    document
        .getElementById("formulario")
        .scrollIntoView({

            behavior: "smooth",

            block: "center"

        });

}


// ======================================================
// 8. EXCLUIR TRANSAÇÃO
// ======================================================

function excluirTransacao(id) {

    const confirmar =
        confirm(
            "Deseja realmente excluir esta movimentação?"
        );


    if (!confirmar) {

        return;

    }


    // Remove a transação

    transacoes =
        transacoes.filter(
            function (transacao) {

                return transacao.id !== id;

            }
        );


    // Salva novamente

    salvarTransacoes(
        transacoes
    );


    // Mensagem

    mostrarMensagem(
        "Movimentação excluída!"
    );


    // Atualiza a tela

    atualizarAplicacao();

}


// ======================================================
// 9. CALCULAR RECEITAS
// ======================================================

function calcularReceitas() {

    return transacoes
        .filter(
            function (transacao) {

                return (
                    transacao.tipo ===
                    "receita"
                );

            }
        )
        .reduce(
            function (
                total,
                transacao
            ) {

                return (
                    total +
                    Number(
                        transacao.valor
                    )
                );

            },
            0
        );

}


// ======================================================
// 10. CALCULAR DESPESAS
// ======================================================

function calcularDespesas() {

    return transacoes
        .filter(
            function (transacao) {

                return (
                    transacao.tipo ===
                    "despesa"
                );

            }
        )
        .reduce(
            function (
                total,
                transacao
            ) {

                return (
                    total +
                    Number(
                        transacao.valor
                    )
                );

            },
            0
        );

}


// ======================================================
// 11. CALCULAR SALDO
// ======================================================

function calcularSaldo() {

    const receitas =
        calcularReceitas();


    const despesas =
        calcularDespesas();


    return receitas - despesas;

}


// ======================================================
// 12. ATUALIZAR RESUMO
// ======================================================

function atualizarResumo() {

    const receitas =
        calcularReceitas();


    const despesas =
        calcularDespesas();


    const saldo =
        calcularSaldo();


    // ==================================================
    // CARDS
    // ==================================================

    receitasElement.textContent =
        formatarMoeda(
            receitas
        );


    despesasElement.textContent =
        formatarMoeda(
            despesas
        );


    saldoElement.textContent =
        formatarMoeda(
            saldo
        );


    // ==================================================
    // RESUMO
    // ==================================================

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


    // ==================================================
    // CLASSE DO SALDO
    // ==================================================

    saldoElement.classList.remove(
        "saldo-positivo",
        "saldo-negativo"
    );


    if (saldo < 0) {

        saldoElement.classList.add(
            "saldo-negativo"
        );

    }

    else {

        saldoElement.classList.add(
            "saldo-positivo"
        );

    }

}


// ======================================================
// 13. CONTADOR
// ======================================================

function atualizarContador(
    quantidade
) {

    if (quantidade === 0) {

        contadorRegistros.textContent =
            "Nenhuma movimentação encontrada";

        return;

    }


    contadorRegistros.textContent =
        `Mostrando ${quantidade} de ${transacoes.length} movimentações`;

}


// ======================================================
// 14. FORMATAÇÃO DE MOEDA
// ======================================================

function formatarMoeda(valor) {

    return Number(
        valor
    ).toLocaleString(
        "pt-BR",
        {

            style: "currency",

            currency: "BRL"

        }
    );

}


// ======================================================
// 15. FORMATAÇÃO DE DATA
// ======================================================

function formatarData(data) {

    if (!data) {

        return "-";

    }


    const partes =
        data.split("-");


    if (
        partes.length !== 3
    ) {

        return data;

    }


    return (
        partes[2] +
        "/" +
        partes[1] +
        "/" +
        partes[0]
    );

}


// ======================================================
// 16. ALTERAR TEXTO DO BOTÃO
// ======================================================

function alterarBotao(texto) {

    const span =
        botaoSubmit.querySelector(
            "span"
        );


    if (span) {

        span.textContent =
            texto;

    }

    else {

        botaoSubmit.textContent =
            texto;

    }

}


// ======================================================
// 17. MENSAGEM
// ======================================================

function mostrarMensagem(texto) {

    const mensagem =
        document.createElement(
            "div"
        );


    mensagem.className =
        "mensagem-js";


    mensagem.textContent =
        texto;


    document.body.appendChild(
        mensagem
    );


    setTimeout(
        function () {

            mensagem.remove();

        },
        2500
    );

}


// ======================================================
// 18. ATUALIZAR A APLICAÇÃO
// ======================================================

function atualizarAplicacao() {

    atualizarTabela();

    atualizarResumo();


    // O gráfico está no chart.js

    if (
        typeof criarGrafico ===
        "function"
    ) {

        criarGrafico();

    }

}


// ======================================================
// 19. INICIAR A APLICAÇÃO
// ======================================================

atualizarAplicacao();