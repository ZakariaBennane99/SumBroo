/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import _ from 'lodash';
import { useRouter } from 'next/router'


const PostsStatus = () => {
 
  const router = useRouter()

  const data = [
    {
      title: 'Family-Friendly Foodie Fun: Recipes and Ideas for All Ages',
      platform: 'pinterest',
      status: 'in-review'
    },
    {
      title: 'Seasonal Sensations: Celebrate Each Season with Flavorful Fare',
      platform: 'pinterest',
      status: 'rejected',
      explanation: "🖼️ Opt for a more captivating title to grab attention.\n🔍 Ensure your image adheres to the recommended specifications.\n✏️ Double-check the description for clarity and accuracy."
    },
    {
      title: 'Exploring the World of Vegetarian Cuisine',
      platform: 'pinterest',
      status: 'in-review'
    },
    {
      title: 'Wholesome Meals and Culinary Delights Awaits',
      platform: 'pinterest',
      status: 'rejected',
      explanation: '🎯 Ensure your content is relevant to the target audience.\n🔄 Consider optimizing your Pin for better rotation in the feed.\n🔗 Double-check any linked content for accessibility and relevance.'
    },
    {
      title: 'Food Inspiration to Spark Your Culinary Creativity',
      platform: 'pinterest',
      date: 'October 2, 2023',
      status: 'published'
    },
    {
      title: 'Embracing the Bounty of Locally Sourced Ingredients',
      platform: 'pinterest',
      date: 'October 3, 2023',
      status: 'published'
    },
    {
      title: 'A Culinary Adventure from Every Corner of the World',
      platform: 'pinterest',
      date: 'October 4, 2023',
      status: 'published'
    },
    {
      title: 'A Collection of Breads, Pastries, and Pies to Bake at Home',
      platform: 'pinterest',
      date: 'October 5, 2023',
      status: 'published'
    },
    {
      title: 'Quick and Delicious Recipes for Busy Lives',
      platform: 'pinterest',
      date: 'October 6, 2023',
      status: 'published'
    },
    {
      title: 'Feeling Great: Nutritious Choices for a Healthier You',
      platform: 'pinterest',
      date: 'October 7, 2023',
      status: 'published'
    },
  ]

  const published = data.filter(elem => elem.status === 'published');
  const inReview = data.filter(elem => elem.status === 'in-review');
  const rejected = data.filter(elem => elem.status === 'rejected');


  return (
        <div className="postStatusContainer">
          <div className="innerContainer">
            <div className="published">
              <div className='titles'>Published</div>
              {
                published.map(el =>
                  <div className='body'>
                    <p>{_.startCase(el.title)}</p>
                    <div>
                      <span className='platform'><img id='smlg' src={`/sm/${el.platform}.svg`} /> <span>{_.startCase(el.platform)}</span> <img id='link' src='/linkToPost.svg' /></span>
                      <span className='date'>{el.date}</span>
                    </div>
                  </div>
                )
              }
            </div>
            <div>
            <div className='titles'>In Review</div>
              {
                inReview.map(el =>
                  <div className='body'>
                    <p>{_.startCase(el.title)}</p>
                    <div>
                      <span className='platform' style={{ cursor: 'default', backgroundColor: '#a4a4bb' }}><img id='smlg' src={`/sm/${el.platform}.svg`} /><span style={{ marginRight: '5px' }}>{_.startCase(el.platform)}</span></span>
                    </div>
                  </div>
                )
              }
            </div>

          </div>  
          <div className="titlesContainer">
              <div className='titles'>Need Revision</div>
              {
                rejected.map(el => 
                  <div className='body'>
                    <p className='postTitle'>{_.startCase(el.title)}</p>
                    <div>
                        <span className='platform' style={{ cursor: 'default', backgroundColor: '#a4a4bb' }}><img id='smlg' src={`/sm/${el.platform}.svg`} /><span style={{ marginRight: '5px' }}>{_.startCase(el.platform)}</span></span>
                    </div>
                    <div id="feedback-box">
                      {
                        el.explanation.split('\n').map(elem => 
                          <div className='feedback-points part'>{elem}</div>
                        )
                      }
                      <button onClick={ () => { router.push('/dashboard/publish-a-post'); } } className="create-post-button">Create a New Post</button>
                    </div>
                  </div>
                )
              }
            </div>
    </div>)
};

export default PostsStatus;


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