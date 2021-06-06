const express = require('express');
const gardenController = require('./../controllers/gardenController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, gardenController.getAllGardens)
  .post(gardenController.addGarden);
router
  .route('/:id')
  .get(gardenController.getGarden)
  .patch(gardenController.updateGarden)
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    gardenController.deleteGarden
  );

module.exports = router;
