import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import SettingsMenu from "../../../../components/SettingsMenu";
import { useState, useEffect } from "react";
import Modal from 'react-modal';
import { useRouter } from "next/router";
import { PinterestAuth } from '../../../../components/auth/PinterestAuth';


function capitalize(wd) {
    const capitalizeWord = wd.charAt(0).toUpperCase() + wd.slice(1).toLowerCase();
    return capitalizeWord
}

const LinkedAccounts = ({ AllAccounts, isServerErr, userId }) => {

  const router = useRouter();
  const [message, setMessage] = useState("");

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

  useEffect(() => {
    if (router.query.result === 'success') {
        setMessage('Successfully linked your Pinterest account!');
    } else if (router.query.result === 'failure') {
        setMessage('Failed to link your Pinterest account. Please try again.');
    }
  }, [router.query]);

  const [componentServerErr, setComponentServerErr] = useState(false)

  

  function handleAccountClick(e) {

    const status = e.target.innerText;
    const media = e.target.dataset.platform;

    if (status === 'Subscribe To Link') {
      // here you have to send the user to the billing page
      router.push('/settings/billing');
    } else if (status === 'Link Account' || 'Renew Connection') {
      // here you have to connect to the target platform
      // and authenticate the user, get the token and store it in the DB
      if (media === 'pinterest') {
        PinterestAuth().initiateAuth();
      }
    } else if (status === 'Apply To Link') {
      // here you connect to a route that will add a new application 
      // to the Admin DB and update this account to inReview, 
      // then show an alert 
    } 

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
              
  return (<div id="parentWrapper">
    <Header signedIn={true}/>
    <div className="resultsSection">
        <div className="homeContainer">
            {
                windowWidth > 1215 ? <SettingsMenu /> : ''
            }
            {
                AllAccounts.map(acc => {
                    return (
                    <div className="smAccountsContainer">
                        <div className="linkedAccountsWrapper"> 
                              {
                                acc.status === 'authExpired' ? 
                                <div className="refreshWarning"> 
                                    <img src="/infotip.svg" />
                                    <span>It looks like your connection has expired. To continue posting, please renew your connection.</span> 
                                </div>
                                : ''
                              }
                            <div className="linkedAccounts">
                                <div className="account">
                                  <span id="sm"><img id="smlg" src={`/sm/${acc.name}.svg`} /> {capitalize(acc.name)}</span>
                                  {
                                    acc.status === 'active' ? <img id="check" src="/check.svg" /> : ''
                                  }
                                </div>
                                {(() => {
                                  let msg;
                                  if (acc.status === 'active') {
                                    msg = 'Linked'
                                  } else if (acc.status === 'pendingPay') {
                                    msg = 'Subscribe To Link'
                                  } else if (acc.status === 'pendingAuth') {
                                    msg = 'Link Account'
                                  } else if (acc.status === 'inReview') {
                                    msg = 'In Review'
                                  } else if (acc.status === 'authExpired') {
                                    msg = 'Renew Connection'
                                  } else {
                                    msg = 'Apply To Link'; 
                                  }
                                  return <button data-platform={acc.name} style={{ backgroundColor: ( msg === 'In Review' || msg === 'Linked') ? 'grey' : '',
                                   cursor: ( msg === 'In Review' || msg === 'Linked') ? 'auto' : ''  }}
                                   onClick={handleAccountClick}>{msg}</button>
                                  })
                                ()}
                            </div>
                        </div>
                    </div>
                    )
                })
            }
        </div>
    </div>
    <Modal
      isOpen={isServerErr || componentServerErr}
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
    <Footer />
    </div>)   
};

export default LinkedAccounts;

export async function getServerSideProps(context) {

  const connectDB = require('../../../../utils/connectUserDB');
  const jwt = require('jsonwebtoken');
  const User = require('../../../../utils/User').default;
  const AvAc = require('../../../../utils/AvailableAccounts').default;
  const mongoSanitize = require('express-mongo-sanitize');

  function getStatus(accountName, accountsArray) {
    // Find the account in the array
    const account = accountsArray.find(acc => acc.name === accountName);
  
    // If the account is found, return its status; otherwise, return false
    return account ? account.status : false;
  }

  let decoded;
  try {

    try {
      // Get cookies from the request headers
      const cookies = context.req.headers.cookie;
  
      // Parse the cookies to retrieve the otpTOKEN
      const tokenCookie = cookies.split(';').find(c => c.trim().startsWith('token='));
  
      let tokenValue;
      if (tokenCookie) {
        tokenValue = tokenCookie.split('=')[1];
      }
  
      decoded = jwt.verify(tokenValue, process.env.USER_JWT_SECRET);
  
      if (decoded.type !== 'sessionToken') {
        return {
          redirect: {
            destination: '/sign-in',
            permanent: false,
          },
        };
      }
    } catch (err) {
      return {
        redirect: {
          destination: '/sign-in',
          permanent: false,
        },
      };
    }

    const userId = decoded.userId
    await connectDB();
    // assuming onboardingStep is 2
    const sanitizedUserId = mongoSanitize.sanitize(userId);
    let user = await User.findOne({ _id: sanitizedUserId });
    const activeProfiles = user.socialMediaLinks
        .map(link => {
          return {
            name: link.platformName,
            status: link.profileStatus
          }
        });
    let AvAccounts = await AvAc.findOne({ _id: '64dff175f982d9f8a4304100' });

    let AvAcc = AvAccounts.accounts.map(ac => {
      if (ac.status === 'available') {
        return {
          name: ac.ac,
          status: getStatus(ac.ac, activeProfiles) ? getStatus(ac.ac, activeProfiles) : 'new'
        }
      }
    }).filter(el => el !== undefined)

    return {
      props: {
        AllAccounts: AvAcc,
        isServerErr: false,
        userId: userId
      }
    };
  } catch (error) {
    console.log('THIS IS THE ERROR', error)
    return {
      props: {
        AllAccounts: false,
        isServerErr: true,
        userId: false
      }
    };
  }

}