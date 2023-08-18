import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import SettingsMenu from "../../../../components/SettingsMenu";
import { useState, useEffect } from "react";

const Billing = () => {

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


    return (<div id="parentWrapper">
        <Header signedIn={true}/>
        <div className="resultsSection">
            <div className="homeContainer">
                {
                    windowWidth > 1215 ? <SettingsMenu /> : ''
                }
                <div className="paymentContainer">
                    <div>
                        <p>When clicking on the button below, you'll be redirected to a secure Stripe page to manage your billing details.</p>
                        <button style={{ paddingLeft: '15px', paddingRight: '15px' }}>Manage Payment <img src="/pinterest/external-white.svg" /></button>
                    </div>
                </div>
            </div>
        </div>
        <Footer />
  </div>)
};

export default Billing;
