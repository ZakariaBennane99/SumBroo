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



const PostInput = dynamic(
  () => import('../../../../components/PostInput'),
  { ssr: false }
);


const options = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
];


const PublishAPost = ({ signedIn, isServerError }) => {

  // show the modal when there is a servre error
  const serverErr = isServerError || false

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

  // submitting the post for validation
  function handlePost() {

  }

  useEffect(() => {
    // Check if targetPlatforms is not empty, then set the first platform as selectedPlatform
    if (targetPlatform) {
      setSelectedPlatform(targetPlatform);
    }
  }, [targetPlatform]);


  return (<div id="parentWrapper">
  <Header signedIn={signedIn}/>
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

  </div>
  <Footer />
  </div>)
};

export default PublishAPost;


export async function getServerSideProps(context) {

  const Stripe = require('stripe');
  const { connectUserDB } = require('../../../../utils/connectUserDB');
  const User = require('../../../../utils/User');
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

    if (decoded.type !== 'sessionToken') {
      return {
        props: {
          signedIn: false
        }
      };
    }

    /*
      You don't need webhooks, you can hit the Stripe customer
      endpoint with each user session (sign in), then update 
      the DB accordingly. And access it freely within that session
      so each session we update the DB and we can request as hit
      our DB's enpoint easily. Make sure you have an array for 
      each social media that contains the pricing Ids which 
      they are part of: one monthly and the other is annually.
      So, when you renew the data in your DB, you match the
      price id of the customer's subscription price ID whose
      status is updated into the DB with the array (the 
      profile). 
    */
     
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
          isServerError: true
        }
      };
    }

    // get the subscription status
    const subStatus = await getSubscriptionStatus(stripeId, activePriceId)

    // now query your DB
    const users = await User.find({ "socialMediaLinks.pricePlans": activePriceId }, 'socialMediaLinks.platformName');
        
    const platformNames = [];
    users.forEach(user => {
        user.socialMediaLinks.forEach(link => {
            if (link.pricePlans.includes(activePriceId)) {
                platformNames.push(link.platformName);
                // get the subscription status
                if (subStatus === 'Server error') {
                  return {
                    props: {
                      isServerError: true
                    }
                  };
                }
                if (subStatus === 'active') {
                  link.profileStatus = 'active';
                } else if (['canceled', 'past_due'].includes(subStatus)) {
                  link.profileStatus = 'canceledSubscriptionPayment';
                } else {
                  link.profileStatus = 'pendingSubscriptionPayment';
                }
            }
        });
    });

    console.log(platformNames);

    // update the active platforms based in the user DB based on the platforms above
    if (platformNames.length > 0) {

    }

    const best = 'b'

    return {
      props: {
        signedIn: true
      }
    };


  } catch (error) {
    return {
      props: {
        signedIn: false
      }
    };
  }

}