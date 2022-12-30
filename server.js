const express = require('express');
const path = require('path');
// const { clog } = require('./middleware/clog');
// const fs = require('fs');
const {
  readFromFile,
  readAndAppend,
  writeToFile,
} = require('./fsUtils');

const PORT = process.env.PORT || 3001;

const notes = express();

//app.use(clog);

notes.use(express.json());
notes.use(express.urlencoded({ extended: true }));
//app.use('/api', api);

// const Nanoid = require('nanoid');
// const NanoidAsync = require('nanoid/async');

// console.log(`UUID with Nano ID sync: ${Nanoid.nanoid()}`);

// (async function() {
//   const nanoId = await NanoidAsync.nanoid();
//   console.log(`UUID with Nano ID async: ${nanoId}`);
// })();

// node uuid-nanoid.js;

notes.use(express.static('public'));

// retrieve all notes
// notes.get('/', (req, res) =>
//   readFromFile('./db/notes.json').then((data) => res.json(JSON.parse(data)))
// );


notes.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

notes.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

notes.get('/api/notes', (req, res) =>
  readFromFile('./db/notes.json').then((data) => res.json(JSON.parse(data)))
);

notes.post('/api/notes', (req, res) => {
  console.log(req.body);

  const { title, item } = req.body;

  if (req.body) {
    readAndAppend(req.body, './db/notes.json');

   res.json(`Note added successfully`);
  } else {
    res.error('Error in adding note');
  }
});

// notes.delete('/api/notes', (req, res) => {
//   const notesId = req.params.notes_id;
//   readFromFile('./db/notes.json')
//     .then((data) => JSON.parse(data))
//     .then((json) => {
//       // Make a new array of all tips except the one with the ID provided in the URL
//       const result = json.filter((tip) => tip.tip_id !== tipId);

//       // Save that array to the filesystem
//       writeToFile('./db/tips.json', result);

//       // Respond to the DELETE request
//       res.json(`Item ${tipId} has been deleted 🗑️`);
//     });
// });

notes.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);

//module.exports = notes;