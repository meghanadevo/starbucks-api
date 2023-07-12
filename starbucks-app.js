let express = require('express');
let app = express();
let port = process.env.PORT||2415;
const bodyParser= require('body-parser');
const cors =require('cors');
let {dbConnect,getData,postData,updateOrder,deleteOrder} = require('./controller/dbcontroller');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors())
app.get('/',(req,res) => {
    res.send('Hi From express')
})
//get main menu
app.get('/food',async (req,res)=>{
    let query = {};
    let collection = "food"
    let output = await getData(collection,query)
    res.send(output)
})
//get category based menu
app.get('/category',async(req,res)=>{
    if(req.query.categoryId){
        query={category_id:Number(req.query.categoryId)}
    }else{
      query={};  
    }
    let collection = "category";
    let output = await getData(collection,query)
    res.send(output)
 })
// get all location
app.get('/city',async (req,res)=>{
    let query = {};
    let collection = "city"
    let output = await getData(collection,query)
    res.send(output)
})
//get the stores area data
app.get('/area', async(req,res) => {
    if(req.query.cityId){
        query={city_id:Number(req.query.cityId)}
    }else if(req.query.categoryId){
        query={"foodCategory.category_id":Number(req.query.categoryId)}
    }
    else{
        query={};
    }
    let collection = "area"
    let output = await getData(collection,query)
    res.send(output)
})
//filters
app.get('/filter/:categoryId',async(req,res)=>{
    let categoryId = Number(req.params.categoryId);
    let menuId = Number(req.query.menuId)
    if(menuId){
        query={
            "foodCategory.category_id":categoryId,
            "menuType.menu_id":menuId
        }
    }
    else{
        query={};
    }
    let collection = "area"
    let output = await getData(collection,query)
    res.send(output)
    })
    //details
    app.get('/details/:id',async(req,res)=>{
        let id = Number(req.params.id)
        let query={item_id:id}
        let collection = "category"
        let output = await getData(collection,query)
        res.send(output)
    })
        //get menu
        app.get('/menu',async (req,res)=>{
            if((req.query.areaId) && (req.query.categoryId)){
                query={area_id:Number(req.query.areaId),
                    category_id:Number(req.query.categoryId)                              }
            }
            else{
                query={};
            }
            let collection = "menu"
            let output = await getData(collection,query)
            res.send(output)
        })
    app.get('/storemenu/:id',async(req,res)=>{
        let id = Number(req.params.id)
        let query={area_id:id}
        let collection = "menu"
        let output = await getData(collection,query)
        res.send(output)
    })
    //get the orders
    app.get('/orders',async (req,res)=>{
        let query = {};
        let collection = "orders"
        let output = await getData(collection,query)
        res.send(output)
    })
    //placing orders
    app.post('/placeOrder',async(req,res)=>{
        let data = req.body;
        let collection="orders"
        console.log('>>>',data)
        let response = await postData(collection,data)
        res.send(response)
    })
    //details of the items
    app.post('/menudetails',async(req,res)=>{
        if(Array.isArray(req.body.id)){
            let query = {item_id:{$in:req.body.id}}
            let collection="menu";
            let output = await getData(collection,query);
            res.send(output)
        }
        else{
            res.send("Please pass an array")
        }
    })
    //updating orders
    app.put('/updateOrder',async(req,res)=>{
        let collection = 'orders';
        let condition = {"o_id":req.body.order_id}
        data={
            $set:{
            "status":req.body.status
        }
    }
    let output = await updateOrder(collection,condition,data)
    res.send(output)
    })
    //deleting order
    app.put('/deleteOrder',async(req,res)=>{
        let collection = 'orders';
        let condition= {"o_id":req.body.order_id}
    let output = await deleteOrder(collection,condition)
    res.send(output)
    })
app.listen(port,(err) => {
    dbConnect()
    if(err) throw err;
    console.log(`Server is running on port ${port}`)
})
