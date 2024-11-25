const express = require('express');
const morgan = require('morgan');
const app = express();
const AppError = require('./utils/appError');
const rateLimit = require('express-rate-limit');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 100,
    message: 'too many requests from this IP, please try again later.',
});
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use('/api', limiter);
app.use(express.json());

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
