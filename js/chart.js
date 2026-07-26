let graficoFinanceiro;


function criarGrafico() {

    let receitas = 0;
    let despesas = 0;


    transacoes.forEach(function(transacao) {

        if (transacao.tipo === "receita") {

            receitas += transacao.valor;

        } else {

            despesas += transacao.valor;

        }

    });



    if (graficoFinanceiro) {

        graficoFinanceiro.destroy();

    }



    const total = receitas + despesas;


    let porcentagemReceita = 0;
    let porcentagemDespesa = 0;


    if (total > 0) {

        porcentagemReceita = ((receitas / total) * 100).toFixed(1);

        porcentagemDespesa = ((despesas / total) * 100).toFixed(1);

    }



    const contexto = document
        .getElementById("graficoFinanceiro")
        .getContext("2d");



    graficoFinanceiro = new Chart(contexto, {


        type: "doughnut",


        data: {


            labels: [

                `Receitas ${porcentagemReceita}%`,

                `Despesas ${porcentagemDespesa}%`

            ],


            datasets: [{

                data: [

                    receitas,

                    despesas

                ],


                backgroundColor: [

                    "#22c55e",

                    "#ef4444"

                ],


                borderWidth: 2

            }]


        },


        options: {

            responsive: true,


            plugins: {


                legend: {

                    position: "bottom"

                },


                tooltip: {


                    callbacks: {


                        label: function(context) {


                            return (

                                " R$ " +

                                context.raw.toFixed(2)

                            );


                        }


                    }


                }


            }


        }


    });


}