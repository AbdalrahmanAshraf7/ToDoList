import express, { Request, Response, Router } from "express";
import List from "../modules/ListModule";
import asynHandler from "express-async-handler"
import  {isValidId , taskId , missionId} from "../MiddleWares/validationId";
import authHandler from "../MiddleWares/authMiddleWare"
import mongoose from "mongoose";

const route: Router = express.Router();




// add a task to a mission
route.put("/addtask/:missionid",authHandler,missionId,asynHandler(
    async(req:Request,res:Response)=>{

        let list = await List.findOneAndUpdate(
            {_id:req.params.missionid , user:new mongoose.Types.ObjectId(req.user)},
            {$push:{tasks:req.body}}
        )
        res.status(202).json({status:"success" , action:"Add Task" , data:list})
    }
))

// delete a task from a mission
route.delete("/deletetask/:missionid/:taskid",authHandler,missionId,taskId,asynHandler(
    async(req:Request,res:Response)=>{

         await List.findOneAndUpdate(
            {_id:req.params.missionid , user:new mongoose.Types.ObjectId(req.user) },
            {$pull:{tasks:{_id:req.params.taskid}}},
            
        )
        let updatedList = await List.findById(req.params.missionid)
        res.status(200).json({status:"success" , action:"Task Deleted" , data:updatedList})
    }
))

// edit a task name
route.put("/edittaskname/:missionid/:taskid",authHandler,missionId,taskId,asynHandler(
    async(req:Request,res:Response)=>{
       let list = await List.findOneAndUpdate(
          { _id: req.params.missionid, "tasks._id": req.params.taskid , user:new mongoose.Types.ObjectId(req.user) },
        {$set:{"tasks.$.name":req.body.name} },
        {new:true}
       )
       res.status(202).json({status:"success" , action:"Task Name Edited" , data:list})
    }
))

// edit a task completion
route.put("/edittaskcompletion/:missionid/:taskid",authHandler,missionId,taskId,asynHandler(
    async(req:Request,res:Response)=>{

        let listCheck =await List.findOne(
            {_id:req.params.missionid,"tasks._id":req.params.taskid , user:new mongoose.Types.ObjectId(req.user)},
            {"tasks.$":1}
        )

       let list = await List.findOneAndUpdate(
          { _id: req.params.missionid, "tasks._id": req.params.taskid ,user:new mongoose.Types.ObjectId(req.user)  },
        {$set:{"tasks.$.completed": !listCheck.tasks[0].completed , "tasks.$.done":listCheck.tasks[0].completed === true ? null : Date.now() } },
        {new:true}
       )

      res.status(202).json({status:"success" , action:"Task completion changed" , data:list})
    }
))


// edit a task fav
route.put("/edittaskfav/:missionid/:taskid",authHandler,missionId,taskId,asynHandler(
    async(req:Request,res:Response)=>{

        let listCheck =await List.findOne(
            {_id:req.params.missionid,"tasks._id":req.params.taskid , user:new mongoose.Types.ObjectId(req.user)},
            {"tasks.$":1}
        )

       let list = await List.findOneAndUpdate(
          { _id: req.params.missionid, "tasks._id": req.params.taskid ,  user:new mongoose.Types.ObjectId(req.user) },
        {$set:{"tasks.$.fav": !listCheck.tasks[0].fav}  },
        {new:true}
       )

      res.status(202).json({status:"success" , action:"Task fav changed" , data:list})
    }
))



// edit a task priority
route.put("/edittaskpriority/:missionid/:taskid",authHandler,missionId,taskId,asynHandler(
    async(req:Request,res:Response)=>{

    
       let list = await List.findOneAndUpdate(
          { _id: req.params.missionid, "tasks._id": req.params.taskid ,  user:new mongoose.Types.ObjectId(req.user) },
        {$set:{"tasks.$.priority": req.body.priority } },
        {new:true ,runValidators:true},
        
       )

       res.status(202).json({status:"success" , action:"Task priority changed" , data:list})
    }
))


// delete all tasks in a mission 

route.delete("/deletetasks/:missionid",authHandler,missionId,asynHandler(
    async(req:Request,res:Response)=>{

    
       let list = await List.findOneAndUpdate(
        { _id: req.params.missionid,user:new mongoose.Types.ObjectId(req.user)},
        {$set:{"tasks": [] } },
        {new:true ,runValidators:true},
        
       )

       res.status(200).json({status:"success" , action:"All tasks deleted" , data:list})
    }
))















export default route;
