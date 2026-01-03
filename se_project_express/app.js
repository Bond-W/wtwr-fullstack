const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");
const {NOT_FOUND} = require("./utils/errors");


const app = express();
const { PORT = 3001 } = process.env;

app.use(cors());


mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db')
.then(() => {
  console.log("Connected to DB");
  return require("./models/user").init();
})
.then(() => {
  console.log("User indexes ensured");
})
.catch(console.error);

app.use(express.json());
app.use("/", mainRouter);


const { INTERNAL_SERVER_ERROR } = require('./utils/errors');

app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: 'Requested resource not found' });
});


app.use((err, req, res, next) => {
  console.error(err);
  const status = err.statusCode || INTERNAL_SERVER_ERROR;
  const message =
    status === INTERNAL_SERVER_ERROR
      ? 'An error has occurred on the server.'
      : err.message;
  res.status(status).send({ message });
});


app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});