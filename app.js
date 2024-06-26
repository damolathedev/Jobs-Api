require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const exlimiter = require('express-rate-limit')

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const authRouter = require('./routes/auth')
const jobRouter = require('./routes/jobs')
const connectDB = require('./db/connect')
const authenticateUser = require('./middleware/authentication')

app.use(express.json());
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/job',authenticateUser, jobRouter)
// extra packages

// routes
app.get('/', (req, res) => {
  res.send('jobs api');
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

app.set('trust  proxy', 1)

app.use(exlimiter({
  windowMs: 15 * 60 * 1000,
  max: 100
}))
app.use(helmet)
app.use(cors)
app.use(xss)

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
