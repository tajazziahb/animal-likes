const express = require('express')
const bodyParser = require('body-parser')
const { MongoClient } = require('mongodb')

const app = express()
let db

const PORT = process.env.PORT || 3000 
const MONGODB_URI = process.env.MONGODB_URI 
const DB_NAME = process.env.DB_NAME || 'animals'

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public'))

function requireDb(req, res, next) {
  if (!db) return res.status(503).send('Service warming up, try again.')
  next()
}

app.get('/', requireDb, (req, res, next) => {
  db.collection('animal').find().toArray((err, animals) => {
    if (err) return next(err)
    res.render('index.ejs', { animals })
  })
})

app.put('/animals/thumbUp', requireDb, (req, res) => { //
  const name = req.body && req.body.name
  if (!name) return res.status(400).send('Missing name')
  db.collection('animal').findOneAndUpdate(
    { name },
    { $inc: { thumbUp: 1 } },
    { returnOriginal: false },
    (err, result) => {
      if (err) return res.status(500).send('DB error')
      if (!result.value) return res.status(404).send('Animal not found')
      res.json({ thumbUp: result.value.thumbUp })
    }
  )
})

app.put('/animals/thumbDown', requireDb, (req, res) => {
  const name = req.body && req.body.name
  if (!name) return res.status(400).send('Missing name')
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

MongoClient.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  if (err) {
    console.error('Mongo connection failed:', err.message)
    return
  }
  db = client.db(DB_NAME)
  app.listen(PORT, () => console.log(`Listening on ${PORT}`))
})
