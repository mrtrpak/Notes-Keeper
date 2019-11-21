const express = require("express");
const path = require("path");
const notes = require("./db/db.json");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3333;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res)=> {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});

// convenience variable
const source = "./db/db.json";

app.get("/api/notes", (req, res) => {
    fs.readFile(source, (err, data) => {
        if (err) throw err;
        res.json(JSON.parse(data));
    });
});

app.post("/api/notes", (req, res) => {
    const newNote = req.body;
    newNote.id = notes.length + 1;
    notes.push(newNote);
    fs.writeFile(source, JSON.stringify(notes), err => {
        if (err) return err;
        res.sendStatus(200);
    });
});

app.delete("/api/notes/:id", (req, res) => {
    const noteId = parseInt(req.params.id);
    const noteObj = notes.find(note => note.id === noteId);
    const deleteNote = notes.indexOf(noteObj);
    notes.splice(deleteNote, 1);
    fs.writeFile(source, JSON.stringify(notes), err => {
        if (err) return err;
    });
    res.send(notes);
});

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});