import React, { useState } from 'react';
import Rating from '@mui/material/Rating';


const Feedback = () => {
    const [feedback, setFeedback] = useState('');
    const [submissionStatus, setSubmissionStatus] = useState(null); // Added state
    const [formVisible, setFormVisible] = useState(false);

    const [rating, setRating] = React.useState(2);

    const handleSubmit = (e) => {
        // send to the server to be stored in the DB
        e.preventDefault();

        
        console.log('Rating:', rating);
        console.log('Feedback:', feedback);
        // Submit the feedback to a server or handle as necessary
        
        setSubmissionStatus('submitted'); // Update submission status
    };

    return (
        <div className={`feedback-container ${formVisible ? 'expanded' : ''}`}>
            {submissionStatus === 'submitted' ? (
                <div className="submission-message">Thanks a ton for sharing! 🌟</div>
            ) : (
                <>
                    <button className="toggle-feedback-btn" onClick={() => setFormVisible(!formVisible)}>
                        Feedback
                    </button>
                    <form onSubmit={handleSubmit} className={formVisible ? 'visible' : ''}>
                        <div className="rating-section">
                            <span id='stars-txt'>🌟 How's your journey going with SumBroo?</span>
                            <Rating
                                size="large"
                                name="simple-controlled"
                                id="rating-stars"
                                value={rating}
                                onChange={(event, newValue) => {
                                  setRating(newValue);
                                }}
                            />
                        </div>
                        <div className="feedback-section">
                            <label id='feedback-txt' htmlFor="feedback">How can we make your experience even better?</label>
                            <textarea
                                id="feedback"
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                            />
                        </div>
                        <div className="submit-section">
                            <button type="submit">Submit</button>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
};

export default Feedback;
