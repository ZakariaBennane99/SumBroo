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
        const now = new Date();
        const currentUTCDate = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
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

            console.log('THIS IS THE CONTEXT', context.params.social)

            if (context.params.social === 'pinterest') {

                authData = await PinterestAuth().handleAuthCallback(code);

                const sanitizedUserId = mongoSanitize.sanitize(userId);
                await connectDB();
                let user = await User.findOne({ _id: sanitizedUserId });

                // get UTC date
                const tokenExpiryUTCDate = getUTCDate(authData.expires_in)
                const refreshTokenExpiryUTCDate = getUTCDate(authData.refresh_token_expires_in)

                const mediaElem = user.socialMediaLinks.find(media => media.platformName === 'pinterest');
                mediaElem.accessToken = authData.access_token;
                mediaElem.refreshToken = authData.refresh_token;
                mediaElem.accesstokenExpirationDate = tokenExpiryUTCDate;
                mediaElem.refreshTokenExpirationDate = refreshTokenExpiryUTCDate;
                mediaElem.profileStatus = 'active';

                await user.save();

                return {
                    redirect: {
                        destination: '/settings/linked-accounts?result=success',
                        permanent: false,
                    }
                };

            }

            // only runs when the If statement fails
            return {
                redirect: {
                    destination: '/settings/linked-accounts?result=failure',
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
