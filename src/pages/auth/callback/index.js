import { PinterestAuth } from '../../../../components/auth/PinterestAuth';

const CallbackPage = ({ success }) => {
    if () {

    } else {
        
    }
    return success ? <div>Successfully linked your Pinterest account!</div> : <div>Failed to link your Pinterest account. Please try again.</div>;
};

export async function getServerSideProps(context) {

    const code = context.query.code || "";

    if (code) {

        try {

            const authData = await PinterestAuth().handleAuthCallback(code);
            console.log('THE AUTH DATA', authData)

            return {
                props: { success: true }
            };
        } catch (error) {
            // Handle the error. Log it or take other appropriate actions.
            return {
                props: { success: false }
            };
        }

    } else {

        // No code was received.
        return {
            props: { success: false }
        };

    }
}

export default CallbackPage;
