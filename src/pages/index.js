/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { useState } from 'react';
import { useRouter } from 'next/router';


const AccordionItem = ({ title, content }) => {

  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className='accordionItem'>
      <div className='accordionTitle' onClick={toggleAccordion}>
        {title}
      </div>
      {isOpen && <div className='accordionContent' dangerouslySetInnerHTML={{ __html: content }} ></div>}
    </div>
  );
};

const Accordion = () => {
  const items = [
    { title: 'What is SumBroo?', content: 'SumBroo is a unique platform that facilitates connections between micro-influencers, allowing for collaborative growth and reach.' },
    { title: 'Why should I join SumBroo?', content: `If you're a micro-influencer looking to expand your influence, acquire daily high-quality content, and grow in a cost-effective manner, SumBroo is for you. With an opportunity to reach up to 1M engaged followers per month per platform, detailed analytics, and a vetted community, you’re set for success.`},
    { title: 'How do I join the network?', content: 'Joining is simple. Apply, get approved, select your preferred plan, make your payment, connect your social media accounts and start guest posting!' },
    { title: 'How do I connect my social media accounts?', content: 'Once you’re approved, you’ll be guided through an easy process to connect your social media accounts to SumBroo.' },
    { title: 'What does the vetting process involve?', content: 'To ensure quality, all micro-influencers are carefully vetted before joining our network. This includes reviewing your content quality, consistency, engagement, and followers.' },
  ];

  return (
    <div className='accordion'>
      {items.map((item, index) => (
        <AccordionItem key={index} title={item.title} content={item.content} />
      ))}
    </div>
  );
};

const Landing = () => {

  const router = useRouter();

  // send the token to the backend
  return (<>
      <div id='heroSection'>
        <h1>Efficiently Maximize Your Impact with SumBroo and Grow Faster</h1>
        <p>Enjoy a surge in your <span>growth rate</span> and <span>audience reach</span>, experience a daily dose of <span>high-quality content</span>, and benefit from the <span>unparalleled value</span> of our carefully curated plans.</p>
        <button onClick={() => router.push('/pricing')}>Join Us Today</button>
      </div>
      <img id='divider' src='./divider.svg' />
      <h1 className='sectionTitle'>What's In It For Me?</h1>
      <div id='featuresContainer'>
        <div>
          <h1>Precision Guest Posting</h1>
          <img src='/feature_targeting.svg' alt='' />
          <p>Choose your desired sub-niche and our system will handpick the perfect member in our network to amplify your post. With SumBroo, it's not just about targeting your niche; we extend your reach to adjacent sub-niches for unparalleled impact.</p>
        </div>
        <div>
          <h1>High-Quality Content</h1>
          <img src='/feature_content.svg' alt='' />
          <p>Every post you create or get shared on your feed undergoes rigorous review to maintain the highest standards of content integrity. This dedication ensures that only premier content circulates within our network, benefiting both you and your audience.</p>
        </div>
        <div>
          <h1>Reach & Growth</h1>
          <img src='/feather_growth.svg' alt='' />
          <p>Expand your influence with SumBroo's network to reach up to 1M engaged follower monthly. With our platform, audience growth isn't only about numbers, but about engaging the right people.</p>
        </div>
        <div>
          <h1>Exceptional Value</h1>
          <img src='/feature_cheap.svg' alt='' />
          <p id='textBrowsers'>For a monthly commitment, immerse yourself in a vast network of dedicated and members. Engage with a supportive community and harness detailed analytics, all ensuring maximum return on your investment.</p>
        </div>
        <div>
          <h1>Analytical Reports</h1>
          <img src='/featured_analytics.svg' alt='' />
          <p>Stay informed and strategize effectively with our in-depth, seven-day post analytics. Get better insights into your audience's behavior and preferences to fine-tune your future content and strategies.</p>
        </div>
        <div>
          <h1>Quality Assurance</h1>
          <img src='/feature_quality.svg' alt='' />
          <p>Every member of our network goes through a thorough vetting process before gaining access. This allows us to maintain a high standard of content, ensuring satisfying and performance-boosting interactions for everyone.</p>
        </div>
      </div>
      <img id='divider' src='./divider.svg' />
      <h1 className='sectionTitle'>How It Works?</h1>
      <div className='howToSection'>
        <div>
          <h1>Step 1: Apply, And Get Approved</h1>
          <img src='./stepsUnderline.svg' />
        </div>
        <button onClick={() => router.push('/pricing')}>Apply Now</button>
        <div>
          <h1>Step 2: Connect Your Social Media Accounts</h1>
          <img src='./stepsUnderline.svg' />
        </div>
        <img className='steps' src='./step2.svg' />
        <div>
          <h1>Step 3: Start Guest Posting and Receive Content</h1>
          <img src='./stepsUnderline.svg' />
        </div>
        <img className='steps' src='./step3.svg' />
        <div>
          <h1>Step 4: Monitor Your Growth with Detailed Analytics</h1>
          <img src='./stepsUnderline.svg' />
        </div>
        <img style={{ marginTop: '0px', marginBottom: '0px' }} className='steps' src='./step4.svg' />
      </div>
      <img style={{ marginTop: '60px' }} id='divider' src='./divider.svg' />
      <h1 className='sectionTitle'>Frequently Asked Questions</h1>
      <Accordion />
      <div className='landin-last-section'>
        <h1>Ready to take your influence<br/> to the next level?</h1>
        <button onClick={() => router.push('/pricing')}>Start Today!</button>
      </div>
  </>
  )
};

export default Landing;

export async function getServerSideProps(context) {

  const jwt = require('jsonwebtoken');

  let signedIn = false;
      
  try {

    const cookies = context.req.headers.cookie;

    const tokenCookie = cookies.split(';').find(c => c.trim().startsWith('token='));
    
    let tokenValue;
    if (tokenCookie) {
      tokenValue = tokenCookie.split('=')[1];
    }
    
    const decoded = jwt.verify(tokenValue, process.env.USER_JWT_SECRET);
    
    if (decoded.type !== 'sessionToken') {
        signedIn = false
    }

    signedIn = true;

  } catch (err) {
    signedIn = false
  }

  return {
    props: {
      notProtected: true,
      signedIn: signedIn
    }
  };

}
