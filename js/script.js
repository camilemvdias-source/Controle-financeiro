// ==========================================
// CONTROLE FINANCEIRO
// JavaScript
// ==========================================


// ==========================================
// 1. ELEMENTOS DO HTML
// ==========================================

const formulario = document.getElementById("form-financeiro");

const campoDescricao = document.getElementById("descricao");

const campoValor = document.getElementById("valor");

const campoData = document.getElementById("data");

const campoTipo = document.getElementById("tipo");

const listaTransacoes = document.getElementById("lista-transacoes");

const pesquisaDescricao =
    document.getElementById("pesquisa-descricao");

const filtroTipo =
    document.getElementById("filtro-tipo");

const filtroData =
    document.getElementById("filtro-data");

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


// ==========================================
// 2. ESTADO DA APLICAÇÃO
// ==========================================

// Carrega as transações salvas no localStorage

let transacoes = carregarTransacoes();


// Guarda o ID da transação que está sendo editada

let transacaoEditando = null;


// ==========================================
// 3. EVENTOS
// ==========================================

// Envio do formulário

formulario.addEventListener(
    "submit",
    adicionarTransacao
);


// Pesquisa por descrição

pesquisaDescricao.addEventListener(
    "input",
    atualizarTabela
);


// Filtro por tipo

filtroTipo.addEventListener(
    "change",
    atualizarTabela
);


// Filtro por data

filtroData.addEventListener(
    "change",
    atualizarTabela
);


// ==========================================
// 4. ADICIONAR TRANSAÇÃO
// ==========================================

function adicionarTransacao(event) {

    event.preventDefault();


    // Captura os valores do formulário

    const descricao =
        campoDescricao.value.trim();

    const valor =
        Number(campoValor.value);

    const data =
        campoData.value;

    const tipo =
        campoTipo.value;


    // ======================================
    // VALIDAÇÃO
    // ======================================

    if (descricao === "") {

        alert("Digite uma descrição.");

        campoDescricao.focus();

        return;
    }


    if (valor <= 0 || isNaN(valor)) {

        alert("Digite um valor válido.");

        campoValor.focus();

        return;
    }


    if (data === "") {

        alert("Selecione uma data.");

        campoData.focus();

        return;
    }


    // ======================================
    // OBJETO DA TRANSAÇÃO
    // ======================================

    const novaTransacao = {

        id: Date.now(),

        descricao: descricao,

        valor: valor,

        data: data,

        tipo: tipo

    };


    // ======================================
    // EDITAR OU ADICIONAR
    // ======================================

    if (transacaoEditando !== null) {

        transacoes =
            transacoes.map(
                function (transacao) {

                    if (
                        transacao.id ===
                        transacaoEditando
                    ) {

                        return novaTransacao;

                    }

                    return transacao;

                }
            );


        transacaoEditando = null;


        alterarTextoBotao(
            "Adicionar movimentação"
        );

    }

    else {

        transacoes.push(
            novaTransacao
        );

    }


    // ======================================
    // SALVAR
    // ======================================

    salvarTransacoes(
        transacoes
    );


    // ======================================
    // ATUALIZAR A INTERFACE
    // ======================================

    atualizarTudo();


    // ======================================
    // LIMPAR FORMULÁRIO
    // ======================================

    formulario.reset();

}


// ==========================================
// 5. FILTRAR TRANSAÇÕES
// ==========================================

function obterTransacoesFiltradas() {

    const texto =
        pesquisaDescricao.value
            .toLowerCase()
            .trim();

    const tipo =
        filtroTipo.value;

    const data =
        filtroData.value;


    return transacoes.filter(
        function (transacao) {

            // Pesquisa pela descrição

            const correspondeTexto =
                transacao.descricao
                    .toLowerCase()
                    .includes(texto);


            // Filtro pelo tipo

            const correspondeTipo =
                tipo === "todos" ||
                transacao.tipo === tipo;


            // Filtro pela data

            const correspondeData =
                data === "" ||
                transacao.data === data;


            return (
                correspondeTexto &&
                correspondeTipo &&
                correspondeData
            );

        }
    );

}


// ==========================================
// 6. ATUALIZAR TABELA
// ==========================================

