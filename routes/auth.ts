import express, { Request, Response, Router } from "express";
import asynHandler from "express-async-handler"
import  {isValidId} from "../MiddleWares/validationId";
import { User,registerVlidation,signInVlidation} from "../modules/UserModule";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const route: Router = express.Router();


route.post("/register",asynHandler(
    async(req:Request ,res:Response )=>{

        let {error}:any = registerVlidation(req.body)
        if(error) return res.json({message :  error.details[0].message})

               
        if(await User.findOne({userName : req.body.userName})) return res.status(401).json({status:"error" , Message:"this user name already used"})
        if(await User.findOne({email : req.body.email})) return res.status(401).json({status:"error" , Message:"this user email already used"})
   
            req.body.password = await bcrypt.hash(req.body.password,await bcrypt.genSalt(10))
            
            let register = new User({
                userName:req.body.userName,
                email:req.body.email,
                password:req.body.password,
                
            })
            
            let token = jwt.sign({id:register._id , userName:register.userName , email : register.email },"key",{expiresIn:"30d"})
            let result:any = await register.save()
            let {password,...other } = result._doc

           return  res.status(201).json({status : "success", action:"user created successfully" , data:{...other , token } , })
        

    }
))

route.post("/signin",asynHandler(
    async(req:Request ,res:Response )=>{

        let {error}:any = signInVlidation(req.body)
        if(error) return res.json({message :  error.details[0].message})
        let user =  await User.findOne({userName : req.body.userName})

        if(!await User.findOne({userName : req.body.userName})) return res.status(401).json({status:"error", message:"wrong user name or password"})
        if(!await bcrypt.compare(req.body.password ,user.password )) return res.status(401).json({status:"error", message:"wrong user name or password"})

            req.body.password = await bcrypt.hash(req.body.password,await bcrypt.genSalt(10))
    
            let token = jwt.sign({id:user._id , userName:user.userName , email : user.email },"key",{expiresIn:"30d"})

           return  res.status(201).json({status : "success", action:"sign in  successfully" , data:{ userName :user.userName  , token }  })
           
    }
))











export default route;