/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { useState, useEffect } from "react";


const Privacy = () => {

  const [windowWidth, setWindowWidth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    setLoading(false);
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

  if (loading) {
    return <div>...loading</div>
  }

    return (<div className="footerSectionsWrapper">
        <Header width={windowWidth} />
        <div className='footerSections'>
            <h1 className="sectionTitle">Privacy Policy</h1>
            <div className="sectionContent">
  <p><strong><em>Last updated: August 13, 2023</em></strong></p>

  <p>SumBroo, operated and owned by Driven Dynamics Limited, is committed to protecting and respecting the privacy of all its users. This Privacy Policy explains how we use any personal data collected from you through our website i.e., under the operations of SumBroo. We advise you to read this Privacy Policy carefully and make sure you understand it.</p>

  <h2>&#73;. Data Collection</h2>
  <p>When you apply to use the services of SumBroo we collect certain necessary data about you, which primarily include:</p>
    <ul>
      <li>Name</li>
      <li>Email Address</li>
      <li>social media profile links</li>
    </ul>

  <h2>&#73;&#73;. Storage, Use, And Security of Data</h2>  
  <p>The collected data is stored in our database for the key purpose of verifying accounts. After the vetting process, social media profile links are deleted from our system. </p>
  <p>However, we associate certain tags and a short description with the accepted user for targeting. Throughout the entire process, we employ strict security measures to avoid any unauthorized access to your data.</p>
  <p>Payment details are handled and hosted exclusively by Stripe, which governs the handling of this data according to its own Privacy Policy.</p>
  <p>We store a token in your browser to keep you signed in and improve your user experience with SumBroo.</p>

  <h2>&#73;&#73;&#73;. Data Used For Communication</h2>
  <p>Your email address is used to communicate essential information such as payment links and details, updates about your onboarding process, and other necessary service-related information.</p>

  <h2>&#73;&#86;. Temporary Hosting of Post Content</h2>
  <p>For the purpose of post verification, the post content is temporarily hosted on AWS Servers until it is approved (usually within a few hours). Post this process, the content hosted in AWS Servers is deleted.</p>

  <h2>&#86;. Data Sharing</h2>
  <p>As a connecting platform between micro-influencers, SumBroo and Driven Dynamics Limited does not share any of your personal data with any third party or the micro-influencers connected through this web app.</p>

  <h2>&#86;&#73;. Your Data Protection Rights</h2>
  <p>Under data protection law, you have rights including your right to access, correct, erase, restrict, and object to the processing of your personal data. If you would like to exercise any of these rights, please contact us via the contact details provided on our website.</p>

  <h2>&#86;&#73;&#73;. Changes To The Privacy Policy</h2>
  <p>We reserve the right to modify this Privacy Policy as necessary, for instance, to comply with changes in laws and regulation or changes in our practices and procedures. Any changes will be duly made known on this platform.</p>

  <h2>&#86;&#73;&#73;&#73;. Children&apos;s Privacy</h2>
  <p>Our extension and services are not intended for use by children under the age of 13. We do not knowingly collect personal information from children under 13.</p>

  <h2>&#73;&#88;. Third-Party Links</h2>
  <p>We are not responsible for the privacy policies, practices, or content of any external websites or services. We encourage users to read the privacy policies of any third-party websites or services they may visit.</p>
  
  <h2>&#88;. Contact Us</h2>
  <p>If you have any questions or concerns about this Privacy Policy, please contact us at hey@sumbroo.com</p>

  <p>By using our services, you consent to the terms of this privacy policy. If at any point you do not agree with the terms outlined in this privacy policy, refrain from using our services.</p>

  <p>This privacy policy was last updated on <b>August 13, 2023</b>. Please check back frequently to see any updates or changes to our privacy policy.</p>

  </div>
        </div>
        <Footer />
    </div>
    )
};

export default Privacy;
