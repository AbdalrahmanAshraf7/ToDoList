import { Request, Response, NextFunction } from "express";

export default function errorHndler(err:any,req:Request,res:Response,next:NextFunction){

    const error = err.statusCode || 500
    const msg = err.message ||"SOME THING WENT WRONG"

    res.status(error).json({errorMsg : msg })

}