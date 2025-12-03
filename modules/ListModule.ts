import { kMaxLength } from "buffer";
import mongoose from "mongoose";


let taskSchema = new mongoose.Schema({

    name:{
        type : String , 
        required:true,
        trim:true,
        maxLength :10
        
    },
    completed:{
        type:Boolean,
        default:false,
    },

   priority : {
    type:Number,
    default:null,
    required:false,
    },

   fav : {
    type:Boolean,
    default:false,
    required:false,

    },

    date:{
        type:Date,
        default:Date.now
    },
    done:{
        type:Date
    },
   
})


let missionSchema = new mongoose.Schema({
  missionName: { type: String, required: true, trim: true },
  tasks: [taskSchema] ,
  date:{type:Date , default:Date.now},
  fav : {type:Boolean,default:false,required:false},
   user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }

})



let List = mongoose.model("List",missionSchema)


export default  List