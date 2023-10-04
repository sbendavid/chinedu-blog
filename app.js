require("dotenv").config();

const express = require("express");
const app = express();
const expressLayout = require("express-ejs-layouts");
const socket = require("socket.io");
const nodeMail = require('nodemailer')

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);

});

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Template Engine
app.use(expressLayout);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs")

// Route setup
app.use("/", require("./server/routes/main"));

// Socket setup
const io = socket(server);

//we use a set to store users, sets objects are for unique values of any type
const activeUsers = new Set();

io.on("connection", function (socket) {
  console.log("Made socket connection");

  socket.on("new user", function (data) {
    socket.userId = data;
    activeUsers.add(data);
    //... is the the spread operator, adds to the set while retaining what was in there already
    io.emit("new user", [...activeUsers]);
  });

  socket.on("disconnect", function () {
      activeUsers.delete(socket.userId);
      io.emit("user disconnected", socket.userId);
    });

    socket.on("chat message", function (data) {
      io.emit("chat message", data);
  });

});

async function mainMail(name, email, phone, message) {
  const transporter = await nodeMail.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.PASSWORD,
    },
    secure: true,
    port: 465,
  });
  const mailOption = {
    from: email,
    to: process.env.GMAIL_USER,
    subject: 'Contact Form Submission',
    html: `You got a message from 
    Email : ${email}
    Name: ${name}
    Message: ${message}`,
  };
  try {
    await transporter.sendMail(mailOption);
    return Promise.resolve("Message Sent Successfully!");
  } catch (error) {
    return Promise.reject(error);
  }
}

mainMail();