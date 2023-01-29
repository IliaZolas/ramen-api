const mongoose = require('mongoose')


const newRamenTemplate = new mongoose.Schema ({ 
        title:{
            type:String,
            required:true,
        },
        description:{
            type:String,
            required:true
        },
        ingredients:{
            type:String,
            required:true
        }
        ,
       id:{
            type:mongoose.Types.ObjectId,
            required:false
        }
        ,
        imageUrl: {
            type: String,
            required:true
        }
        ,
        public_id: {
            type: String,
            required: true
        }
        // date:{
        //     type:Date,
        //     default:Date.now
        // }
})

module.exports = mongoose.model('ramentable', newRamenTemplate )