import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import jwt from 'jsonwebtoken';
import User from '../../../utils/User'
import Modal from 'react-modal';
import { Tadpole } from "react-svg-spinners";
import { useState, useEffect } from 'react';
import mongoSanitize from 'express-mongo-sanitize';
import { useRouter } from 'next/router';
import { connectUserDB, userDbConnection } from '../../../utils/connectUserDB'



// This can be in a separate file for reusability across pages


const Onboarding = ({ userId, status }) => {

  const router = useRouter();

  // if onboarding step is 2, take the user to the last step which is 
  // to link the accounts in the settings
  if (status !== 'password' || status !== 'payment') {
    router.push('/sign-in');
    return null; // Return null to prevent rendering the component
  }

  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  

  async function handlePayment() {
    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:4050/api/create-checkout-session', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId, token })
      });

      const data = await response.json();

      if (data.url) {
        // take the user to the Stripe page
        setIsLoading(false)
        window.location.href = data.url;
      } else {
        // handle error: maybe show a message to the user
        setIsError(true)
      }
    } catch (error) {
      setIsError(true)
      console.error('Error creating Stripe checkout session:', error);
    }
  }

  async function handlePassword() {

  }


  const customStyles = {
    content: {
      width: '55%',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      fontFamily: 'Ubuntu',
    },
  };

  // closing the Modal
  function closeModal() {
      setModalIsOpen({
          isOpen: false,
          text: ''
      })
  }

  return (<div className='onboarding-parent-container'>
      <Header />
      <div className='onboarding-container'>

        {
          status === 'password' ? 
            <div className='password-container'>
              <h1>Step 1: Set Up a Password</h1>
              <div>
                <div>
                  <label>Password</label>
                  <input />
                </div>
                <div>
                  <label>Confirm Password</label>
                  <input />
                </div>
              </div>
            </div>
          : status === 'payment' ?
            <div className='payment-container'>
              <h1>Step 2: Let's Take Care of the Payment</h1>
              <div style={{ width: '100%', position: 'relative' }}>
                <button type='button' className={`button ${isLoading ? 'loading' : ''}`} onClick={handlePayment} disabled={isLoading ? true : false}>
                  {isLoading ? <Tadpole width={25} color='white' /> : <>Pay Via Stripe <img src='/pinterest/external-white.svg' /></>}</button>
              </div>
            </div> 
          : 
          <div>
            Generic page 
          </div>
        }


      </div>

        <Modal
          isOpen={isError}
          style={customStyles}
          onRequestClose={closeModal}
          contentLabel="Example Modal"
            >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h2 style={{ fontFamily: 'Ubuntu', fontSize: '1.3em', color: '#1c1c57' }} >Server Error</h2>
            <span onClick={() => location.reload()}
              style={{ backgroundColor: '#1465e7', 
              color: "white",
              padding: '10px 0px 10px 0px', 
              cursor: 'pointer',
              fontFamily: 'Ubuntu',
              fontSize: '1.1em' }}>Try again</span>
          </div>
        </Modal>

      <Footer />
  </div>)

}

export default Onboarding;



export async function getServerSideProps(context) {
  console.log('runnign')

  try {

    const token = context.query.token;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log((decoded.action !== 'onboarding' && decoded.action === 'payment') || 
    ((decoded.action === 'onboarding' && decoded.action !== 'payment')))
    if (decoded.action !== 'onboarding') {
      throw new Error('Invalid action');
    }
    console.log('first')
    const userId = decoded.userId
    await connectUserDB()
    if (decoded.action === 'onboarding') { 
      // assuming onboardingStep is 0
      console.log('second')
      const sanitizedUserId = mongoSanitize.sanitize(userId);
      let user = await userDbConnection.model('User').findOne({ _id: sanitizedUserId });
      if (!user || user.onboardingStep !== 0) throw new Error('User not found');
      return {
        props: {
          userId, status: 'password'
        }
      }; 
    }

    if (decoded.action === 'payment') {
      console.log('third')
      const sanitizedUserId = mongoSanitize.sanitize(userId);
      let user = await userDbConnection.model('User').findOne({ _id: sanitizedUserId });
      if (!user || user.onboardingStep !== 1) throw new Error('User not found');
      return {
        props: {
          userId, status: 'payment'
        }
      };
    }

  } catch (error) {
    return {
      notFound: true
    };
  }

}