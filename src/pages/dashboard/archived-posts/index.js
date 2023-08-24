/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { useRouter } from 'next/router';
import Link from "next/link";
import { useState, useEffect } from "react";
import Header from '../../../../components/Header';
import Footer from '../../../../components/Footer';
import HomeMenu from '../../../../components/HomeMenu';
import _ from 'lodash';
import jwt from 'jsonwebtoken';
import { useRouter } from "next/router";



const Archive = ({ signedIn }) => {

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

  const data = [
    {
      title: 'the best thing to do is to make happen',
      platform: 'pinterest',
      date: 'July 17, 2023'
    },
    {
      title: 'the best thing to do is to make happen for those who know it well man how',
      platform: 'pinterest',
      date: 'July 9, 2023'
    },
    {
      title: 'great things happen to those who seek them',
      platform: 'pinterest',
      date: 'July 16, 2023'
    },
    {
      title: 'No is ready to face their fears, I do not know how',
      platform: 'Pinterest',
      date: 'July 15, 2023'
    },
    {
      title: 'the best thing to do is to make happen',
      platform: 'pinterest',
      date: 'July 12, 2023'
    },
    {
      title: 'great things happen to those who seek them',
      platform: 'pinterest',
      date: 'July 18, 2023'
    },
    {
      title: 'No is ready to face their fears, I do not know how',
      platform: 'Pinterest',
      date: 'July 8, 2023'
    }
  ]


  if (signedIn) {
    router.push('/sign-in');
    return null
  } else {
    return (<div id="parentWrapper">
    <Header signedIn={signedIn}/>
    <div className="resultsSection">
      <div className="homeContainer">
        {
          windowWidth > 1215 ? <HomeMenu /> : ''
        }
        <div className="archiveSection">
          {
            data.map(el =>
              <div className='body'>
                <p>{_.startCase(el.title)}</p>
                <div>
                  <span className='platform'><img id='smlg' src='/sm/pin.svg' /> <span>{_.startCase(el.platform)}</span> <img id='link' src='/linkToPost.svg' /></span>
                  <span className='date'>{el.date}</span>
                </div>
              </div>
            )
          }
        </div>
      </div>
    </div>
    <Footer />
    </div>)
  }

};

export default Archive;


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
        props: {
          signedIn: false
        }
      };
    }

    return {
      props: {
        signedIn: true
      }
    };


  } catch (error) {
    return {
      props: {
        signedIn: false
      }
    };
  }

}