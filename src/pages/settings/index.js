import Link from "next/link";
import { useState, useEffect } from "react";
import SettingsMenu from "../../../components/SettingsMenu";
import Header from "../../../components/Header";
import Footer from '../../../components/Footer';
import { useRouter } from "next/router";


const Settings = () => {

  const router = useRouter();

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
          <div style={{ width: windowWidth > 1215 ? '80%' : '100%' }} className="rightSectionZenContainer">
            <img src="./zenMode.svg" alt="editing"/>
          </div>
        </div>
      </div>
      <Footer />
    </div>)

};

export default Settings;

export async function getServerSideProps(context) {

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
