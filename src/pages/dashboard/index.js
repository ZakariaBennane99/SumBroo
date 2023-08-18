/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import Link from "next/link";
import { useState, useEffect } from "react";
import HomeMenu from "../../../components/HomeMenu";
import Header from "../../../components/Header";
import Footer from '../../../components/Footer'


const Home = () => {

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
        windowWidth > 1215 ? <HomeMenu /> : ''
      }
      <div style={{ width: windowWidth > 1215 ? '80%' : '100%', height: windowWidth > 1215 ? 'fit-content' : '100vh' }} className="rightSectionZenContainer">
        <img src="./zenMode.svg" alt="editing"/>
      </div>
    </div>
  </div>
  <Footer />
</div>)

};

export default Home;
