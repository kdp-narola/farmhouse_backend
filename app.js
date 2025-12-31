const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const createHttpError = require('http-errors');
const fileUpload = require('express-fileupload');
require('dotenv').config({ path: '.env.example', quiet: true });
const helmet = require('helmet');
const app = express();

app.use(cors({
  origin: [process.env.FRONTEND_URL, 'http://localhost:8080'],
  optionsSuccessStatus: 200
}));
app.use(fileUpload());
// require('./middlewares/googleAuth');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(require('./middlewares/response.interceptor'));

app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());

app.get('/health', (req,res) => {
  res.send('API is running')
})
app.use('/webhook', require('./routes/webhook.routes'));
app.use(express.json());
app.use('/api/v1', require('./routes/index'));

app.use(function (req, res, next) {
  next(createHttpError(404));
});

app.use(require('./middlewares/error.interceptor'));

module.exports = app;
