var express = require('express');
var router = express.Router();
require("../models/db")

const user = require("../models/userModel");
const expenses = require("../models/expenseModel")
const passport = require("passport")
const Localstrategy = require("passport-local");
const expenseModel = require('../models/expenseModel');
passport.use(new Localstrategy(user.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/sign-up', function(req, res, next) {
  res.redirect('/register');
});
router.get('/register', function(req, res, next) {
  res.render("register")
});
router.post('/register',async function(req, res, next) {
                                                            
    await user.register(
       { username : req.body.username,
          },req.body.password)
  
    res.redirect("/sign-in");

});
router.get("/sign-in",function(req,res,next){
  res.render("sign-in")
})


router.post('/sign-in', passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/sign-in" ,
}), function(req, res, next) {

});
router.get("/profile",isLoggedIn, async function(req,res,next){
   try {
        const { expenses } = await req.user.populate("expenses") ;
        console.log(req.user, expenses);
        res.render("profile", { admin: req.user, expenses });
    } catch (error) {
        res.send(error);
    }
   
})
router.get("/createexpense",isLoggedIn, function(req,res,next){
  res.render("createexpense")
});
router.post("/createexpense",isLoggedIn,async function(req,res,next){
  try {
    
    let createdexpense = await new expenses(req.body)
  createdexpense.user= req.user._id
  req.user.expenses.push(createdexpense._id)
    await req.user.save()
    await createdexpense.save()
    res.redirect("/profile")
} catch (error) {
    res.send(error);
}
})

router.get('/update/:id', async function(req, res, next) {
  const obj =await expenses.findById(req.params.id)
  res.render("update",{obj: obj})
  });
router.post('/update/:id', async function(req, res, next) {
 await expenses.findByIdAndUpdate(req.params.id,req.body)
 res.redirect("/profile")
  });

router.get("/delete/:_id",isLoggedIn, async function(req,res,next){
 try {
  await expenses.findByIdAndDelete(req.params._id);
   // res.render("profile",{expenses:e})
   
  res.redirect("/profile")
 } catch (error) {
  res.send(error)
 }
  
  
});
function isLoggedIn(req,res,next){
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/sign-in")
  }
}

router.get("/sign-out", isLoggedIn, function (req, res, next) {
  req.logout(() => {
      res.redirect("/sign-in");
  });
});

module.exports = router;
