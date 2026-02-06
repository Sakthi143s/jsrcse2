const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.get("/", (req, res) => {
    res.send("Minimal server running");
});

mongoose.connect("mongodb://127.0.0.1:27017/test_db")
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log("MongoDB error", err));

const PORT = 5002;
app.listen(PORT, () => {
    console.log(`Minimal server running on port ${PORT}`);
});
