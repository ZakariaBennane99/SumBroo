/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { useRouter } from 'next/router';
import Link from "next/link";
import { useState, useEffect } from "react";


function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

const ActiveAccounts = ({ setPlatform, platforms }) => {

    const router = useRouter();

    const [isOpen, setIsOpen] = useState(true);
    const [selectedPlatform, setSelectedPlatform] = useState();

    const toggleAccordion = () => {
      setIsOpen(!isOpen);
    };

    function handleClick(platform) {
        setSelectedPlatform(platform);
        setPlatform(platform);
    }


    function toLinkedAccounts() {
        // send to the linkedAccounts page
        router.push('/settings/linked-accounts');
    }

    function toBilling() {
        // send to the linkedAccounts page
        router.push('/settings/billing');
    }

    return (<div className='activeAccountsDiv'>
        <div className='targetPlatformsTitle' onClick={toggleAccordion}>
            <div>
                <h1>1/ Select A Platform</h1>
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
                    } else if (platform.status === 'notAvailable') {
                        return (
                        <div>
                            <div className="cell-content notAvailable">
                                <img src={`/sm/${platform.name}.svg`} alt={`${platform.name}-logo`} className='notAvailableImg' /><span>{capitalize(platform.name)}</span>
                                <span className='tooltip'>Coming soon!</span>
                            </div>
                        </div>
                        )
                    } else if (platform.status === 'available') {
                        return (
                            <div>
                                <div className="cell-content notApplied">
                                    <img src={`/sm/${platform.name}.svg`} alt={`${platform.name}-logo`} className='notAppliedImg' /><span>{capitalize(platform.name)}</span>
                                    <span className='tooltip'><span onClick={toLinkedAccounts} className='linkAccount'>Apply</span> to connect your account</span>
                                </div>
                            </div>
                            )  
                    } else {
                        return (
                            <div>
                                <div className="cell-content notApplied">
                                    <img src={`/sm/${platform.name}.svg`} alt={`${platform.name}-logo`} className='notAppliedImg' /><span>{capitalize(platform.name)}</span>
                                    {
                                        platform.status === 'canceled' ?
                                        <span className='tooltip'>
                                            <span onClick={toBilling} className='linkAccount'>Re-activate</span> your subscription to continue posting
                                        </span>    
                                        :
                                        <span className='tooltip'>
                                        Please <span onClick={toBilling} className='linkAccount'>fix</span> your payment issue
                                        </span>
                                    }
                                </div>
                            </div>
                        )    
                    }
                })
            }
        </div>}
    </div>)

};

export default ActiveAccounts;
