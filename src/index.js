const express = require("express");
const { Server } = require("socket.io");
require("dotenv").config();
const path = require("path");
const fs = require("fs");
const http = require("http"); // Import HTTP for Socket.io
const cookieParser = require("cookie-parser");
const Library = require("../src/models/testlibrary.model.js");
const cors = require("cors");
const { initSocket } = require("./socket");
const app = express();
const server = http.createServer(app); // Create HTTP server for WebSocket

initSocket(server);
app.use(cookieParser());
app.use(express.json());
const allowedOrigins = [
 "https://testify-frontend-x333.vercel.app",,
  
  "http://localhost:5000"
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    }, 
    methods: ["GET", "POST" , "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

const port = process.env.PORT || 8000;

const Route = require("./Routes/routers.js");
app.use("/api", Route);
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
};

const insertDataOnStart = async () => {
  try {
    const dataExists = await Library.countDocuments();
    if (dataExists === 0) {
      const jsonFilePath = path.join(__dirname, "../src/assest/data.json"); 
      const data = JSON.parse(fs.readFileSync(jsonFilePath, "utf-8"));
      await Library.insertMany(data);
      console.log("Data successfully inserted into MongoDB.");
    } else {
      console.log("Data already exists in the database.");
    }
  } catch (error) {
    console.error("Error inserting data:", error);
  }
};

insertDataOnStart();

connectDB();

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

server.timeout = 100000;
