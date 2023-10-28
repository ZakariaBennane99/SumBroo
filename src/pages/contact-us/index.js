
const ContactUs = () => {
  
  return (<div className='footerSections' style={{ marginBottom: '200px' }}>
      <h1 className="sectionTitle">Contact Us</h1>
      <p style={{ fontFamily: 'IBM Plex Sans' }}>Have a question, drop us an email at <b>hey@sumbroo.com</b>, and we will respond as soon as possible.</p>
    </div>
  )
};

export default ContactUs;

export async function getServerSideProps() {

  return {
    props: {
      notProtected: true
    }
  };

}