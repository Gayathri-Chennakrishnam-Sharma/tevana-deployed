const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewController.getOveriew);
router.get('/gardens', authController.isLoggedIn, viewController.getGardens);
// router.get('/gardens/:slug', viewController.getGarden);
router.get('/signup', authController.isLoggedIn, viewController.getSingupForm);
router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
router.get('/me', authController.protect, viewController.getAccount);

router.post(
  '/submit-user-data',
  authController.protect,
  viewController.updateUserData
);

module.exports = router;