function atualizarTabela() {

    listaTransacoes.innerHTML = "";


    const transacoesFiltradas =
        obterTransacoesFiltradas();


    // ======================================
    // NENHUM RESULTADO
    // ======================================

    if (
        transacoesFiltradas.length === 0
    ) {

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


        atualizarContador(0);

        return;
    }


    // ======================================
    // CRIAR AS LINHAS
    // ======================================

    transacoesFiltradas.forEach(
        function (transacao) {

            const linha =
                document.createElement("tr");


            const dataFormatada =
                formatarData(
                    transacao.data
                );


            const valorFormatado =
                formatarMoeda(
                    transacao.valor
                );


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


            // ==================================
            // CONTEÚDO DA LINHA
            // ==================================

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
                            class="btn-editar"
                            title="Editar"
                            data-id="${transacao.id}"
                        >

                            Editar

                        </button>


                        <button
                            class="btn-excluir"
                            title="Excluir"
                            data-id="${transacao.id}"
                        >

                            Excluir

                        </button>

                    </div>

                </td>

            `;


            // ==================================
            // BOTÃO EDITAR
            // ==================================

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


            // ==================================
            // BOTÃO EXCLUIR
            // ==================================

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


            // ==================================
            // ADICIONAR LINHA À TABELA
            // ==================================

            listaTransacoes.appendChild(
                linha
            );

        }
    );


    atualizarContador(
        transacoesFiltradas.length
    );

}


// ==========================================
// 7. CONTADOR
// ==========================================

function atualizarContador(
    quantidade
) {

    if (!contadorRegistros) {
        return;
    }


    if (quantidade === 0) {

        contadorRegistros.textContent =
            "Nenhuma movimentação encontrada";

        return;
    }


    contadorRegistros.textContent =
        `Mostrando ${quantidade} de ${transacoes.length} movimentações`;

}


// ==========================================
// 8. EDITAR TRANSAÇÃO
// ==========================================

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


    // Coloca os dados no formulário

    campoDescricao.value =
        transacao.descricao;

    campoValor.value =
        transacao.valor;

    campoData.value =
        transacao.data;

    campoTipo.value =
        transacao.tipo;


    // Guarda o ID que está sendo editado

    transacaoEditando = id;


    // Muda o texto do botão

    alterarTextoBotao(
        "Salvar alteração"
    );


    // Leva o usuário até o formulário

    document
        .getElementById("formulario")
        .scrollIntoView({

            behavior: "smooth",

            block: "center"

        });

}


// ==========================================
// 9. EXCLUIR TRANSAÇÃO
// ==========================================

function excluirTransacao(id) {

    const confirmar =
        confirm(
            "Deseja realmente excluir esta movimentação?"
        );


    if (!confirmar) {
        return;
    }


    // Remove pelo ID

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


    // Atualiza a aplicação

    atualizarTudo();

}


// ==========================================
// 10. CALCULAR RESUMO
// ==========================================

function calcularResumo() {

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

            else if (
                transacao.tipo ===
                "despesa"
            ) {

                despesas +=
                    Number(
                        transacao.valor
                    );

            }

        }
    );


    const saldo =
        receitas - despesas;


    // ======================================
    // CARDS
    // ======================================

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


    // ======================================
    // RESUMO
    // ======================================

    if (resumoReceitas) {

        resumoReceitas.textContent =
            formatarMoeda(
                receitas
            );

    }


    if (resumoDespesas) {

        resumoDespesas.textContent =
            formatarMoeda(
                despesas
            );

    }


    if (resumoSaldo) {

        resumoSaldo.textContent =
            formatarMoeda(
                saldo
            );

    }

}


// ==========================================
// 11. FORMATAR MOEDA
// ==========================================

function formatarMoeda(valor) {

    return Number(valor).toLocaleString(
        "pt-BR",
        {

            style: "currency",

            currency: "BRL"

        }
    );

}


// ==========================================
// 12. FORMATAR DATA
// ==========================================

function formatarData(data) {

    if (!data) {
        return "-";
    }


    const partes =
        data.split("-");


    if (partes.length !== 3) {
        return data;
    }


    return `${partes[2]}/${partes[1]}/${partes[0]}`;

}


// ==========================================
// 13. ALTERAR TEXTO DO BOTÃO
// ==========================================

function alterarTextoBotao(texto) {

    if (!botaoSubmit) {
        return;
    }


    const span =
        botaoSubmit.querySelector(
            "span"
        );


    if (span) {

        span.textContent =
            texto;

    }

}


// ==========================================
// 14. ATUALIZAR TUDO
// ==========================================

function atualizarTudo() {

    atualizarTabela();

    calcularResumo();


    // Atualiza o gráfico

    if (
        typeof criarGrafico ===
        "function"
    ) {

        criarGrafico();

    }

}


// ==========================================
// 15. INICIALIZAÇÃO
// ==========================================

atualizarTudo();