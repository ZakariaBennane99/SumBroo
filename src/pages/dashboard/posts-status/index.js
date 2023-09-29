/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import _ from 'lodash';
import { useRouter } from 'next/router'


const PostsStatus = () => {
 
  const router = useRouter()

  const data = [
    {
      title: 'the best 3 destinations to visit this Summer - Summer Board',
      platform: 'pinterest',
      status: 'in-review'
    },
    {
      title: 'navigatin my youth blog post',
      platform: 'pinterest',
      status: 'rejected',
      explanation: '🖊️ Consider adding more detailed descriptions for each destination.\n💡 Please ensure all images have proper attributions.\n📝 Check for typos in the third paragraph.'
    },
    {
      title: 'navigating my 20s by a 45 years old person',
      platform: 'pinterest',
      status: 'in-review'
    },
    {
      title: 'how to change your lifestyle',
      platform: 'pinterest',
      status: 'rejected',
      explanation: '🖊️ Consider adding more detailed descriptions for each destination.\n💡 Please ensure all images have proper attributions.\n📝 Check for typos in the third paragraph.'
    },
    {
      title: 'the best thing to do is to make happen',
      platform: 'pinterest',
      date: 'July 17, 2023',
      status: 'published'
    },
    {
      title: 'great things happen to those who seek them',
      platform: 'pinterest',
      date: 'July 16, 2023',
      status: 'published'
    },
    {
      title: 'No is ready to face their fears, I do not know how',
      platform: 'Pinterest',
      date: 'July 15, 2023',
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
                      <span className='platform'><img id='smlg' src='/sm/pin.svg' /> <span>{_.startCase(el.platform)}</span> <img id='link' src='/linkToPost.svg' /></span>
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
                      <span className='platform' style={{ cursor: 'default', backgroundColor: '#a4a4bb' }}><img id='smlg' src='/sm/pin.svg' /><span style={{ marginRight: '5px' }}>{_.startCase(el.platform)}</span></span>
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
                        <span className='platform' style={{ cursor: 'default', backgroundColor: '#a4a4bb' }}><img id='smlg' src='/sm/pin.svg' /><span style={{ marginRight: '5px' }}>{_.startCase(el.platform)}</span></span>
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