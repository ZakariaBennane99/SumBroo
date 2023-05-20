import { useRouter } from 'next/router'
import Footer from '../../../components/Footer'
import Header from "../../../components/Header";
import axios from 'axios'
import React, { useState, useEffect } from 'react'



const NewSignUp = () => {

    const router = useRouter();
    const { userId } = router.query;

    const [isVerified, setIsVerified] = useState()

    useEffect(() => {
        if (userId) {
            const url = 'http://localhost:4050/api/verify-user-email'
            // make a call to check the user's email verification
            axios.post(url, { userId })
                .then(res => {
                    if (res.status === 201) {
                        return setIsVerified("Yes")
                    }
                })
                .catch (err => {
                    console.log(err)
                    return setIsVerified("No")
                })
        }
    }, [userId])

    if (isVerified === undefined) {
        return (<div className='loader-holder'>
            <div className="loader"></div>
        </div>)
    }

    return (<>
        {isVerified === "Yes" ?
        <>
            <Header />
            <div className='signed-up-container-holder'>
                <div className='signed-up-container'>You Are In! You Can Now sign in.</div>
            </div>
            <Footer />
        </>
             :
            <div>Page 404</div>
        }
        </>
    )

}

export default NewSignUp
