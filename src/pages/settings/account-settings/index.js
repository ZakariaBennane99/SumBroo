import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import SettingsMenu from "../../../../components/SettingsMenu";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";


const AccountSettings = ({ userData }) => { 

  const router = useRouter();

    const [windowWidth, setWindowWidth] = useState(null);

    useEffect(() => {
      setWindowWidth(window.innerWidth);
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

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [newPass, setNewPass] = useState('')
    const [confirmPass, setConfirmPass] = useState('')


    function updateName() {

    }

    function updateEmail() {

    }

    function updatePassword() {

    }

    return (<div id="parentWrapper">
      <Header signedIn={true}/>
      <div className="resultsSection">
          <div className="homeContainer">
              {
                  windowWidth > 1215 ? <SettingsMenu /> : ''
              }
              <div className="accountSettingsContainer">
                  <div className="accountSetting">
                      <div className="head">
                          Username
                      </div>
                      <div className='body'>
                          <div>
                              <span className="titles">Current Username</span>
                              <span className="old">{userData.username}</span>
                          </div>
                          <div>
                              <label className="titles">New Username</label>
                              <input type="text" placeholder="New username" name="username" onChange={(e) => setName(e.target.value)} />
                          </div>
                          <button onClick={updateName}>Update Username</button>
                      </div>
                  </div>

                  <div className="accountSetting">
                      <div className='head'>
                          Email
                      </div>
                      <div className='body'>
                          <div>
                              <span className="titles">Current Email</span>
                              <span className="old">{userData.email}</span>
                          </div>
                          <div>
                              <label className="titles">New Email</label>
                              <input type="email" placeholder="New email" name="email" onChange={(e) => setEmail(e.target.value)} />
                          </div>
                          <button onClick={updateEmail}>Update Email</button>
                      </div>
                  </div>

                  <div className="accountSetting">
                      <div className='head'>
                          Password
                      </div>
                      <div className='body'>
                          <div>
                              <label className="titles">New password</label>
                              <input type="password" placeholder="New password" name="newPassword" onChange={(e) => setNewPass(e.target.value)} />
                          </div>
                          <div>
                              <label className="titles">Confirm Password</label>
                              <input type="password" placeholder="Confirm password" name="confirmPassword" onChange={(e) => setConfirmPass(e.target.value)} />
                          </div>
                          <button onClick={updatePassword}>Update Password</button>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      <Footer />
    </div>)
};

export default AccountSettings;

export async function getServerSideProps(context) {

  const jwt = require('jsonwebtoken');
  const { connectUserDB } = require('../../../../utils/connectUserDB');
  const mongoSanitize = require('express-mongo-sanitize');

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

      console.log('user Id', decoded.userId)

      const userId = decoded.userId;

      
      const sanitizedUserId = mongoSanitize.sanitize(userId);
      
      const { User } = await connectUserDB();
      let user = await User.findOne({ _id: sanitizedUserId });
      
      console.log('after user connection')

      // send the data to the front end
      const userData = {
        username: user.name,
        email: user.email
      }

      console.log(userData)
  
      // continue rendering
      return {
        props: {
          userData
        }
      };
  
  
    } catch (error) {
      console.error("Error in getServerSideProps:", error);
      return {
        redirect: {
          destination: '/sign-in',
          permanent: false,
        },
      };
    }
  
}
  