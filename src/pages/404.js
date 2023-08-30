// pages/404.js
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useState, useEffect } from 'react';

function Custom404() {

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

  return (<div className='Er404-parent-section'>
      <Header width={windowWidth} />
          <div className='Error-container'>
            <h1 style={{ fontSize: '2.5em' }}>Page Not Found</h1>
            <img src="/404.svg" />
            <button style={{ width: 'fit-content', 
              padding: '15px 25px 15px 25px', 
              fontSize: '1.5em',
              marginBottom: '70px' }}>Go Back To The Homepage</button>
          </div>
      <Footer />
    </div>
  );
}
  
export default Custom404;
  