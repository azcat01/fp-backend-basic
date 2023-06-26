const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  password: String,
  createdAt: {
    type: Date,
    default: new Date(),
  }
}, {
  collection: "admins",
  versionKey: false,
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  username: String,
  password: String,
  createdAt: {
    type: Date,
    default: new Date(),
  }
}, {
  collection: "users",
  versionKey: false,
});

const imgSchema = new mongoose.Schema({
    _id: ObjectId,
    files_id: ObjectId,
    n: Number,
    data: Buffer,
}, {
  collection: "fs.chunks"
});

const imgDataSchema = new mongoose.Schema({
  _id: ObjectId,
  length: Number,
  chunkSize: Number,
  uploadDate: Date,
  filename: String,
  contentType : String
}, {
  collection: "fs.files"
});

const courseSchema = new mongoose.Schema({
  courseId: {
    type: Number,
    default: 0
  },
  courseName: String,
  instructor: String,
  users: [String],
  updated_at: {
    type: Date,
    default: new Date()
  }
});

const userScoreSchema = new mongoose.Schema({
  user: String,
  score: {
    courseId: [Number],
    value: Number
  },
  updated_at: {
    type: Date,
    default: new Date()
  }
});

const Admin = mongoose.model("Admin", adminSchema);
const User = mongoose.model("User", userSchema);
const Image = mongoose.model("Image", imgSchema);
const ImageData = mongoose.model("ImageData", imgDataSchema);

module.exports = {
  Admin,
  User,
  Image,
  ImageData
}