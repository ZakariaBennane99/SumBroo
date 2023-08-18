import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import SettingsMenu from "../../../../components/SettingsMenu";
import { useState, useEffect } from "react";


const LinkedAccounts = () => {

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

    // don't forget to get the user's active accounts
    // when introducing more SMs networks
    // another thing, make sure to check the user's token 
    // for the account linked and update the above 

    return (<div id="parentWrapper">
        <Header signedIn={true}/>
        <div className="resultsSection">
            <div className="homeContainer">
                {
                    windowWidth > 1215 ? <SettingsMenu /> : ''
                }
                <div className="smAccountsContainer">
                    <div className="linkedAccountsWrapper"> 
                        {
                            refresh ? <div className="refreshWarning"> 
                                        <img src="/infotip.svg" /><span>It looks like your connection has expired. To continue posting, please renew your connection.</span> 
                                    </div> : ''
                        }
                        <div className="linkedAccounts">
                            <div className="account">
                                <span id="sm"><img id="smlg" src="/sm/pin.svg" /> Pinterest</span> <img id="check" src="/check.svg" />
                            </div>
                            <button>{refresh ? 'Renew Connection' : 'Unlink Account'}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Footer />
  </div>)
};

export default LinkedAccounts;
