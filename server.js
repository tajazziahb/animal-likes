const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { MongoClient, ObjectId } = require('mongodb')
const multer = require('multer')
const fs = require('fs')

const upload = multer({ dest: 'public/uploads/' })

const PORT = process.env.PORT || 3000
const MONGODB_URI = process.env.MONGODB_URI
const DB_NAME = 'animals'

let db

// ensure uploads dir exists (prevents silent 500 on first upload)
if (!fs.existsSync('public/uploads')) fs.mkdirSync('public/uploads', { recursive: true })

MongoClient.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    db = client.db(DB_NAME)
    console.log(`✅ Connected to "${DB_NAME}"`)
  })
  .catch(err => {
    console.error('❌ Mongo connection failed:', err.message)
  })

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public'))

function requireDb(req, res, next) {
  if (!db) return res.status(503).send('Database not connected')
  next()
}

app.get('/', (req, res, next) => {
  db.collection('animal').find().toArray((err, animals) => {
    if (err) return next(err)
    res.render('index.ejs', { animals })
  })
})

// POST: create animal (file upload) help from Google 
app.post('/animals', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded') // input name must be "image"
  const name = req.body.name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
  if (!name) return res.status(400).send('Name is required')

  const doc = {
    name,
    img: '/uploads/' + req.file.filename,
    thumbUp: 0,
    userSubmitted: true,
    createdAt: new Date()
  }

  db.collection('animal').insertOne(doc, (err, result) => {
    if (err) return res.status(500).send('Error saving animal')
    res.json({ _id: result.insertedId, name: doc.name, img: doc.img, thumbUp: 0, userSubmitted: true })
  })
})

app.put('/animals/thumbUp', (req, res) => {
  const name = req.body.name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
  if (!name) return res.status(400).send('Missing name')
  db.collection('animal').findOneAndUpdate(
    { name },
    { $inc: { thumbUp: 1 } },
    { returnDocument: 'after' },
    (err, result) => {
      if (err) return res.status(500).send('DB error')
      if (!result.value) return res.status(404).send('Animal not found')
      res.json({ thumbUp: result.value.thumbUp })
    }
  )
})

app.put('/animals/thumbDown', (req, res) => {
  const name = req.body.name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
  if (!name) return res.status(400).send('Missing name')
  db.collection('animal').findOneAndUpdate(
    { name },
    { $inc: { thumbUp: -1 } },
    { returnDocument: 'after' },
    (err, result) => {
      if (err) return res.status(500).send('DB error')
      if (!result.value) return res.status(404).send('Animal not found')
      res.json({ thumbUp: result.value.thumbUp })
    }
  )
})

// DELETE: only user-submitted animals
app.delete('/animals/:id', requireDb, (req, res) => {
  const id = req.params.id
  if (!id) return res.status(400).send('Missing id')
  db.collection('animal').deleteOne({ _id: new ObjectId(id) }, (err, result) => {
    if (err) return res.status(500).send('Error deleting animal')
    if (!result.deletedCount) return res.status(404).send('Animal not found or not deletable')
    res.json({ ok: true })
  })
})

app.listen(PORT, () => console.log(`🚀 Server listening on ${PORT}`))