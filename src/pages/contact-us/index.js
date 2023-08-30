/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { useState, useEffect } from "react";


const ContactUs = () => {

  const [windowWidth, setWindowWidth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    setLoading(false);
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

  if (loading) {
    return <div>...loading</div>
  }
  
  return (<div className='footerSectionsWrapper'>
      <Header width={windowWidth} />
      <div className='footerSections'>
          <h1 className="sectionTitle">Contact Us</h1>
          <p style={{ fontFamily: 'IBM Plex Sans' }}>Have a question, drop us an email at <b>hey@sumbroo.com</b>, and we will respond as soon as possible.</p>
      </div>
      <Footer />
  </div>
  )
};

export default ContactUs;
