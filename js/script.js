// ======================================================
// CONTROLE FINANCEIRO
// Projeto desenvolvido com foco em JavaScript
// ======================================================


// ======================================================
// 1. CONFIGURAÇÕES
// ======================================================

const CHAVE_STORAGE = "transacoes";

let transacoes = carregarDados();

let idEmEdicao = null;

let grafico = null;


// ======================================================
// 2. SELEÇÃO DOS ELEMENTOS DO HTML
// ======================================================

const formulario = document.getElementById("form-financeiro");

const descricaoInput = document.getElementById("descricao");

const valorInput = document.getElementById("valor");

const dataInput = document.getElementById("data");

const tipoInput = document.getElementById("tipo");

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

formulario?.addEventListener(
    "submit",
    adicionarTransacao
);

pesquisaInput?.addEventListener(
    "input",
    atualizarTabela
);

filtroTipo?.addEventListener(
    "change",
    atualizarTabela
);

filtroData?.addEventListener(
    "change",
    atualizarTabela
);


// ======================================================
// 4. LOCAL STORAGE
// ======================================================

function carregarDados() {

    const dados =
        localStorage.getItem(
            CHAVE_STORAGE
        );

    if (!dados) {

        return [];

    }

    try {

        return JSON.parse(dados);

    }

    catch (erro) {

        console.error(
            "Erro ao carregar dados:",
            erro
        );

        return [];

    }

}


function salvarDados() {

    localStorage.setItem(
        CHAVE_STORAGE,
        JSON.stringify(transacoes)
    );

}


// ======================================================
// 5. ADICIONAR TRANSAÇÃO
// ======================================================

