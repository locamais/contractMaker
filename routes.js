const express = require("express")
const Clients = require("./models/client")
const Products = require("./models/product")
const Contracts = require("./models/contract")

var router = express.Router();

router.get("/clients", (req,res)=>{
    Clients.findAll({raw:true}).then(data =>{
        res.json(data)
    })
})

router.get("/client/:id", async (req,res)=>{
    Clients.findOne({raw:true ,where: {id: req.params.id}}).then((data)=>{
        res.json(data)
    })
})


router.post("/add-client", (req,res)=>{
    Clients.create({
        name: req.body.name,
        adress: req.body.adress,
        cpf: req.body.cpf,
        tel: req.body.tel,
        status: req.body.status
    })
})  

router.put("/edit-client/:id", async (req,res)=>{
    await Clients.update({
        name: req.body.name,
        adress: req.body.adress,
        cpf: req.body.cpf,
        tel: req.body.tel,
        city: req.body.city,
        status: req.body.status
    } ,{where: {id: req.params.id}})
})

router.delete("/delete-client/:id", async (req,res)=>{
    await Clients.destroy({where: {id: req.params.id}})
})

// Prrodutos

router.get("/products", (req,res)=>{
    Products.findAll({raw:true}).then(data =>{
        res.json(data)
    })
})

router.get("/product/:id", async (req,res)=>{
    const reqId = req.params.id
    const idString = reqId.split(",")  
    const idNumber = idString.map((e)=>parseInt(e))  
    Products.findAll({where: {id:idNumber}}).then((data)=>{
        res.json(data)
    })
})
    
router.post("/add-product", (req,res)=>{   
    Products.create({
        name: req.body.name,
        dayPrice: req.body.dayPrice,
        weekPrice: req.body.weekPrice,
        fortnightPrice: req.body.fortnightPrice,
        monthPrice: req.body.monthPrice,
        stock: req.body.stock
    })
})

router.put("/edit-product/:id", async (req,res)=>{
    await Products.update({
        name: req.body.name,
        dayPrice: req.body.dayPrice,
        weekPrice: req.body.weekPrice,
        fortnightPrice: req.body.fortnightPrice,
        monthPrice: req.body.monthPrice,
        stock: req.body.stock
    } ,{where: {id: req.params.id}})
})

router.delete("/delete-product/:id", async (req,res)=>{
    await Products.destroy({where: {id: req.params.id}})
})

// Contratos

router.get("/contracts", (req,res)=>{
    Contracts.findAll().then(data =>{
        res.json(data)
    })
})

router.get("/contract/:id", async (req,res)=>{
    Contracts.findOne({raw:true ,where: {id: [req.params.id]}}).then((data)=>{
        res.json(data)
    })
})

router.post("/add-contract", async (req,res)=>{
    
    let clientName
    let clientAdress
    let clientCpf
    let clientTel

    await Client.findOne({raw:true, where:{id:req.body.client}}).then((e)=>{
        clientName = e.name
        clientAdress = e.adress
        clientCpf = e.cpf
        clientTel = e.tel
    })

    let productsid = req.body.product
    let promises = productsid.map(id => Products.findByPk(id));
    let productsData
    await Promise.all(promises).then(items => {
        productsData = items
    })

    let productsName = productsData.map((e)=> e.name)

    let days = req.body.days
    let period = days.map((e)=>{
        if(e < 7){
            return e
        } else if(e == 7){
            return "Semanal"
        } else if(e == 15){
            return "Quinzenal"
        } else if(e == 30){
            return "Mensal"
        }
    })

    let items = req.body.quantity

    let prices = period.map((value, index)=>{
        if(value <7){
            return productsData[index].dayPrice
        } else if(value === "Semanal"){
            return productsData[index].weekPrice
        } else if(value === "Quinzenal"){
            return productsData[index].fortnightPrice
        } else if(value === "Mensal"){
            return productsData[index].monthPrice
        }
    })
    
    let totalPrices = period.map((value, index)=>{
        if(value <7){
            return value * prices[index] * items[index]
        } else{
            return prices[index] * items[index]
        }
    })

    totalPrice = totalPrices.reduce((accumulator,value) => accumulator + Number(value),0) 
    totalPrice = Number(req.body.delivery) + Number(totalPrice)

    let day = new Date().getDate(); // Para obter o dia
    let month = new Date().getMonth() + 1; // Para obter o mês
    let year = new Date().getFullYear(); // Para obter o ano
    let hours = new Date().getHours(); // Para obter a hora
    let min = new Date().getMinutes(); // Para obter os minutos
    let currentDate = `${day}/${month}/${year} ${hours}:${min}`;

    Contracts.create({
         clientName: clientName,
         clientAdress, clientAdress,
         clientCpf, clientCpf,
         clientTel: clientTel,
         product: productsName,
         prices: prices,
         totalPrices: totalPrices,
         totalPrice: totalPrice,
         period: period,
         quantity: req.body.quantity,
         days: req.body.days,
         workAdress: req.body.workAdress,
         delivery: req.body.delivery,
         date: currentDate,
         equipment: 0,
         payment: 0,
     })
})

router.post("/paidout-contract/:id", async (req,res)=>{
    await Contracts.update({
        payment: 1
    } ,{where: {id: req.params.id}})
})

router.post("/delivered-contract/:id", async (req,res)=>{
    await Contracts.update({
        equipment: 1
    } ,{where: {id: req.params.id}})
})

router.put("/edit-product/:id", async (req,res)=>{
    await Products.update({
        name: req.body.name,
        dayPrice: req.body.dayPrice,
        weekPrice: req.body.weekPrice,
        fortnightPrice: req.body.fortnightPrice,
        monthPrice: req.body.monthPrice,
        stock: req.body.stock
    } ,{where: {id: req.params.id}})
})

router.delete("/delete-product/:id", async (req,res)=>{
    await Products.destroy({where: {id: req.params.id}})
})

module.exports = router