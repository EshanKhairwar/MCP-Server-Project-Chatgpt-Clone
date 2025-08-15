const express=require("express")
const { authUser } = require("../middleware/auth.middleware")

const router=express.Router()



router.get("/",authUser,(req,res)=>{
    res.render("home")
})



module.exports=router;