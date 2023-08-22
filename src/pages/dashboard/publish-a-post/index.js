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

    // new get the user Stripe customer id
    let user = await User.find({ userId });

    // the Stripe customer Id
    let stripeId = user.stripeId;


    // get the user plan PRICE ID not the the plan id

    const activePriceId = await getCusPriceId(stripeId)
    return {
      props: {
        isServerError: true
      }
    };

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