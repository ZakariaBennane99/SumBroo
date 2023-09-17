/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { useState, useEffect } from "react";
import ActiveAccounts from '../../../../components/ActiveAccounts';
import Requirements from '../../../../components/Requirements';
import Targeting from '../../../../components/Targeting';
import PinterestPostPreview from "../../../../components/PinterestPostPreview";
import Modal from 'react-modal';
import Link from 'next/link';
import PinterestPostInput from "../../../../components/PinterestPostInput";
import { Tadpole } from "react-svg-spinners";


function getCurrentUTCDate() {

  const now = new Date();

  const utcFullYear = now.getUTCFullYear();
  const utcMonth = String(now.getUTCMonth() + 1).padStart(2, '0'); 
  const utcDate = String(now.getUTCDate()).padStart(2, '0');
  const utcHours = String(now.getUTCHours()).padStart(2, '0');
  const utcMinutes = String(now.getUTCMinutes()).padStart(2, '0');
  const utcSeconds = String(now.getUTCSeconds()).padStart(2, '0');

  const fullUTCDate = `${utcFullYear}-${utcMonth}-${utcDate} ${utcHours}:${utcMinutes}:${utcSeconds} UTC`;

  return fullUTCDate

}

function allObjectsHaveSameValueForKey(arr, key) {
  if (arr.length === 0) return true; // or handle empty array as you see fit
  const firstValue = arr[0][key];
  return arr.every(obj => obj[key] === firstValue);
}


