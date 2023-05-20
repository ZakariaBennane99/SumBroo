/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";


const ContactUs = () => {

    return (<div className='footerSectionsWrapper'>
        <Header />
        <div className='footerSections'>
            <h1 className="sectionTitle">Contact Us</h1>
            <p>Have a question, drop us an email at hey@swiftnotion.co</p>
        </div>
        <Footer />
    </div>
    )
};

export default ContactUs;
