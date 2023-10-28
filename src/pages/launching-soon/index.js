
import { useEffect, useState } from 'react';

export default function LaunchingSoon() {
  // Initialize state variables for days, hours, minutes, and seconds
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  // Target launch date
  const launchDate = new Date('2023-12-31T00:00:00'); // Modify this to your desired launch date

  useEffect(() => {
    // Function to calculate the remaining time
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = launchDate - now;

      if (difference > 0) {
        setDays(Math.floor(difference / (1000 * 60 * 60 * 24)));
        setHours(Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
        setMinutes(Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)));
        setSeconds(Math.floor((difference % (1000 * 60)) / 1000));
      }
    };

    // Call the function immediately to populate the values
    calculateTimeLeft();

    // Update the countdown every second
    const timer = setInterval(calculateTimeLeft, 1000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(timer);
  }, []);

  return (
    <div className='launchingSoonContainer'>
        <h1>Launching Soon</h1>
        <div className="flex-container">
            <div className="flex-item">{days}D</div>
            <div className="flex-item">{hours}H</div>
            <div className="flex-item">{minutes}M</div>
            <div className="flex-item">{seconds}S</div>
        </div>
    </div>
  );
}