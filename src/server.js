require("express-async-errors")
const AppError = require("./utils/AppError")
const migrationsRun = require("./database/migrations")
const express = require("express")
const app = express()

const routes = require("./routes/index.js")

app.use(express.json())
migrationsRun();

app.use(routes)

app.use(( error, request, response, next )=>{
    if(error instanceof AppError){
        return response.status(error.statusCode).json({
            status: "error",
            message: error.message
        })
    }

    console.error(error);

    return response.status(500).json({
        message: "Internal server error",
        status: "error"
    })
})

const PORT = 3333
app.listen(PORT, () => console.log(`O servidor está rodando na porta ${PORT}`))