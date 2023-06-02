import express from "express"
import 'dotenv/config.js'
import {createConnection} from "./db/connect.js"
import authRoute from "./routes/auth.js";
import sgMail from "@sendgrid/mail"
import userRoute from "./routes/user.js";
import "../src/middleware/passport/userAuthStrategy.js"
const app=express();
const PORT=process.env.PORT;
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
app.use(express.json());
app.use(express.urlencoded({extended:false}));
const connectAndTryAgainIfFail=async()=>{
    try {
        await createConnection()
        console.log("database connected...!")
    } catch (error) {
        console.log("error connecting, will retry after 5 minute")
        setTimeout(connectAndTryAgainIfFail,1000*5)
    }
}
connectAndTryAgainIfFail() 
app.use("/auth",authRoute)
app.use("/user",userRoute)
app.listen(PORT,()=>{
    console.log(`app is up on PORT : ${PORT}`)
});


