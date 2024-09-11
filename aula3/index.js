// while
// function start() {
//     let count = 0

//     while(count <= 10){
//         console.log(count)
//         count++
//     }
// }

const { select, input, checkbox } = require('@inquirer/prompts')
const fs = require("fs").promises

let mensagem = "Bem vindo ao app de metas!";

let metas

const carregarMetas = async () => {
    try {
        const dados = await fs.readFile("metas.json")
        metas = JSON.parse(dados)
    }

    catch(erro){
        metas = []
    }
}

const salvarMetas = async () =>{
    await fs.writeFile("metas.json", JSON.stringify(metas, null, 2))
}

const cadastrarMeta = async () => {
    const meta = await input({message: "Digite a meta: "})

    if(meta.length == 0) {
        mensagem = 'A meta está vazia! por favor, insira uma meta.'
        return 
    }

    metas.push(
        { value: meta, checked: false }
    )

    mensagem = "Meta cadastrada com sucesso!" 
}

const listarMeta = async () => {
    if(metas.length ==0 ){
        mensagem = "não há metas!"
        return
    }

    const respostas = await checkbox({
        message: "use as setas para mudar de meta, o espaço para marcar e desmarcar, enter para finalizar.",
        choices: [...metas],
        instructions: false,

    })

    metas.forEach((m) => {
        m.checked = false
    })
    

    if (respostas.length == 0) {
        mensagem = "nenhuma meta selecionada."
        return
    }

    respostas.forEach((resposta) => {
        const meta = metas.find((m) => {
            return m.value == resposta
        }) 
        
        meta.checked = true
    })

    mensagem = "meta(s) concluida(s)!"
}

const metasRealizadas = async () => {
    if(metas.length ==0 ){
        mensagem = "não há metas!"
        return
    }

    const realizadas = metas.filter((meta) => {
        return meta.checked
    })

    if(realizadas.length == 0) {
        mensagem = "não existem metas realizadas!"
        return
    }

    await select ({
        message: "metas realizadas: " + realizadas.length,
        choices: [...realizadas]
    })
}

const metasAbertas = async () =>{
    if(metas.length ==0 ){
        mensagem = "não há metas!"
        return
    }

    const abertas = metas.filter((meta) => {
        return meta.checked != true
    })

    if (abertas.length == 0) {
        mensagem = "não existem metas abertas!"
        return
    }

    await select({
        message: "Metas Abertas: " + abertas.length,
        choices: [...abertas]
    })
}

const ApagarMetas = async () =>{
    if(metas.length ==0 ){
        mensagem = "não há metas!"
        return
    }
    
    const metasDesmarcadas = metas.map((meta) => {
        return {value: meta.value, checked: false}
    })

    const itemsADeletar = await checkbox({
        message: "selecione a meta que deseja apagar.",
        choices: [...metasDesmarcadas],
        instructions: false,

    })

    if(itemsADeletar.length == 0) {
        mensagem = "nenhum item para apagar!"
        return
    }

    itemsADeletar.forEach((item) => {
        metas = metas.filter((meta) => {
            return meta.value != item
        })
    })

    mensagem = "meta(s) apagada(s) com sucesso!"
}

const mostrarMensagem = () => {
    console.clear();

    if(mensagem != "") {
        console.log(mensagem)
        console.log("")
        mensagem = ""
    }
}

const start = async () => {
   await carregarMetas()

    while(true){
        // let opcao = "sair"
        mostrarMensagem()
        await salvarMetas()

        const opcao = await select({
            message: "Menu >",
            choices: [
                {
                    name: "cadastrar metas",
                    value: "cadastrar"
                },
                {
                    name: "listar metas",
                    value: "listar"

                },
                {
                    name: "metas realizadas",
                    value: "realizadas"
                },
                {
                    name: "metas abertas",
                    value: "abertas"
                },
                {
                    name: "apagar metas",
                    value: "apagar"
                },
                {
                    name: "sair",
                    value: "sair"
                }
            ]
        })

        switch(opcao) {
            case "cadastrar":
                await cadastrarMeta()
                break
            case "listar":
                await listarMeta()
                break
            case "realizadas":
                await metasRealizadas()
                break
            case "abertas":
                await metasAbertas()
                break
            case "apagar":
                await ApagarMetas()

                break
            case "sair":
                console.log("disconnected.")
                return
        }
    }
}


start()