/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { useRouter } from 'next/router';
import Link from "next/link";
import { useState, useEffect } from "react";


const ActiveAccounts = ({ setPlatform }) => {

    const [isOpen, setIsOpen] = useState(true);
    const [selectedPlatform, setSelectedPlatform] = useState();

    const toggleAccordion = () => {
      setIsOpen(!isOpen);
    };

    function handleClick(platform) {
        setSelectedPlatform(platform);
        setPlatform(platform);
    }

    // don't forget to get the user's info in order to display the right
    // elements SM platforms

    // below if Instagram is not connected, we display what you
    // see below

    // notApplied class to the elements that the user didn't apply for. And Add the following:
    // <span className='tooltip'><button className='linkAccount'>Apply</button> to connect your account</span>
    // below it

    return (<div className='activeAccountsDiv'>
        <div className='targetPlatformsTitle' onClick={toggleAccordion}>
            <div>
                <h1>1/ Target Platform</h1>
            </div>
            <div>
                <img src='/arrow.svg' style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(180deg)' }} />
            </div>
        </div>
        {isOpen && <div className='platformsContainer'>
            <div>
                <div className="cell-content notAvailable">
                    <img src='/sm/fb.svg' alt='facebook-logo' className='notAvailableImg' /><span>Facebook</span>
                    <span className='tooltip'>Coming soon!</span>
                </div>
            </div>
            <div>
                <div className="cell-content notAvailable" >
                    <img src='/sm/insta.svg' alt='instagram-logo' className='notAvailableImg' /><span>Instagram</span>
                    <span className='tooltip'>Coming soon!</span>
                </div>
            </div>
            <div>
                <div className="cell-content notAvailable">
                    <img src='/sm/twit.svg' alt='twitter-logo' className='notAvailableImg' /><span>Twitter</span>
                    <span className='tooltip'>Coming soon!</span>
                </div>
            </div>
            <div>
                <div className="cell-content notAvailable">
                    <img src='/sm/linked.svg' alt='linkedIn-logo' className='notAvailableImg' /><span>LinkedIn</span>
                    <span className='tooltip'>Coming soon!</span>
                </div>
            </div>
            <div>
                <div className="cell-content notAvailable">
                    <img src='/sm/tik.svg' alt='tiktok-logo' className='notAvailableImg' /><span>TikTok</span>
                    <span className='tooltip'>Coming soon!</span>
                </div>
            </div>
            <div>
                <div className="cell-content notAvailable">
                    <img src='/sm/ytb.svg' alt='youtube-logo' className='notAvailableImg' /><span>YouTube</span>
                    <span className='tooltip'>Coming soon!</span>
                </div>
            </div>
            <div>
                <div className="cell-content notAvailable">
                    <img src='/sm/vim.svg' alt='vimeo-logo' className='notAvailableImg' /><span>Vimeo</span>
                    <span className='tooltip'>Coming soon!</span>
                </div>
            </div>
            <div>
                <div className="cell-content" onClick={() => handleClick('pinterest')} style={{ 
                    backgroundColor: selectedPlatform === 'pinterest' ? '#b9b9c6' : '' }}>
                    <img src='/sm/pin.svg' alt='pinterest-logo' style={{ borderRadius: '50%' }} /><span>Pinterest</span>
                    {selectedPlatform === 'pinterest' ? <img src='/check.svg' alt='checkmark' id='checkmark' /> : '' }
                </div>
            </div>
            <div>
                <div className="cell-content notAvailable">
                    <img src='/sm/flic.svg' alt='flickr-logo' className='notAvailableImg' /><span>Flickr</span>
                    <span className='tooltip'>Coming soon!</span>
                </div>
            </div>
        </div>}
    </div>)

};

export default ActiveAccounts;
