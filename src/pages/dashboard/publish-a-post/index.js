/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { useState, useEffect } from "react";
import ActiveAccounts from '../../../../components/ActiveAccounts';
import Requirements from '../../../../components/Requirements';
import Targeting from '../../../../components/Targeting';
import PinterestPostPreview from "../../../../components/PinterestPostPreview";
import dynamic from 'next/dynamic';
import Modal from 'react-modal';
import Link from 'next/link';



const PostInput = dynamic(
  () => import('../../../../components/PostInput'),
  { ssr: false }
);


function allObjectsHaveSameValueForKey(arr, key) {
  if (arr.length === 0) return true; // or handle empty array as you see fit

  const firstValue = arr[0][key];
  return arr.every(obj => obj[key] === firstValue);
}


const PublishAPost = ({ isServerError, platforms, windowWidth }) => {


  const [selectedPlatform, setSelectedPlatform] = useState(null);

  // for the form data
  const [postTitle, setPostTitle] = useState("")
  const [pinTitle, setPinTitle] = useState("")
  const [text, setText] = useState("");
  const [pinLink, setPinLink] = useState("")
  const [imgUrl, setImgUrl] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);

  // for the target platforms
  const [targetPlatform, setTargetPlatform] = useState()

  // submitting the post for backend validation
  // then a message to the user to either 
  function handlePost() {

  }

  useEffect(() => {
    // Check if targetPlatforms is not empty, then set the first platform as selectedPlatform
    if (targetPlatform) {
      setSelectedPlatform(targetPlatform);
    }
  }, [targetPlatform]);


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


  // Show this section if all the social Media 
  if (allObjectsHaveSameValueForKey(platforms, 'status') && platforms[0].status !== 'active') {
    return (<>
              <div className="notification">
                <img src='/infotip.svg' alt="Info Tip" />
                <p>Your subscription has been canceled.</p>
                <Link href="/settings/billing">
                  <button className="link-button">Restart Subscription</button>
                </Link>
              </div>
        <Modal
            isOpen={isServerError}
            style={customStyles}
            contentLabel="Example Modal"
              >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontFamily: 'Ubuntu', fontSize: '1.3em', color: '#1c1c57' }} >Server Error</h2>
              <span onClick={() => location.reload()}
                style={{ backgroundColor: '#1465e7', 
                color: "white",
                padding: '10px', 
                cursor: 'pointer',
                fontFamily: 'Ubuntu',
                borderRadius: '3px',
                fontSize: '1.1em',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                 }}>Try again</span>
            </div>
        </Modal>
    </>)
  } else if (platforms.length === 1 && platforms[0].status === '') {
    return 'BIG FUCK'
  } else {
    return (<>
        {
          windowWidth < 620 ?
          <>
          <div className='farRightSectionHome'>
          <div className='postPreview' >
            <h2>Preview</h2>
              {selectedPlatform && selectedPlatform === 'pinterest' && (imgUrl || videoUrl || pinLink.length > 0 ||
              text.length > 0 || pinTitle.length > 0) &&
              <PinterestPostPreview pinLink={pinLink}
              pinTitle={pinTitle} text={text} 
              imgUrl={imgUrl} videoUrl={videoUrl} />}
          </div>
        </div>
              <div className="rightSectionHome" >
              <ActiveAccounts
                  setPlatform={setTargetPlatform}
                  platforms={platforms}
                />
              <Requirements
                  platform={targetPlatform}
                />
              <PostInput
                setText={setText}
                setPostTitle={setPostTitle}
                setPinTitle={setPinTitle}
                setPinLink={setPinLink}
                setImgUrl={setImgUrl}
                setVideoUrl={setVideoUrl}
                submitPost={handlePost}
                platform={targetPlatform}
              />
              <Targeting />
              <button id='publish-btn'>PUBLISH</button>
            </div>
          </>
          :
        <>
          <div className="rightSectionHome" >
            <ActiveAccounts
                setPlatform={setTargetPlatform}
                platforms={platforms}
              />
            <Requirements
                platform={targetPlatform}
              />
            <PostInput
              setText={setText}
              setPostTitle={setPostTitle}
              setPinTitle={setPinTitle}
              setPinLink={setPinLink}
              setImgUrl={setImgUrl}
              setVideoUrl={setVideoUrl}
              submitPost={handlePost}
              platform={targetPlatform}
            />
            <Targeting />
            <button id='publish-btn'>PUBLISH</button>
          </div>
          <div className='farRightSectionHome'>
          <div className='postPreview' >
            <h2>Preview</h2>
              {selectedPlatform && selectedPlatform === 'pinterest' && (imgUrl || videoUrl || pinLink.length > 0 ||
              text.length > 0 || pinTitle.length > 0) &&
              <PinterestPostPreview pinLink={pinLink}
              pinTitle={pinTitle} text={text} 
              imgUrl={imgUrl} videoUrl={videoUrl} />}
          </div>
        </div>
        </>
        }
        <Modal
            isOpen={isServerError}
            style={customStyles}
            contentLabel="Example Modal"
              >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontFamily: 'Ubuntu', fontSize: '1.3em', color: '#1c1c57' }} >Server Error</h2>
              <span onClick={() => location.reload()}
                style={{ backgroundColor: '#1465e7', 
                color: "white",
                padding: '10px', 
                cursor: 'pointer',
                fontFamily: 'Ubuntu',
                borderRadius: '3px',
                fontSize: '1.1em',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                 }}>Try again</span>
            </div>
        </Modal>
    </>)
  }
};

