import React, { useState } from 'react';
import Router from 'next/router';
import '@/styles/globals.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import HomeMenu from '../../components/HomeMenu';
import { useRouter } from 'next/router';
import SettingsMenu from '../../components/SettingsMenu';

export default function MyApp({ Component, pageProps }) {

  console.log(pageProps.signedIn)

  const signedIn = pageProps.signedIn;
  const set = pageProps.isSettings

  const isSettings = set ? set : false

  const router = useRouter();

  const [loading, setLoading] = React.useState(false);
  const [windowWidth, setWindowWidth] = useState(null);
  const [mountedLoading, setMountedLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState(router.pathname);

  React.useEffect(() => {
    setWindowWidth(window.innerWidth);
    setMountedLoading(false)
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

  React.useEffect(() => {
    const start = () => {
      console.log("start");
      setLoading(true);
    };
    const end = () => {
      console.log("finished");
      setLoading(false);
    };
    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);

    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
  }, []);

  React.useEffect(() => {
    setCurrentPath(router.pathname);
  }, [router.pathname]);

  if (mountedLoading) {
    return <div>loading...</div>
  }

  return (
    <div id="parentWrapper">
      <Header signedIn={signedIn} width={windowWidth}/>
      <div className="resultsSection">
        <div className='homeContainer'>
          {
            (windowWidth > 1215 && signedIn) ? (
              isSettings ? 
                <SettingsMenu pathname={currentPath} />
              :
                <HomeMenu pathname={currentPath} />
            ) : ''
          }
          {loading ? (
            <h1>Loading...</h1>  // Replace this with your actual loading bar or spinner
          ) : (
            <Component {...pageProps} windowWidth={windowWidth} />
          )}
        </div>  
      </div>  
      <Footer />
    </div>
  );
}