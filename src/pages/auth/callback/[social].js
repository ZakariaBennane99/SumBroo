import { PinterestAuth } from '../../../../components/auth/PinterestAuth';
import { SpinnerCircularFixed } from 'react-svg-spinners';


const CallbackPage = () => {
    return (<div style={{ 
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }}>
        <SpinnerCircularFixed size={90} thickness={100} speed={100} color="#125bd2" secondaryColor="#f5f6f7" />
    </div>)
};

export async function getServerSideProps(context) {

    const connectDB = require('../../../../utils/connectUserDB');
    const jwt = require('jsonwebtoken');
    const User = require('../../../../utils/User').default;
    const mongoSanitize = require('express-mongo-sanitize');
    

    function getUTCDate(expiryInSec) {
        const currentUTCDate = new Date();
        const UTCExpiryDate = new Date(currentUTCDate.getTime() + (expiryInSec * 1000));
        return UTCExpiryDate;
    }

    let userId;

    try {
        // Get cookies from the request headers
        const cookies = context.req.headers.cookie;
    
        // Parse the cookies to retrieve the otpTOKEN
        const tokenCookie = cookies.split(';').find(c => c.trim().startsWith('token='));
    
        let tokenValue;
        if (tokenCookie) {
          tokenValue = tokenCookie.split('=')[1];
        }
    
        let decoded = jwt.verify(tokenValue, process.env.USER_JWT_SECRET);
        userId = decoded.userId
    
        if (decoded.type !== 'sessionToken') {
          return {
            redirect: {
              destination: '/sign-in',
              permanent: false,
            },
          };
        }
    } catch (err) {
      return {
        redirect: {
          destination: '/sign-in',
          permanent: false,
        },
      };
    }

    const code = context.query.code || "";

    if (code) {

        try {

            let authData;

            if (context.social === 'pinterest') {

                authData = await PinterestAuth().handleAuthCallback(code);

                const sanitizedUserId = mongoSanitize.sanitize(userId);
                await connectDB();
                let user = await User.findOne({ _id: sanitizedUserId });

                // get UTC date
                const UTCDate = getUTCDate(authData.expires_in)

                // add the auth to the DB
                console.log('THE AUTH DATA', authData)


            }

            return {
                redirect: {
                    destination: '/settings/linked-accounts?result=success',
                    permanent: false,
                }
            };
        } catch (error) {
            // Handle the error. Log it or take other appropriate actions.
            return {
                redirect: {
                    destination: '/settings/linked-accounts?result=failure',
                    permanent: false,
                }
            };
        }

    } else {

        // No code was received.
        return {
            redirect: {
                destination: '/settings/linked-accounts?result=failure',
                permanent: false,
            }
        };

    }
}

export default CallbackPage;
