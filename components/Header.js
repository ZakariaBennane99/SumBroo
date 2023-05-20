/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { useEffect, useRef, useState } from 'react';
import { Tadpole } from "react-svg-spinners";
import Link from 'next/link';


const Header = ({ signedIn }) => {

    return (
      <div id='header'>
        <img src='./logo.svg' alt='logo' />
        <div>
          {signedIn ? <Link href='/home'><p>Home</p></Link> : <Link href='/pricing'><p>Pricing</p></Link>}
          {signedIn ? <Link href='/settings'><p>Settings</p></Link> : <Link href='/sign-up'><p>Sign Up</p></Link>}
          {signedIn ? <p style={{ color: '#e60000' }}>Sign out</p> : <Link href='/sign-in'><p>Sign In</p></Link>}
        </div>
      </div>
    )
};

export default Header;
