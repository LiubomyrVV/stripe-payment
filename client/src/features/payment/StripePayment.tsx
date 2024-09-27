import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { createPaymentIntent } from './paymentSlice';
import { AppDispatch, RootState } from '../../store/store';

const stripePromise = loadStripe(`pk_test_51Q3NrVP9k3QiW6zZ6FEcDaSiMB5yQo5A49AGS4jWwunAC2K7QMkixSdza7npN1L3001W0XXNYMwiq97R9E2ALPV0001d37SBLz`);

const CheckoutForm: React.FC = () => {
    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch<AppDispatch>();
    const { clientSecret, loading, error } = useSelector((state: RootState) => state.payment);
    
    useEffect(() => {
        dispatch(createPaymentIntent(10)); // Amount in cents
    }, [dispatch]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!stripe || !elements) return;

        const cardElement = elements.getElement(CardElement);
        if (cardElement == null) return;

        const { error, paymentIntent } = await stripe.confirmCardPayment(`pk_test_51Q3NrVP9k3QiW6zZ6FEcDaSiMB5yQo5A49AGS4jWwunAC2K7QMkixSdza7npN1L3001W0XXNYMwiq97R9E2ALPV0001d37SBLz`, {
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
            {error && <div>{typeof error === 'string' ? error : error.message ? error.message : JSON.stringify(error)}</div>}

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