const PublishAPost = ({ isServerError, platforms, windowWidth, niches, below24Hours }) => {

  const lessThan24 = below24Hours || false;

  const [selectedPlatform, setSelectedPlatform] = useState(null);

  // for the form data
  const [postFormData, setPostFormData] = useState({
    postTitle: '',
    pinTitle: '',
    text: '',
    pinLink: '',
    imgUrl: '',
    videoUrl: ''
  })

  const [publishPostClicked, setPublishPostClicked] = useState(false)
  // for the target platforms
  const [targetPlatform, setTargetPlatform] = useState(null)
  // this is for the selected niche and tags
  const [nicheAndTags, setNicheAndTags] = useState(null)

  const [isSuccess, setIsSuccess] = useState(false)

  const [validatedNicheAndTags, setValidatedNicheAndTags] = useState(null) 

  const [isTargetingErr, setIsTargetingErr] = useState(false)

  const [targetingErrors, setTargetingErrors] = useState({
    niche: null,
    audience: null
  })

  // Validate niche and tags
  function validateNicheAndTags() {

    const errors = {
      niche: null,
      audience: null
    };

    const { niche, tags: audience } = nicheAndTags;

    if (!niche && audience.length === 0) {
      errors.niche = 'Sub-field is required.'
      errors.audience = 'At least 4 tags should be selected.'
      setTargetingErrors(errors);
      return !Object.values(errors).some(error => error);
    }

    if (niches && niche && !niches.some(n => n.niche === niche)) {
      errors.niche = "Invalid niche selected.";
    }
  
    if (audience.length < 4) {
      errors.audience = "At least 4 tags should be selected.";
    } else {
      if (!audience.every(tag => audience.includes(tag))) {
        errors.audience = "Some selected tags are invalid.";
      }
    }
  
    // Update targetingErrors state
    setTargetingErrors(errors);
  
    return !Object.values(errors).some(error => error);

  }

  // submitting the post for backend validation
  // then a message to the user to either 
  async function handlePostSubmit() {

    if (targetPlatform === 'pinterest') {

      const isNicheAndTagsValid = validateNicheAndTags();

      setPublishPostClicked(true)
      setIsTargetingErr(isNicheAndTagsValid)
      setValidatedNicheAndTags(nicheAndTags)

    } 
    // you can continue the if-else statement or use switch when adding more
    // platforms
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


  // Show this section if all the social Media are not active
  if (allObjectsHaveSameValueForKey(platforms, 'status') && platforms[0].status !== 'active') {
    return (<>
      <div className="notification">
        <img src='/infotip.svg' alt="Info Tip" />
        <p>Subscription canceled. Miss us? Hit 'Restart Subscription' below! 🌟</p>
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
  } 

  // render the following in case the user hasn't reached the grace period
  // in this case, make a responsive div with a friendly message
  if (lessThan24) {
    return (<>
      <div className="notification">
        <img src='/infotip.svg' alt="Info Tip" />
        <p>Patience is a virtue! You'll be able to publish again after the 24-hour window. 🌟</p>
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
  }
  
  // render the following in case of a server error
  // you know the Modal directly
  if (platforms.length === 1 && platforms[0].status === '') {
    console.log('GETTING READY')
    return (<>
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

  // render the following if there is no issue
  return (<>
      {
        windowWidth < 620 ?
          isSuccess ?
          <div className="postSentSuccess">
            <img src="/green-check.svg" />
            <p>Thank you for your submission! 🌟 We are now reviewing your content and will update you as soon as possible.</p>
          </div> 
          :
          <>
            <div className='farRightSectionHome'>
              <div className='postPreview' >
                <h2>Preview</h2>
                  {selectedPlatform && selectedPlatform === 'pinterest' && postFormData && (postFormData.imgUrl || postFormData.videoUrl || 
                  (postFormData.pinLink && postFormData.pinLink.length > 0) > 0 ||
                  (postFormData.text && postFormData.text.length > 0) || (postFormData.pinTitle && postFormData.pinTitle.length > 0)) &&
                  <PinterestPostPreview pinLink={postFormData.pinLink}
                  pinTitle={postFormData.pinTitle} text={postFormData.text} 
                  imgUrl={postFormData.imgUrl} videoUrl={postFormData.videoUrl} />}
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
              <PinterestPostInput
                  setDataForm={setPostFormData}
                  dataForm={postFormData}
                  platform={targetPlatform} 
                  nicheAndTags={validatedNicheAndTags} // from here we know if publish is clicked
                  nicheAndTagsErrors={setTargetingErrors} // nicheAndTagsErrors needed for for the Targeting component
                  noTargetingErrs={isTargetingErr}
                  publishPost={publishPostClicked}
                  setPublishPost={setPublishPostClicked}
                  targetErrors={targetingErrors} // this is just to open the accordion when there are errors
                  setSuccess={setIsSuccess} // this is only when the user has successfully sent the request
                /> 
              <Targeting 
                  nichesAndTags={niches}
                  chosenNicheAndTags={setNicheAndTags}
                  errors={targetingErrors}
                  resetErrors={setTargetingErrors}
                  platform={targetPlatform} 
                />
              <button id='publish-btn' className={`${publishPostClicked ? 'publish-btn-loading' : ''}`}
               onClick={handlePostSubmit} disabled={publishPostClicked}>
                {
                  publishPostClicked ? <Tadpole height={40} color='white' /> : 'PUBLISH'
                }
              </button>
            </div>
          </>
        : isSuccess ? 
          <div className="postSentSuccess">
            <img src="/green-check.svg" />
            <p>Thank you for your submission! 🌟 We are now reviewing your content and will update you as soon as possible.</p>
          </div> 
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
              <PinterestPostInput
                  setDataForm={setPostFormData}
                  platform={targetPlatform} 
                  dataForm={postFormData}
                  nicheAndTags={validatedNicheAndTags} // from here we know if publish is clicked
                  nicheAndTagsErrors={setTargetingErrors} // nicheAndTagsErrors needed for for the Targeting component
                  noTargetingErrs={isTargetingErr}
                  publishPost={publishPostClicked}
                  setPublishPost={setPublishPostClicked}
                  targetErrors={targetingErrors} // this is just to open the accordion when there are errors
                  setSuccess={setIsSuccess} // this is only when the user has successfully sent the request
                />
              <Targeting 
                  nichesAndTags={niches}
                  errors={targetingErrors}
                  chosenNicheAndTags={setNicheAndTags}
                  resetErrors={setTargetingErrors}
                  platform={targetPlatform} 
                />
              <button id='publish-btn' className={`${publishPostClicked ? 'publish-btn-loading' : ''}`}
               onClick={handlePostSubmit} disabled={publishPostClicked}>
                {
                  publishPostClicked ? <Tadpole height={50} color='white' /> : 'PUBLISH'
                }
              </button>
            </div>
            <div className='farRightSectionHome'>
              <div className='postPreview' >
                <h2>Preview</h2>
                  {selectedPlatform && selectedPlatform === 'pinterest' && postFormData && (postFormData.imgUrl || postFormData.videoUrl || (postFormData.pinLink && postFormData.pinLink.length > 0) ||
                  (postFormData.text && postFormData.text.length) > 0 || (postFormData.pinTitle && postFormData.pinTitle.length > 0) ) &&
                  <PinterestPostPreview pinLink={postFormData.pinLink}
                  pinTitle={postFormData.pinTitle} text={postFormData.text} 
                  imgUrl={postFormData.imgUrl} videoUrl={postFormData.videoUrl} />}
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
    const tokenCookie = cookies.trim().split('token=')[1]

    if (!tokenCookie) {
      return {
        redirect: {
          destination: '/sign-in',
          permanent: false,
        },
      };
    }

    let decoded
    try {
      decoded = jwt.verify(tokenCookie, process.env.USER_JWT_SECRET);
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


    if (activePriceId === 'Server error') {
      return {
        props: {
          isServerError: true,
          signedIn: true,
          dash: true,
          platforms: [{
            status: ''
          }]
        }
      };
    }


    // get the subscription status
    const subStatus = await getSubscriptionStatus(stripeId, activePriceId);

    if (subStatus === 'Server error') {
      return {
        props: {
          isServerError: true,
          signedIn: true,
          dash: true,
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
    
    
    // here you have to also find if 
    // the user has published anything in the last
    // 24H + DON'T FORGET TO MAKE IT MORE EFFICIENT 
    // WITH DIRECT MONGODB QUERIES
    const userMaxPublishingDatePipeline = [
      { $match: { _id: userId } },
      { $unwind: '$socialMediaLinks' },
      { $unwind: '$socialMediaLinks.posts' },
      { $group: { _id: null, maxPublishingDate: { $max: '$socialMediaLinks.posts.publishingDate' } } },
    ];
    
    const [result] = await User.aggregate(userMaxPublishingDatePipeline);

    // get all the available niches
    const pipeline = [
      { $unwind: "$socialMediaLinks" },
      { $unwind: "$socialMediaLinks.audience" },
      {
        $group: {
          _id: { niche: "$socialMediaLinks.niche", tag: "$socialMediaLinks.audience" },
        },
      },
      {
        $group: {
          _id: "$_id.niche",
          tags: { $addToSet: "$_id.tag" },
        },
      },
      {
        $project: {
          _id: 0,
          niche: "$_id",
          tags: 1,
        },
      },
    ]
    
    
    const nicheRes = await User.aggregate(pipeline);
  

    if (!result) {
      // here where you return all of the data
      return {
        props: {
          isServerError: false,
          signedIn: true,
          dash: true,
          platforms: platformNames,
          niches: nicheRes
        }
      };
    }


    if (result.maxPublishingDate <= getCurrentUTCDate()) {
      // if we return this, then it still hasn't passed 24H
      // change of status in the platforms. This is only when 
      // have multiple platforms
      return {
        props: {
          isServerError: false,
          signedIn: true,
          dash: true,
          below24Hours: true,
          platforms: platformNames  // to be amended when you have multiple platforms
        }
      };
  
    } 

    // here where you return all of the data
    return {
      props: {
        isServerError: false,
        signedIn: true,
        dash: true,
        platforms: platformNames,
        niches: nicheRes
      }
    };


  } catch (error) {
    console.log('THE ERROR', error)
    return {
      props: {
        isServerError: true,
        signedIn: true,
        dash: true,
        platforms: [{
          status: ''
        }]
      }
    };
  }

}