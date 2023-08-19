import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import SettingsMenu from "../../../../components/SettingsMenu";
import { useState, useEffect } from "react";
import { connectUserDB, userDbConnection } from '../../../../utils/connectUserDB';
import jwt from 'jsonwebtoken';
import mongoSanitize from 'express-mongo-sanitize';


function capitalize(wd) {
    const capitalizeWord = wd => wd.charAt(0).toUpperCase() + wd.slice(1).toLowerCase();
    return capitalizeWord
}

const LinkedAccounts = ({ userId, AllAccounts }) => {

    console.log(userId, AllAccounts)

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
        <Footer />
  </div>)
};

export default LinkedAccounts;

export async function getServerSideProps(context) {

    console.log(context.query.grub)

    if (context.query.grub) {
        try {
            const { grub } = context.query;

            console.log('the Grub is there')
        
            const decoded = jwt.verify(grub, process.env.JWT_SECRET);
            console.log('after the decoded')
            console.log(decoded.action)
        
            if (decoded.action !== 'payment') {
              throw new Error('Invalid action');
            }
            const userId = decoded.userId
            await connectUserDB()
            // assuming onboardingStep is 2
            console.log('after connecting DB')
            const sanitizedUserId = mongoSanitize.sanitize(userId);
            console.log(sanitizedUserId)
            let user = await userDbConnection.model('User').findOne({ _id: sanitizedUserId });
            console.log('the step', user.onboardingStep)
            if (!user || user.onboardingStep !== 2) throw new Error('User not found');

            const activeProfiles = user.socialMediaLinks
                .filter(link => link.profileStatus === "active")
                .map(link => link.platformName);

            let AvAccounts = await userDbConnection.model('AvAc').findOne({ _id: '64dff175f982d9f8a4304100' });

            let AvAcc = AvAccounts.map(ac => {
                return {
                    name: ac,
                    active: activeProfiles.includes(ac)
                }
            })

            return {
              props: {
                userId, AllAccounts: AvAcc
              }
            }; 
        
          } catch (error) {
            return {
              notFound: true
            };
          }
    } else {
        // general token check for the user
    }
  
  }