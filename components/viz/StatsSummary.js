import React, { useState, useEffect } from 'react';
import Select from 'react-select';

const StatsSummary = ({ data }) => {

    const [showTooltip0, setShowTooltip0] = useState(false);

    const handleMouseEnter0 = () => {
      setShowTooltip0(true);
    };
  
    const handleMouseLeave0 = () => {
      setShowTooltip0(false);
    };

    const [showTooltip1, setShowTooltip1] = useState(false);

    const handleMouseEnter1 = () => {
      setShowTooltip1(true);
    };
  
    const handleMouseLeave1 = () => {
      setShowTooltip1(false);
    };

    const [showTooltip2, setShowTooltip2] = useState(false);

    const handleMouseEnter2 = () => {
      setShowTooltip2(true);
    };
  
    const handleMouseLeave2 = () => {
      setShowTooltip2(false);
    };

    const [showTooltip3, setShowTooltip3] = useState(false);

    const handleMouseEnter3 = () => {
      setShowTooltip3(true);
    };
  
    const handleMouseLeave3 = () => {
      setShowTooltip3(false);
    };

    let totalImpressions = data.reduce((total, elem) => {
        return total + elem['Impressions']
    }, 0)
    let totalLinkClicks = data.reduce((total, elem) => {
        return total + elem['Destination Link Clicks']
    }, 0)
    let totalSaves = data.reduce((total, elem) => {
        return total + elem['Saves']
    }, 0)

    return (
      <div className='statsSummary'>
        <div className='topArea'>
            <div className='title'>Analytics Summary</div>
        </div>
        <div class="grid-container">
            <div className='box one'>
                <div className='interactive'>
                    <div className='title'>Conversion Rates</div>
                    <div className="question-mark-container">
                    <div
                      className="question-mark"
                      onMouseOver={handleMouseEnter0}
                      onMouseOut={handleMouseLeave0}
                    >
                      ?
                    </div>
                        {showTooltip0 ? <div className="graphInfoTooltip">
                            <span className='title'>Conversion Rate of Link Clicks</span><br/>
                            <span>This metric represents the ratio of destination link clicks to the total number of impressions. It provides an understanding of how effectively your Pin is driving traffic to your linked destination.</span><br/>
                            <span className='title'>Conversion Rate of Saves</span><br/>
                            <span>This metric indicates the ratio of the number of times your Pin was saved to the total number of impressions. It provides insight into the proportion of impressions that resulted in saves, thereby helping you understand the effectiveness of your Pin in engaging viewers and prompting them to save it for future reference.</span><br/>
                    </div> : ''}
                    </div>
                </div> 
                <div className='sub-metrics'>
                    <div>
                        <span className='conversion-title'>Link Clicks</span>
                        <span>{Math.round(totalLinkClicks/totalImpressions*100)}%</span>
                    </div>     
                    <div>
                        <span className='conversion-title'>Saves</span>
                        <span>{Math.round(totalSaves/totalImpressions*100)}%</span>
                    </div>
                </div> 
            </div>
            <div className='box two'>
                <div className='interactive'>
                    <div className='title'>Impressions</div>
                        <div className="question-mark-container">
                        <div
                          className="question-mark"
                          onMouseOver={handleMouseEnter1}
                          onMouseOut={handleMouseLeave1}
                        >
                          ?
                        </div>
                            {showTooltip1 ? <div className="graphInfoTooltip">
                                This is the number of times your Pin was on screen whether it was seen or 
                                not.
                        </div> : ''}
                    </div>
                </div>
                <span>{totalImpressions}</span>
            </div>
            <div className='box three'>
                <div className='interactive'>
                    <div className='title'>Link Clicks</div>
                    <div className="question-mark-container">
                    <div
                      className="question-mark"
                      onMouseOver={handleMouseEnter2}
                      onMouseOut={handleMouseLeave2}
                    >
                      ?
                    </div>
                        {showTooltip2 ? <div className="graphInfoTooltip">
                            Number of destination link clicks.
                    </div> : ''}
                    </div>
                </div>
                <span>{totalLinkClicks}</span>
            </div>
            <div className='box four'>
                <div className='interactive'>
                    <div className='title'>Saves</div>
                        <div className="question-mark-container">
                        <div
                          className="question-mark"
                          onMouseOver={handleMouseEnter3}
                          onMouseOut={handleMouseLeave3}
                        >
                          ?
                        </div>
                            {showTooltip3 ? <div className="graphInfoTooltip">
                                The number of times your Pin was saved.
                        </div> : ''}
                    </div>
                </div>
                <span>{totalSaves}</span>
            </div>
        </div>
      </div>
    )
};

export default StatsSummary;
