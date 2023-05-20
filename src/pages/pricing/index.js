/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { useState, useEffect } from "react";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const Pricing = () => {

    const [hovered, setHovered] = useState(false)
    const [isMounted, setIsMounted] = useState(false);
    const [isAnnual, setIsAnnual] = useState()
    const [tableClicked, setTableClicked] = useState()
    const [lookupKey, setLookupKey] = useState()


    function handleToggle (e) {
        return setIsAnnual(e.target.checked)
    }


    async function handleTableClicked(e) {
        setTableClicked(e.currentTarget.name)
        setLookupKey(e.target.getAttribute("data-lookup-key"))
    }

    async function handleCheckoutPage() {

        const response = await fetch("http://localhost:4050/api/create-checkout-session", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              lookupKey: lookupKey
            })
        });

        if (response.ok) {
            const { url } = await response.json();
            // Redirect the customer to Stripe Checkout
            window.location.href = url;
        } else {
            // Handle error
            const errorMessage = await response.text();
            console.error("Error creating checkout session:", errorMessage);
        }

    }

    function handleHover () {
        return setHovered(!hovered)
    }

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;  // or return a loading spinner, etc.
    }

    return (<>
            <Header />
            <div className="pricingParent">
                <div className="pricingTitle">
                    <h1>Select Your Plan To Get Started</h1>
                    <p><b>You won&apos;t be charged now.</b> You can cancel the plan you chose before the trial period <b>(2 days with 20Min Free Credit)</b> ends, and you won&apos;t be charged</p>
                </div>
                <div className="planTypeContainer">
                    <div class='annualMonthly'>
                        Monthly
                        <div class="toggle">
                          <input onChange={handleToggle} type="checkbox" id="toggle" />
                          <label htmlFor="toggle"></label>
                        </div>
                        Annual
                    </div>
                </div>

                <div className="pricingTablesContainer">
                    <div className="table1" style={{
                        outline: tableClicked === 'table1' ? '4px solid #1465e7' : '',
                    }} >
                        {isAnnual ? <div className="saveRibbon">Save 20%</div> : '' }
                        {isAnnual ? <span class="strikethrough">$120</span> : ''}
                        <h1 style={{ marginTop: isAnnual ? '10px' : '30px' }}>{isAnnual ? '$95.99' : '$9.99'}</h1>
                        <p>{isAnnual ? 'Per Year' : 'Per Month'}</p>
                        <p><b>{isAnnual ? '240' : '20'} Hours</b> of video content
                        <div class="info-tooltip"><span class="question-mark">?</span>
                            <div class="tooltip-content">
                                <p id="tooltipText">One hour of video processed whether it is for a summary or notes, counts as a <b>1 hour video content</b></p>
                            </div>
                        </div></p>
                        <p>Summaries, notes, and highly relavant screensots</p>
                        <p>Both single videos and full courses</p>
                        <p>Save {isAnnual ? 'even more' : ''} hours per month from you precious time</p>
                        <button onClick={handleTableClicked} data-lookup-key={isAnnual ? "rLnQOY52o040&%!" : "T1NF%Q2p4SKw5633"} name="table1">Select</button>
                    </div>
                    <div className="table2" style={{
                        outline: tableClicked === 'table2' ? '4px solid #1465e7' : '',
                     }}>
                        {isAnnual ? <div className="saveRibbon">Save $54</div> : '' }
                        {isAnnual ? <span class="strikethrough">$240</span> : ''}
                        <h1 style={{ marginTop: isAnnual ? '10px' : '30px' }}>{isAnnual ? '$185.99' : '$19.99'}</h1>
                        <p>{isAnnual ? 'Per Year' : 'Per Month'}</p>
                        <p><b>{isAnnual ? '360' : '30'} Hours</b> of video content<div class="info-tooltip"><span class="question-mark">?</span>
                            <div class="tooltip-content">
                                <p id="tooltipText">One hour of video processed whether it is for a summary or notes, counts as a <b>1 hour video content</b></p>
                            </div>
                        </div></p>
                        <p><b>{isAnnual ? '183,600' : '15,300'} words</b> of audio</p>
                        <p>Summaries, notes, and highly relavant screensots</p>
                        <p>Both single videos and full courses</p>
                        <p>Save {isAnnual ? 'even more' : ''} hours per month from you precious time</p>
                        <button onClick={handleTableClicked} data-lookup-key={isAnnual ? "FQNY@kc@2751cNeu" : "M4147V^LRc$dz7^e"} name="table2">Select</button>
                    </div>
                    <div className="table3" style={{
                        outline: tableClicked === 'table3' ? '4px solid #1465e7' : '',
                    }}>
                        {isAnnual ? <div className="saveRibbon">Save $100</div> : '' }
                        {isAnnual ? <span class="strikethrough">$360</span> : ''}
                        <h1 style={{ marginTop: isAnnual ? '10px' : '30px' }}>{isAnnual ? '$259.99' : '$29.99'}</h1>
                        <p>{isAnnual ? 'Per Year' : 'Per Month'}</p>
                        <p><b>{isAnnual ? '660' : '55'} Hours</b> of video content<div class="info-tooltip"><span class="question-mark">?</span>
                            <div class="tooltip-content">
                                <p id="tooltipText">One hour of video processed whether it is for a summary or notes, counts as a <b>1 hour video content</b></p>
                            </div>
                        </div></p>
                        <p><b>{isAnnual ? '400,000' : '33,300'} words</b> of audio</p>
                        <p>Summaries, notes, and highly relavant screensots</p>
                        <p>Both single videos and full courses</p>
                        <p>Save {isAnnual ? 'even more' : ''} hours per month from you precious time</p>
                        <button onClick={handleTableClicked} data-lookup-key={isAnnual ? "gDWS558GB^RaQeA2" : "gMWB7J88IzoskV6*"} name="table3">Select</button>
                    </div>
                </div>
                <div className="next-page">
                    <button onClick={handleCheckoutPage} onMouseOver={handleHover} onMouseOut={handleHover} style={{ paddingRight: hovered ? "70px" : "" }}>Checkout<FontAwesomeIcon icon={faArrowRight} style={{ position: 'absolute', fontSize:'32px', right: hovered ? '30' : '-45', transition: '0.5s', bottom:'13' , color: 'white' }}/></button>
                </div>
            </div>
            <Footer />
        </>
    )
};

export default Pricing;
