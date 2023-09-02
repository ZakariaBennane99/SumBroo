/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import _ from 'lodash';



const Archive = () => {


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

  return (
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
    </div>)

};

export default Archive;


export async function getServerSideProps(context) {

  const jwt = require('jsonwebtoken');

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
      props: {
        signedIn: true,
        dash: true
      }
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