export default PublishAPost;


export async function getServerSideProps(context) {

  const Stripe = require('stripe');
  const connectDB = require('../../../../utils/connectUserDB');
  const jwt = require('jsonwebtoken');
  const User = require('../../../../utils/User').default;
  const AvAc = require('../../../../utils/AvailableAccounts').default;
  const mongoSanitize = require('express-mongo-sanitize');

  async function getCusPriceId(id) {

    // now hit the Stripe API to get the user status
    const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

    try {
      const subscriptions = await stripe.subscriptions.list({
        customer: id,
      });
      const subscription = subscriptions.data[0];
      const activePriceId = subscription.items.data[0].price.id;
      return activePriceId;

    } catch(err) {
      console.log(err)
      return 'Server error'
    }

  }
  
  async function getSubscriptionStatus(customerId, priceId) {

    const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

    try {
        // List all subscriptions for the customer
        const subscriptions = await stripe.subscriptions.list({
          customer: customerId,
        });

        // Find the subscription with the specific price ID
        const targetSubscription = subscriptions.data.find(sub => 
          sub.items.data.some(item => item.price.id === priceId)
        );

        // Return the status of the subscription
        return targetSubscription.status;
    } catch (error) {
        console.error('Error fetching subscription status:', error);
        return 'Server error'
    }
  }

  function getStatus(st) {
    if (st === 'active') {
      return 'active'
    } else if (['canceled', 'unpaid', 'ended'].includes(st)) {
      return 'canceled'
    } else if (['past_due', 'incomplete', 'incomplete_expired'].includes(st)) {
      return 'pendingPay'
    } 
  }

  const updateStatusByName = (name, newStatus, arr) => {
    for (let obj of arr) {
      if (obj.name === name) {
        obj.status = newStatus;
        break;  // Exit the loop once the item is found
      }
    }
  };

  try {

    // Get cookies from the request headers
    const cookies = context.req.headers.cookie;

    if (!cookies) {
      return {
        redirect: {
          destination: '/sign-in',
          permanent: false,
        },
      };
    }

    // Parse the cookies to retrieve the otpTOKEN
    const tokenCookie = cookies.split(';').find(c => c.trim().startsWith('token='));

    if (!tokenCookie) {
      return {
        redirect: {
          destination: '/sign-in',
          permanent: false,
        },
      };
    }
    
    let tokenValue = tokenCookie.split('=')[1];
    let decoded
    try {
      decoded = jwt.verify(tokenValue, process.env.USER_JWT_SECRET);
    } catch (err) {
      return {
        redirect: {
          destination: '/sign-in',
          permanent: false,
        },
      };
    }

    // if not sessiong token (user not signed in) return
    // so we can avoid unecessary payment checks
    if (decoded.type !== 'sessionToken') {
      return {
        redirect: {
          destination: '/sign-in',
          permanent: false,
        },
      };
    }
     
    // your token has already the userId
    const userId = decoded.userId;

    // connect DB
    await connectDB();

    const sanitizedUserId = mongoSanitize.sanitize(userId);
    let user = await User.findOne({ _id: sanitizedUserId });

    // the Stripe customer Id
    let stripeId = user.stripeId;

    // get the user plan PRICE ID not the plan id
    const activePriceId = await getCusPriceId(stripeId)
    
    console.log('after the activePriveID')

    if (activePriceId === 'Server error') {
      return {
        props: {
          isServerError: true,
          signedIn: true,
          platforms: [{
            status: ''
          }]
        }
      };
    }


    // get the subscription status
    const subStatus = await getSubscriptionStatus(stripeId, activePriceId);
    console.log('after the subStatus')
    if (subStatus === 'Server error') {
      return {
        props: {
          isServerError: true,
          signedIn: true,
          platforms: [{
            status: ''
          }]
        }
      };
    };

    const avac = await AvAc.find();
    
    const platformNames = avac[0].accounts.map(acc => {
      return (
        {
          name: acc.ac,
          status: acc.status
        }
      )
    });

    [user].forEach(user => {
      user.socialMediaLinks.forEach(link => {
        if (link.pricePlans.includes(activePriceId)) {
          link.profileStatus = 'active';
          updateStatusByName(link.platformName, 'active', platformNames);
        } else {
          const st = getStatus(subStatus)
          link.profileStatus = st
          updateStatusByName(link.platformName, st, platformNames);
        }
      });
    });

    return {
      props: {
        isServerError: false,
        signedIn: true,
        platforms: platformNames
      }
    };

  } catch (error) {
    return {
      props: {
        isServerError: true,
        signedIn: true,
        platforms: [{
          status: ''
        }]
      }
    };
  }

}