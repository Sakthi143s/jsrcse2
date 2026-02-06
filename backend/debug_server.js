const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send("Minimal server running");
});

const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Minimal server running on port ${PORT}`);
});
