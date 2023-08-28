import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import SettingsMenu from "../../../../components/SettingsMenu";
import { useState, useEffect } from "react";
import Modal from 'react-modal';


function capitalize(wd) {
    const capitalizeWord = wd.charAt(0).toUpperCase() + wd.slice(1).toLowerCase();
    return capitalizeWord
}

const LinkedAccounts = ({ AllAccounts, newUser, isServerErr, userId }) => {

    const isNewUser = newUser || false

    console.log(AllAccounts)

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

    const [refresh, setRefresh] = useState(true)

    /*
        {
            refresh ? <div className="refreshWarning"> 
                <img src="/infotip.svg" /><span>It looks like your connection has expired. To continue posting, please renew your connection.</span> 
            </div> : ''
        } 
        {
            acc.active ?
            <img id="check" src="/check.svg" />
            : ''
        } 
    */

  
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
                            <div className="linkedAccounts">
                                <div className="account">
                                  <span id="sm"><img id="smlg" src={`/sm/${acc.name}.svg`} /> {capitalize(acc.name)}</span>
                                </div>
                                <button>{acc.active ? 'Link Account' : 'Apply To Link'}</button>
                            </div>
                        </div>
                    </div>
                    )
                })
            }
        </div>
    </div>
    <Modal
      isOpen={isServerErr}
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

  const { connectUserDB, userDbConnection } = require('../../../../utils/connectUserDB');
  const jwt = require('jsonwebtoken');
  const mongoSanitize = require('express-mongo-sanitize');

  // this is only for onboarding
  if (context.query.grub) {
      try {
          const { grub } = context.query;
      
          const decoded = jwt.verify(grub, process.env.JWT_SECRET);
      
          if (decoded.action !== 'payment') {
            throw new Error('Invalid action');
          }
          const userId = decoded.userId
          await connectUserDB()
          // assuming onboardingStep is 2
          const sanitizedUserId = mongoSanitize.sanitize(userId);
          let user = await userDbConnection.model('User').findOne({ _id: sanitizedUserId });
          if (!user || user.onboardingStep !== 2) throw new Error('User not found');
          const activeProfiles = user.socialMediaLinks
              .filter(link => link.profileStatus === "active")
              .map(link => link.platformName);
          let AvAccounts = await userDbConnection.model('AvAc').findOne({ _id: '64dff175f982d9f8a4304100' });
          let AvAcc = AvAccounts.accounts.map(ac => {
            return {
              name: ac,
              active: activeProfiles.includes(ac)
            }
          })
          return {
            props: {
              userId, 
              AllAccounts: AvAcc, 
              newUser: true,
              isServerErr: false
            }
          }; 
      
        } catch (error) {
          return {
            props: {
              userId: false, 
              AllAccounts: false, 
              newUser: false,
              isServerErr: false
            }
          };
        }
  } else {
    // general token check for the user
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
          redirect: {
            destination: '/sign-in',
            permanent: false,
          },
        };
      }
  
      // continue rendering
      return {
        props: {}
      };
    } catch (error) {
      return {
        redirect: {
          destination: '/sign-in',
          permanent: false,
        },
      };
    }
  }
  
  }