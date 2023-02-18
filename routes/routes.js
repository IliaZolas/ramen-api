const express = require('express')
const routes = express.Router()
const newUserTemplateCopy = require('../models/users')
const newRamenTemplateCopy = require('../models/ramens')
const Ramens = require('../models/ramens')
const Users = require('../models/users')
const AWS = require('aws-sdk')
const upload = require('../middleware/multer-aws')
const cloudinary = require('cloudinary')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("./auth");


// Index Routes

routes.get('/', (req, res) => {
    res.send('Hello world');
})

// User Routes

routes.post('/app/signup', (req, res) =>{

    bcrypt
    .hash(req.body.password, 10)
    .then((hashedPassword) => {
    const user = new newUserTemplateCopy({
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        password: hashedPassword,
        imageUrl: req.body.imageUrl,
        public_id: req.body.publicId
    })

    user
        .save()
        .then((result) => {
        res.status(201).send({
            message: "User Created Successfully",
            result,
        });
        })
        .catch((error) => {
        res.status(500).send({
            message: "Error creating user",
            error,
        });
        });
    })
    .catch((e) => {
    res.status(500).send({
        message: "Password was not hashed successfully",
        e,
    })
    })
})


routes.post('/app/login', (req, res) => {
    console.log("login route triggered")

        Users.findOne({ email: req.body.email })
        .then((user) => {
        bcrypt
            .compare(req.body.password, user.password)
            .then((passwordCheck) => {
                console.log("password check object:", passwordCheck)
                if(!passwordCheck ) {
                    console.log( "No password provided")
                }
                const token = jwt.sign(
                    {
                    userId: user._id,
                    userEmail: user.email,
                    },
                    "RANDOM-TOKEN",
                    { expiresIn: "24h" }
                )
                res.status(200).send({
                    message: "Login Successful",
                    email: user.email,
                    userId: user._id,
                    token,
                })
            })
            .catch((error) => {
            res.status(400).send({
                message: "Passwords do not match",
                error,
            });
            });
        })
        .catch((e) => {
        res.status(404).send({
            message: "Email not found",
            e,
        })
        }) 
})


routes.get('/app/user/show/:id', (req, res) => {
    const userId = req.params.id;
    console.log("GET SINGLE USER RECORD:", userId)

    Users.findOne({_id: userId})
    .then(data => res.json(data))
})

routes.put('/app/user/update/:id', auth, (req, res) => {
    const userId = req.params.id
    console.log("update user id route", userId)

    Users.updateOne({_id: userId},
        {
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,

        imageUrl: req.body.imageUrl,
        public_id: req.body.publicId
        })
        .then(data => res.json(data))

})

routes.delete('/app/user/delete/:id', (req, res) => {
    const userId = req.params.id
    console.log(userId,":delete route")

    Users.deleteOne({_id: userId}, function (err, _result) {
        if (err) {
            res.status(400).send(`Error deleting listing with id ${userId}!`);
        } else {
            console.log(`${userId} document deleted`);
        }
    })
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUD_API_KEY,
        api_secret: process.env.CLOUD_API_SECRET
    })

    const publicId = req.params.public_id
    console.log("cloudinary check public_id for delete:", publicId)
    
    cloudinary.v2.uploader
            .destroy(publicId)
            .then(result=>console.log("cloudinary delete", result))
            .catch(_err=> console.log("Something went wrong, please try again later."))

})

// Ramen Routes

// Cloudinary
routes.post('/app/ramen/upload', (req,res) => {
    
})

routes.post('/app/ramen/add', (req, res) =>{
    const newRamen = new newRamenTemplateCopy({
        title:req.body.title,
        description:req.body.description,
        ingredients:req.body.ingredients,
        imageUrl: req.body.imageUrl,
        public_id: req.body.publicId 
    })
    newRamen.save()
    .then(data =>{
        res.json(data)
        console.log("Send request successful:", data)
    })
    .catch(error => {
        res.json(error)
        console.log("Send request failed", error)
    }) 
})

routes.get('/app/ramen/show/:id', (req, res) => {
        const ramenId = req.params.id
        console.log("GET SINGLE RECORD:", ramenId)

        Ramens.findOne({_id: ramenId})
        .then(data => res.json(data))
        
})

routes.get('/app/ramen', (req, res) => {
    Ramens.find()
    .then(data => res.json(data))
})

routes.put('/app/ramen/update/:id',auth, (req, res) => {
    const ramenId = req.params.id
    console.log(ramenId, "update ramen id route")

    Ramens.updateOne({_id: ramenId},
        {
        title:req.body.title,
        description:req.body.description,
        ingredients:req.body.ingredients,
        imageUrl: req.body.imageUrl,
        public_id: req.body.publicId 
        })
        .then(data => res.json(data))
})

routes.delete('/app/ramen/delete/:id/:public_id', auth, (req, res) => {
    const ramenId = req.params.id
    console.log(ramenId,":delete route")

    Ramens.deleteOne({_id: ramenId}, function (err, _result) {
        if (err) {
            res.status(400).send(`Error deleting listing with id ${ramenId}!`);
        } else {
            console.log(`${ramenId} document deleted`);
        }
    })
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUD_API_KEY,
        api_secret: process.env.CLOUD_API_SECRET
    })

    const publicId = req.params.public_id
    console.log("cloudinary check public_id for delete:", publicId)
    
    cloudinary.v2.uploader
            .destroy(publicId)
            .then(result=>console.log("cloudinary delete", result))
            .catch(_err=> console.log("Something went wrong, please try again later."))
})


module.exports = routes
