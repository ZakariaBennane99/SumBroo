/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { useRouter } from 'next/router';
import Modal from 'react-modal';
import React, { useState } from 'react';
import { faEye, faEyeSlash, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';


const SignIn = () => {

    const router = useRouter();

    const [isClicked, setIsClicked] = useState(false)

    const [isServerError, setIsServerError] = useState(false)

    const [showEye, setShowEye] = useState(false)

    const [hovered, setHovered] = useState(false)

    const [passChangeEmail, setPassChangeEmail] = useState({
      email: ""
    })

    const [changePassErrors, setChangePassErrors] = useState("")

    const [isEmailSentForPassChange, setIsEmailSentForPassChange] = useState("")

    const [clickedOnForgot, setClickedOnForgot] = useState(false)

    const [formValues, setFormValues] = useState({
      email: '',
      password: ''
    })

    const [leftErrors, setleftErrors] = useState(null)

    const [passChangeErr, setPassChangeErr] = useState(false)

    const [validationErrors, setValidationErrors] = useState({
      email: false,
      password: false
    })

    function handleShowEye () {
      return setShowEye(!showEye)
    }

    function handleHover () {
      return setHovered(!hovered)
    }

    function handleChangePass () {
      return setClickedOnForgot(!clickedOnForgot)
    }

    async function handleSendForgot () {


        const changePassUrl = 'http://localhost:4050/api/change-password'

        try {
          const resp = await axios.post(changePassUrl, passChangeEmail)
          const userId = resp.data._id
          if (resp.status === 201) {
            console.log(resp)
          }
        } catch (err) {
          console.log(err)
          // if not a server error
          if (err.response.status === 401) {
            // just take the message from your server
            setChangePassErrors(err.response.data.msg)
          } else {
            setChangePassErrors('Please try again later.')
          }

        }
    }

    function handleEmailPassChange(e) {
      setChangePassErrors("")
      return setPassChangeEmail({ email: e.target.value })
    }

    function handleChange (e) {

      setValidationErrors((prev) => {
        return {...prev, [e.target.id]: false}
      })

      setleftErrors('')

      return setFormValues((prev) => {
        return {...prev, [e.target.id]: e.target.value}
      })
    }

    // login the user
    const loginUser = async function authUser () {

      setIsClicked(true)

      const apiUrl = 'http://localhost:4050/api/auth'

      try {
        const res = await axios.post(apiUrl, formValues)
        console.log(res)
        if (res.status === 201) {
          router.push('/dashboard');
        }
        // send the user to the dashboard
      } catch (error) {
        // client error 400 or 401
        if (error.response.status === 400) {
          error.response.data.errors.forEach(error => {
            setValidationErrors((prev) => {
              return {
                ...prev, 
                [error.param]: error.msg
              }
            })
          })
          setIsServerError(false)
        } else if (error.response.status === 401) {
          console.log(error)
          // here set up the leftErrors
          setleftErrors('Invalid credentials!')
          setIsServerError(false)
        } else {
          setIsServerError(true)
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

    return (<div className="footerSectionsWrapper">
        <Header />
          <div className='login-container'>
            {!clickedOnForgot ?
                <form className='loginForm'>
                    <h1 id='loginUpTxt'>Sign In</h1>
                    {
                      leftErrors ? 
                      <p style={{ color: 'red' }}>{leftErrors}</p> : ''
                    }
                    <div className='email-cont'>
                      <label htmlFor="email">Email</label>
                      <div>
                        {validationErrors.email ? <p style={{ fontSize: '.7em', marginBottom: '10px', marginTop: '0px', color: 'red' }}>Please enter a valid email.</p> : "" }
                        <input placeholder="Enter your email" type="email" id="email" onChange={handleChange} style={{ outline: validationErrors.email ? '2px solid red' : '' }}/>
                      </div>
                    </div>
                    <div className='pass-cont'>
                      <label htmlFor="password">Password</label>
                      {formValues.password.length > 0 ?
                         <FontAwesomeIcon icon={showEye ? faEye : faEyeSlash } style={{ position: 'absolute', zIndex:'100', width: '15px', right: '6px', top: '6px' , cursor: 'pointer', color: '#1c1c57' }} onClick={handleShowEye}/>
                      : ""}
                      <div>
                        {validationErrors.password ? <p style={{ fontSize: '.7em', marginBottom: '10px', marginTop: '0px', color: 'red' }}>Password required.</p> : "" }
                        <input placeholder="Enter your password" type={showEye ? "text" : "password"} id="password" value={formValues.password} onChange={handleChange} style={{ outline: validationErrors.password ? '2px solid red' : '', position:'relative' }}/>
                      </div>
                    </div>
                    <div style={{ width: '100%', position: 'relative' }}>
                      <button type='button' onMouseOver={handleHover} onMouseOut={handleHover} onClick={loginUser} style={{ paddingRight: hovered ? "70px" : "" }} disabled={isClicked}>Sign In</button>
                      <FontAwesomeIcon icon={faArrowRight} style={{ position: 'absolute', fontSize:'20px', right: hovered ? '30' : '-30', transition: '0.5s', bottom:'10' , color: 'white' }}/>
                    </div>
                    <p onClick={handleChangePass} className='forgot-pass'>Forgot Password?</p>
                </form> :
                <div className='forgot-pass-container'>
                    {isEmailSentForPassChange === "Yes" ?
                    <>
                      <p className='pass-sent'>We have sent you an email with a link to change your password. The link will be active for 20 Minutes.</p>
                    </> :
                    <>
                        <div>
                            <label htmlFor="email">Email</label>
                            {isEmailSentForPassChange === "No" ? <p className='pass-error'>{changePassErrors}</p> : "" }
                            <input type="email" id="email" onInput={handleEmailPassChange} value={passChangeEmail.email} placeholder="Enter your email"/>
                        </div>
                        <button onClick={handleSendForgot}>Send</button>
                    </>}
                </div>}
          </div>
          <Modal
            isOpen={isServerError || passChangeErr}
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
    </div>
    )
};

export default SignIn;


