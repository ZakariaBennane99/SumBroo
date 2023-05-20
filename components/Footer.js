/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { useEffect, useRef, useState } from 'react';
import { Tadpole } from "react-svg-spinners";
import Link from 'next/link';


const Header = () => {

    return (
      <div id='footer'>
        <p>© 2023 <a href='https://thelibertagroup.co.uk' target="_blank" style={{ color: '#003ea1', cursor: 'pointer' }}>Liberta Group Ltd</a>. All rights reserved.</p>
        <div>
          <Link href='/contact-us'><p>Contact Us</p></Link>
          <Link href='/privacy-policy'><p>Privacy Policy</p></Link>
          <Link href='/terms-and-conditions'><p>Terms & Conditions</p></Link>
        </div>
      </div>
    )
};

export default Header;
