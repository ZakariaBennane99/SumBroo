/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import Link from "next/link";
import axios from 'axios'
import { useState } from "react";
import { faEye, faEyeSlash, faArrowRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const SignUp = () => {

    const [signUpClicked, setSignUpClicked] = useState(false)

    const [showEye, setShowEye] = useState(false)

    const [hovered, setHovered] = useState(false)

    const [isEmailSent, setIsEmailSent] = useState("")

    const [validationErrors, setValidationErrors] = useState({
      name: false,
      email: false,
      password: false
    })

    const [formValues, setFormValues] = useState({
      name: '',
      email: '',
      password: '',
      verified: false
    })

    const [leftErrors, setleftErrors] = useState('')

    function handleShowEye () {
      return setShowEye(!showEye)
    }

    function handleHover () {
      return setHovered(!hovered)
    }

    function handleChange (e) {

      setValidationErrors((prev) => {
        return {...prev, [e.target.id]: false}
      })

      setleftErrors('')

      setFormValues((prev) => {
        return {...prev, [e.target.id]: e.target.value}
      })

    }

    async function sendVerificationEmail (userId) {
      try {

        const resp = await axios.post('http://localhost:4050/api/email-verification', {
          name: formValues.name,
          email: formValues.email,
          userId: userId
        })

        if (resp.status === 201) {
          setIsEmailSent("Yes")
        }
      } catch (err) {
        setIsEmailSent("No")
        console.error(err)
      }
    }

    // registering a new user
    const signUpUser = async function registerUser () {

      setSignUpClicked(true)

      // user registration URL
      const registerUrl = 'http://localhost:4050/api/users'
      try {
        const res = await axios.post(registerUrl, formValues)
        if (res.status === 201) {
          await sendVerificationEmail(res.data)
        }
      } catch (err) {
        // if not a server error
        console.log(err)
        if (err.response.status === 401) {
          setleftErrors(err.response.data.errors[0].msg)
        } else if (err.response.status === 400) {
          err.response.data.errors.map(el => {
            setValidationErrors((prev) => {
              return {...prev, [el.param]: true}
            })
          })
          // if server error
        } else {
          setleftErrors('Please refresh the page and try again!')
        }

      }

    }


    return (<div className="footerSectionsWrapper">
        <Header />
        {isEmailSent === "Yes" ?
      <div className='signed-up-container-holder'>
        <div className='signed-up-container'>
          <p>Check Your Email</p>
          <p>If you didn&apos;t receive anything, you can <button onClick={sendVerificationEmail}>Resend the email</button></p>
          </div>
      </div> : isEmailSent === "No" ?
      <div className='signed-up-container-holder'>
        <div className='signed-up-container'>
          <p>Something happened!</p>
          <button onClick={sendVerificationEmail}>Resend email</button>
        </div>
      </div> :
      <div className='signup-container'>
        <form className='signUpForm'>
          <h1 id='signUpTxt'>Sign Up</h1>
          {isEmailSent}
          <h4 style={{ color: 'red' }}>{leftErrors}</h4>
          <div className='emailSCont'>
            <label htmlFor="name">Name</label>
            <div>
              {validationErrors.name ? <p style={{ fontSize: '12px', marginBottom: '10px', marginLeft: '43px', color: 'red' }}>Name is required</p> : "" }
              <input type="text" id="name" onChange={handleChange} style={{ outline: validationErrors.name ? '2px solid red' : '' }}/>
            </div>
          </div>
          <div className='emailSCont'>
            <label htmlFor="email">Email</label>
            <div>
              {validationErrors.email ? <p style={{ fontSize: '12px', marginBottom: '10px', marginLeft: '43px', color: 'red' }}>Please enter a valid email</p> : "" }
              <input type="email" id="email" onChange={handleChange} style={{ outline: validationErrors.email ? '2px solid red' : '' }}/>
            </div>
          </div>
          <div className='passwCont'>
            <label htmlFor="password">Password</label>
            {formValues.password.length > 0 ?
               <FontAwesomeIcon icon={showEye ? faEyeSlash : faEye} style={{ position: 'absolute', zIndex:'10', width: showEye ? '17px' : '16px', right: showEye ? '9' : '9', bottom: '4' , cursor: 'pointer', color: 'black' }} onClick={handleShowEye}/>
            : ""}
            <div>
              {validationErrors.password ? <p style={{ fontSize: '12px', marginBottom: '10px', marginLeft: '5px', color: 'red' }}> At least 6 characters</p> : "" }
              <input type={showEye ? "text" : "password"} id="password" value={formValues.password} onChange={handleChange} style={{ outline: validationErrors.password ? '2px solid red' : '', position:'relative' }}/>
            </div>
          </div>
          <div style={{ width: '100%', position: 'relative' }}>
            <button type='button' onMouseOver={handleHover} onMouseOut={handleHover} style={{ paddingRight: hovered ? "70px" : "" }} onClick={signUpUser}>Sign Up</button>
            <FontAwesomeIcon icon={faArrowRight} style={{ position: 'absolute', fontSize:'20px', right: hovered ? '30' : '-20', transition: '0.5s', bottom:'7' , color: 'white' }}/>
          </div>
        </form>
      </div>}
        <Footer />
    </div>
    )
};

export default SignUp;
