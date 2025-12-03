import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import List from "../modules/ListModule";

async function isValidId(req:Request,res:Response,next:NextFunction){
    let id = req.params.id
    
    
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(401).json({status:"error" , message:"this id is not valid"})
    if(!await List.findById(id)) return res.status(401).json({status:"error" , message:"this item is not exist"})
        next()

    
} 

async function missionId(req:Request,res:Response,next:NextFunction) {
    let missionid = req.params.missionid 

    if(!mongoose.Types.ObjectId.isValid(missionid)) return res.status(401).json({status:"error" , message:"this id is not valid"})
    if(!await List.findById(missionid)) return res.status(401).json({status:"error" , message:"this item is not exist"})
        next() 
}

async function taskId(req:Request,res:Response,next:NextFunction) {
    let taskId = req.params.taskid 
    let isExistTaskId = await List.findById(req.params.missionid)
    let isTrueId = isExistTaskId.tasks.find((T)=>T._id.toString() === taskId.toString() )



    if(!mongoose.Types.ObjectId.isValid(taskId)) return res.status(401).json({status:"error" , message:"this id is not valid"})
    if(!isTrueId) return res.status(401).json({status:"error" , message:"this item is not exist"})
        next() 
}


export { 
    isValidId, 
    missionId, 
    taskId 
};