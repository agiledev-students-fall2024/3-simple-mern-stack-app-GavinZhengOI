require('dotenv').config({ silent: true }) // load environmental variables from a hidden file named .env
const express = require('express') // CommonJS import style!
const morgan = require('morgan') // middleware for nice logging of incoming HTTP requests
const cors = require('cors') // middleware for enabling CORS (Cross-Origin Resource Sharing) requests.
const mongoose = require('mongoose')

const app = express() // instantiate an Express object
app.use(morgan('dev', { skip: (req, res) => process.env.NODE_ENV === 'test' })) // log all incoming requests, except when in unit test mode.  morgan has a few logging default styles - dev is a nice concise color-coded style
app.use(cors()) // allow cross-origin resource sharing

// use express's builtin body-parser middleware to parse any data included in a request
app.use(express.json()) // decode JSON-formatted incoming POST data
app.use(express.urlencoded({ extended: true })) // decode url-encoded incoming POST data

// connect to database
mongoose
  .connect(`${process.env.DB_CONNECTION_STRING}`)
  .then(data => console.log(`Connected to MongoDB`))
  .catch(err => console.error(`Failed to connect to MongoDB: ${err}`))

// load the dataabase models we want to deal with
const { Message } = require('./models/Message')
const { User } = require('./models/User')

app.get('/about', (req, res) => {
  res.json({
    name: "Zihan Zheng",
    bio: [
      "Hey, I’m Zihan Zheng! I’m a junior at NYU studying Computer Science and Mathematics. I’m really into playing around with home labs, experimenting with Kubernetes, Docker, and various automation setups—always trying to make things more efficient. I’m also super interested in the latest tech products, space exploration, and autonomous driving, especially Tesla’s Full Self-Driving (FSD) technology. I love keeping up with the cutting-edge of tech and innovation.",
      "This past summer, I interned at NVIDIA, where I worked on the in-cabin Copilot system for their next-gen DRIVE Thor platform. It was an exciting project where I helped integrate voice features like ASR and TTS, optimized response times, and worked on a RAG pipeline. It was really cool to see how these technologies come together in autonomous driving systems.",
      "On top of that, I’ve also competed in ICPC, where I placed 2nd in the Greater NY Regional Contest and went on to the North America Finals in 2023 and 2024. Competitive programming has been a huge part of my journey, and I love solving complex problems under pressure!"
    ],
    photoUrl: "/photo.jpg" // Update to use the local photo
  });
});

// a route to handle fetching all messages
app.get('/messages', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({})
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})

// a route to handle fetching a single message by its id
app.get('/messages/:messageId', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({ _id: req.params.messageId })
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})
// a route to handle logging out users
app.post('/messages/save', async (req, res) => {
  // try to save the message to the database
  try {
    const message = await Message.create({
      name: req.body.name,
      message: req.body.message,
    })
    return res.json({
      message: message, // return the message we just saved
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    return res.status(400).json({
      error: err,
      status: 'failed to save the message to the database',
    })
  }
})

// export the express app we created to make it available to other modules
module.exports = app // CommonJS export style!
