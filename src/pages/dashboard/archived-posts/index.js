/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import _ from 'lodash';



const Archive = () => {


  const data = [
    {
      title: 'Satisfy Your Cravings with These Delectable Weeknight Dinner Recipes',
      platform: 'pinterest',
      date: 'July 17, 2023'
    },
    {
      title: 'Deliciously Easy Weeknight Dinners',
      platform: 'pinterest',
      date: 'July 9, 2023'
    },
    {
      title: 'From Farm to Your Fork: Embrace Freshness in Every Bite',
      platform: 'pinterest',
      date: 'July 16, 2023'
    },
    {
      title: 'Embark on a Flavorful Journey: International Cuisines at Home',
      platform: 'pinterest',
      date: 'July 15, 2023'
    },
    {
      title: 'Foodie Adventures & Culinary Creations',
      platform: 'pinterest',
      date: 'July 12, 2023'
    },
    {
      title: 'Mouthwatering Dessert Delights',
      platform: 'pinterest',
      date: 'July 18, 2023'
    },
    {
      title: 'Nourish Your Body and Soul: Wholesome Healthy Eating Ideas',
      platform: 'pinterest',
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
                  <span className='platform'><img id='smlg' src={`/sm/${el.platform}.svg`} /> <span>{_.startCase(el.platform)}</span> <img id='link' src='/linkToPost.svg' /></span>
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