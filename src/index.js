const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./db');
const router = require('./routs/index');

const { User } = require('./models/models');

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
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