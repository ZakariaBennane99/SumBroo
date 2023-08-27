import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import SettingsMenu from "../../../../components/SettingsMenu";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Modal from 'react-modal';
import axios from 'axios';


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

    const [isErr, setIsErr] = useState(false)

    const [name, setName] = useState('')
    const [nameClicked, setNameClicked] = useState(false)
    const [email, setEmail] = useState('')
    const [emailClicked, setEmailClicked] = useState(false)
    const [emailErrs, setEmailErrs] = useState(null)
    const [newPass, setNewPass] = useState('')
    const [confirmPass, setConfirmPass] = useState('')
    const [passClicked, setPassClicked] = useState(false)
    const [passErrs, setPassErrs] = useState([])


    async function updateName() {
      setNameClicked(true)

      const apiUrl = 'http://localhost:4050/api/update-name'

      try {
        const res = await axios.post(apiUrl, {
          name: name
        },  {
          withCredentials: true
        })
        console.log(res)
        if (res.status === 200) {
          setNameClicked(false)
          // alert user
          alert('Your username has been changed.')
        }
        // send the user to the dashboard
      } catch (error) {
        // set Server error
        setIsErr(true)
      }

    }

    async function updateEmail() {
      setEmailClicked(true)

      const apiUrl = 'http://localhost:4050/api/update-email'

      try {
        const res = await axios.post(apiUrl, {
          email: email
        },  {
          withCredentials: true
        })
        if (res.status === 200) {
          setEmailClicked(false)
          // alert user
          alert('Your email has been changed.')
        }
        // send the user to the dashboard
      } catch (error) {
        // set Server error
        setEmailClicked(false)
        if (error.response.status === 400) {
          setEmailErrs('Please include a valid email')
        } else {
          setIsErr(true)
        }
      }

    }

    async function updatePassword() {

      // check if password match
      if (newPass !== confirmPass) {
        setPassErrs([{ msg: `Passwords dont't match` }])
        return
      }

      setPassClicked(true)

      const apiUrl = 'http://localhost:4050/api/update-password'

      try {
        const res = await axios.post(apiUrl, {
          newPass: newPass
        },  {
          withCredentials: true
        })
        if (res.status === 200) {
          setPassClicked(false)
          // alert user
          alert('Your password has been changed.')
        }
        // send the user to the dashboard
      } catch (error) {
        // set Server error
        setPassClicked(false)
        if (error.response.status === 400) {
          setPassErrs(error.response.data.errors)
        } else {
          setIsErr(true)
        }
        
      }

    }


    const customStyles = {
      content: {
        width: '20%',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        fontFamily: 'Ubuntu',
      },
    };

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
                          <button onClick={updateName} disabled={nameClicked}>Update Username</button>
                      </div>
                  </div>

                  <div className="accountSetting">
                      <div className='head'>
                          Email
                      </div>
                      <div className='body'>
                      {emailErrs ?
                            <p style={{ fontSize: '.9em', color: 'red', marginTop: '10px' }}>{emailErrs}</p>
                           : ''}
                          <div>
                              <span className="titles">Current Email</span>
                              <span className="old">{userData.email}</span>
                          </div>
                          <div>
                              <label className="titles">New Email</label>
                              <input type="email" placeholder="New email" name="email" 
                              style={{ outline: emailErrs ? '1.5px solid red' : '' }} 
                              onChange={(e) => { setEmailErrs(null); setEmail(e.target.value) }} />
                          </div>
                          <button onClick={updateEmail} disabled={emailClicked}>Update Email</button>
                      </div>
                  </div>

                  <div className="accountSetting">
                      <div className='head'>
                          Password
                      </div>
                      <div className='body'>
                        {passErrs.length > 0 ?
                            passErrs.map(elem => {
                              return <p style={{ fontSize: '.9em', color: 'red', marginTop: '10px' }}>{elem.msg}</p>
                            })
                           : ''}
                          <div>
                              <label className="titles">New password</label>
                              <input style={{ outline: passErrs.length > 0 ? '1.5px solid red' : '' }} 
                              type="password" placeholder="New password" name="newPassword" 
                              onChange={(e) => { setPassErrs([]); setNewPass(e.target.value) } } />
                          </div>
                          <div>
                              <label className="titles">Confirm Password</label>
                              <input style={{ outline: passErrs.length > 0 ? '1.5px solid red' : '' }} 
                              type="password" placeholder="Confirm password" name="confirmPassword" 
                              onChange={(e) => { setPassErrs([]); setConfirmPass(e.target.value) } } />
                          </div>
                          <button onClick={updatePassword} disabled={passClicked}>Update Password</button>
                      </div>
                  </div>
              </div>
          </div>
      </div>
        <Modal
            isOpen={isErr}
            style={customStyles}
            contentLabel="Example Modal"
              >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontFamily: 'Ubuntu', fontSize: '1.3em', color: '#1c1c57' }} >Server Error</h2>
              <span onClick={() => location.reload()}
                style={{ backgroundColor: '#1465e7', 
                color: "white",
                padding: '10px', 
                cursor: 'pointer',
                fontFamily: 'Ubuntu',
                borderRadius: '3px',
                fontSize: '1.1em',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                 }}>Try again</span>
            </div>
        </Modal>
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

      const userId = decoded.userId;
      
      const sanitizedUserId = mongoSanitize.sanitize(userId);
      
      const { User } = await connectUserDB();
      let user = await User.findOne({ _id: sanitizedUserId });
    

      // send the data to the front end
      const userData = {
        username: user.name,
        email: user.email
      }
  
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
  