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



function allObjectsHaveSameValueForKey(arr, key) {
  if (arr.length === 0) return true; // or handle empty array as you see fit
  const firstValue = arr[0][key];
  return arr.every(obj => obj[key] === firstValue);
}


const PublishAPost = ({ isServerError, platforms, windowWidth, niches }) => {

  const [selectedPlatform, setSelectedPlatform] = useState(null);

  // for the form data
  const [postFormData, setPostFormData] = useState(null)
  // for the target platforms
  const [targetPlatform, setTargetPlatform] = useState(null)
  // this is for the selected niche and tags
  const [nicheAndTags, setNicheAndTags] = useState(null)

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

    if (!niches.some(n => n.niche === niche.value)) {
      errors.niche = "Invalid niche selected";
    }
  
    if (audience.length < 4) {
      errors.audience = "At least 4 tags should be selected";
    } else {
      const selectedNiche = niches.find(n => n.niche === niche);
      if (!audience.every(tag => selectedNiche.audience.includes(tag))) {
        errors.audience = "Some selected tags are invalid";
      }
    }
  
    // Update targetingErrors state
    setTargetingErrors(errors);
  
    const isValid = !Object.values(errors).some(error => error);
    console.log('the isValid', isValid)
    return isValid

  }

  // submitting the post for backend validation
  // then a message to the user to either 
  async function handlePostSubmit() {

    if (targetPlatform === 'pinterest') {

      const isNicheAndTagsValid = validateNicheAndTags();

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
                  platform={targetPlatform} 
                  nicheAndTags={validatedNicheAndTags} // from here we know if publish is clicked
                  nicheAndTagsErrors={setTargetingErrors} // nicheAndTagsErrors needed for for the Targeting component
                  noTargetingErrs={isTargetingErr}
                /> 
              <Targeting 
                  nichesAndTags={niches}
                  chosenNicheAndTags={setNicheAndTags}
                  errors={targetingErrors}
                  resetErrors={setTargetingErrors}
                  platform={targetPlatform} 
                />
              <button id='publish-btn' onClick={handlePostSubmit}>PUBLISH</button>
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
            <PinterestPostInput
                 setDataForm={setPostFormData}
                 platform={targetPlatform} 
                 nicheAndTags={validatedNicheAndTags} // from here we know if publish is clicked
                 nicheAndTagsErrors={setTargetingErrors} // nicheAndTagsErrors needed for for the Targeting component
                 noTargetingErrs={isTargetingErr}
              />
            <Targeting 
                nichesAndTags={niches}
                errors={targetingErrors}
                chosenNicheAndTags={setNicheAndTags}
                resetErrors={setTargetingErrors}
                platform={targetPlatform} 
              />
            <button id='publish-btn' onClick={handlePostSubmit}>PUBLISH</button>
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

    // get all the available niches
    let nichesAndTags = await User.aggregate([
      { $unwind: "$socialMediaLinks" },
      { $group: { _id: "$socialMediaLinks.niche", tags: { $addToSet: "$socialMediaLinks.audience" } } },
      { $project: { _id: 0, niche: "$_id", tags: 1 } }
    ]);
  
    // Flatten the tags arrays
    nichesAndTags = nichesAndTags.map(({ niche, tags }) => ({ niche, tags: [].concat(...tags) }));
    
    // Remove duplicates in tags
    nichesAndTags = nichesAndTags.map(({ niche, tags }) => ({ niche, tags: [...new Set(tags)] }));


    console.log('THE NICHES & TAGS', nichesAndTags)

    return {
      props: {
        isServerError: false,
        signedIn: true,
        dash: true,
        platforms: platformNames,
        niches: nichesAndTags
      }
    };

  } catch (error) {
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