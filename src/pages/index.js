/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { useEffect, useRef, useState } from 'react';
import Bowser from "bowser";
import { Tadpole } from "react-svg-spinners";
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Head from 'next/head';

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
    { title: 'Are the generated notes and summaries editable?', content: 'Absolutely! You have full control over the generated notes and summaries created by our extension. You can easily edit the content to suit your preferences before downloading them or sending them to your Kindle.' },
    { title: 'Is the extension available on mobile devices as well?', content: 'Unfortunately, our extension is not available on mobile devices at the moment. We have designed it specifically for desktop use to provide the best experience and functionality for users on major browsers like Chrome, Safari, Mozilla Firefox, and Microsoft Edge. But we may develop an option for mobile based on demand.' },
    { title: 'How can I upgrade, downgrade, or cancel my subscription?', content: '<p>Managing your subscription is simple and hassle-free. To upgrade, downgrade, or cancel your subscription, just follow these steps:</p>\n <p>1. Click on <strong>Account Settings</strong> if you have the extension opened or Go to <strong>Settings</strong> on the website.</p>\n <p>2. Click on the <strong>Billing</strong> tab.</p>\n<p>3. From there, you can easily choose to upgrade or downgrade your subscription plan, or select the option to cancel your subscription altogether.</p>'},
    { title: 'How often is the extension updated with new features or improvements?', content: 'Our extension is continuously evolving, and we are committed to providing the best possible experience for our users. We typically release updates with new features, improvements, and bug fixes every 4-6 weeks' },
    { title: 'Are there any plans for future integrations with other learning platforms?', content: 'Yes, we understand the importance of catering to a diverse range of learning platforms to provide a comprehensive learning experience for our users. While our extension currently focuses on LinkedIn Learning courses, we have plans to explore and integrate with other popular learning platforms in the future.' },
    { title: 'Is there a free trial or a free version available for the extension?', content: 'Certainly! We offer a free trial with 20 minutes of credit upon sign up, allowing you to explore the extension\'s features. After the trial, you can choose from our subscription plans to continue using the extension.' },
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

  const [browserName, setBrowserName] = useState("");
  const [token, setToken] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const browser = Bowser.getParser(window.navigator.userAgent);
      setBrowserName(browser.getBrowser().name.toLowerCase());
    }
    setToken(window.localStorage.getItem("userPassToken"))
  }, []);

  // send the token to the backend
  return (
    <div id='parentWrapper'>
      <Header singedIn={token !== ''} />
      <div id='heroSection'>
        <h1>Generate Powerful Notes & Summaries For Your LinkedIn Courses And Accelerate Your Learning</h1>
        <p>Revolutionize Your Learning Experience with the <span>SwiftNotion</span> Extension Delivers AI-Powered Smart Notes & Precise Screenshot</p>
        <button>Try It Now For Free { browserName === '' ? '' : <img src={`./${browserName}.svg`} alt='Call to action button' /> } </button>
      </div>
      <img id='divider' src='./divider.svg' />
      <h1 className='sectionTitle'>Key Features</h1>
      <div id='featuresContainer'>
        <div>
          <h1>Automatic Screenshots At 80% Accuracy</h1>
          <img src='./picFeature.svg' alt='' />
          <p>Let the extension handle capturing and integrating screenshots into your notes, ensuring a richer and more engaging learning experience</p>
        </div>
        <div>
          <h1>Natural-Sounding Audio</h1>
          <img id='audioWaves' src='./audioWaves.svg' alt='' />
          <p>Create lifelike audio versions of all your summaries and notes, enabling you to listen anytime and anywhere at your convenience.</p>
        </div>
        <div>
          <h1>Smart Notes & Summaries</h1>
          <img src='./feather.svg' alt='' />
          <p>Generate smart notes and summaries and
download them as PDF or send them directly
to your Kindle with one Click</p>
        </div>
        <div>
          <h1>Available For All Major Browsers</h1>
          <img id='browsersGroup' src='./majorBrowsers.svg' alt='' />
          <p id='textBrowsers'>Effortlessly download it in your favorite
browser, for a seamless note-generating
experience wherever you go</p>
        </div>
      </div>
      <img id='divider' src='./divider.svg' />
      <h1 className='sectionTitle'>How It Works?</h1>
      <div className='howToSection'>
        <div>
          <h1>Step 1: Add the extension & Sign up</h1>
          <img src='./stepsUnderline.svg' />
        </div>
        <button>Add It To Your { browserName === '' ? '' : <img src={`./${browserName}.svg`} alt='Call to action button' /> } Browser</button>
        <div>
          <h1>Step 2: Choose your preferences</h1>
          <img src='./stepsUnderline.svg' />
        </div>
        <img className='steps' src='./step2.svg' />
        <div>
          <h1>Step 3: Download your notes/summary</h1>
          <img src='./stepsUnderline.svg' />
        </div>
        <img className='steps' src='./step3.svg' />
      </div>
      <img id='divider' src='./divider.svg' />
      <h1 className='sectionTitle'>Frequently Asked Questions</h1>
      <Accordion />
      <Footer />
    </div>
  )
};

export default Landing;
