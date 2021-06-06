const mongoose = require('mongoose');
const slugify = require('slugify');

const gardenSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'a garden must have a name'],
    unique: true,
    trim: true,
  },
  slug: String,
  imageCover: {
    type: String,
    required: [true, 'a garden must have a cover image'],
  },
  subHeading:{
    type: String,
    required: [true, 'a garden must have a subHeading'],
    unique: true,
    trim: true,
  },
  summary:{
    type: String,
    required: [true, 'a garden must have a summary'],
    unique: true,
    trim: true,
  },
  location: {
    required: [true, 'a garden must have location/s at which it is available'],
    type: String,
    trim: true,
  },
  availability: {
    required: [true, 'a garden must have availability specification'],
    type: String,
    trim: true,
  },
  nature: {
    required: [true, 'a garden must have nature specification'],
    type: String,
    trim: true,
  },
  potsIncluded: {
    required: [true, 'a garden must have availability specification'],
    type: String,
    trim: true,
  },
  amount: {
    type: Number,
    required: [true, 'A garden package must have a price'],
    default: 100
  },
  package: {
    required: [true, 'a garden must have number of packages specification'],
    type: String,
    trim: true,
  },
  ratingAverage: {
    type: Number,
    default: 4.5,
  },
  ratingQuantity:{
    type:Number,
    default:5,
  },
  price:{
    type: Number,
    required: [true, 'a garden must have a price which is amount*100, since stripe conversions are complex'],
    default: 10000
  }
});

gardenSchema.index({ slug: 1 });
gardenSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});


const Garden = mongoose.model('Garden', gardenSchema);

module.exports = Garden;
