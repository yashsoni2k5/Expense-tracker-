const mongoose  = require("mongoose");
const userModel = require("./userModel");

const expenses = new mongoose.Schema({
    amount : Number,
    remark : String,
    category : String,
    payment_method : {
        type : String,
       
    },
    user : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "userModel"
    }]
},{timestamps :true})
 
module.exports = mongoose.model("expenses",expenses);