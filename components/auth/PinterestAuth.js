// auth/PinterestAuth.js

// Define constants for the Pinterest OAuth flow.
const PINTEREST_OAUTH_URL = "https://www.pinterest.com/oauth/";
const REDIRECT_URI = 'http://localhost:3000/auth/callback'; // The callback endpoint for your app
const SCOPE = "boards:read,pins:read,pins:write"; // Define the scope you want to access
const STATE = "vXpd@aSf1nGdgfXTf"; // You can generate a random string for added security


export const PinterestAuth = () => {
    // Redirects the user to Pinterest's OAuth page.
    const initiateAuth = () => {
        const authURL = `${PINTEREST_OAUTH_URL}?client_id=1484362&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPE}&state=${STATE}`;
        window.open(authURL, '_blank');
    };

    // This function will handle the callback from Pinterest with the auth code.
    // You would call this function in the page or API route that handles the callback specified in REDIRECT_URI.
    const handleAuthCallback = async (code) => {

        const headers = new Headers();
        headers.append("Authorization", `Basic ${btoa(`1484362:${process.env.PINTEREST_APP_SECRET}`)}`);
        headers.append("Content-Type", "application/x-www-form-urlencoded");

        const body = new URLSearchParams();
        body.append("grant_type", "authorization_code");
        body.append("code", code);
        body.append("redirect_uri", REDIRECT_URI);

        const response = await fetch("https://api.pinterest.com/v5/oauth/token", {
            method: "POST",
            headers: headers,
            body: body
        });

        const data = await response.json();

        // Here you can store the access_token and refresh_token in your database or wherever you need.
        return data;
    };

    return { initiateAuth, handleAuthCallback };

};
