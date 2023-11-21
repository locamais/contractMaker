const express = require("express")
const app = express()

const cors = require('cors')
const bodyParser = require('body-parser')
const routes = require("./routes")
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.json()) 
app.use(cors())
app.use('/', routes)


const port = process.env.PORT || 5000

app.listen(port, ()=>{
    console.log(`server on, port: ${port}`)
})