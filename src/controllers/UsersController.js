const {hash} = require("bcryptjs")
const AppError = require("../utils/AppError")
const sqlConection = require("../database/sqlite/index")

class UsersController {
   async create(request, response){
        const {name, email, password} = request.body    

        const database = await sqlConection();
        const checkUserExistis = await database.get("SELECT * FROM users WHERE email = (?)", [email])

        if(checkUserExistis){
            throw new AppError("Este e-mail já está em uso")
        }

        const hashedPassword = await hash(password.toString(), 8)

        await database
        .run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)",[name, email, hashedPassword]);

        return response.status(201).json()
   }

   async update(request, response){
    const { name, email} = request.body;
    const { id } = request.params

    const database = await sqlConection();

    //verificar se o usuário existe
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [id])
    
    if(!user){
        throw new AppError("Usuário não encontrado")
    }
    console.log(user)

    //verificar se o email já está sendo usado por outro usuário
    const userWithUpdateEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email])
    console.log(userWithUpdateEmail, userWithUpdateEmail.id)

    if(userWithUpdateEmail && userWithUpdateEmail.id !== user.id){
        throw new AppError("Este e-mail já está em uso")
    }
    
    user.name= name;
    user.email= email;
    
    await database.run(`
        UPDATE users SET 
         name = ?,
         email = ?,
         updated_at = ?
         WHERE id = ?`,
         [user.name, user.email, new Date(), id]
         )

    return response.status(200).json()     

   }
}

module.exports = UsersController