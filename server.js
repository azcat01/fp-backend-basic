require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { env, port } = require("./src/configs/server.config");
const userRouter = require("./src/router/userRouter");
const adminRouter = require("./src/router/adminRouter");
const dbConnect = require('./src/configs/db.config');

const app = express();

dbConnect;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use("/admin", adminRouter)
app.use("/", userRouter);

app.listen(port,() => console.log(`Server started on [env, port] = [${env}, ${port}]`));