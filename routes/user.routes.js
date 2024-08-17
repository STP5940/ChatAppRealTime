const express = require('express');
const app = express();
// const { check } = require('express-validator');
// const router = express.Router();

const ExampleController = require('../app/controllers/ExampleController');

/* GET home page. */
app.get('/serverinfo', ExampleController.show);

module.exports = app;