const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const start = async () => {
  try {

    app.listen(PORT, () => {
      console.log(`Example app listening on port ${PORT}`)
    })

  } catch (e) {
    console.log(e)
  }
}

start();