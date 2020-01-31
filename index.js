const express = require('express')
const app = express()
const db = require('./config/db')
const consign = require('consign')
const bodyParser = require('body-parser')
const cors = require('cors')

app.use(bodyParser.json())
app.use(cors({
    origin: '*'
}))

consign()
    .include('./config/passport.js')
    .then('./api')
    .then('./config/routes.js')
    .into(app)

app.db = db

app.listen(process.env.PORT || 3000, () => {
    console.log('Backend executando...')
})