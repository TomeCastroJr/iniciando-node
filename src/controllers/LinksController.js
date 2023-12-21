const knex = require("../database/knex")

class LinksController {
    async index(request, response){
        const {user_id} = request.params
        
        const tags = await knex("links")
            .where({ user_id })

        return response.json(tags)
    }
}

module.exports = LinksController