function adicionarTransacao(event) {

    event.preventDefault();


    const descricao =
        descricaoInput.value.trim();

    const valor =
        Number(valorInput.value);

    const data =
        dataInput.value;

    const tipo =
        tipoInput.value;


    // ------------------------------------------
    // VALIDAÇÃO
    // ------------------------------------------

    if (!descricao) {

        mostrarMensagem(
            "Digite uma descrição."
        );

        descricaoInput.focus();

        return;

    }


    if (!valor || valor <= 0) {

        mostrarMensagem(
            "Digite um valor válido."
        );

        valorInput.focus();

        return;

    }


    if (!data) {

        mostrarMensagem(
            "Selecione uma data."
        );

        dataInput.focus();

        return;

    }


    // ------------------------------------------
    // CRIAÇÃO DO OBJETO
    // ------------------------------------------

    const novaTransacao = {

        id: idEmEdicao || Date.now(),

        descricao: descricao,

        valor: valor,

        data: data,

        tipo: tipo

    };


    // ------------------------------------------
    // VERIFICA SE É EDIÇÃO
    // ------------------------------------------

    if (idEmEdicao) {

        transacoes =
            transacoes.map(
                transacao => {

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

    else {

        transacoes.push(
            novaTransacao
        );


        mostrarMensagem(
            "Movimentação adicionada!"
        );

    }


    // ------------------------------------------
    // SALVAR
    // ------------------------------------------

    salvarDados();


    // ------------------------------------------
    // RESETAR MODO DE EDIÇÃO
    // ------------------------------------------

    idEmEdicao = null;


    alterarBotao(
        "Adicionar"
    );


    // ------------------------------------------
    // LIMPAR FORMULÁRIO
    // ------------------------------------------

    formulario.reset();


    // ------------------------------------------
    // ATUALIZAR A APLICAÇÃO
    // ------------------------------------------

    atualizarAplicacao();

}


// ======================================================
// 6. FILTRAR TRANSAÇÕES
// ======================================================

function obterTransacoesFiltradas() {

    const pesquisa =
        pesquisaInput?.value
            .toLowerCase()
            .trim() || "";


    const tipoSelecionado =
        filtroTipo?.value || "todos";


    const dataSelecionada =
        filtroData?.value || "";


    return transacoes.filter(
        transacao => {

            // Pesquisa pela descrição

            const correspondePesquisa =
                transacao.descricao
                    .toLowerCase()
                    .includes(pesquisa);


            // Filtro de receita/despesa

            const correspondeTipo =
                tipoSelecionado === "todos" ||
                transacao.tipo ===
                tipoSelecionado;


            // Filtro de data

            const correspondeData =
                !dataSelecionada ||
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
// 7. RENDERIZAR TABELA
// ======================================================

function atualizarTabela() {

    if (!listaTransacoes) {

        return;

    }


    listaTransacoes.innerHTML = "";


    const lista =
        obterTransacoesFiltradas();


    // ------------------------------------------
    // NENHUM RESULTADO
    // ------------------------------------------

    if (lista.length === 0) {

        listaTransacoes.innerHTML = `

            <tr>

                <td colspan="5">

                    Nenhuma movimentação encontrada.

                </td>

            </tr>

        `;


        atualizarContador(0);

        return;

    }


    // ------------------------------------------
    // CRIAR LINHAS
    // ------------------------------------------

    lista.forEach(
        transacao => {

            const linha =
                document.createElement("tr");


            const data =
                formatarData(
                    transacao.data
                );


            const valor =
                formatarMoeda(
                    transacao.valor
                );


            const tipo =
                transacao.tipo === "receita"
                    ? "Receita"
                    : "Despesa";


            linha.innerHTML = `

                <td>
                    ${data}
                </td>

                <td>
                    ${transacao.descricao}
                </td>

                <td>
                    <span class="
                        tipo-badge
                        ${
                            transacao.tipo === "receita"
                                ? "tipo-receita"
                                : "tipo-despesa"
                        }
                    ">
                        ${tipo}
                    </span>
                </td>

                <td class="
                    ${
                        transacao.tipo === "receita"
                            ? "valor-receita"
                            : "valor-despesa"
                    }
                ">
                    ${valor}
                </td>

                <td>

                    <button
                        class="btn-editar"
                        data-id="${transacao.id}"
                    >
                        Editar
                    </button>

                    <button
                        class="btn-excluir"
                        data-id="${transacao.id}"
                    >
                        Excluir
                    </button>

                </td>

            `;


            // ----------------------------------
            // BOTÃO EDITAR
            // ----------------------------------

            const editar =
                linha.querySelector(
                    ".btn-editar"
                );


            editar.addEventListener(
                "click",
                () => {

                    editarTransacao(
                        transacao.id
                    );

                }
            );


            // ----------------------------------
            // BOTÃO EXCLUIR
            // ----------------------------------

            const excluir =
                linha.querySelector(
                    ".btn-excluir"
                );


            excluir.addEventListener(
                "click",
                () => {

                    excluirTransacao(
                        transacao.id
                    );

                }
            );


            listaTransacoes.appendChild(
                linha
            );

        }
    );


    atualizarContador(
        lista.length
    );

}


// ======================================================
// 8. EDITAR TRANSAÇÃO
// ======================================================

function editarTransacao(id) {

    const transacao =
        transacoes.find(
            item => item.id === id
        );


    if (!transacao) {

        return;

    }


    descricaoInput.value =
        transacao.descricao;


    valorInput.value =
        transacao.valor;


    dataInput.value =
        transacao.data;


    tipoInput.value =
        transacao.tipo;


    idEmEdicao = id;


    alterarBotao(
        "Salvar alteração"
    );


    descricaoInput.focus();


    window.scrollTo({

        top: 300,

        behavior: "smooth"

    });

}


// ======================================================
// 9. EXCLUIR TRANSAÇÃO
// ======================================================

function excluirTransacao(id) {

    const confirmar =
        confirm(
            "Deseja realmente excluir esta movimentação?"
        );


    if (!confirmar) {

        return;

    }


    transacoes =
        transacoes.filter(
            transacao =>
                transacao.id !== id
        );


    salvarDados();


    mostrarMensagem(
        "Movimentação excluída!"
    );


    atualizarAplicacao();

}


// ======================================================
// 10. CALCULAR RECEITAS
// ======================================================

function calcularReceitas() {

    return transacoes
        .filter(
            transacao =>
                transacao.tipo === "receita"
        )
        .reduce(
            (
                total,
                transacao
            ) => {

                return total +
                    Number(
                        transacao.valor
                    );

            },
            0
        );

}


// ======================================================
// 11. CALCULAR DESPESAS
// ======================================================

function calcularDespesas() {

    return transacoes
        .filter(
            transacao =>
                transacao.tipo === "despesa"
        )
        .reduce(
            (
                total,
                transacao
            ) => {

                return total +
                    Number(
                        transacao.valor
                    );

            },
            0
        );

}


// ======================================================
// 12. CALCULAR SALDO
// ======================================================

function calcularSaldo() {

    const receitas =
        calcularReceitas();


    const despesas =
        calcularDespesas();


    return receitas - despesas;

}


// ======================================================
// 13. ATUALIZAR RESUMO
// ======================================================

function atualizarResumo() {

    const receitas =
        calcularReceitas();


    const despesas =
        calcularDespesas();


    const saldo =
        receitas - despesas;


    // Cards principais

    if (receitasElement) {

        receitasElement.textContent =
            formatarMoeda(receitas);

    }


    if (despesasElement) {

        despesasElement.textContent =
            formatarMoeda(despesas);

    }


    if (saldoElement) {

        saldoElement.textContent =
            formatarMoeda(saldo);

    }


    // Resumo

    if (resumoReceitas) {

        resumoReceitas.textContent =
            formatarMoeda(receitas);

    }


    if (resumoDespesas) {

        resumoDespesas.textContent =
            formatarMoeda(despesas);

    }


    if (resumoSaldo) {

        resumoSaldo.textContent =
            formatarMoeda(saldo);

    }


    // Altera visual do saldo

    if (saldoElement) {

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

}


// ======================================================
// 14. CONTADOR DE MOVIMENTAÇÕES
// ======================================================

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


// ======================================================
// 15. GRÁFICO
// ======================================================

function criarGrafico() {

    const canvas =
        document.getElementById(
            "graficoFinanceiro"
        );


    if (!canvas) {

        return;

    }


    // Verifica se Chart.js está carregado

    if (
        typeof Chart === "undefined"
    ) {

        console.warn(
            "Chart.js não foi carregado."
        );

        return;

    }


    const receitas =
        calcularReceitas();


    const despesas =
        calcularDespesas();


    // Destrói gráfico anterior

    if (grafico) {

        grafico.destroy();

    }


    grafico =
        new Chart(
            canvas,
            {

                type: "doughnut",

                data: {

                    labels: [
                        "Receitas",
                        "Despesas"
                    ],

                    datasets: [

                        {

                            data: [
                                receitas,
                                despesas
                            ],

                            borderWidth: 0

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {

                            position: "bottom"

                        },

                        tooltip: {

                            callbacks: {

                                label:
                                    function (
                                        contexto
                                    ) {

                                        const valor =
                                            contexto.raw;


                                        return (
                                            " " +
                                            formatarMoeda(
                                                valor
                                            )
                                        );

                                    }

                            }

                        }

                    }

                }

            }
        );

}


// ======================================================
// 16. ORDENAR POR DATA
// ======================================================

function ordenarPorData() {

    transacoes.sort(
        (
            a,
            b
        ) => {

            return new Date(
                b.data
            ) - new Date(
                a.data
            );

        }
    );


    salvarDados();


    atualizarAplicacao();

}


// ======================================================
// 17. FORMATAR MOEDA
// ======================================================

function formatarMoeda(valor) {

    return Number(valor).toLocaleString(
        "pt-BR",
        {

            style: "currency",

            currency: "BRL"

        }
    );

}


// ======================================================
// 18. FORMATAR DATA
// ======================================================

function formatarData(data) {

    if (!data) {

        return "-";

    }


    const partes =
        data.split("-");


    if (partes.length !== 3) {

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
// 19. ALTERAR BOTÃO
// ======================================================

function alterarBotao(texto) {

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

    else {

        botaoSubmit.textContent =
            texto;

    }

}


// ======================================================
// 20. MENSAGEM PARA O USUÁRIO
// ======================================================

function mostrarMensagem(texto) {

    const mensagem =
        document.createElement(
            "div"
        );


    mensagem.textContent =
        texto;


    mensagem.className =
        "mensagem-js";


    document.body.appendChild(
        mensagem
    );


    setTimeout(
        () => {

            mensagem.remove();

        },
        2500
    );

}


// ======================================================
// 21. ATUALIZAR TODA A APLICAÇÃO
// ======================================================

function atualizarAplicacao() {

    atualizarTabela();

    atualizarResumo();

    criarGrafico();

}


// ======================================================
// 22. INICIALIZAÇÃO
// ======================================================

atualizarAplicacao();


// ======================================================
// FIM DO JAVASCRIPT
// ======================================================