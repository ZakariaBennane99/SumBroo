import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import SettingsMenu from "../../../../components/SettingsMenu";
import { useState, useEffect } from "react";
import Modal from 'react-modal';
import { Tadpole } from "react-svg-spinners";

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

    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)

    async function handleBilling() {
      const customerId = 'cus_OTkFQCz14xEjQx'
      setIsLoading(true)
      try {
        const response = await fetch('http://localhost:4050/api/create-customer-portal-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ customerId })
        });
  
        const data = await response.json();

        console.log('this is the date', data)
  
        if (data.url) {
          // take the user to the Stripe page
          window.location.href = data.url;
        } else {
          // handle error: maybe show a message to the user
          console.log(data)
          setIsError(true)
        }
      } catch (error) {
        setIsError(true)
        console.error('Server error', error);
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
                <div className="paymentContainer">
                    <div>
                        <p>When clicking on the button below, you'll be redirected to a secure Stripe page to manage your billing details.</p>
                        <button className={`button ${isLoading ? 'loading' : ''}`} onClick={handleBilling} style={{ paddingLeft: '15px', paddingRight: '15px' }} disabled={isLoading ? true : false}>
                        {isLoading ? <Tadpole width={20} color='white' /> : <>Manage Billing <img src="/pinterest/external-white.svg" /></>}</button>
                    </div>
                </div>
            </div>
        </div>
        <Modal
          isOpen={isError}
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

export default Billing;
