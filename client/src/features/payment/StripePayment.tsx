import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { createPaymentIntent } from './paymentSlice';
import { AppDispatch, RootState } from '../../store/store';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY as string);

const CheckoutForm: React.FC = () => {
    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch<AppDispatch>();
    const { clientSecret, loading, error } = useSelector((state: RootState) => state.payment);

    useEffect(() => {
        dispatch(createPaymentIntent(0)); // Amount in cents
    }, [dispatch]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!stripe || !elements) return;

        const cardElement = elements.getElement(CardElement);
        if (cardElement == null) return;

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret!, {
            payment_method: {
                card: cardElement,
            },
        });

        if (error) {
            console.error(error.message);
        } else {
            console.log('Payment successful:', paymentIntent);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            <button type="submit" disabled={!stripe || loading}>
                {loading ? 'Processing...' : 'Pay'}
            </button>
            {error && <div>{error}</div>}
        </form>
    );
};

const StripePayment: React.FC = () => {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm />
        </Elements>
    );
};

export default StripePayment;
