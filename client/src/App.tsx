import './App.css'
import StripePayment from './features/payment/StripePayment'

function App() {
  console.log('All env variables:', import.meta.env);
  console.log('Stripe Publishable Key:', import.meta.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
  return (
    <>
     <StripePayment />
    </>
  )
}

export default App
