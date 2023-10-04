const { Router } = require("express")

const usersRouter = require("./users.routes.js")
const notesRouter = require("./notes.rotes.js")

const routes = Router()

routes.use("/users", usersRouter)
routes.use("/notes", notesRouter)

module.exports = routes
