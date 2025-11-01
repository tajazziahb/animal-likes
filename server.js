const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

var db;
const url = "mongodb+srv://bootht14_db_user:teletubbies@cluster0.pchtn1f.mongodb.net";
const dbName = "animals";

app.listen(2000, () => {
  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    if (error) throw error;
    db = client.db(dbName);
    console.log("Connected to `" + dbName + "`!");
  });
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  db.collection('animal').find().toArray((err, results) => {
    if (err) return console.log(err);
    res.render('index.ejs', { animals: results });
  });
});

app.put('/animals/thumbUp', (req, res) => {
  const name = req.body.name
  db.collection('animal').findOneAndUpdate(
    { name }, // Filter to find the animal by name
    { $inc: { thumbUp: 1 } },
    { returnOriginal: false }, // Return the updated document
    (err, result) => {
      if (err) return res.status(500).send('DB error')
      if (!result.value) return res.status(404).send('Animal not found')
      res.json({ thumbUp: result.value.thumbUp }) // Send back the updated thumbUp count
    }
  )
})

app.put('/animals/thumbDown', (req, res) => {
  const name = req.body.name
  db.collection('animal').findOneAndUpdate(
    { name },
    { $inc: { thumbUp: -1 } },
    { returnOriginal: false },
    (err, result) => {
      if (err) return res.status(500).send('DB error')
      if (!result.value) return res.status(404).send('Animal not found')
      res.json({ thumbUp: result.value.thumbUp })
    }
  )
})


