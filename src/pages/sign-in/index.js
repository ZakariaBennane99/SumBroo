/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import { faEye, faEyeSlash, faArrowRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'


const SignIn = () => {

    const router = useRouter();

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

    const [leftErrors, setleftErrors] = useState('')

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

        const userChPassUrl = 'http://localhost:4050/api/user'
        // send email to change password
        const changePassUrl = 'http://localhost:4050/api/change-password'

        try {
          const resp = await axios.post(userChPassUrl, passChangeEmail)
          const userId = resp.data._id
          if (resp.status === 201) {
            try {
              const emailRes = await axios.post(changePassUrl, {
                email: passChangeEmail.email,
                userId: userId
               })
              if (emailRes.status === 200) {
                setIsEmailSentForPassChange("Yes")
                // this is to tokenise the password change request
                document.cookie = `passToken=${emailRes.data.token}; path=/; max-age=${30 * 24 * 60 * 60}`;
                window.localStorage.setItem('userId', JSON.stringify(userId))
              }
            } catch (err) {
              setIsEmailSentForPassChange("No")
              setChangePassErrors('Please try again later.')
              console.error(err)
            }
          }
        } catch (err) {
          console.log(err)
          // if not a server error
          if (err.response.status === 401) {
            // just take the message from your server
            setIsEmailSentForPassChange("No")
            setChangePassErrors(err.response.data.msg)
          } else {
            setIsEmailSentForPassChange("No")
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

      const apiUrl = 'http://localhost:4050/api/auth'

      try {
        const r = await axios.post(apiUrl, formValues)
        console.log('this is the res', r.data)
        document.cookie = `passToken=${r.data.token}; path=/; max-age=${30 * 24 * 60 * 60}`;
        window.localStorage.setItem('userId', JSON.stringify(r.data.userData.id))
        window.localStorage.setItem('userName', JSON.stringify(r.data.userData.name))
        window.localStorage.setItem('userEmail', JSON.stringify(r.data.userData.email))
        router.push('/home');
      } catch (error) {
        // client error 400 or 401
        if (error.response.status === 401 || error.response.status === 403) {
          setleftErrors(error.response.data.errors[0].msg)
        } else if (error.response.status === 400) {
          error.response.data.errors.map(el => {
            setValidationErrors((prev) => {
              return {...prev, [el.param]: true}
            })
          })
          // server error 500
        } else {
          setleftErrors('Please try again!')
        }

      }

    }


    return (<div className="footerSectionsWrapper">
        <Header />
          <div className='login-container'>
            {!clickedOnForgot ?
                <form className='loginForm'>
                    <h1 id='loginUpTxt'>Log In</h1>
                    <h4 style={{ color: 'red' }}>{leftErrors}</h4>
                    <div className='email-cont'>
                      <label htmlFor="email">Email</label>
                      <div>
                        {validationErrors.email ? <p style={{ fontSize: '12px', marginBottom: '10px', color: 'red' }}>Please enter a valid email</p> : "" }
                        <input type="email" id="email" onChange={handleChange} style={{ outline: validationErrors.email ? '2px solid red' : '' }}/>
                      </div>
                    </div>
                    <div className='pass-cont'>
                      <label htmlFor="password">Password</label>
                      {formValues.password.length > 0 ?
                         <FontAwesomeIcon icon={showEye ? faEyeSlash : faEye} style={{ position: 'absolute', zIndex:'100', width: showEye ? '17px' : '16px', right: showEye ? '9' : '9', top: '4' , cursor: 'pointer', color: 'black' }} onClick={handleShowEye}/>
                      : ""}
                      <div>
                        {validationErrors.password ? <p style={{ fontSize: '12px', marginBottom: '10px', color: 'red' }}>Password required</p> : "" }
                        <input type={showEye ? "text" : "password"} id="password" value={formValues.password} onChange={handleChange} style={{ outline: validationErrors.password ? '2px solid red' : '', position:'relative' }}/>
                      </div>
                    </div>
                    <div style={{ width: '100%', position: 'relative' }}>
                      <button type='button' onMouseOver={handleHover} onMouseOut={handleHover} onClick={loginUser} style={{ paddingRight: hovered ? "70px" : "" }}>Log In</button>
                      <FontAwesomeIcon icon={faArrowRight} style={{ position: 'absolute', fontSize:'20px', right: hovered ? '30' : '-20', transition: '0.5s', bottom:'8' , color: 'white' }}/>
                    </div>
                    <p onClick={handleChangePass} className='forgot-pass'>Forgot Password?</p>
                </form> :
                <div className='forgot-pass-container'>
                    {isEmailSentForPassChange === "Yes" ?
                    <>
                      <p className='pass-sent'>We have sent you an email with instructions to change your password. Make sure you check your spam folder.</p>
                    </> :
                    <>
                        <div>
                            <label htmlFor="email">Email</label>
                            {isEmailSentForPassChange === "No" ? <p className='pass-error'>{changePassErrors}</p> : "" }
                            <input type="email" id="email" onInput={handleEmailPassChange} value={passChangeEmail.email}/>
                        </div>
                        <button onClick={handleSendForgot}>Send</button>
                    </>}
                </div>}
          </div>
        <Footer />
    </div>
    )
};

export default SignIn;
