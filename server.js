const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv').config();

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())


const URL = "mongodb+srv://user1:user1@cluster0.jw9cuev.mongodb.net/BidPokemonDB";

mongoose.connect(URL, {useNewUrlParser: true, useUnifiedTopology: true})
    .then (()=>{
        console.log("Connected to MongoDB!!!!")
        app.listen(port, ()=>{
            console.log("Server is on Port"+ port)
        });
    })
    .catch ((err)=>{
        console.log(err)
    })


    const itemSchema = new mongoose.Schema({

        bid_id: {type: String, required: true} ,
        end_date: {type: Date, required: true},
        start_price: {type: Number, required: true},
        poke_id: {type: String, required: true} ,
        poke_name: {type: String, required: true} ,
        poke_type: {type: String, required: true} ,
        poke_img: {type: String, required: true} ,
        poke_hp: {type: Number, required: true},
        poke_attack: {type: Number, required: true},
        poke_defense: {type: Number, required: true},
        
    })

    const bidSchema = new mongoose.Schema({

        bid_id: {type: String, required: true} ,
        poke_id: {type: String, required: true} ,
        username: {type: String, required: true} ,
        bid_date: {type: Date, required: true} ,
        bid_amount: {type: Number, required: true},
        
    })
///////////////////////////////////////////////////////////
    const Item = mongoose.model("Item", itemSchema)

    const Bid = mongoose.model("Bid", bidSchema)

    const router = express.Router()

    app.use("/", router)
    router.route("/item/add").post((req,res)=>{

            const bid_id = req.body.bid_id
            const end_date = req.body.end_date
            const start_price = req.body.start_price
            const poke_id = req.body.poke_id
            const poke_name = req.body.poke_name
            const poke_type = req.body.poke_type
            const poke_img = req.body.poke_img
            const poke_hp = req.body.poke_hp
            const poke_attack = req.body.poke_attack
            const poke_defense = req.body.poke_defense
         
           
            const newItem = new Item( {
                bid_id,end_date,start_price,poke_id,poke_name,poke_type,poke_img,poke_hp,poke_attack,poke_defense,
            })

            newItem
                .save()
                .then(()=>res.json("New Item Added"))
                .catch((err) =>{
                    res.status(400).json("Error: " + err);
                })
        })

    router.route("/items")
        .get((req,res)=>{
            Item.find()
                .then((items)=>{res.json(items)})
                .catch((err) =>{
                    res.status(400).json("Error: " + err);
                })
        })

    router.route("/items/current")
        .get((req, res) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Set time to start of the day to include items ending today
    
            Item.find({ end_date: { $gte: today } }) // Find items where end_date is greater than or equal to today
                .then(items => res.json(items))
                .catch(err => res.status(400).json("Error: " + err));
        });

    router.route("/item/current/:poke_id")
        .get((req, res) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0); 
            const poke_id = req.params.poke_id;
            Item.find({
                poke_id: poke_id,  
                end_date: { $gte: today } 
            }).then(items => res.json(items))
              .catch(err => res.status(400).json("Error: " + err));
        });

   

    router.route("/item/:bid_id")
        .get((req, res) => {
            Item.findOne({ bid_id: req.params.bid_id })
                .then((item) => {
                    res.json(item);
                })
                .catch((err) => {
                    res.status(400).json("Error: " + err);
                });
        });


    
    // router.route("/item/delete/:bid_id")
    //     .delete((req, res) => {
    //         Item.findOneAndDelete({ bid_id: req.params.bid_id })
    //             .then(() => res.json("Item deleted."))
    //             .catch((err) => res.status(400).json("Error: " + err));
    //     });

    router.route("/bids")
        .get((req,res)=>{
            Bid.find()
                .then((bids)=>{res.json(bids)})
                .catch((err) =>{
                    res.status(400).json("Error: " + err);
                })
        })

    router.route("/bids/:poke_id")
        .get((req,res)=>{
            Bid.find({ poke_id: req.params.poke_id })
            .then((bid)=>{res.json(bid)})
            .catch((err) =>{
                res.status(400).json("Error: " + err);
            })
        })

    router.route("/bid/:bid_id")
        .get((req,res)=>{
            Bid.find({ bid_id: req.params.bid_id })
            .sort({ bid_amount: -1 })
            .then((bid)=>{res.json(bid)})
            .catch((err) =>{
                res.status(400).json("Error: " + err);
            })
        })

    router.route("/bid/highest/:bid_id")
        .get((req,res)=>{
            Bid.find({ bid_id: req.params.bid_id })
            .sort({ bid_amount: -1 }) // Sort in descending order
            .limit(1) // Limit to the highest bid
            .then(bids => {
                if (bids.length > 0) {
                    res.json(bids[0]); // Send the highest bid
                } else {
                    res.status(404).json("No bids found for this bid_id.");
                }
            })
            .catch(err => {
                res.status(400).json("Error: " + err);
            });
        })

    router.route("/bid/add").post((req,res)=>{

        const bid_id = req.body.bid_id
        const poke_id = req.body.poke_id
        const username = req.body.username
        const bid_date = req.body.bid_date
        const bid_amount = req.body.bid_amount
           
        const newBid = new Bid( {
            bid_id,poke_id,username,bid_date,bid_amount,
        })

        newBid
            .save()
            .then(()=>res.json("New Bid Added"))
            .catch((err) =>{
                res.status(400).json("Error: " + err);
            })
        })

    // router.route("/bids/delete/:bid_id")
    //     .delete((req, res) => {
    //         Bid.findOneAndDelete({ bid_id: req.params.bid_id })
    //             .then(() => res.json("Item deleted."))
    //             .catch((err) => res.status(400).json("Error: " + err));
    //     });
