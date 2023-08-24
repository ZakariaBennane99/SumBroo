import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import SettingsMenu from "../../../../components/SettingsMenu";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";


const AccountSettings = ({ signedIn }) => {

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

    const [userInfo, setUserInfo] = useState({
      username: '',
      email: '',
      password: '',
      oldPassword: ''
    })

    const data = {
        username: 'Maker89',
        email: 'manOnFire@mail.com',
        password: 'backendSex'
    }

    function handleUserInfo(e) {
        setUserInfo(prev => {
            return {
                ...prev,
                [e.target.name]: e.target.value
            }
        })
    }


    useEffect(() => {
        console.log(userInfo)
    }, [userInfo])

    if (!signedIn) {
      router.push('/sign-in');
      return null
    } else {
      return (<div id="parentWrapper">
      <Header signedIn={signedIn}/>
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
                              <span className="old">{data.username}</span>
                          </div>
                          <div>
                              <label className="titles">New Username</label>
                              <input type="text" placeholder="New username" name="username" onChange={handleUserInfo} />
                          </div>
                          <button>Update Username</button>
                      </div>
                  </div>

                  <div className="accountSetting">
                      <div className='head'>
                          Email
                      </div>
                      <div className='body'>
                          <div>
                              <span className="titles">Current Email</span>
                              <span className="old">{data.email}</span>
                          </div>
                          <div>
                              <label className="titles">New Email</label>
                              <input type="email" placeholder="New email" name="email" onChange={handleUserInfo} />
                          </div>
                          <button>Update Email</button>
                      </div>
                  </div>

                  <div className="accountSetting">
                      <div className='head'>
                          Password
                      </div>
                      <div className='body'>
                          <div>
                              <label className="titles">Current password</label>
                              <input type="password" placeholder="Current password" name="oldPassword" onChange={handleUserInfo} />
                          </div>
                          <div>
                              <label className="titles">New Password</label>
                              <input type="password" placeholder="New password" name="password" onChange={handleUserInfo} />
                          </div>
                          <button>Update Password</button>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      <Footer />
    </div>)
    }
};

export default AccountSettings;

export async function getServerSideProps(context) {

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
          props: {
            signedIn: false
          }
        };
      }
  
      return {
        props: {
          signedIn: true
        }
      };
  
  
    } catch (error) {
      return {
        props: {
          signedIn: false
        }
      };
    }
  
  }
  