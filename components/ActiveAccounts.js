/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { useRouter } from 'next/router';
import Link from "next/link";
import { useState, useEffect } from "react";


function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

const ActiveAccounts = ({ setPlatform, platforms }) => {

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
            {
                platforms.map(platform => {
                    if (platform.status === 'active') {
                        return (
                            <div>
                                <div className="cell-content" onClick={() => handleClick('pinterest')} style={{ 
                                    backgroundColor: selectedPlatform === 'pinterest' ? '#b9b9c6' : '' }}>
                                    <img src='/sm/pinterest.svg' alt='pinterest-logo' style={{ borderRadius: '50%' }} /><span>Pinterest</span>
                                    {selectedPlatform === platform.name ? <img src='/check.svg' alt='checkmark' id='checkmark' /> : '' }
                                </div>
                            </div>
                        )
                    } else if (platform.status === 'notAvailale') {
                        return (
                        <div>
                            <div className="cell-content notAvailable">
                                <img src={`/sm/${platform.name}.svg`} alt={`${platform.name}-logo`} className='notAvailableImg' /><span>{capitalize(platform.name)}</span>
                                <span className='tooltip'>Coming soon!</span>
                            </div>
                        </div>
                        )
                    } else {
                        <div>
                            <div className="cell-content notAvailable">
                                <img src={`/sm/${platform.name}.svg`} alt={`${platform.name}-logo`} className='notAvailableImg' /><span>{capitalize(platform.name)}</span>
                                <span className='tooltip'>
                                {
                                    platform.status === '' ? 
                                    '' 
                                    :
                                    
                                }
                                </span>
                            </div>
                        </div>
                    }
                })
            }
        </div>}
    </div>)

};

export default ActiveAccounts;
