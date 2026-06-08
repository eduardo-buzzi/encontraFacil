/* ==========================================
   API VIA CEP
========================================== */

function buscarCEP() {

    const cep =
        document.getElementById(
            "cep-input"
        )
            .value
            .replace(/\D/g, "");

    if (cep.length !== 8) {
        alert(
            "Digite um CEP válido."
        );
        return;
    }

    document.getElementById(
        "logradouro"
    ).value = "Buscando...";

    document.getElementById(
        "bairro"
    ).value = "Buscando...";

    fetch(
        `https://viacep.com.br/ws/${cep}/json/`
    )
        .then(response =>
            response.json()
        )

        .then(data => {

            if (data.erro) {

                alert(
                    "CEP não encontrado."
                );

                limparCamposCEP();
                return;
            }

            document.getElementById(
                "logradouro"
            ).value =
                data.logradouro || "";

            document.getElementById(
                "bairro"
            ).value =
                data.bairro || "";
        })

        .catch(error => {

            console.error(error);

            alert(
                "Erro ao buscar CEP."
            );

            limparCamposCEP();
        });
}

function limparCamposCEP() {

    document.getElementById(
        "logradouro"
    ).value = "";

    document.getElementById(
        "bairro"
    ).value = "";
}

/* ==========================================
   API NINJAS
========================================== */

function gerarSenhaSegura() {

    const campoSenha =
        document.getElementById(
            "senha-gerada"
        );

    campoSenha.value =
        "Gerando senha...";

    /*
       IMPORTANTE:
       Crie sua chave grátis aqui:
       https://api-ninjas.com

       Depois substitua abaixo
    */

    const apiKey =
        "I6WWWaO0u5tP0nmJbtbIUWWL7Y4eFUYP5jM7IBj2";

    fetch(
        "https://api.api-ninjas.com/v1/passwordgenerator?length=12",
        {
            method: "GET",

            headers: {
                "X-Api-Key":
                    apiKey
            }
        }
    )

        .then(response => {

            if (!response.ok) {
                throw new Error(
                    "Erro API"
                );
            }

            return response.json();
        })

        .then(data => {

            campoSenha.value =
                data.random_password;
        })

        .catch(error => {

            console.error(error);

            // senha fake fallback
            campoSenha.value =
                gerarSenhaLocal();
        });
}

/* ==========================================
   FALLBACK SENHA LOCAL
========================================== */

function gerarSenhaLocal() {

    const letras =
        "abcdefghijklmnopqrstuvwxyz";

    const maiusculas =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    const numeros =
        "0123456789";

    const especiais =
        "@#$%&*!";

    const todos =
        letras +
        maiusculas +
        numeros +
        especiais;

    let senha = "";

    senha +=
        maiusculas[
        Math.floor(
            Math.random() *
            maiusculas.length
        )
        ];

    senha +=
        especiais[
        Math.floor(
            Math.random() *
            especiais.length
        )
        ];

    senha +=
        numeros[
        Math.floor(
            Math.random() *
            numeros.length
        )
        ];

    for (let i = 0; i < 9; i++) {

        senha +=
            todos[
            Math.floor(
                Math.random() *
                todos.length
            )
            ];
    }

    return senha
        .split("")
        .sort(() =>
            Math.random() - 0.5
        )
        .join("");
}