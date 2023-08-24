/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { useState, useEffect } from "react";
import Header from '../../../../components/Header';
import Footer from '../../../../components/Footer';
import HomeMenu from '../../../../components/HomeMenu';
import ActiveAccounts from '../../../../components/ActiveAccounts';
import Requirements from '../../../../components/Requirements';
import Targeting from '../../../../components/Targeting';
import PinterestPostPreview from "../../../../components/PinterestPostPreview";
import dynamic from 'next/dynamic';
import Modal from 'react-modal';



const PostInput = dynamic(
  () => import('../../../../components/PostInput'),
  { ssr: false }
);


const options = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
];

function allObjectsHaveSameValueForKey(arr, key) {
  if (arr.length === 0) return true; // or handle empty array as you see fit

  const firstValue = arr[0][key];
  return arr.every(obj => obj[key] === firstValue);
}


const PublishAPost = ({ isServerError, platforms }) => {

  const [windowWidth, setWindowWidth] = useState(null);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    // Update the window width when the window is resized
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener('resize', handleResize);

    // Cleanup: remove the event listener when the component is unmounted
    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, []);

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
    return (<div id="parentWrapper">
    <Header signedIn={true}/>
    <div className="resultsSection">
        {
          windowWidth < 620 ?
          <div className="homeContainer">
            {
              windowWidth > 1215 ? <HomeMenu /> : ''
            }
            {
              platforms[0].status === 'canceledSubscriptionPayment' ? 
              <div className="notification">
                <img src='/infotip.svg' alt="Info Tip" />
                <p>Your subscription has been canceled.</p>
                <Link href="/settings/billing">
                  <button className="link-button">Restart Subscription</button>
                </Link>
              </div>
              :
              <div className="notification">
                <img src='/infotip.svg' alt="Info Tip" />
                <p>There seems to be an issue with your billing.</p>
                <Link href="/settings/billing">
                  <button className="link-button">Go To Billing</button>
                </Link>
              </div>
            }
          </div>
          :
          <div className="homeContainer">
            {
              windowWidth > 1215 ? <HomeMenu /> : ''
            }
            {
              platforms[0].status === 'canceledSubscriptionPayment' ? 
              <div className="notification">
                <img src='/infotip.svg' alt="Info Tip" />
                <p>Your subscription has been canceled.</p>
                <Link href="/settings/billing">
                  <button className="link-button">Restart Subscription</button>
                </Link>
              </div>
              :
              <div className="notification">
                <img src='/infotip.svg' alt="Info Tip" />
                <p>There seems to be an issue with your billing.</p>
                <Link href="/settings/billing">
                  <button className="link-button">Go To Billing</button>
                </Link>
              </div>
            }
          </div>
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
    </div>
    <Footer />
    </div>)
  } else {
    return (<div id="parentWrapper">
    <Header signedIn={true}/>
    <div className="resultsSection">
        {
          windowWidth < 620 ?
          <div className="homeContainer">
          {
            windowWidth > 1215 ? <HomeMenu /> : ''
          }
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
                  activeProfiles={platforms}
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
            </div></div>
          :
          <div className="homeContainer">
              {
                windowWidth > 1215 ? <HomeMenu /> : ''
              }
              <div className="rightSectionHome" >
              <ActiveAccounts
                  setPlatform={setTargetPlatform}
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
        </div></div>
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
    </div>
    <Footer />
    </div>)
  }
};

export default PublishAPost;


export async function getServerSideProps(context) {

  const Stripe = require('stripe');
  const { connectUserDB } = require('../../../../utils/connectUserDB');
  const User = require('../../../../utils/User');
  const AvAc = require('../../../../utils/AvailableAccounts')
  const jwt = require('jsonwebtoken');

  async function getCusPriceId(id) {

    // now hit the Stripe API to get the user status
    const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

    try {
      const customer = await stripe.customers.retrieve(id);
      const subscription = customer.subscriptions.data[0];
      const activePriceId = subscription.items.data[0].price.id;
      return activePriceId;

    } catch(err) {
      console.log(err)
      return 'Server error'
    }

  }
  
  async function getSubscriptionStatus(customerId, priceId) {
    try {
        // List all subscriptions for the customer
        const subscriptions = await Stripe.subscriptions.list({
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
    } else if (['cnaceled', 'unpaid', 'ended'].includes(st)) {
      return 'canceledSubscriptionPayment'
    } else if (['past_due', 'incomplete', 'incomplete_expired'].includes(st)) {
      return 'pendingSubscriptionPayment'
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

    // Parse the cookies to retrieve the otpTOKEN
    const tokenCookie = cookies.split(';').find(c => c.trim().startsWith('token='));

    let tokenValue;
    if (tokenCookie) {
      tokenValue = tokenCookie.split('=')[1];
    }

    const decoded = jwt.verify(tokenValue, process.env.USER_JWT_SECRET);

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
    const { userId } = decoded.userId;

    // connect DB
    await connectUserDB()

    // new get the user Stripe customer id
    let user = await User.find({ userId });

    // the Stripe customer Id
    let stripeId = user.stripeId;

    // get the user plan PRICE ID not the plan id

    const activePriceId = await getCusPriceId(stripeId)

    if (activePriceId === 'Server error') {
      return {
        props: {
          isServerError: true,
          platforms: []
        }
      };
    }

    // get the subscription status
    const subStatus = await getSubscriptionStatus(stripeId, activePriceId);
    if (subStatus === 'Server error') {
      return {
        props: {
          isServerError: true,
          platforms: []
        }
      };
    };

    // now query your DB
    const users = await User.find({ "socialMediaLinks.pricePlans": activePriceId }, 'socialMediaLinks.platformName');
    const avac = await AvAc.find();
    
    const platformNames = avac.accounts.map(acc => {
      return (
        {
          name: acc.ac,
          status: acc.status
        }
      )
    });

    users.forEach(user => {
        user.socialMediaLinks.forEach(link => {
            if (link.pricePlans.includes(activePriceId)) {
                link.profileStatus = 'active';
                updateStatusByName(link.platformName, 'active', platformNames);
            } else {
              const st = getStatus(subStatus)
              link.profileStatus = st
              updateStatusByName(link.platformName, 'active', platformNames);
            }
        });
    });

    console.log(platformNames);

    return {
      props: {
        isServerError: false,
        platforms: platformNames
      }
    };

  } catch (error) {
    return {
      props: {
        isServerError: true,
        platforms: []
      }
    };
  }

}