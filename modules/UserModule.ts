import mongoose from "mongoose";
import joi, { func } from "joi";

let UserSchema = new mongoose.Schema({
    userName:{
        type:String,
        required : true,
        trim:true,
        maxLength:50 , 
        minLength:6
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password:{
        type:String,
        required : true,
        trim:true,
    }
})


let User = mongoose.model("User",UserSchema)


function registerVlidation(obj:any){
    const Schema = joi.object(
        {
        userName : joi.string().trim().required().min(6).max(15),
        email : joi.string().trim().required().email(),
        password : joi.string().trim().required().min(6).max(13)
        }
    )
    let {error} = Schema.validate(obj)
    return {error}
}

function signInVlidation(obj:any){
    const Schema = joi.object(
        {
        userName : joi.string().trim().required().min(6).max(15),
        password : joi.string().trim().required().min(6).max(13)
        }
    )
    let {error} = Schema.validate(obj)
    return {error}
}


export {
    User,
    registerVlidation,
    signInVlidation,
}






