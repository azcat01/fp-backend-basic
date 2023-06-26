require('dotenv').config();
const { env } = require("./server.config");
const mongoose = require('mongoose');

const uri = env === 'prod'? process.env.ATLAS_URI : 'mongodb://127.0.0.1:27017/hitorigoto';

const dbConnect = mongoose.connect(
  uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true})
    .then(() => console.log("MongoDB is  connected successfully"))
    .catch((err) => console.error(err));

module.exports = dbConnect;