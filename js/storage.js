// Chave utilizada no LocalStorage

const CHAVE_STORAGE = "transacoes";

// Salvar transações

function salvarTransacoes(transacoes) {

    localStorage.setItem(
        CHAVE_STORAGE,
        JSON.stringify(transacoes)
    );

}

// Carregar transações

function carregarTransacoes() {

    const dados = localStorage.getItem(CHAVE_STORAGE);

    if (!dados) {
        return [];
    }

    return JSON.parse(dados);

}