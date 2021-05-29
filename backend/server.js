const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

const uri = 'mongodb+srv://agentraghav:ClsMHXKeq9qQn55o@cluster0.6npik.mongodb.net/blog?retryWrites=true&w=majority';
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});
const connection = mongoose.connection;
connection.once("open", () =>
    console.log("MongoDB connection has been established!")
);

const postsRouter = require("./routes/posts");
const authRouter = require("./routes/auth");

app.use("/auth", authRouter);
app.use("/server/posts", postsRouter);

if (process.env.NODE_ENV === "production") {
    app.use(express.static("frontend/build"));

    app.get("*", (req, res) => {
        res.sendFile(
            path.resolve(__dirname, "../frontend", "build", "index.html")
        );
    });
}

app.listen(PORT, () => console.log(`Server is running at PORT ${PORT}!`));
