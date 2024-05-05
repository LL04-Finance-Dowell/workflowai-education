import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import successFulPayment from "./../../assets/paymentSuccessful.svg";
import failurePayment from "./../../assets/failure.svg"
import { useStateContext } from '../../contexts/contextProvider';
import axios from 'axios';


const ThankYouPage = () => {
    const { savedSripeKey, savedPaypalKey } = useStateContext()
    const [successful, setSuccessful] = useState(null)
    const navigate = useNavigate();
    const MainURL = localStorage.getItem("MainURL")

    const handleGoBack = () => {
        window.close();// This will navigate back to the previous route
    };
    useEffect(() => {
       const savedStripeKey = localStorage.getItem("stripeKey");
       const savedStripePaymentID = localStorage.getItem("stripePaymentId");
       const savedPaypalSecretKey = localStorage.getItem("paypalClientSecret");
       const savedPaypalPaymentId = localStorage.getItem("paypalPaymentId");
       const savedPaypalClientId = localStorage.getItem("paypalClientId");
        
        console.log("saved stripe", savedSripeKey);
        console.log("saved paypal", savedStripePaymentID);

        if (savedStripePaymentID !== null ) {
            const resVerify = axios.post("https://100088.pythonanywhere.com/api/workflow/verify/payment/stripe", {
                stripe_key: savedStripeKey,
                id: savedStripePaymentID
            }).then(data =>{
                if(data.status == 200){
                    setSuccessful(true);
                } else {
                    setSuccessful(false);
                    console.log(data);
                }
            }) .catch(err =>  {
                setSuccessful(false);
                console.log(err);
            })

        }

        if (savedPaypalPaymentId !== null ) {
            const paypalVerify = axios.post("https://100088.pythonanywhere.com/api/workflow/verify/payment/paypal", {
                paypal_client_id: savedPaypalClientId,
                paypal_secret_key: savedPaypalSecretKey,
                id: savedPaypalPaymentId
            }).then(data =>{
                if(data.status == 200){
                    setSuccessful(true);
                } else {
                    setSuccessful(false);
                    console.log(data);
                }
            }) .catch(err =>  {
                setSuccessful(false);
                console.log(err);
            })
            
            // if (resVerify.data.status == "succeeded") {
            //     setSuccessful(true);
            // } else {
            //     setSuccessful(false);
            //     console.log("Your Stripe Payment Not verified");
            // }
        }

    }, [])
    
    return (
        <div className='shadow-lg p-3'>
            <div className="vh-100 d-flex justify-content-center align-items-center">
                {/* <h1>Hello</h1> */}
                <div>
                    {
                        (successful != null) && (successful ? (<>
                            <div className="mb-4 text-center">
                                <img src={successFulPayment} alt='payment successful' />
                            </div>
                            <div className="text-center">
                                <h1>Thank You!</h1>
                                <p>your payment was successfull</p>
                                <button className="btn btn-primary" onClick={handleGoBack}>Back Home</button>
                            </div>
                        </>) : 
                        (<>
                            <div className="mb-4 text-center">
                                <img src={failurePayment} alt='payment successful' />
                            </div>
                            <div className="text-center">
                                <h1>Sorry</h1>
                                <p>your payment was not successful</p>
                                <button className="btn btn-primary" onClick={handleGoBack}>Back Home</button>
                            </div>
                        </>)
                        
                        
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default ThankYouPage;