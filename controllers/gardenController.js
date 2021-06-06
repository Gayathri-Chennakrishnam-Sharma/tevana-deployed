const Garden = require('./../models/gardenModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAync');
const AppError = require('./../utils/appError');

exports.getAllGardens = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Garden.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const gardens = await features.query;

  res.status(200).json({
    status: 'success',
    results: gardens.length,
    data: {
      gardens,
    },
  });
});

exports.addGarden = catchAsync(async (req, res, next) => {
  const newGarden = await Garden.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      garden: newGarden,
    },
  });
});

exports.getGarden = catchAsync(async (req, res, next) => {
  const garden = await Garden.findById(req.params.id);

  if (!garden) {
    return next(new AppError('no garden found with this ID', 404));
  }

  res.status(201).json({
    status: 'success',
    data: {
      garden,
    },
  });
});

exports.updateGarden = catchAsync(async (req, res, next) => {
  const garden = await Garden.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!garden) {
    return next(new AppError('no garden found with this ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      garden,
    },
  });
});

exports.deleteGarden = catchAsync(async (req, res) => {
  const garden = await Garden.findByIdAndDelete(req.params.id);

  if (!garden) {
    return next(new AppError('no garden found with this ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
