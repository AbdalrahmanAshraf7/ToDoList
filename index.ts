import express from 'express';
import cors from "cors";
import env from "dotenv"
import mongoose from 'mongoose';
import errorHandler from "./MiddleWares/errorMiddleWare"
env.config()


///////routes////////
import List from "./routes/missions";
import Task from "./routes/tasks"
import Auth from "./routes/auth"
///////routes////////


const app = express();
const PORT = 5000;


mongoose.connect(process.env.MongoUrl).then(()=>console.log("dbWork!!")).catch((err)=>console.log(err))

app.use(express.json());
app.use(cors());


app.use("/api", List)
app.use("/api", Task)
app.use("/api", Auth)


app.use(errorHandler)
app.listen(PORT, () => console.log(`SV is working on ${PORT}`));
