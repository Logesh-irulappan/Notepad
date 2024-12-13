const express = require("express");
const bodyParser = require("body-parser");
const pg = require("pg");

const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "Notepad",
    password: "*******",
    port: "5432",
});
db.connect();


app.get("/", async (req, res) => {
    let notes = (await db.query("SELECT * FROM notes")).rows;
    res.render("home.ejs", { notes: notes });
});

app.get("/goBack", (req, res) => {
    res.redirect("/");
});

app.post("/editNote", async (req, res) => {
    let noteId = req.body["selectedNote"];
    let data = (await db.query("SELECT * FROM notes WHERE id = ($1)", [noteId])).rows[0];
    res.render("notepad.ejs", { title: data.title, id: data.id, content: data.content });
});

app.post("/createNote", async (req, res) => {
    let newTitle = req.body["newTitle"];
    var defaultContent = "Type something here...";
    await db.query("INSERT INTO notes (title, content) VALUES ($1, $2)", [newTitle, defaultContent]);
    res.redirect("/");
});

app.post("/submitNotepad", async (req ,res) => {
    let title = req.body["title"];
    let content = req.body["content"];
    let id = req.body["submitId"];
    await db.query("UPDATE notes SET title = ($1), content = ($2) WHERE id = ($3)", [title, content, id]);
    res.redirect("/");
});

app.post("/deleteNote", async (req, res) => {
    let noteId = req.body["selectedNote"]
    await db.query("DELETE FROM notes WHERE id = ($1)", [noteId]);
    res.redirect("/");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:3000`);
});




