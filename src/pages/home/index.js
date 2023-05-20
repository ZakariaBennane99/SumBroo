/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import Results from "../../../components/Results";
import { parse } from 'cookie';
import jwt from 'jsonwebtoken';
import { useRouter } from 'next/router'
import { useState } from "react";


const Home = () => {

  const [formActive, setFormActive] = useState(false);

  const toggleForm = () => {
    setFormActive(!formActive);
  };

  const router = useRouter()

  // This will be 'extension' if the page was opened by the background script
  const source = router.query.source

  if (source === 'extension') {
    return (<div id="parentWrapper">
      <Header />
      <div className="resultsSection">
        <h1 className="sectionTitle">Home</h1>
        <Results />
      </div>
      <Footer />
    </div>)
  } else {
    return (<div id="parentWrapper">
      <Header />
      <div className="resultsSection">
        <h1 className="sectionTitle">Home</h1>
        <div className="homeContainer">
          <div className="leftSectionHome">
            <button><img src="./edit.svg" alt="editing"/>Enable Editing</button>
            <button><img src="./download.svg" alt="download"/>Download PDF</button>
            <button><img src="./book.svg" alt="book"/>Send To Kindle</button>
            <button><img src="./audioWaves.svg" alt="audio"/>Get Audio</button>
          </div>
          <div className="rightSectionHome">
            <img src="./zenMode.svg" alt="editing"/>
          </div>
        </div>
      </div>
      <Footer />
    </div>)
  }
};

export default Home;


/*
export async function getServerSideProps(context) {
  const cookies = parse(context.req.headers.cookie || '');
  const passToken = cookies.passToken;

  if (!passToken) {
    console.log('the passtoken doesn\'t exists')
    // If the user is not authenticated, redirect them to the sign-in page
    return {
      redirect: {
        destination: '/sign-in',
        permanent: false,
      },
    };
  }

  try {
    // Verify the token
    jwt.verify(passToken, process.env.USER_JWT_SECRET);
  } catch (err) {
    console.log('the passtoken doesn\'t is wrong')
    // If the token is invalid, redirect the user to the sign-in page
    return {
      redirect: {
        destination: '/sign-in',
        permanent: false,
      },
    };
  }

  // If the user is authenticated, render the Home page
  return {
    props: {},
  };
}
*/
