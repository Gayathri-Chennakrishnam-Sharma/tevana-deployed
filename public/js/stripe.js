const stripe = Stripe('pk_test_51Iz4jeSJZMM3bl9Qllm7TZzswGDn3ZVgzCRxOH7FAU7wUiuM2ugDNmM4p4M0EDvLPpAbopEd0P8X0LjA1dmnI7eD00qrpw7Ytv');
import axios from 'axios';
import { showAlert } from './alerts';
// import {loadStripe} from '@stripe/stripe-js';


export const bookGarden = async gardenId => {
  try {
    // this.stripe = await loadStripe("pk_test_51Iz4jeSJZMM3bl9Qllm7TZzswGDn3ZVgzCRxOH7FAU7wUiuM2ugDNmM4p4M0EDvLPpAbopEd0P8X0LjA1dmnI7eD00qrpw7Ytv");
    // 1) Get checkout session from API
    const session = await axios(
      `http://127.0.0.1:4000/api/v1/booking/checkout-session/${gardenId}`
    );
    console.log(session);

    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
