const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    const signin = async(req, res) => {
        if(!req.body.email || !req.body.password) {
            return res.status(400).json({ error: 'Dados incompletos' })
        }

        const user = await app.db('users')
            .whereRaw("LOWER(email) = LOWER(?)", req.body.email)
            .first()

        if(user) {
            bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
                if(err || !isMatch){
                    return res.status(401).json({ error: 'A senha informada é inválida' })
                }

                const payload = { id: user.id }
                res.json({
                    name: user.name,
                    email: user.email,
                    token: jwt.encode(payload, process.env.AUTH_SECRET_KEY)
                })
            })
        } else {
            res.status(400).json({ error: 'Problemas com o login do usuário. Usuário não encontrado' })
        }
    }

    return { signin }
}
