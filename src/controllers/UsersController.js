const {hash, compare} = require("bcryptjs")
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

        const hashedPassword = await hash(password, 8)

        await database
        .run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)",[name, email, hashedPassword]);

        return response.status(201).json()
   }

   async update(request, response){
    const { name, email, password, old_password} = request.body
    const { id } = request.params

    const database = await sqlConection()

    const user = await database.get("SELECT * FROM users WHERE id = (?)", [id])
    
    if(!user){
        throw new AppError("Usuário não encontrado")
    }

    const userWithUpdateEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email])
    
    if(userWithUpdateEmail && userWithUpdateEmail.id !== user.id){
        throw new AppError("Email já está em uso.")
    }

    user.name = name ?? user.name
    user.email = email ?? user.email

    if(password && !old_password){
        throw new AppError("você precisa inserir a senha antiga")
    }

    if(password && old_password){
        const checkOldPassword = await compare(old_password, user.password)

        if(!checkOldPassword){
            throw new AppError("A senha antiga não confere")
        }
        user.password = await hash(password, 8)
    }

    await database.run(`
        UPDATE users SET
        name = ?,
        email =  ?,
        password = ?,
        updated_at = DATETIME('now', 'localtime')
        WHERE id = ?`,
        [user.name, user.email, user.password , id]
        )

        return response.status(200).json()     
   }

    
}

module.exports = UsersController