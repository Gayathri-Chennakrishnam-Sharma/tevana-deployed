const fs = require('fs');
const mongoose = require('mongoose');
const Garden = require('./../../models/gardenModel');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connected successfully'));

const gardens = JSON.parse(
  fs.readFileSync(`${__dirname}/garden-packages.json`, 'utf-8')
);

const importData = async () => {
  try {
    await Garden.create(gardens);
    console.log('data loaded successfully');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Garden.deleteMany();
    console.log('data deleted successfully');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
