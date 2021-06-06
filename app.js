const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const stripe = require('stripe');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/globalErrorHndler');
const gardenRouter = require('./routes/gardenRoute');
const userRouter = require('./routes/userRoute');
const bookingRouter = require('./routes/bookingRoute');
const viewRouter = require('./routes/viewRoute');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//global middlewares
//set security HTTP
app.use(helmet());

app.use(compression());

//body parser
app.use(express.json({ limit: '10kb' }));

app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(cookieParser());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// eslint-disable-next-line prefer-arrow-callback
app.use(function (req, res, next) {
  res.setHeader(
    'Content-Security-Policy',
    "script-src 'self' https://cdnjs.cloudflare.com"
  );
  next();
});

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//limit request
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too Many requests from this IP ,please try again after an hour',
});
app.use('/api', limiter);

app.use(express.json());

app.use(mongoSanitize());

app.use(xss());

app.use(hpp());
//serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', viewRouter);
app.use('/api/v1/gardens', gardenRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/booking', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on the server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
