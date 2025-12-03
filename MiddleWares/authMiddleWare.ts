import { Request, Response, NextFunction } from "express";
import { json } from "stream/consumers";
import jwt from "jsonwebtoken";


export default function authHandler(req:Request,res:Response,next:NextFunction){

    let token:any = req.headers.token
    if(!token) return res.status(401).json({status:"error" , message:"you have to provid token"})
    let decodedToken = jwt.verify(token,"key")
    req.user = decodedToken.id
    next() 

}