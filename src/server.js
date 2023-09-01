const express = require("express")
const app = express()



app.get("/", (request, response) => {
    response.send("Hello Word")
})
app.get("/message/:id", (request, response) => {
    response.send(`Rota mensagem, com o id ${request.params.teste}`)
})


const PORT = 3333
app.listen(PORT, () => console.log(`O servidor está rodando na porta ${PORT}`))