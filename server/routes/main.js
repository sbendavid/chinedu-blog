const express = require("express");
const router = express.Router();

// Routes
router.get("", (req, res) => {
    res.render("index");
});

router.get("/home", (req, res) => {
    res.render("home");
});

router.get("/chat", (req, res) => {
    res.render("chat",);
});

router.get("/aboutUs", (req, res) => {
    res.render("about");
});

router.get("/contactUs", (req, res) => {
    res.render("contact");
});

router.get("/post", (req, res) => {
    res.render("post");
});

module.exports = router;