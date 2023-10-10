import Modal from 'react-modal';
import { Tadpole } from "react-svg-spinners";
import { useState } from 'react';
import { useRouter } from 'next/router';



// This can be in a separate file for reusability across pages


const SpecialOnboarding = ({ userId, status }) => {

  const [action, setAction] = useState(status)
  const [tk, setTk] = useState('')

  const [pass, setPass] = useState('')
  const [confirPass, setConfirmPass] = useState('')
  const [passErrors, setPassErrors] = useState(null)

  // if onboarding step is 2, take the user to the last step which is 
  // to link the accounts in the settings

  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // for the pricing tables
  const [tableClicked, setTableClicked] = useState()
  const [lookupKey, setLookupKey] = useState(null)

  const [modalIsOpen, setModalIsOpen] = useState(false)
  

  async function handlePayment() {

    if (!tableClicked) {
      setModalIsOpen(true)
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:4050/api/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId, tk, paymentPlan: lookupKey })
      });

      const data = await response.json();

      if (data.url) {
        // take the user to the Stripe page
        window.location.href = data.url;
      } else {
        // handle error: maybe show a message to the user
        console.log(data)
        setIsError(true)
      }
    } catch (error) {
      setIsError(true)
      console.error('Error creating Stripe checkout session:', error);
    }
  }

  async function handlePassword() {
    if (pass != confirPass) {
      setPassErrors(['Passwords do not match'])
      return
    }
    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:4050/api/set-up-password', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId, pass })
      });

      const data = await response.json();
      if (data.errors) {
        setPassErrors(data.errors.map(er => er.msg))
        setIsLoading(false)
      } else if (data.success) {
        setIsLoading(false)
        setTk(data.token)
        setAction('payment')
      }

    } catch (error) {
      setIsError(true)
      console.error('Server Error');
    }

  }



  function handleTableClicked(e) {
    setTableClicked(e.currentTarget.name)
    setLookupKey(e.currentTarget.getAttribute("data-lookup-key"))
  }

  const customStyles = {
    content: {
      width: '20%',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      fontFamily: 'Ubuntu',
    },
  };

  function toError404() {
    const router = useRouter();
    router.push('/404');
  }


  return (<div className='onboarding-container'>
        {
          action === 'password' ? 
            <div className='password-container'>
              <h1>Step 1: Set Up a Password</h1>
              <div className='pass-holder'>
                {
                  passErrors ? passErrors.map(err => <p style={{ width: '100%', textAlign: 'center', marginBottom: '15px',
                  marginTop: '0px', color: "red", fontSize: '.85em' }}>{err}</p>)  : ''
                }
                <div className='pass'>
                  <label htmlFor='pass'>Password</label>
                  <input type='password' id='pass' placeholder='Enter your new password' 
                  onChange={(e) => { setPassErrors(null); setPass(e.target.value)}} />
                </div>
                <div className='confirm-pass'>
                  <label htmlFor='confirm-pass'>Confirm Password</label>
                  <input type='password' id='confirm-pass' placeholder='Confirm your password'
                  onChange={(e) => { setPassErrors(null); setConfirmPass(e.target.value) }}/>
                </div>

                <button disabled={isLoading ? true : false} className={`button ${isLoading ? 'loading' : ''}`} onClick={(handlePassword)}>{isLoading ? <Tadpole height={15} color='white' /> : 'Confirm'}</button>
              </div>
            </div>
          : action === 'payment' ?
            <div className='payment-container'>
              <h1>Step 2: Let's Take Care of the Payment</h1>
              <>
                <div className="pricingTablesContainer">
                <div className="table1" style={{
                    outline: tableClicked === 'table1' ? '4px solid #1465e7' : '',
                }} >
                    <h1 style={{ marginTop: '30px' }}>$41.99</h1>
                    <p>Per Month</p>
                    <p>Receive credits to post daily within our <b>highly vetted</b> network for an entire month
                    <Tooltip 
                        content="Each month you maintain your subscription, you'll receive 30 credits that renew. This value is based on the average cost of a post from creators, which is typically <a id='value-source' title='Influencer rates from influencermarketinghub.' href='https://influencermarketinghub.com/influencer-rates/' target='_blank' rel='noopener noreferrer'>$119/post</a>."
                        valueTag="Valued at $3570"
                    />
                    </p>
                    <p>Reach an engaged audience between <b>300K - 1M</b> each month on the network
                    <Tooltip 
                        content="You will be able to get 300K-1M views for your posts per month. As for the value, it is based on the average cost per thousand impressions on all platforms which averages <a id='value-source' title='Influencer rates from influencermarketinghub.' href='https://www.adroll.com/blog/ad-cost-breakdown-facebook-instagram-tiktok-and-pinterest' target='_blank' rel='noopener noreferrer'>$9.9.</a>"
                        valueTag="Worth $3000"
                    />
                    </p>
                    <p>Access <b>detailed analytics</b> for your posts to gain deeper insights into your audience
                    <Tooltip 
                        content="You will receive analytics for each of your posts for a duration of 7 days before they are archived. These analytics will be updated every 24 hours."
                        valueTag=""
                    />
                    </p>
                    <p>Receive a <b>high-quality</b> post daily completely for free
                    <Tooltip 
                        content="Influencers within our network will also have the opportunity to guest-post on your feed. To ensure the highest quality of content, every post undergoes a human review before being published."
                        valueTag=""
                    />
                    </p>
                    <p>Connect <b>genuinely</b> with fellow creators within a community that shares your passion
                    <Tooltip 
                        content="You will be able to join a community where creators like you connect, share insights, and engage with one another."
                        valueTag=""
                    />
                    </p>
                    <p>Grow <b>faster</b> with Sumbroo
                    <Tooltip 
                        content="We handle everything, from profile vetting to content review, allowing you to concentrate solely on expanding your follower base."
                        valueTag=""
                    />
                    </p>
                    <button onClick={handleTableClicked} data-lookup-key='price_1NduMpHK22p9cyvXL5JiI0mA' name="table1">Select</button>
                </div>
                <div className="table2" style={{
                    outline: tableClicked === 'table2' ? '4px solid #1465e7' : ''
                 }}>
                    <div className="saveRibbon">Save $100.9</div>
                    <span className="strikethrough">$503.88</span>
                    <h1 style={{ marginTop: '10px' }}>$402.99</h1>
                    <p>Per Year</p>
                    <p>Receive credits to post daily within our <b>highly vetted</b> network for an entire month
                    <Tooltip 
                        content="Each month you maintain your subscription, you'll receive 30 credits that renew. This value is based on the average cost of a post from creators, which is typically <a id='value-source' title='Influencer rates from influencermarketinghub.' href='https://influencermarketinghub.com/influencer-rates/' target='_blank' rel='noopener noreferrer'>$119/post</a>."
                        valueTag="Valued at $42840"
                    />
                    </p>
                    <p>Reach an engaged audience between <b>300K - 1M</b> each month on the network
                    <Tooltip 
                        content="You will be able to get 300K-1M views for your posts per month. As for the value, it is based on the average cost per thousand impressions on all platforms which averages <a id='value-source' title='Influencer rates from influencermarketinghub.' href='https://www.adroll.com/blog/ad-cost-breakdown-facebook-instagram-tiktok-and-pinterest' target='_blank' rel='noopener noreferrer'>$9.9.</a>"
                        valueTag="Worth $36000"
                    />
                    </p>
                    <p>Access <b>detailed analytics</b> for your posts to gain deeper insights into your audience
                    <Tooltip 
                        content="You will receive analytics for each of your posts for a duration of 7 days before they are archived. These analytics will be updated every 24 hours."
                        valueTag=""
                    />
                    </p>
                    <p>Receive a <b>high-quality</b> post daily completely for free
                    <Tooltip 
                        content="Influencers within our network will also have the opportunity to guest-post on your feed. To ensure the highest quality of content, every post undergoes a human review before being published."
                        valueTag=""
                    />
                    </p>
                    <p>Connect <b>genuinely</b> with fellow creators within a community that shares your passion
                    <Tooltip 
                        content="You will be able to join a community where creators like you connect, share insights, and engage with one another."
                        valueTag=""
                    />
                    </p>
                    <p>Grow <b>faster</b> with Sumbroo
                    <Tooltip 
                        content="We handle everything, from profile vetting to content review, allowing you to concentrate solely on expanding your follower base."
                        valueTag=""
                    />
                    </p>
                    <button onClick={handleTableClicked} data-lookup-key='price_1NduMpHK22p9cyvXtZr9KbhJ' name="table2">Select</button>
                </div>
                </div>
                <div style={{ width: '100%', position: 'relative' }}>
                  <button type='button' className={`button ${isLoading ? 'loading' : ''}`} onClick={handlePayment} disabled={isLoading ? true : false}>
                    {isLoading ? <Tadpole width={20} color='white' /> : <>Pay Via Stripe <img src='/pinterest/external-white.svg' /></>}
                  </button>
                </div>
              </>
            </div> 
          : toError404()
        }
        <Modal
          isOpen={modalIsOpen}
          style={customStyles}
          onRequestClose={() => { setModalIsOpen(false) }}
          contentLabel="Example Modal"
            >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontFamily: 'Ubuntu', fontSize: '1.3em', color: '#1c1c57' }} >Whoops! Before we get started, please select a plan first. 👈</h2>
          </div>
        </Modal>
      </div>
)

}

export default SpecialOnboarding;


export async function getServerSideProps(context) {

  const connectDB = require('../../../utils/connectUserDB');
  const User = require('../../../utils/User').default;
  const jwt = require('jsonwebtoken');
  const mongoSanitize = require('express-mongo-sanitize');

  try {

    const token = context.query.token;

    const decoded = jwt.verify(token, process.env.JWT_SPECIAL_ONBOARDING_SECRET);

    if (decoded.platform !== 'pinterest') {
      throw new Error('Invalid action');
    }

    const userId = decoded.userId
    await connectDB()
    // assuming onboardingStep is 0
    const sanitizedUserId = mongoSanitize.sanitize(userId);
    let user = await User.findOne({ _id: sanitizedUserId });

    if (!user || user.onboardingStep !== 0) throw new Error('User not found');

    return {
      props: {
        userId, status: 'password',
        onboarding: true,
        notProtected: true
      }
    }; 

  } catch (error) {
    return {
      notFound: true
    };
  }

}