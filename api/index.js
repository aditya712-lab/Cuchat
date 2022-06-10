const express = require("express");
const app = express();

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users")
const authRoute = require("./routes/auth")
const conversationRoute = require("./routes/conversations")
const messageRoute = require("./routes/messages")
const cors = require('cors');


dotenv.config();

mongoose.connect(process.env.MONGO_URL, ()=>{
    console.log("Connected to mongo")
});

//middleware

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use(cors({ origin: true }));

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);

app.listen(8080, ()=>{
    console.log("Backend server is running");
})