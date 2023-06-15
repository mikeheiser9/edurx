import mongoose from "mongoose";
mongoose.connection.on('error',(err)=>{
    console.log("mongoose connection error catch.." ,err)
    process.exit(1);
});
mongoose.connection.on('disconnected',(err)=>{
    console.log("mongoose connection disconnected..")
});
export const createConnection=async()=>{
        const dbUrl=process.env.DB_URL ? process.env.DB_URL:"mongodb://localhost:27017"
        const dbName=process.env.DB_NAME;
        await mongoose.connect(dbUrl,{
            dbName,
            autoCreate:true
        });
}
