import express from "express"
import 'dotenv/config.js'
import {createConnection} from "./db/connect.js"
import authRoute from "./routes/auth.js";
import sgMail from "@sendgrid/mail"
import userRoute from "./routes/user.js";
import "../src/middleware/passport/userAuthStrategy.js"
import postRoute from "./routes/post.js";
import resRoute from "./routes/resource.js";
import cors from "cors"
import { fileUpload,fileTypeCheckAndRename} from "./middleware/multer.js";
import sheetRoute from "./routes/googleSheet.js";
import logger from 'morgan'
import notificationRoute from "./routes/notification.js";
import "./crons/timeSensitiveNotification.js"
const app=express();
const PORT=process.env.PORT;
app.use(cors({
    origin:process.env.FRONTEND_SERVER_URL.toString()
}))
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
app.use(express.json());
app.use(logger('dev'));
app.use(express.static('public'))
app.use(express.urlencoded({extended:false}));
app.use(fileUpload)
app.use(fileTypeCheckAndRename)
const connectAndTryAgainIfFail=async()=>{
    try {
        await createConnection()
        console.log("database connected...!")
    } catch (error) {
        console.log("error connecting, will retry after 5 minute")
        setTimeout(connectAndTryAgainIfFail,1000*5)
    }
}
connectAndTryAgainIfFail();
app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/post", postRoute);
app.use("/google-sheets", sheetRoute);
app.use("/notification",notificationRoute);
app.use("/resource", resRoute);
app.listen(PORT, () => {
  console.log(`app is up on PORT : ${PORT}`);
});


