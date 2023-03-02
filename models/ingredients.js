const mongoose = require('mongoose')


const newIngredientTemplate = new mongoose.Schema ({ 
        ingredient:{
            type:String,
            required:true,
        },
        calories:{
            type:Number,
            required:true
        },
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
})

module.exports = mongoose.model('ingredienttable', newIngredientTemplate )