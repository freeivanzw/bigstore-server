const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const fileupload = require('express-fileupload');
const bodyParser = require('body-parser');
const path = require('path');
const sequelize = require('./db');
const router = require('./routs/index');

const { User } = require('./models/models');

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileupload({
  useTempFiles : true,
}));
app.use(cors({
  // origin: 'http://localhost:3000',
  origin: 'https://freeivanzw.github.io/bigstore',
}));
app.use(express.static(path.resolve(__dirname, 'upload')))
app.use('/api', router)

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    app.listen(PORT, () => {
      console.log(`Server working on port: ${PORT}`)
    })

  } catch (e) {
    console.log(e)
  }
}

start();