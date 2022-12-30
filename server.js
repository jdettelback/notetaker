const express = require("express");
const path = require("path");

const { readFromFile, readAndAppend, writeToFile } = require("./fsUtils");

const PORT = process.env.PORT || 3001;

const notes = express();

notes.use(express.json());
notes.use(express.urlencoded({ extended: true }));

const crypto = require("crypto");
console.log(crypto.randomUUID());

notes.use(express.static("public"));

notes.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

notes.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

notes.get("/api/notes", (req, res) =>
  readFromFile("./db/notes.json").then((data) => res.json(JSON.parse(data)))
);

notes.post("/api/notes", (req, res) => {
  console.log(req.body);

  if (req.body) {
    const newItem = { ...req.body };
    newItem.id = crypto.randomUUID();
    readAndAppend(newItem, "./db/notes.json");

    res.json(`Note added successfully`);
  } else {
    res.error("Error in adding note");
  }
});

notes.delete("/api/notes/:notes_id", (req, res) => {
  const notesId = req.params.notes_id;
  readFromFile("./db/notes.json")
    .then((data) => JSON.parse(data))
    .then((json) => {
      const result = json.filter((note) => note.id !== notesId);
      writeToFile("./db/notes.json", result);

      res.json(`Item ${notesId} has been deleted 🗑️`);
    });
});

notes.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
