import { json } from 'stream/consumers';
import express, { Request, Response, Router } from "express";
import List from "../modules/ListModule";
import asynHandler from "express-async-handler"
import mongoose from "mongoose";
import  {isValidId} from "../MiddleWares/validationId";
import authHandler from "../MiddleWares/authMiddleWare"
const route: Router = express.Router();
import jwt from "jsonwebtoken";

// create a new mission
route.post("/createmission",authHandler,asynHandler(
  async(req:Request,res:Response)=>{
    let list = new List({
      missionName:req.body.missionName,
      user : req.user
    })
    let listCreation = await list.save()
    res.status(201).json({status:"success" , action:"mission created" , data:listCreation})
  }

));


// edit a mission name
route.put("/renamemission/:id",authHandler,isValidId,asynHandler(
  async(req:Request,res:Response)=>{
    let missionName = await List.findOneAndUpdate(
          {
        _id: new mongoose.Types.ObjectId(req.params.id),
        user: new mongoose.Types.ObjectId(req.user)
      },
      {$set:{missionName:req.body.missionName}},
      {new:true}
    )

    res.status(203).json({status:"success" , action:"mission renamed" , data:missionName})
  }

))


// get all missions + name filter
route.get("/missions",authHandler,asynHandler(
  async(req:Request,res:Response)=>{
    let {missionName } = req.query
    let search:any = {}
    if(req.query.missionName){search.missionName = {$regex:missionName , $options:"i"}}
    let date:any = Number(req.query.date) ||1
    let list = await List.find({...search, user :req.user}).sort({date:date})
    res.status(200).json({status:"success" , action:"get all missions" , data:list})
  }
))


// get a mission by id + time sort
route.get("/missions/:id",authHandler,isValidId,asynHandler(
  async(req:Request,res:Response)=>{
    let tasksSort:any  = {}
    let date:any = Number(req.query.date) ||1
    let priority:any = Number(req.query.priority) ||1
    let completed = req.query.completed 
    if(date) tasksSort.date = Number(req.query.date) > 0 ? 1 : -1;
    if(priority) tasksSort.priority = Number(req.query.priority) > 0 ? 1 : -1;

    let list = await List.aggregate([
      {$match:{_id:new mongoose.Types.ObjectId(req.params.id),user:new mongoose.Types.ObjectId(req.user)}},
      {$set : {tasks:{$filter:{input:"$tasks", as: "tasks" ,cond:{$eq:["$$tasks.completed", completed ==="true"? true :"$$tasks.completed"]}}}}},
      {$set:{tasks:{$sortArray:{input:"$tasks",sortBy:tasksSort }}}},
    ])

    res.status(200).json({status:"success" , action:"get mission by id" , data:list})
  }
))


// edit fav mission with id
route.put("/editmissionfav/:id",authHandler,isValidId,asynHandler(
    async(req:Request,res:Response)=>{

      let listCheck = await List.findOne({
    _id: new mongoose.Types.ObjectId(req.params.id),
    user: new mongoose.Types.ObjectId(req.user)
});

       let list = await List.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(req.params.id),
        user: new mongoose.Types.ObjectId(req.user) },
        {$set:{"fav": !listCheck.fav}  },
        {new:true}
       )

      res.status(203).json({status:"success" , action:"Mission fav changed" , data:list})
    }
))


// delete a one mission with id
route.delete("/deletemission/:id",authHandler,isValidId,asynHandler(
    async(req:Request,res:Response)=>{
      

       let list = await List.findOneAndDelete(
        { _id: new mongoose.Types.ObjectId(req.params.id),
        user: new mongoose.Types.ObjectId(req.user) },
        )
        

      res.status(203).json({status:"success" , action:"A Mission deleted" , data:list})
    }
))



//delete all missions
route.delete("/missions",authHandler,asynHandler(
  async(req:Request,res:Response)=>{
    let listDelete:any = await List.deleteMany(
      {user: new mongoose.Types.ObjectId(req.user)}
    )

    res.status(200).json({status:"success" , action:"all missions deleted" , data:listDelete})
  }
))



// get all fav missions
route.get("/favmissions",authHandler,asynHandler(
    async(req:Request,res:Response)=>{
      let favList = await List.aggregate([
        {$match :{user:new mongoose.Types.ObjectId(req.user)}},
        {$match:{fav:true}}
      ])


    res.status(200).json({status:"success" , action:"fav missions" , data:favList})

    }
))




// delete missions by select 

route.delete("/deletebyselect",authHandler,asynHandler(
    async(req:Request,res:Response)=>{
      
     let id:any =  req.body.Ids.map((I)=>{return I })   

      let results = await List.deleteMany({
        _id:{"$in":id}
      }) 
        
      res.status(203).json({status:"success" , action:"selected missions deleted" , data:results})
    }
))











export default route;
