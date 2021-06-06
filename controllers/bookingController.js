const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Garden = require('./../models/gardenModel');
const factory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAync');
const AppError = require('./../utils/appError');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    //get the currently booked garden
    const garden = await Garden.findById(req.params.gardenId);
    console.log(garden);


    //create checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/`,
        cancel_url: `${req.protocol}://${req.get('host')}/gardens/${garden.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.gardendId,
        line_items: [
            {
              name: `${garden.name} Garden`,
              description: garden.subHeading,
              images: [`https://blooming-peak-67620.herokuapp.com/imgs/gardens/${garden.imageCover}`],
              amount: garden.amount * 100,
              currency: "INR",
              quantity: 1
            }
          ]
    })


    //create session as  response
    res.status(200).json({
        status: 'success',
        session
      });

});


