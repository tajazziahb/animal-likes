const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { MongoClient } = require('mongodb')

const PORT = process.env.PORT || 3000
const MONGODB_URI = process.env.MONGODB_URI
const DB_NAME = 'animals'

let db

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

app.get('/', requireDb, async (req, res) => {
  try {
    const animals = await db.collection('animal').find().toArray()
    res.render('index.ejs', { animals })
  } catch (err) {
    res.status(500).send('Error fetching animals')
  }
})

app.put('/animals/thumbUp', requireDb, async (req, res) => {
  const name = req.body?.name
  if (!name) return res.status(400).send('Missing name')
  try {
    const result = await db.collection('animal').findOneAndUpdate(
      { name },
      { $inc: { thumbUp: 1 } },
      { returnDocument: 'after' }
    )
    if (!result.value) return res.status(404).send('Animal not found')
    res.json({ thumbUp: result.value.thumbUp })
  } catch (err) {
    res.status(500).send('DB error')
  }
})

app.put('/animals/thumbDown', requireDb, async (req, res) => {
  const name = req.body?.name
  if (!name) return res.status(400).send('Missing name')
  try {
    const result = await db.collection('animal').findOneAndUpdate(
      { name },
      { $inc: { thumbUp: -1 } },
      { returnDocument: 'after' }
    )
    if (!result.value) return res.status(404).send('Animal not found')
    res.json({ thumbUp: result.value.thumbUp })
  } catch (err) {
    res.status(500).send('DB error')
  }
})

app.listen(PORT, () => console.log(`🚀 Server listening on ${PORT}`))
