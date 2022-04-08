import createError from 'http-errors';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);

// 👇️ "/home/john/Desktop/javascript"
const __dirname = path.dirname(__filename);

import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import OTPRouter from './routes/otp.js';
// import loginRouter from './routes/login.js';
// import logoutRouter from './routes/logout.js';

const app = express();


//Config Files
import env from 'dotenv';
env.config();

// db connection
import initDB from './helper/db.js';
initDB();

// Middleware
// import verifyBaseToken from './middleware/basetoken.js';
// import verifyTempToken from './middleware/temptoken.js';


// view engine setup
app.set('views', path.join(__dirname,  'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static( path.join(__dirname,  'public')));

app.use('/otp', OTPRouter);
// app.use('/login', verifyTempToken, loginRouter);
// app.use('/api', verifyBaseToken);
// app.use('/api/logout', logoutRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("Me3temed");
});

// headers
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  next();
});

app.listen(PORT, () => {
  console.log(`Me3temed live on port ${PORT}`);
});

export default app;
