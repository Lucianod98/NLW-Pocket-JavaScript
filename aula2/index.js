// while
// function start() {
//     let count = 0

//     while(count <= 10){
//         console.log(count)
//         count++
//     }
// }

const { select, input, checkbox } = require('@inquirer/prompts')

let meta = {
    value: "toma 3L de água por dia",
    checked: false,
}

let metas = [meta]

const cadastrarMeta = async () => {
    const meta = await input({message: "Digite a meta: "})

    if(meta.lenght == 0) {
        console.log('A meta está vazia! por favor, insira uma meta.')
        return cadastrarMeta()
    }
    metas.push(
        { value: meta, checked: false })
}

const listarMeta = async () => {
    const respostas = await checkbox({
        message: "use as setas para mudar de meta, o espaço para marcar e desmarcar, enter para finalizar.",
        choices: [...metas],
        instructions: false,

    })

    if (respostas.length == 0) {
        console.log("nenhuma meta selecionada.")
        return
    }

    metas.forEach((m) => {
        m.checked = false
    })
    
    respostas.forEach((resposta) => {
        const meta = metas.find((m) => {
            return m.value == resposta
        }) 
        
        meta.checked = true
    })

    console.log("meta(s) concluida(s)!")
}

const metasRealizadas = async () => {
    const realizadas =
}

const start = async () => {

    while(true){
        // let opcao = "sair"
        
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
                    name: "sair",
                    value: "sair"
                }
            ]
        })

        switch(opcao) {
            case "cadastrar":
                await cadastrarMeta()
                console.log(metas)
                break
            case "listar":
                await listarMeta()
                break
            case "realizadas":
                await metasRealizadas()

            case "sair":
                console.log("disconnected.")
                return
        }
    }
}


start()