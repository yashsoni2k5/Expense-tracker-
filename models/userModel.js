const mongoose = require("mongoose");
const passport = require("passport");
const plm = require("passport-local-mongoose")
const expenses = require("./expenseModel")
const userModel = new mongoose.Schema({
    username : String,
    password : Number,

    expenses : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "expenses"
    }]
 })
 userModel.plugin(plm)

 module.exports = mongoose.model("usermodel",userModel);